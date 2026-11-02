package com.brightpathai.config;

import java.time.Instant;
import java.util.List;

public class ErrorResponse {

    private final String timestamp;
    private final int status;
    private final String error;
    private final String message;
    private final String path;
    private final String requestId;
    private final List<ValidationError> details;

    private ErrorResponse(Builder builder) {
        this.timestamp = builder.timestamp;
        this.status = builder.status;
        this.error = builder.error;
        this.message = builder.message;
        this.path = builder.path;
        this.requestId = builder.requestId;
        this.details = builder.details;
    }

    public static Builder validationError(String path, List<ValidationError> details) {
        return new Builder()
            .timestamp(Instant.now().toString())
            .status(400)
            .error("VALIDATION_ERROR")
            .message("Invalid request payload")
            .path(path)
            .requestId(java.util.UUID.randomUUID().toString())
            .details(details);
    }

    public static Builder internalError(String path, String message) {
        return new Builder()
            .timestamp(Instant.now().toString())
            .status(500)
            .error("INTERNAL_ERROR")
            .message(message)
            .path(path)
            .requestId(java.util.UUID.randomUUID().toString())
            .details(null);
    }

    // Getters
    public String getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }
    public String getRequestId() { return requestId; }
    public List<ValidationError> getDetails() { return details; }

    public static class Builder {
        private String timestamp;
        private int status;
        private String error;
        private String message;
        private String path;
        private String requestId;
        private List<ValidationError> details;

        public Builder timestamp(String timestamp) { this.timestamp = timestamp; return this; }
        public Builder status(int status) { this.status = status; return this; }
        public Builder error(String error) { this.error = error; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder path(String path) { this.path = path; return this; }
        public Builder requestId(String requestId) { this.requestId = requestId; return this; }
        public Builder details(List<ValidationError> details) { this.details = details; return this; }

        public ErrorResponse build() { return new ErrorResponse(this); }
    }

    public static class ValidationError {
        private final String field;
        private final String code;
        private final String message;
        private final String rejectedValue;

        public ValidationError(String field, String code, String message, String rejectedValue) {
            this.field = field;
            this.code = code;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }

        public ValidationError(String field, String message, String rejectedValue) {
            this(field, "VALIDATION_ERROR", message, rejectedValue);
        }

        public String getField() { return field; }
        public String getCode() { return code; }
        public String getMessage() { return message; }
        public String getRejectedValue() { return rejectedValue; }
    }
}
