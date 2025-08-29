package com.dhb.api.utils;

import org.springframework.http.HttpHeaders;
import java.util.ArrayList;
import java.util.List;

public class HeaderValidator {
    
    private static final String[] REQUIRED_HEADERS = {
        "channelCode", "username", "lang", "countryCode", "sessionId"
    };

    public static ValidationResult validateRequiredHeaders(HttpHeaders headers) {
        List<String> missingHeaders = new ArrayList<>();
        
        for (String requiredHeader : REQUIRED_HEADERS) {
            if (headers.getFirst(requiredHeader) == null || headers.getFirst(requiredHeader).trim().isEmpty()) {
                missingHeaders.add(requiredHeader);
            }
        }
        
        if (missingHeaders.isEmpty()) {
            return new ValidationResult(true, null);
        } else {
            return new ValidationResult(false, missingHeaders);
        }
    }

    public static class ValidationResult {
        private final boolean valid;
        private final List<String> missingHeaders;

        public ValidationResult(boolean valid, List<String> missingHeaders) {
            this.valid = valid;
            this.missingHeaders = missingHeaders;
        }

        public boolean isValid() { return valid; }
        public List<String> getMissingHeaders() { return missingHeaders; }
    }
}

