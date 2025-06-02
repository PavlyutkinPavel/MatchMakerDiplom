package com.sporteventstournaments.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Entity(name = "teams")
@Data
public class Team {
    @Id
    @SequenceGenerator(name = "teamSeqGen", sequenceName = "team_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "teamSeqGen")
    private Long id;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "achievements")
    private String achievements;

    @Column(name = "status")
    private String status;

    @Column(name = "wins")
    private String wins;

    @Column(name = "team_type")
    @Enumerated(EnumType.STRING)
    private TeamType teamType;

    @Column(name = "creator_id")
    private Long creatorId;

    @Column(name = "director_id")
    private Long directorId;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    @JsonManagedReference("email-team")
    private List<Email> teamInvites;

}
