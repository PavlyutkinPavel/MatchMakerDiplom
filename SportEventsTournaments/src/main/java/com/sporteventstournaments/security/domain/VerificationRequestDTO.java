package com.sporteventstournaments.security.domain;

import lombok.Data;

@Data
public class VerificationRequestDTO {
    String verificationCode;
    String isRedirectRequired;
}
