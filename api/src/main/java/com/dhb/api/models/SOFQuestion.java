package com.dhb.api.models;

public class SOFQuestion {
    private String question;
    private String answer;

    // Constructors
    public SOFQuestion() {}

    public SOFQuestion(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }

    // Getters and Setters
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}

