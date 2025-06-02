package com.sporteventstournaments.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;


@Entity
@Table(name = "l_users_teams")
@Data
@Component
public class UserTeamRelation {

    @Id
    @SequenceGenerator(name = "userTeamSeqGen", sequenceName = "l_users_teams_id_seq", allocationSize = 1)//для нерандомных id а по sequence
    @GeneratedValue(generator = "userChatSeqGen")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "accepted_invite")
    private Boolean acceptedInvite;

    @Column(name = "username")
    private String username;

    @Column(name = "position")
    private String position;

    @Column(name = "stats")
    private String stats;

    @Column(name = "team_role")
    @Enumerated(EnumType.STRING)
    private TeamRole teamRole;

    public enum TeamRole {
        PLAYER, COACH, MANAGER, MEDICAL_STUFF
    }

}
