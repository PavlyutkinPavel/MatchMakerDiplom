package com.sporteventstournaments.security.domain;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    String email;
    String newPassword;
}
