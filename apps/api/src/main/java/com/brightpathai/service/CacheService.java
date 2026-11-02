package com.brightpathai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

/**
 * Redis-based caching service for API response caching.
 *
 * <p>Caching strategy:</p>
 * <ul>
 *   <li>Case studies and blog posts: cached for 1 hour (read-heavy, infrequent updates)</li>
 *   <li>Project listings: cached for 5 minutes (moderate update frequency)</li>
 *   <li>Project details: cached for 10 minutes</li>
 *   <li>User profiles: cached for 30 minutes</li>
 * </ul>
 *
 * <p>Cache invalidation happens on write operations (create/update/delete).</p>
 */
@Service
@RequiredArgsConstructor
public class CacheService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_PREFIX = "agency:cache:";

    // TTL constants
    private static final Duration CASE_STUDY_TTL = Duration.ofHours(1);
    private static final Duration BLOG_POST_TTL = Duration.ofHours(1);
    private static final Duration PROJECT_LIST_TTL = Duration.ofMinutes(5);
    private static final Duration PROJECT_DETAIL_TTL = Duration.ofMinutes(10);
    private static final Duration USER_PROFILE_TTL = Duration.ofMinutes(30);

    /**
     * Gets a cached value by key.
     *
     * @param key the cache key
     * @param clazz the class type to deserialize to
     * @param <T> the type of the cached value
     * @return the cached value or empty if not found/expired
     */
    public <T> Optional<T> get(String key, Class<T> clazz) {
        String cacheKey = CACHE_PREFIX + key;
        String json = redisTemplate.opsForValue().get(cacheKey);
        if (json == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(json, clazz));
        } catch (Exception e) {
            // Corrupted cache entry, remove it
            redisTemplate.delete(cacheKey);
            return Optional.empty();
        }
    }

    /**
     * Sets a cached value with the specified TTL.
     *
     * @param key the cache key
     * @param value the value to cache
     * @param ttl the time-to-live duration
     * @param <T> the type of the value
     */
    public <T> void put(String key, T value, Duration ttl) {
        String cacheKey = CACHE_PREFIX + key;
        try {
            String json = objectMapper.writeValueAsString(value);
            redisTemplate.opsForValue().set(cacheKey, json, ttl);
        } catch (Exception e) {
            // Cache write failure is non-fatal
            System.err.println("Cache write failed for key: " + cacheKey);
        }
    }

    /**
     * Removes a cached value by key.
     *
     * @param key the cache key to remove
     */
    public void evict(String key) {
        redisTemplate.delete(CACHE_PREFIX + key);
    }

    /**
     * Removes all cached values matching a pattern.
     *
     * @param pattern the key pattern to match
     */
    public void evictByPattern(String pattern) {
        redisTemplate.delete(redisTemplate.keys(CACHE_PREFIX + pattern));
    }

    // Convenience methods for common cache keys

    public String caseStudyKey(String slug) {
        return "case-study:" + slug;
    }

    public String blogPostKey(String slug) {
        return "blog-post:" + slug;
    }

    public String projectListKey(UUID userId, int page, int size) {
        return "project-list:" + userId + ":" + page + ":" + size;
    }

    public String projectDetailKey(UUID projectId) {
        return "project-detail:" + projectId;
    }

    public String userProfileKey(String userId) {
        return "user-profile:" + userId;
    }

    public Duration getCaseStudyTtl() { return CASE_STUDY_TTL; }
    public Duration getBlogPostTtl() { return BLOG_POST_TTL; }
    public Duration getProjectListTtl() { return PROJECT_LIST_TTL; }
    public Duration getProjectDetailTtl() { return PROJECT_DETAIL_TTL; }
    public Duration getUserProfileTtl() { return USER_PROFILE_TTL; }
}
