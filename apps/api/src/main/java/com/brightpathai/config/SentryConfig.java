package com.brightpathai.config;

import io.sentry.Sentry;
import io.sentry.spring.SentrySpringAutoConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class SentryConfig {

    @Value("${sentry.dsn:}")
    private String dsn;

    @Value("${sentry.environment:production}")
    private String environment;

    @Value("${sentry.release:1.0.0}")
    private String release;

    @Value("${sentry.traces-sample-rate:0.1}")
    private double tracesSampleRate;

    @PostConstruct
    public void init() {
        if (dsn != null && !dsn.isEmpty()) {
            io.sentry.Sentry.init(options -> {
                options.setDsn(dsn);
                options.setEnvironment(environment);
                options.setRelease(release);
                options.setTracesSampleRate(tracesSampleRate);
            });
        }
    }
}
