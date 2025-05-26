package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.Team;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.UserChatRelation;
import com.sporteventstournaments.domain.UserTeamRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserTeamRelationRepository extends JpaRepository<UserTeamRelation, Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM l_users_teams WHERE user_id = :userId AND teamId = :teamId", nativeQuery = true)
    void removeUserByIdAndTeamId(@Param("userId") Long userId, @Param("teamId") Long teamId);

    @Query(nativeQuery = true, value = "SELECT c.* FROM teams c " +
            "JOIN l_users_teams luc ON c.id = luc.team_id " +
            "WHERE luc.user_id = :userId")
    List<Long> findAllTeamsByUserId(Long userId);

    @Query(nativeQuery = true, value = "SELECT * FROM l_users_teams  " +
            "WHERE team_id = :teamId")
    List<UserTeamRelation> findAllUsersByTeamId(Long teamId);

    @Query("SELECT COALESCE(MAX(id), 0) + 1 FROM l_users_teams")
    Long getNextId();


    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "INSERT INTO l_users_teams (id, team_id, user_id) VALUES (?1, ?2, ?3)")
    void saveEntrance(Long id, Long teamId, Long userId);


    void deleteUserTeamRelationByUserIdAndTeamId(Long userId, Long teamId);

}
