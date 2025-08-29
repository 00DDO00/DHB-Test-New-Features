package com.dhb.api.controllers;

import com.dhb.api.models.*;
import com.dhb.api.utils.HeaderValidator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    @GetMapping("/saving/modification/{customerId}/{accountNumber}")
    public ResponseEntity<?> getSavingModification(@PathVariable String customerId, @PathVariable String accountNumber, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate customer ID
        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("453", "Customer id is null"));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "accountNumber", accountNumber,
            "customerId", customerId,
            "modificationAllowed", true,
            "modificationOptions", List.of(
                "interest_rate_change",
                "account_type_change",
                "holder_change"
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/new/{customerId}")
    public ResponseEntity<?> getNewSavingAccountOptions(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate customer ID
        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("453", "Customer id is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "customerId", customerId,
            "availableProducts", List.of(
                Map.of(
                    "productCode", "SAV_ONLINE",
                    "productName", "DHB SaveOnline",
                    "interestRate", 1.1,
                    "minimumAmount", 0,
                    "maximumAmount", 1000000,
                    "currency", "EUR"
                ),
                Map.of(
                    "productCode", "SAV_MAXI",
                    "productName", "DHB MaxiSpaar",
                    "interestRate", 1.1,
                    "minimumAmount", 0,
                    "maximumAmount", 1000000,
                    "currency", "EUR"
                ),
                Map.of(
                    "productCode", "SAV_COMBI",
                    "productName", "DHB Combispaar",
                    "interestRate", 1.1,
                    "minimumAmount", 0,
                    "maximumAmount", 1000000,
                    "currency", "EUR"
                )
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/utilities/customerMatchByAccount/{customerId}/{accountNumber}")
    public ResponseEntity<?> getCustomerMatchByAccount(@PathVariable String customerId, @PathVariable String accountNumber, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate customer ID
        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("453", "Customer id is null"));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "customerId", customerId,
            "accountNumber", accountNumber,
            "isMatch", true,
            "customerName", "Lucy Lavender",
            "accountHolder", "Lucy Lavender"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/targetAccounts/{customerId}/{accountNumber}/{transactionType}")
    public ResponseEntity<?> getTargetAccounts(@PathVariable String customerId, @PathVariable String accountNumber, @PathVariable String transactionType, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate customer ID
        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("453", "Customer id is null"));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        List<Map<String, Object>> response = List.of(
            Map.of(
                "accountNumber", "2018470580",
                "accountName", "Target Account 1",
                "iban", "NL24DHBN2018470580",
                "holderName", "John Doe"
            ),
            Map.of(
                "accountNumber", "2018470581",
                "accountName", "Target Account 2",
                "iban", "NL24DHBN2018470581",
                "holderName", "Jane Smith"
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/transactions/receipt/{accountNumber}")
    public ResponseEntity<?> getTransactionReceipt(@PathVariable String accountNumber, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "accountNumber", accountNumber,
            "transactionId", "TXN001",
            "receiptUrl", "/receipts/" + accountNumber + "/TXN001.pdf",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/statement/{accountNumber}/{pageIndex}/{pageSize}")
    public ResponseEntity<?> getAccountStatement(@PathVariable String accountNumber, @PathVariable int pageIndex, @PathVariable int pageSize, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "accountNumber", accountNumber,
            "accountName", "DHB SaveOnline",
            "currencyCode", "EUR",
            "transactions", List.of(
                Map.of(
                    "transactionDate", "2025-01-15",
                    "valueDate", "2025-01-15",
                    "description", "Salary payment",
                    "amount", 2500.00,
                    "balance", 10566.55,
                    "type", "CREDIT",
                    "reference", "REF001"
                ),
                Map.of(
                    "transactionDate", "2025-01-14",
                    "valueDate", "2025-01-14",
                    "description", "Online purchase",
                    "amount", -125.50,
                    "balance", 8066.55,
                    "type", "DEBIT",
                    "reference", "REF002"
                )
            ),
            "pagination", Map.of(
                "pageIndex", pageIndex,
                "pageSize", pageSize,
                "totalRecords", 2,
                "totalPages", 1
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/statement/print/{accountNumber}")
    public ResponseEntity<?> printAccountStatement(@PathVariable String accountNumber, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "accountNumber", accountNumber,
            "statementUrl", "/statements/" + accountNumber + "/statement.pdf",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/rates/{customerId}")
    public ResponseEntity<?> getSavingRates(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate customer ID
        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("453", "Customer id is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "customerId", customerId,
            "rates", List.of(
                Map.of(
                    "productCode", "SAV_ONLINE",
                    "productName", "DHB SaveOnline",
                    "interestRate", 1.1,
                    "effectiveDate", "2025-01-01",
                    "currency", "EUR"
                ),
                Map.of(
                    "productCode", "SAV_MAXI",
                    "productName", "DHB MaxiSpaar",
                    "interestRate", 1.1,
                    "effectiveDate", "2025-01-01",
                    "currency", "EUR"
                ),
                Map.of(
                    "productCode", "SAV_COMBI",
                    "productName", "DHB Combispaar",
                    "interestRate", 1.1,
                    "effectiveDate", "2025-01-01",
                    "currency", "EUR"
                )
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/history/{accountNumber}")
    public ResponseEntity<?> getSavingHistory(@PathVariable String accountNumber, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "accountNumber", accountNumber,
            "history", List.of(
                Map.of(
                    "date", "2025-01-15",
                    "action", "ACCOUNT_OPENED",
                    "description", "Account opened",
                    "amount", 1000.00
                ),
                Map.of(
                    "date", "2025-01-20",
                    "action", "INTEREST_PAID",
                    "description", "Interest payment",
                    "amount", 5.50
                )
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/history/print/{accountNumber}")
    public ResponseEntity<?> printSavingHistory(@PathVariable String accountNumber, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate account number
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "accountNumber", accountNumber,
            "historyUrl", "/history/" + accountNumber + "/history.pdf",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/saving/calculate/{customerId}")
    public ResponseEntity<?> calculateSaving(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate customer ID
        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("453", "Customer id is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "customerId", customerId,
            "calculations", List.of(
                Map.of(
                    "productCode", "SAV_ONLINE",
                    "amount", 10000.00,
                    "interestRate", 1.1,
                    "interestEarned", 110.00,
                    "totalAmount", 10110.00
                )
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list/{customerId}")
    public ResponseEntity<?> getAccountList(@PathVariable String customerId, @RequestParam(defaultValue = "saving") String accountType, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate customer ID
        if (customerId == null || customerId.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("453", "Customer id is null"));
        }

        // Mock accounts data
        List<Map<String, Object>> mockAccounts = new ArrayList<>();
        
        // First account
        Map<String, Object> account1 = new HashMap<>();
        account1.put("BIC", "DHBNNL2R");
        account1.put("IBAN", "NL24DHBN2018470578");
        account1.put("accountName", "DHB SaveOnline");
        account1.put("accountNumber", "2018470578");
        account1.put("accountNumberLabel", "SaveOnline Account");
        account1.put("address", "GRONINGEN, STR. VONDELLAAN 172");
        
        Map<String, Object> branch1 = new HashMap<>();
        branch1.put("code", "AMS");
        branch1.put("name", "Amsterdam Branch");
        account1.put("branch", branch1);
        
        account1.put("currencyCode", "EUR");
        account1.put("customerName", "Lucy Lavender");
        
        Map<String, Object> detail1 = new HashMap<>();
        detail1.put("balance", 10566.55);
        detail1.put("holderName", "Lucy Lavender");
        detail1.put("interestRate", 1.1);
        account1.put("detail", detail1);
        
        account1.put("minPaymentDate", "2025-01-15T00:00:00Z");
        
        Map<String, Object> moduleType1 = new HashMap<>();
        moduleType1.put("code", "SAV");
        moduleType1.put("name", "Savings");
        account1.put("moduleType", moduleType1);
        
        Map<String, Object> operationProfile1 = new HashMap<>();
        operationProfile1.put("allowClosing", true);
        operationProfile1.put("allowModification", true);
        operationProfile1.put("allowOwnTransferOut", true);
        operationProfile1.put("allowPaymentOrderOut", true);
        operationProfile1.put("allowPrintStatement", true);
        operationProfile1.put("allowSourceForOpening", true);
        account1.put("operationProfile", operationProfile1);
        
        Map<String, Object> productClass1 = new HashMap<>();
        productClass1.put("code", "SAVINGS");
        productClass1.put("name", "Savings Account");
        account1.put("productClass", productClass1);
        
        Map<String, Object> productGroup1 = new HashMap<>();
        productGroup1.put("code", "saveOnline");
        productGroup1.put("name", "SaveOnline");
        account1.put("productGroup", productGroup1);
        
        Map<String, Object> productType1 = new HashMap<>();
        productType1.put("code", "SAV_ONLINE");
        productType1.put("name", "Online Savings");
        account1.put("productType", productType1);
        
        account1.put("status", "active");
        mockAccounts.add(account1);
        
        // Second account
        Map<String, Object> account2 = new HashMap<>();
        account2.put("BIC", "DHBNNL2R");
        account2.put("IBAN", "NL24DHBN2018470579");
        account2.put("accountName", "DHB MaxiSpaar");
        account2.put("accountNumber", "2018470579");
        account2.put("accountNumberLabel", "MaxiSpaar Account");
        account2.put("address", "GRONINGEN, STR. VONDELLAAN 172");
        
        Map<String, Object> branch2 = new HashMap<>();
        branch2.put("code", "AMS");
        branch2.put("name", "Amsterdam Branch");
        account2.put("branch", branch2);
        
        account2.put("currencyCode", "EUR");
        account2.put("customerName", "Lucy Lavender");
        
        Map<String, Object> detail2 = new HashMap<>();
        detail2.put("balance", 31960.23);
        detail2.put("holderName", "Lucy Lavender");
        detail2.put("interestRate", 1.1);
        account2.put("detail", detail2);
        
        account2.put("minPaymentDate", "2025-01-15T00:00:00Z");
        
        Map<String, Object> moduleType2 = new HashMap<>();
        moduleType2.put("code", "SAV");
        moduleType2.put("name", "Savings");
        account2.put("moduleType", moduleType2);
        
        Map<String, Object> operationProfile2 = new HashMap<>();
        operationProfile2.put("allowClosing", true);
        operationProfile2.put("allowModification", true);
        operationProfile2.put("allowOwnTransferOut", true);
        operationProfile2.put("allowPaymentOrderOut", true);
        operationProfile2.put("allowPrintStatement", true);
        operationProfile2.put("allowSourceForOpening", true);
        account2.put("operationProfile", operationProfile2);
        
        Map<String, Object> productClass2 = new HashMap<>();
        productClass2.put("code", "SAVINGS");
        productClass2.put("name", "Savings Account");
        account2.put("productClass", productClass2);
        
        Map<String, Object> productGroup2 = new HashMap<>();
        productGroup2.put("code", "maxiSpaar");
        productGroup2.put("name", "MaxiSpaar");
        account2.put("productGroup", productGroup2);
        
        Map<String, Object> productType2 = new HashMap<>();
        productType2.put("code", "SAV_MAXI");
        productType2.put("name", "Maxi Savings");
        account2.put("productType", productType2);
        
        account2.put("status", "active");
        mockAccounts.add(account2);

        Map<String, Object> response = Map.of("saving", mockAccounts);
        return ResponseEntity.ok(response);
    }
}

