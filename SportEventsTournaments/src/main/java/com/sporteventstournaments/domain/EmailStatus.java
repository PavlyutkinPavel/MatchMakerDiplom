package com.sporteventstournaments.domain;

public enum EmailStatus {
    PENDING("pending"),
    ACCEPTED("accepted"),
    DECLINED("declined"),
    SENT("sent");

    private final String value;

    EmailStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static EmailStatus fromValue(String value) {
        for (EmailStatus status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown email status: " + value);
    }
}
