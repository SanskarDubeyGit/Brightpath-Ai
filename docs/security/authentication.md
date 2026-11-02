# Authentication & Authorization

## Overview

Passwordless authentication via magic links. JWT-based stateless sessions with short-lived access tokens and rotating refresh tokens. Role-Based Access Control (RBAC) with fine-grained permissions.

## Authentication Flow

### Magic Link Login (Primary)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Client    │     │   API Server │     │   Email Service │
└──────┬──────┘     └──────┬───────┘     └─────────┬───────┘
       │                   │                       │
       │ POST /auth/login  │                       │
       │ {email}           │                       │
       │                   │───────────────────────▶│
       │                   │  Generate magic link  │
       │                   │  (single-use token)   │
       │                   │◀───────────────────────│
       │                   │ 200 OK                │
       │                   │                       │
       │  Magic link sent  │                       │
       │◀──────────────────│                       │
       │                   │                       │
       │ User clicks link  │                       │
       │ GET /auth/verify  │                       │
       │ {token}           │                       │
       │                   │◀───────────────────────│
       │                   │  Validate token       │
       │                   │  Issue JWT pair       │
       │                   │                       │
       │  200 OK + JWT     │                       │
       │◀──────────────────│                       │
       │                   │                       │
```

### Steps

1. User enters email on login page
2. Server generates cryptographically secure single-use token (32 bytes, URL-safe base64)
3. Token stored in Redis with 15-minute TTL, hashed before storage
4. Magic link emailed: `https://app.example.com/auth/verify?token=<token>`
5. User clicks link → server validates token → issues JWT access + refresh token pair
6. Token consumed (deleted from Redis) — single use only

### JWT Token Pair

| Token | Lifetime | Storage | Rotation |
|-------|----------|---------|----------|
| Access Token | 15 minutes | Memory (not localStorage) | No rotation |
| Refresh Token | 7 days | HTTP-only, Secure, SameSite=Strict cookie | Rotated on each use |

### JWT Payload (Access Token)

```json
{
  "sub": "uuid",
  "email": "user@example.com",
  "roles": ["CLIENT"],
  "permissions": ["project:read", "booking:write"],
  "iat": 1730520000,
  "exp": 1730520900,
  "iss": "agency-api",
  "aud": "agency-web",
  "jti": "uuid",
  "typ": "access"
}
```

### JWT Payload (Refresh Token)

```json
{
  "sub": "uuid",
  "iat": 1730520000,
  "exp": 1731124800,
  "iss": "agency-api",
  "aud": "agency-web",
  "jti": "uuid",
  "typ": "refresh",
  "family": "uuid"  // Token family for rotation detection
}
```

### Refresh Token Rotation

1. Client sends refresh token in HTTP-only cookie
2. Server validates token, checks `jti` not in revocation list
3. Server checks `family` matches user's active family
4. New access + refresh token pair issued with new `jti` and same `family`
5. Old refresh token `jti` added to revocation list (Redis, 7-day TTL)
6. If refresh token reused (token theft detected): revoke entire family, force re-login

### Token Revocation

- Refresh tokens stored in Redis with `jti` as key, 7-day TTL
- Revocation list: `revoked:refresh:{jti}` → `1`
- Family-based revocation: `family:{familyId}` → set of active `jti`s
- Logout: revoke current refresh token + all family tokens

## Authorization

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| ADMIN | All permissions |
| CLIENT | `project:read` (own), `project:write` (own), `booking:read` (own), `booking:write` (own), `cms:read` |
| PROJECT_MANAGER | `project:read` (all), `project:write` (assigned), `task:read` (all), `task:write` (assigned), `booking:read` (all) |
| DEVELOPER | `task:read` (assigned), `task:write` (assigned), `project:read` (assigned) |

### Permission Checks

```java
// Controller level
@PreAuthorize("hasPermission(#projectId, 'project', 'READ')")
@GetMapping("/projects/{id}")
public ProjectDto getProject(@PathVariable UUID id) { ... }

// Service level
@PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
@PostMapping("/projects")
public ProjectDto createProject(@RequestBody CreateProjectDto dto) { ... }
```

### Custom Permission Evaluator

```java
@Component
public class ProjectPermissionEvaluator implements PermissionEvaluator {
    
    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        if (!(targetDomainObject instanceof UUID projectId)) return false;
        UserDetails user = (UserDetails) auth.getPrincipal();
        // Check project ownership or membership
        return projectService.userHasAccess(user.getUsername(), projectId, (String) permission);
    }
    
    @Override
    public boolean hasPermission(Authentication auth, Serializable targetId, String targetType, Object permission) {
        // Implement for ID-based checks without loading entity
    }
}
```

### Route Protection (Next.js Middleware)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const protectedRoutes = ['/dashboard', '/projects', '/bookings', '/profile'];
  
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Optionally verify token with API
  }
  return NextResponse.next();
}
```

## Session Security

- **Access token**: Stored in memory only (Next.js state management), never in localStorage
- **Refresh token**: HTTP-only cookie, `Secure`, `SameSite=Strict`, `Path=/api/v1/auth/refresh`
- **CSRF protection**: Double-submit cookie pattern for state-changing operations
- **Session fixation**: New tokens issued on login, old refresh tokens revoked
- **Concurrent sessions**: Configurable limit (default: 5 active sessions per user)

## Logout

1. Client calls `POST /auth/logout` with refresh token
2. Server revokes refresh token `jti` + entire family
3. Server clears HTTP-only cookie
4. Client clears access token from memory
5. Redirect to login page

## MFA (Future)

TOTP and WebAuthn scaffolding prepared in database schema (`mfa_devices` table) but not activated in Phase 4. Can be enabled by adding MFA verification step between magic link validation and JWT issuance.