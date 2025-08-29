package com.dhb.api.services;

import com.dhb.api.models.Message;
import com.dhb.api.models.SOFQuestion;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DataService {
    
    private List<Message> messagesStore;
    private List<SOFQuestion> sofQuestionsStore;
    private String currentPassword;
    private static final String PASSWORD_FILE = "current_password.txt";

    @PostConstruct
    public void init() {
        initializeMessages();
        initializeSOFQuestions();
        loadCurrentPassword();
    }

    private void initializeMessages() {
        messagesStore = new ArrayList<>();
        messagesStore.add(new Message(
            "MSG001",
            LocalDateTime.parse("2025-01-19T11:05:00"),
            "Email",
            "€25 Bonus to Our New Customers!",
            "€25 Bonus to Our New Customers! DHB Bank gives away €25 bonus to new customers who complete their identification process digitally via Verimi instead of Postident identification.",
            false
        ));
        messagesStore.add(new Message(
            "MSG002",
            LocalDateTime.parse("2025-01-18T11:05:00"),
            "Email",
            "Device Pairing Removed",
            "The iPhone model device and Mobile Banking Application pairing have been removed.",
            false
        ));
    }

    private void initializeSOFQuestions() {
        sofQuestionsStore = new ArrayList<>();
        sofQuestionsStore.add(new SOFQuestion(
            "What is the origin of the money in your NIBC Savings Account?",
            "Leftover from my income"
        ));
        sofQuestionsStore.add(new SOFQuestion(
            "What is the source of your income?",
            "Director, Major Shareholder"
        ));
        sofQuestionsStore.add(new SOFQuestion(
            "What is your (joint) gross annual income?",
            "Between €0 and €30,000"
        ));
        sofQuestionsStore.add(new SOFQuestion(
            "What amount do you expect to save/deposit annually with NIBC?",
            "Nothing or less than €1,000"
        ));
        sofQuestionsStore.add(new SOFQuestion(
            "How often do you expect to deposit money into your Savings Account?",
            "Never or on average once a month"
        ));
        sofQuestionsStore.add(new SOFQuestion(
            "Do you expect to make one or more occasional (larger) deposits with us?",
            "Yes"
        ));
        sofQuestionsStore.add(new SOFQuestion(
            "What is the amount if these are the amounts you plan to deposit?",
            "Less than €10,000"
        ));
    }

    private void loadCurrentPassword() {
        try {
            File file = new File(PASSWORD_FILE);
            if (file.exists()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    currentPassword = reader.readLine();
                }
            } else {
                currentPassword = "password123";
                saveCurrentPassword(currentPassword);
            }
        } catch (IOException e) {
            currentPassword = "password123";
        }
    }

    public void saveCurrentPassword(String password) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(PASSWORD_FILE))) {
            writer.write(password);
        } catch (IOException e) {
            // Log error
        }
    }

    // Getters and Setters
    public List<Message> getMessagesStore() { return messagesStore; }
    public void setMessagesStore(List<Message> messagesStore) { this.messagesStore = messagesStore; }

    public List<SOFQuestion> getSofQuestionsStore() { return sofQuestionsStore; }
    public void setSofQuestionsStore(List<SOFQuestion> sofQuestionsStore) { this.sofQuestionsStore = sofQuestionsStore; }

    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { 
        this.currentPassword = currentPassword;
        saveCurrentPassword(currentPassword);
    }

    public String generateUUID() {
        return UUID.randomUUID().toString();
    }
}

