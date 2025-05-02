package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    @Query("SELECT u FROM user_profiles u WHERE u.username = :fn")
    Optional<UserProfile> findByUsername(@Param("fn") String fn);

    void deleteByUsername(String username);

    @Query(value = "SELECT NEXTVAL('user_profiles_id_seq')", nativeQuery = true)
    Long getNextSequenceValue();
}
