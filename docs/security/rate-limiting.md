# Rate Limiting

## Overview

Redis-backed sliding window rate limiting applied at the API Gateway level. Separate limits for authenticated users, anonymous users, and per-endpoint. Protects against brute force, scraping, and DDoS attacks.

## Rate Limit Tiers

| Tier | Scope | Limit | Window | Use Case |
|------|-------|-------|--------|----------|
| Anonymous | Per IP | 20 req/min | 60s | Public pages, API discovery |
| Authenticated | Per user (JWT sub) | 100 req/min | 60s | General API usage |
| Auth | Per IP | 5 req/min | 60s | Login, register, magic link |
| Password Reset | Per IP + email | 3 req/min | 60s | Forgot password |
| Booking | Per user | 10 req/min | 60s | Consultation bookings |
| File Upload | Per user | 30 req/min | 60s | File uploads |
| CMS Write | Per user | 10 req/min | 60s | Case studies, blog posts |

## Implementation (Spring Cloud Gateway)

```yaml
# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-route
          uri: lb://agency-api
          predicates:
            - Path=/api/v1/auth/**
          filters:
            - RequestRateLimiter=4, 2  # 4 req, 2 burst
        - id: api-route
          uri: lb://agency-api
          predicates:
            - Path=/api/v1/**
          filters:
            - RequestRateLimiter=100, 50  # 100 req/min, 50 burst
```

```java
@Configuration
public class RateLimiterConfig {
    
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            String userId = exchange.getRequest()
                .getHeaders()
                .getFirst("X-User-Id"); // Extracted from JWT by auth filter
            return Mono.just(userId != null ? userId : 
                exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
        };
    }
    
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
        );
    }
}
```

### Custom Rate Limiter Filter

```java
@Component
public class RateLimitingFilter extends GatewayFilter {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String key = "rate_limit:" + resolveKey(exchange);
        String endpoint = exchange.getRequest().getPath().value();
        String fullKey = key + ":" + endpoint;
        
        Long increment = redisTemplate.opsForValue().increment(fullKey);
        
        if (increment == 1) {
            redisTemplate.expire(fullKey, Duration.ofMinutes(1));
        }
        
        int limit = resolveLimit(exchange);
        
        exchange.getResponse().getHeaders().add("X-RateLimit-Limit", String.valueOf(limit));
        exchange.getResponse().getHeaders().add("X-RateLimit-Remaining", 
            String.valueOf(Math.max(0, limit - increment)));
        exchange.getResponse().getHeaders().add("X-RateLimit-Reset", 
            String.valueOf(Instant.now().plusSeconds(60).getEpochSecond()));
        
        if (increment > limit) {
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }
        
        return chain.filter(exchange);
    }
}
```

## Rate Limit Response

When limit exceeded:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1730520960
Retry-After: 45
```

```json
{
  "timestamp": "2026-11-02T14:30:00Z",
  "status": 429,
  "error": "RATE_LIMITED",
  "message": "Too many requests. Please try again later.",
  "path": "/api/v1/auth/login",
  "retryAfter": 45
}
```

## Redis Configuration

```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      ssl: ${REDIS_SSL:false}
      lettuce:
        shutdown-timeout: 100ms
```

### Rate Limit Keys (Redis)

```
rate_limit:{ip}:{endpoint}      → counter (TTL: 60s)
rate_limit:{userId}:{endpoint}  → counter (TTL: 60s)
brute_force:{ip}:{endpoint}     → failed attempt counter (TTL: 15min)
lockout:{ip}                    → lockout flag (TTL: 30min)
```

## Brute Force Protection

```java
// After failed login attempt
public void recordFailedAttempt(String ip, String endpoint) {
    String key = "brute_force:" + ip + ":" + endpoint;
    Long count = redisTemplate.opsForValue().increment(key);
    if (count == 1) {
        redisTemplate.expire(key, Duration.ofMinutes(15));
    }
    
    if (count >= 5) {
        // Lock out IP for 30 minutes
        redisTemplate.opsForValue().set("lockout:" + ip, "1", Duration.ofMinutes(30));
    }
}

public boolean isLockedOut(String ip) {
    return Boolean.TRUE.equals(redisTemplate.hasKey("lockout:" + ip));
}
```

## Distributed Rate Limiting (Multi-Instance)

Since rate limit counters are in Redis, all API instances share the same state. No sticky sessions required.

### Lua Script for Atomic Check-and-Increment

```lua
-- Atomic rate limit check
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local expire = tonumber(ARGV[2])

local current = redis.call('GET', key)
if current then
    if tonumber(current) >= limit then
        return -1  -- Rate limited
    end
    return redis.call('INCR', key)
else
    redis.call('SET', key, 1)
    redis.call('EXPIRE', key, expire)
    return 1
end
```

---

## Monitoring & Alerts

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Rate limited requests | > 5% of total traffic | Warning |
| 429 responses per IP | > 100/min | Critical (potential attack) |
| Lockout events | > 10/min | Warning |
| Redis memory for rate limits | > 1GB | Warning |

## Exemptions

| Path | Reason |
|------|--------|
| `/actuator/health` | Internal health checks |
| `/api/v1/cms/pages/{slug}` | Public pages (higher limit: 200/min) |
| `/api/v1/cms/case-studies` | Public listings (higher limit: 100/min) |
| Webhook endpoints | Partner integrity via signature verification |