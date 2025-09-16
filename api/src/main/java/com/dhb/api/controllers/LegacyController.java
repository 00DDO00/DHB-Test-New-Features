package com.dhb.api.controllers;

import com.dhb.api.models.*;
import com.dhb.api.services.DataService;
import com.dhb.api.utils.HeaderValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class LegacyController {

    @Autowired
    private DataService dataService;

    @GetMapping("/combispaar")
    public ResponseEntity<?> getCombispaar(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", List.of(
                Map.of(
                    "id", "combispaar_001",
                    "name", "DHB Combispaar",
                    "type", "combispaar",
                    "balance", 15000.00,
                    "currency", "EUR",
                    "iban", "NL24DHBN2018470580",
                    "interest_rate", 1.1,
                    "holder_name", "Lucy Lavender"
                )
            ),
            "total_balance", 150000.00,
            "count", 5,
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/combispaar/accounts")
    public ResponseEntity<?> getCombispaarAccounts(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response with 5 different CombiSpaar accounts
        List<Map<String, Object>> accounts = List.of(
            Map.of(
                "id", "combispaar_001",
                "name", "DHB Combispaar - Short Term",
                "type", "combispaar",
                "balance", 25000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470581",
                "interest_rate", 1.1,
                "holder_name", "Lucy Lavender",
                "term", "3 months",
                "maturity_date", "2025-04-15"
            ),
            Map.of(
                "id", "combispaar_002",
                "name", "DHB Combispaar - Medium Term",
                "type", "combispaar",
                "balance", 35000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470582",
                "interest_rate", 1.3,
                "holder_name", "Lucy Lavender",
                "term", "1 year",
                "maturity_date", "2026-01-15"
            ),
            Map.of(
                "id", "combispaar_003",
                "name", "DHB Combispaar - Long Term",
                "type", "combispaar",
                "balance", 45000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470583",
                "interest_rate", 1.5,
                "holder_name", "Lucy Lavender",
                "term", "2 years",
                "maturity_date", "2027-01-15"
            ),
            Map.of(
                "id", "combispaar_004",
                "name", "DHB Combispaar - Premium",
                "type", "combispaar",
                "balance", 30000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470584",
                "interest_rate", 1.4,
                "holder_name", "Lucy Lavender",
                "term", "18 months",
                "maturity_date", "2026-07-15"
            ),
            Map.of(
                "id", "combispaar_005",
                "name", "DHB Combispaar - Extended",
                "type", "combispaar",
                "balance", 15000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470585",
                "interest_rate", 1.2,
                "holder_name", "Lucy Lavender",
                "term", "6 months",
                "maturity_date", "2025-07-15"
            )
        );

        Map<String, Object> response = Map.of(
            "success", true,
            "data", accounts,
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/maxispaar/accounts")
    public ResponseEntity<?> getMaxiSpaarAccounts(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response with 5 different MaxiSpaar accounts
        List<Map<String, Object>> accounts = List.of(
            Map.of(
                "id", "maxispaar_001",
                "name", "DHB MaxiSpaar - Short Term",
                "type", "maxispaar",
                "balance", 40000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470591",
                "interest_rate", 2.1,
                "holder_name", "Lucy Lavender",
                "term", "3 months",
                "maturity_date", "2025-04-15"
            ),
            Map.of(
                "id", "maxispaar_002",
                "name", "DHB MaxiSpaar - Medium Term",
                "type", "maxispaar",
                "balance", 55000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470592",
                "interest_rate", 2.3,
                "holder_name", "Lucy Lavender",
                "term", "1 year",
                "maturity_date", "2026-01-15"
            ),
            Map.of(
                "id", "maxispaar_003",
                "name", "DHB MaxiSpaar - Long Term",
                "type", "maxispaar",
                "balance", 70000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470593",
                "interest_rate", 2.5,
                "holder_name", "Lucy Lavender",
                "term", "2 years",
                "maturity_date", "2027-01-15"
            ),
            Map.of(
                "id", "maxispaar_004",
                "name", "DHB MaxiSpaar - Premium",
                "type", "maxispaar",
                "balance", 60000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470594",
                "interest_rate", 2.4,
                "holder_name", "Lucy Lavender",
                "term", "18 months",
                "maturity_date", "2026-07-15"
            ),
            Map.of(
                "id", "maxispaar_005",
                "name", "DHB MaxiSpaar - Extended",
                "type", "maxispaar",
                "balance", 35000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470595",
                "interest_rate", 2.2,
                "holder_name", "Lucy Lavender",
                "term", "6 months",
                "maturity_date", "2025-07-15"
            )
        );

        Map<String, Object> response = Map.of(
            "success", true,
            "data", accounts,
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/solidextra/accounts")
    public ResponseEntity<?> getSolidExtraAccounts(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response with 5 different SolidExtra accounts
        List<Map<String, Object>> accounts = List.of(
            Map.of(
                "id", "solidextra_001",
                "name", "DHB SolidExtra - Short Term",
                "type", "solidextra",
                "balance", 30000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470601",
                "interest_rate", 1.8,
                "holder_name", "Lucy Lavender",
                "term", "3 months",
                "maturity_date", "2025-04-15"
            ),
            Map.of(
                "id", "solidextra_002",
                "name", "DHB SolidExtra - Medium Term",
                "type", "solidextra",
                "balance", 45000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470602",
                "interest_rate", 2.0,
                "holder_name", "Lucy Lavender",
                "term", "1 year",
                "maturity_date", "2026-01-15"
            ),
            Map.of(
                "id", "solidextra_003",
                "name", "DHB SolidExtra - Long Term",
                "type", "solidextra",
                "balance", 60000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470603",
                "interest_rate", 2.2,
                "holder_name", "Lucy Lavender",
                "term", "2 years",
                "maturity_date", "2027-01-15"
            ),
            Map.of(
                "id", "solidextra_004",
                "name", "DHB SolidExtra - Premium",
                "type", "solidextra",
                "balance", 50000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470604",
                "interest_rate", 2.1,
                "holder_name", "Lucy Lavender",
                "term", "18 months",
                "maturity_date", "2026-07-15"
            ),
            Map.of(
                "id", "solidextra_005",
                "name", "DHB SolidExtra - Extended",
                "type", "solidextra",
                "balance", 25000.00,
                "currency", "EUR",
                "iban", "NL24DHBN2018470605",
                "interest_rate", 1.9,
                "holder_name", "Lucy Lavender",
                "term", "6 months",
                "maturity_date", "2025-07-15"
            )
        );

        Map<String, Object> response = Map.of(
            "success", true,
            "data", accounts,
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/combispaar/page-data")
    public ResponseEntity<?> getCombispaarPageData(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of(
                "accountName", "DHB SaveOnline",
                "balance", "€ 10.566,55",
                "iban", "NL24DHBN2018470578",
                "interestRate", 1.1,
                "title", "Save and still be able to withdraw money",
                "description", "The DHB CombiSpaarrekening offers a higher interest rate than the DHB SaveOnline because withdrawals are planned in advance. Depending on the chosen account, you can give 33, 66, or 99 days' notice for withdrawals. A longer notice period results in a higher interest rate."
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/combispaar/account-options")
    public ResponseEntity<?> getCombispaarAccountOptions(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", List.of(
                Map.of(
                    "id", "33-days",
                    "name", "33 Days Notice",
                    "days", 33,
                    "interestRate", 1.5,
                    "balanceClass", "Class A",
                    "noticePeriod", "33 days",
                    "interest", "1.5%",
                    "validFrom", "2025-01-15"
                ),
                Map.of(
                    "id", "66-days",
                    "name", "66 Days Notice",
                    "days", 66,
                    "interestRate", 1.8,
                    "balanceClass", "Class B",
                    "noticePeriod", "66 days",
                    "interest", "1.8%",
                    "validFrom", "2025-01-15"
                ),
                Map.of(
                    "id", "99-days",
                    "name", "99 Days Notice",
                    "days", 99,
                    "interestRate", 2.1,
                    "balanceClass", "Class C",
                    "noticePeriod", "99 days",
                    "interest", "2.1%",
                    "validFrom", "2025-01-15"
                )
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/combispaar/iban-options")
    public ResponseEntity<?> getCombispaarIbanOptions(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", List.of(
                Map.of(
                    "iban", "NL24DHBN2018470578",
                    "accountName", "DHB SaveOnline",
                    "balance", "€ 10.566,55",
                    "holderName", "Lucy Lavender"
                ),
                Map.of(
                    "iban", "NL24DHBN2018470579",
                    "accountName", "DHB MaxiSpaar",
                    "balance", "€ 31.960,23",
                    "holderName", "Lucy Lavender"
                )
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/chart-data")
    public ResponseEntity<?> getChartData(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", List.of(
                Map.of(
                    "label", "Savings",
                    "value", 42526.78,
                    "color", "#1976d2"
                ),
                Map.of(
                    "label", "Investments",
                    "value", 15000.00,
                    "color", "#388e3c"
                ),
                Map.of(
                    "label", "Checking",
                    "value", 5000.00,
                    "color", "#f57c00"
                )
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of(
                "name", "Lucy Lavender",
                "customer_id", "CUST001",
                "last_login", "2025-01-15 14:30:00"
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of(
                "accounts", List.of(
                    Map.of(
                        "id", "saveonline_001",
                        "name", "DHB SaveOnline",
                        "type", "savings",
                        "balance", 10566.55,
                        "currency", "EUR",
                        "iban", "NL24DHBN2018470578",
                        "interest_rate", 1.1,
                        "holder_name", "Lucy Lavender"
                    ),
                    Map.of(
                        "id", "maxispaar_001",
                        "name", "DHB MaxiSpaar",
                        "type", "savings",
                        "balance", 31960.23,
                        "currency", "EUR",
                        "iban", "NL24DHBN2018470579",
                        "interest_rate", 1.1,
                        "holder_name", "Lucy Lavender"
                    )
                ),
                "combispaar", Map.of(
                    "accounts", List.of(
                        Map.of(
                            "id", "combispaar_001",
                            "name", "DHB Combispaar",
                            "type", "combispaar",
                            "balance", 15000.00,
                            "currency", "EUR",
                            "iban", "NL24DHBN2018470580",
                            "interest_rate", 1.1,
                            "holder_name", "Lucy Lavender"
                        )
                    ),
                    "total_balance", 15000.00,
                    "count", 1
                ),
                "chart_data", List.of(
                    Map.of(
                        "label", "Savings",
                        "value", 42526.78,
                        "color", "#1976d2"
                    ),
                    Map.of(
                        "label", "Investments",
                        "value", 15000.00,
                        "color", "#388e3c"
                    ),
                    Map.of(
                        "label", "Checking",
                        "value", 5000.00,
                        "color", "#f57c00"
                    )
                ),
                "user_info", Map.of(
                    "name", "Lucy Lavender",
                    "customer_id", "CUST001",
                    "last_login", "2025-01-15 14:30:00"
                )
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/maxispaar/page-data")
    public ResponseEntity<?> getMaxispaarPageData(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of(
                "accountName", "DHB MaxiSpaar",
                "balance", "€ 31.960,23",
                "iban", "NL24DHBN2018470579",
                "interest_rate", 1.1,
                "title", "MaxiSpaar Account",
                "description", "High-yield savings account with flexible terms",
                "additional", "No notice period required"
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/personal-details")
    public ResponseEntity<?> getPersonalDetails(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of(
                "updateId", "PASSPORT - 1234567",
                "mobilePhone", "+31 123 456 789",
                "password", "**********",
                "email", "lucy.lavender@example.com",
                "telephone", "+31 987 654 321",
                "address", "GRONINGEN, STR. VONDELLAAN 172"
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/personal-details")
    public ResponseEntity<?> updatePersonalDetails(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", request,
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/personal-details/phone")
    public ResponseEntity<?> getPhone(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of("phone", "+31 123 456 789"),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/personal-details/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        String newPassword = (String) request.get("password");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("470", "Password is required"));
        }

        // Update password
        dataService.setCurrentPassword(newPassword);

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of(
                "updateId", "PASSPORT - 1234567",
                "mobilePhone", "+31 123 456 789",
                "password", "**********",
                "email", "lucy.lavender@example.com",
                "telephone", "+31 987 654 321",
                "address", "GRONINGEN, STR. VONDELLAAN 172"
            ),
            "message", "Password updated successfully",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/personal-details/validate-password")
    public ResponseEntity<?> validatePassword(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        String providedPassword = (String) request.get("password");
        boolean isValid = providedPassword != null && providedPassword.equals(dataService.getCurrentPassword());

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "valid", isValid,
            "message", isValid ? "Password is valid" : "Password is incorrect",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/verification/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Generate a random 6-digit code
        Random random = new Random();
        String verificationCode = String.format("%06d", random.nextInt(1000000));

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of("code", verificationCode),
            "message", "Verification code sent successfully",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/account/by-iban")
    public ResponseEntity<?> getAccountByIban(@RequestParam String iban, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", Map.of(
                "holder_name", "Lucy Lavender",
                "institution_name", "DHB Bank",
                "bic", "DHBNNL2R",
                "customer_number", "123456789",
                "support_reg_number", "SUP001",
                "support_packages", "Premium",
                "email", "lucy.lavender@example.com"
            ),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/sof-questions")
    public ResponseEntity<?> getSOFQuestions(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", dataService.getSofQuestionsStore(),
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/sof-questions")
    public ResponseEntity<?> updateSOFQuestions(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> questions = (List<Map<String, Object>>) request.get("questions");
        
        if (questions != null) {
            // Convert to SOFQuestion objects
            List<SOFQuestion> sofQuestions = questions.stream()
                .map(q -> new SOFQuestion((String) q.get("question"), (String) q.get("answer")))
                .toList();
            
            dataService.setSofQuestionsStore(sofQuestions);
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "data", dataService.getSofQuestionsStore(),
            "message", "SOF questions updated successfully",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/documents/download")
    public ResponseEntity<?> downloadDocument(@RequestParam String type, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response - generate a simple text file
        String content = "This is a mock " + type + " document generated at " + LocalDateTime.now();
        
        return ResponseEntity.ok()
            .header("Content-Type", "text/plain")
            .header("Content-Disposition", "attachment; filename=" + type + ".txt")
            .body(content);
    }
}

