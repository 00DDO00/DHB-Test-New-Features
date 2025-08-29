package com.dhb.api.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class Account {
    private String id;
    private String name;
    private String type;
    private BigDecimal balance;
    private String currency;
    private String iban;
    
    @JsonProperty("interest_rate")
    private BigDecimal interestRate;
    
    @JsonProperty("holder_name")
    private String holderName;

    // Constructors
    public Account() {}

    public Account(String id, String name, String type, BigDecimal balance, String currency, String iban, BigDecimal interestRate, String holderName) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.balance = balance;
        this.currency = currency;
        this.iban = iban;
        this.interestRate = interestRate;
        this.holderName = holderName;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public String getHolderName() { return holderName; }
    public void setHolderName(String holderName) { this.holderName = holderName; }
}

