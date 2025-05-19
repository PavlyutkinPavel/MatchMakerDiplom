package com.sporteventstournaments.domain;

import com.sporteventstournaments.domain.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Entity(name = "fan_club_members")
@Data
public class Fan {
    @Id
    @SequenceGenerator(name = "fanSeqGen", sequenceName = "fan_club_members_id_seq", allocationSize = 1)//для нерандомных id а по sequence
    @GeneratedValue(generator = "fanSeqGen")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "team_id")
    private Long teamId;

}
