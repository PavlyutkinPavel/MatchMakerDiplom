package com.sporteventstournaments.domain;

public enum DifficultyLevel {
    BEGINNER("Начинающий"),
    INTERMEDIATE("Средний"),
    ADVANCED("Продвинутый"),
    EXPERT("Эксперт");

    private final String displayName;

    DifficultyLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}