package com.dhb.api.controllers;

import com.dhb.api.models.*;
import com.dhb.api.services.DataService;
import com.dhb.api.utils.HeaderValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transfers")
public class TransferController {

    @Autowired
    private DataService dataService;

    @GetMapping("/payment/{customerId}/{sourceAccount}")
    public ResponseEntity<?> getTransferSimulation(@PathVariable String customerId, @PathVariable String sourceAccount, 
                                                   @RequestParam(defaultValue = "") String targetIBAN,
                                                   @RequestParam(defaultValue = "0") String amount,
                                                   @RequestParam(defaultValue = "EUR") String currencyCode,
                                                   @RequestParam(defaultValue = "") String description,
                                                   @RequestParam(defaultValue = "normal") String paymentType,
                                                   @RequestParam(defaultValue = "oneOff") String period,
                                                   @RequestHeader HttpHeaders headers) {
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

        // Validate source account
        if (sourceAccount == null || sourceAccount.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = new HashMap<>();
        response.put("simulationId", dataService.generateUUID());
        response.put("sourceAccount", sourceAccount);
        response.put("targetIBAN", targetIBAN);
        response.put("amount", Double.parseDouble(amount));
        response.put("currencyCode", currencyCode);
        response.put("description", description);
        response.put("paymentType", paymentType);
        response.put("period", period);
        response.put("fees", 0.00);
        response.put("totalAmount", Double.parseDouble(amount));
        response.put("estimatedDelivery", LocalDateTime.now().toLocalDate().toString());
        response.put("status", "SIMULATED");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/ownAccountTransfer/{customerId}/{sourceAccount}")
    public ResponseEntity<?> getOwnAccountTransfer(@PathVariable String customerId, @PathVariable String sourceAccount, @RequestHeader HttpHeaders headers) {
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

        // Validate source account
        if (sourceAccount == null || sourceAccount.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("456", "Account number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "customerId", customerId,
            "sourceAccount", sourceAccount,
            "targetAccounts", List.of(
                Map.of(
                    "accountNumber", "2018470579",
                    "accountName", "DHB MaxiSpaar",
                    "iban", "NL24DHBN2018470579"
                )
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/utilities/holidays")
    public ResponseEntity<?> getHolidays(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        List<Map<String, Object>> response = List.of(
            Map.of(
                "date", "2025-01-01",
                "description", "New Year's Day",
                "isHoliday", true
            ),
            Map.of(
                "date", "2025-12-25",
                "description", "Christmas Day",
                "isHoliday", true
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/utilities/bankDate")
    public ResponseEntity<?> getBankDate(@RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "bankDate", LocalDateTime.now().toLocalDate().toString(),
            "isBusinessDay", true
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/payment/futurePayment/list/{customerId}")
    public ResponseEntity<?> getFuturePaymentList(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
        List<Map<String, Object>> response = List.of(
            Map.of(
                "paymentId", "PAY001",
                "sourceAccount", "2018470578",
                "targetIBAN", "NL24DHBN2018470579",
                "amount", 500.00,
                "description", "Monthly transfer",
                "scheduledDate", "2025-02-01",
                "status", "SCHEDULED"
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/payment/{customerId}/{reference}")
    public ResponseEntity<?> getPaymentByReference(@PathVariable String customerId, @PathVariable String reference, @RequestHeader HttpHeaders headers) {
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
            "reference", reference,
            "customerId", customerId,
            "status", "COMPLETED",
            "amount", 100.00,
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }
}

