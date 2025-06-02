package com.sporteventstournaments.domain;

public enum EmailType {
    TEAM_INVITE("team_invite"),
    EVENT_INVITE("event_invite"),
    INFO("info");

    private final String value;

    EmailType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static EmailType fromValue(String value) {
        for (EmailType type : values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown email type: " + value);
    }
}
