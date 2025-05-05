package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM users u WHERE u.lastName = :ln")
    Optional<User> findByLastName(@Param("ln") String ln);

    @Query("SELECT u FROM users u WHERE u.firstName = :fn")
    Optional<User> findByFirstName(@Param("fn") String fn);

    @Query("SELECT u FROM users u WHERE u.userLogin = :ul")
    Optional<User> findByUserLogin(@Param("ul") String ul);

    @Query("SELECT u FROM users u WHERE u.email = :ul")
    Optional<User> findByEmail(@Param("ul") String ul);

    @Query(value = "SELECT NEXTVAL('users_id_seq')", nativeQuery = true)
    Long getNextSequenceValue();
}
