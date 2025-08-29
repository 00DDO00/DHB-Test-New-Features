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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private DataService dataService;

    @GetMapping("/profile/phone/{customerId}")
    public ResponseEntity<?> getCustomerPhone(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
        List<Map<String, Object>> response = List.of(Map.of(
            "phoneNumber", "+31 123 456 789",
            "phoneType", "MOBILE",
            "phoneTypeName", "Mobile",
            "editable", true,
            "editableFlag", "Y"
        ));

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/phone/{customerId}")
    public ResponseEntity<?> updateCustomerPhone(@PathVariable String customerId, @RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
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

        // Validate phone number
        String phoneNumber = (String) request.get("phoneNumber");
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("454", "Mobile phone number is null"));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Phone number updated successfully",
            "phoneNumber", phoneNumber,
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/identification/{customerId}")
    public ResponseEntity<?> getCustomerIdentification(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
            "identityType", "PASSPORT",
            "identitySeries", "AB",
            "identitySerialNo", "1234567",
            "issueDate", "2020-01-15T00:00:00Z",
            "expiryDate", "2030-01-15T00:00:00Z",
            "issueCountry", "NL",
            "issueCountryName", "Netherlands"
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/identification/{customerId}")
    public ResponseEntity<?> updateCustomerIdentification(@PathVariable String customerId, @RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
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
            "success", true,
            "message", "Identification updated successfully",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/email/{customerId}")
    public ResponseEntity<?> getCustomerEmail(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
        List<Map<String, Object>> response = List.of(Map.of(
            "address", "lucy.lavender@example.com",
            "editable", true,
            "editableFlag", "Y"
        ));

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/email/{customerId}")
    public ResponseEntity<?> updateCustomerEmail(@PathVariable String customerId, @RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
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
            "success", true,
            "message", "Email updated successfully",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/address/{customerId}")
    public ResponseEntity<?> getCustomerAddress(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
        Map<String, Object> address = new HashMap<>();
        address.put("addressType", "HOME");
        address.put("addressTypeName", "Home Address");
        address.put("cityCode", "AMS");
        address.put("cityName", "Amsterdam");
        address.put("countryCode", "NL");
        address.put("editable", true);
        address.put("editableFlag", "Y");
        address.put("fullAddressInfo", "GRONINGEN, STR. VONDELLAAN 172");
        address.put("houseNumber", "172");
        address.put("street", "Vondellaan");
        address.put("zipCode", "1011AA");
        List<Map<String, Object>> response = List.of(address);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/address/{customerId}")
    public ResponseEntity<?> updateCustomerAddress(@PathVariable String customerId, @RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
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
            "success", true,
            "message", "Address updated successfully",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile/validateNetBankingUser")
    public ResponseEntity<?> validateNetBankingUser(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "isValid", true,
            "message", "User validation successful",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile/login")
    public ResponseEntity<?> customerLogin(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "success", true,
            "sessionId", dataService.generateUUID(),
            "message", "Login successful",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile/appStatus")
    public ResponseEntity<?> getAppStatus(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Mock response
        Map<String, Object> response = Map.of(
            "status", "ACTIVE",
            "message", "Application is active",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/messages/{customerId}")
    public ResponseEntity<?> createCustomerMessage(@PathVariable String customerId, @RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
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

        // Create new message
        Message newMessage = new Message(
            "MSG" + dataService.generateUUID().substring(0, 8).toUpperCase(),
            LocalDateTime.now(),
            (String) request.getOrDefault("type", "Email"),
            (String) request.getOrDefault("subject", "New Message"),
            (String) request.getOrDefault("content", ""),
            false
        );

        dataService.getMessagesStore().add(0, newMessage);

        return ResponseEntity.ok(newMessage);
    }

    @GetMapping("/profile/resolveAddress/{customerId}/{postCode}")
    public ResponseEntity<?> resolveAddressByPostcode(@PathVariable String customerId, @PathVariable String postCode, @RequestHeader HttpHeaders headers) {
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
        List<Map<String, Object>> response = List.of(Map.of(
            "street", "Vondellaan",
            "city", "Amsterdam",
            "postCode", postCode,
            "houseNumbers", List.of("170", "172", "174")
        ));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/resolveAddress/{customerId}/{postCode}/{houseNo}")
    public ResponseEntity<?> resolveAddressByHouseNumber(@PathVariable String customerId, @PathVariable String postCode, @PathVariable String houseNo, @RequestHeader HttpHeaders headers) {
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
            "street", "Vondellaan",
            "houseNumber", houseNo,
            "postCode", postCode,
            "city", "Amsterdam",
            "fullAddress", "Vondellaan " + houseNo + ", " + postCode + " Amsterdam"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/isNetBankingUserActive/{customerId}")
    public ResponseEntity<?> isNetBankingUserActive(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
            "isActive", true,
            "lastLoginDate", "2025-01-15T14:30:00Z",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/fullProfile/{customerId}")
    public ResponseEntity<?> getCustomerFullProfile(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
        Map<String, Object> response = new HashMap<>();
        response.put("customerId", customerId);
        response.put("firstName", "Lucy");
        response.put("firstNameLatin", "Lucy");
        response.put("surName", "Lavender");
        response.put("surNameLatin", "Lavender");
        response.put("middleName", "");
        response.put("birthDate", "1985-06-15T00:00:00Z");
        response.put("birthPlace", "Amsterdam");
        response.put("genderCode", "F");
        response.put("genderName", "Female");
        response.put("maritalStatusCode", "S");
        response.put("maritalStatusName", "Single");
        response.put("customerType", "INDIVIDUAL");
        response.put("customerTypeName", "Individual");
        response.put("customerStatus", "ACTIVE");
        response.put("customerNumber", "123456789");
        response.put("taxNumber", "12345678901");
        response.put("taxOfficeCode", "001");
        response.put("taxOfficeName", "Amsterdam Tax Office");
        response.put("identityType", "PASSPORT");
        response.put("identitySeries", "AB");
        response.put("identitySerialNo", "1234567");
        response.put("prefferedLang", "en");
        
        Map<String, Object> address = new HashMap<>();
        address.put("addressType", "HOME");
        address.put("addressTypeName", "Home Address");
        address.put("cityCode", "AMS");
        address.put("cityName", "Amsterdam");
        address.put("countryCode", "NL");
        address.put("editable", true);
        address.put("editableFlag", "Y");
        address.put("fullAddressInfo", "GRONINGEN, STR. VONDELLAAN 172");
        address.put("houseNumber", "172");
        address.put("street", "Vondellaan");
        address.put("zipCode", "1011AA");
        response.put("addresses", List.of(address));
        
        Map<String, Object> phone = new HashMap<>();
        phone.put("editable", true);
        phone.put("editableFlag", "Y");
        phone.put("phoneNumber", "+31 123 456 789");
        phone.put("phoneType", "MOBILE");
        phone.put("phoneTypeName", "Mobile");
        response.put("phones", List.of(phone));
        
        Map<String, Object> email = new HashMap<>();
        email.put("address", "lucy.lavender@example.com");
        email.put("editable", true);
        email.put("editableFlag", "Y");
        response.put("emails", List.of(email));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages/{customerId}/{reference}")
    public ResponseEntity<?> getCustomerMessageByReference(@PathVariable String customerId, @PathVariable String reference, @RequestHeader HttpHeaders headers) {
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

        // Find message by reference
        Message message = dataService.getMessagesStore().stream()
            .filter(msg -> msg.getReference().equals(reference))
            .findFirst()
            .orElse(null);

        if (message == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("477", "Message not found"));
        }

        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/messages/{customerId}/{reference}")
    public ResponseEntity<?> deleteCustomerMessage(@PathVariable String customerId, @PathVariable String reference, @RequestHeader HttpHeaders headers) {
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

        // Remove message
        dataService.setMessagesStore(
            dataService.getMessagesStore().stream()
                .filter(msg -> !msg.getReference().equals(reference))
                .collect(Collectors.toList())
        );

        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Message deleted successfully",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages/unread/{customerId}")
    public ResponseEntity<?> getUnreadMessages(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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

        // Count unread messages
        long unreadCount = dataService.getMessagesStore().stream()
            .filter(msg -> !msg.isRead())
            .count();

        Map<String, Object> response = Map.of("count", unreadCount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages/list/{customerId}")
    public ResponseEntity<?> getCustomerMessages(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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

        return ResponseEntity.ok(dataService.getMessagesStore());
    }

    @GetMapping("/downloads/financialAnnualOverview/{customerId}")
    public ResponseEntity<?> getFinancialAnnualOverview(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
                "documentType", "financial",
                "name", "Financial Overview 2024",
                "year", "2024",
                "id", "FIN_2024_001"
            ),
            Map.of(
                "documentType", "tax",
                "name", "Tax Statement 2024",
                "year", "2024",
                "id", "TAX_2024_001"
            ),
            Map.of(
                "documentType", "financial",
                "name", "Financial Overview 2023",
                "year", "2023",
                "id", "FIN_2023_001"
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/downloads/financialAnnualOverview/print/{customerId}/{id}")
    public ResponseEntity<?> printFinancialAnnualOverview(@PathVariable String customerId, @PathVariable String id, @RequestHeader HttpHeaders headers) {
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
            "success", true,
            "documentId", id,
            "downloadUrl", "/downloads/financial/" + id + ".pdf",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/downloads/contracts/{customerId}")
    public ResponseEntity<?> getCustomerContracts(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
                "contractType", "savings",
                "name", "DHB SaveOnline Contract",
                "date", "2024-01-15",
                "id", "CON_SAV_001"
            ),
            Map.of(
                "contractType", "maxispaar",
                "name", "DHB MaxiSpaar Contract",
                "date", "2024-06-20",
                "id", "CON_MAX_001"
            )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/downloads/contracts/print/{customerId}/{id}")
    public ResponseEntity<?> printCustomerContract(@PathVariable String customerId, @PathVariable String id, @RequestHeader HttpHeaders headers) {
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
            "success", true,
            "contractId", id,
            "downloadUrl", "/downloads/contracts/" + id + ".pdf",
            "timestamp", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/campaigns/list/{customerId}")
    public ResponseEntity<?> getCustomerCampaigns(@PathVariable String customerId, @RequestHeader HttpHeaders headers) {
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
                "subject", "€25 Bonus Campaign",
                "content", "Get €25 bonus when you open a new DHB Netspar account!",
                "reference", "CAM001",
                "bannerLink", "https://example.com/banner1.jpg"
            ),
            Map.of(
                "subject", "Digital Banking Promotion",
                "content", "Switch to digital banking and get exclusive benefits!",
                "reference", "CAM002",
                "bannerLink", "https://example.com/banner2.jpg"
            )
        );

        return ResponseEntity.ok(response);
    }
}

