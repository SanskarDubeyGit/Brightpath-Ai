package com.brightpathai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class PostHogService {

    @Value("${posthog.api.key:}")
    private String apiKey;

    @Value("${posthog.api.host:https://app.posthog.com}")
    private String apiHost;

    private boolean enabled;

    public PostHogService() {
        this.enabled = false;
    }

    public void init() {
        this.enabled = apiKey != null && !apiKey.isEmpty();
        if (!enabled) {
            System.out.println("PostHog not configured, analytics disabled");
        }
    }

    /**
     * Track a custom event in PostHog
     */
    public void trackEvent(String eventName, String userId, Map<String, Object> properties) {
        if (!enabled) return;

        // In production, this would send an HTTP request to PostHog API
        // For MVP, we log the event
        Map<String, Object> payload = new HashMap<>();
        payload.put("event", eventName);
        payload.put("properties", properties);
        payload.put("distinct_id", userId);
        payload.put("timestamp", System.currentTimeMillis());

        System.out.println("[PostHog] " + payload);
    }

    /**
     * Identify a user in PostHog
     */
    public void identifyUser(String userId, Map<String, Object> properties) {
        if (!enabled) return;

        Map<String, Object> payload = new HashMap<>();
        payload.put("event", "$identify");
        payload.put("properties", properties);
        payload.put("distinct_id", userId);

        System.out.println("[PostHog] " + payload);
    }

    /**
     * Track user registration
     */
    public void trackRegistration(String userId, String email, String locale) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("email", email);
        properties.put("locale", locale);
        trackEvent("user_registered", userId, properties);
    }

    /**
     * Track consultation booking
     */
    public void trackBooking(String userId, String projectId, String slotId, String serviceType) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("project_id", projectId);
        properties.put("slot_id", slotId);
        properties.put("service_type", serviceType);
        trackEvent("consultation_booked", userId, properties);
    }

    /**
     * Track project creation
     */
    public void trackProjectCreated(String userId, String projectId, String status) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("project_id", projectId);
        properties.put("status", status);
        trackEvent("project_created", userId, properties);
    }

    public boolean isEnabled() {
        return enabled;
    }
}
