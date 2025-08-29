package com.dhb.api.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class Message {
    private String reference;
    
    @JsonProperty("entryDate")
    private LocalDateTime entryDate;
    
    private String type;
    private String subject;
    private String body;
    
    @JsonProperty("isRead")
    private boolean isRead;

    // Constructors
    public Message() {}

    public Message(String reference, LocalDateTime entryDate, String type, String subject, String body, boolean isRead) {
        this.reference = reference;
        this.entryDate = entryDate;
        this.type = type;
        this.subject = subject;
        this.body = body;
        this.isRead = isRead;
    }

    // Getters and Setters
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public LocalDateTime getEntryDate() { return entryDate; }
    public void setEntryDate(LocalDateTime entryDate) { this.entryDate = entryDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}

