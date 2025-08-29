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
import java.util.Map;

@RestController
@RequestMapping("/vop")
public class VOPController {

    @Autowired
    private DataService dataService;

    @PostMapping("/requestPayeeVerification")
    public ResponseEntity<?> requestPayeeVerification(@RequestBody Map<String, Object> request, @RequestHeader HttpHeaders headers) {
        // Validate required headers
        HeaderValidator.ValidationResult validation = HeaderValidator.validateRequiredHeaders(headers);
        if (!validation.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("495", "Missing required headers: " + String.join(", ", validation.getMissingHeaders())));
        }

        // Validate required fields
        String targetIBAN = (String) request.get("targetIBAN");
        if (targetIBAN == null || targetIBAN.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("474", "Invalid party account IBAN"));
        }

        String beneficiaryName = (String) request.get("beneficiaryName");
        if (beneficiaryName == null || beneficiaryName.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("473", "Invalid party name"));
        }

        // Mock VOP response
        Map<String, Object> response = Map.of(
            "vopGuid", dataService.generateUUID(),
            "verificationStatus", "VERIFIED",
            "beneficiaryName", beneficiaryName,
            "targetIBAN", targetIBAN,
            "verificationDate", LocalDateTime.now().toString() + "Z",
            "confidence", "HIGH"
        );

        return ResponseEntity.ok(response);
    }
}

