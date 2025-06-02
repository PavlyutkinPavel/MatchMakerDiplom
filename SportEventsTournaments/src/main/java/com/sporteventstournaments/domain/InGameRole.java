package com.sporteventstournaments.domain;

public enum InGameRole {
    USER("Пользователь"),
    COACH("Тренер"),
    ADMIN("Администратор"),
    MODERATOR("Модератор");

    private final String displayName;

    InGameRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}