package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String name;
    private String username;
    private String bio;
    private String location;
    private String email;
}
