package com.dhb.api.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class ErrorResponse {
    private boolean success;
    private Error error;
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    public static class Error {
        private String code;
        private String message;
        private String description;

        public Error() {}

        public Error(String code, String message, String description) {
            this.code = code;
            this.message = message;
            this.description = description;
        }

        // Getters and Setters
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    // Constructors
    public ErrorResponse() {}

    public ErrorResponse(String code, String message, String description) {
        this.success = false;
        this.error = new Error(code, message, description);
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String code, String message) {
        this.success = false;
        this.error = new Error(code, message, message);
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public Error getError() { return error; }
    public void setError(Error error) { this.error = error; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

