package com.sporteventstournaments.security.domain;

import com.sporteventstournaments.domain.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Entity(name = "security_credentials")
@Data
public class SecurityCredentials {
    @Id
    @SequenceGenerator(name = "securitySeqGen", sequenceName = "security_credentials_id_seq", allocationSize = 1)//для нерандомных id а по sequence
    @GeneratedValue(generator = "securitySeqGen")
    private Long id;

    @Column(name = "user_login")
    private String userLogin;

    @Column(name = "user_password")
    private String userPassword;

    @Column(name = "user_role")
    @Enumerated(EnumType.STRING)
    private Role userRole;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "verification_code", length = 6)
    private String verificationCode;

    @Column(name = "enabled")
    private Boolean enabled;

    @Column(name = "verified_rq")
    private Boolean verifiedRq;

}
