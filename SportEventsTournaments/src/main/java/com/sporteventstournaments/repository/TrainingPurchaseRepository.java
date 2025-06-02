package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.TrainingPurchase;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingPurchaseRepository extends JpaRepository<TrainingPurchase, Long> {

    List<TrainingPurchase> findByUserAndIsActiveTrueOrderByPurchaseDateDesc(User user);

    List<TrainingPurchase> findByTrainingProgramAndIsActiveTrueOrderByPurchaseDateDesc(TrainingProgram trainingProgram);


    Optional<TrainingPurchase> findByUserAndTrainingProgramAndIsActiveTrue(User user, TrainingProgram trainingProgram);

    boolean existsByUserAndTrainingProgramAndIsActiveTrue(User user, TrainingProgram trainingProgram);

    long countByTrainingProgramAndIsActiveTrue(TrainingProgram trainingProgram);

    // Получить всех студентов тренера по всем его программам
    @Query("SELECT tp FROM training_purchases tp " +
            "JOIN tp.trainingProgram prog " +
            "WHERE prog.coach.id = :coachId AND tp.isActive = true " +
            "ORDER BY prog.title, tp.purchaseDate DESC")
    List<TrainingPurchase> findAllByCoachId(@Param("coachId") Long coachId);

    // Найти покупку по программе и ID студента
    @Query("SELECT tp FROM training_purchases tp " +
            "WHERE tp.trainingProgram.id = :programId AND tp.user.id = :studentId AND tp.isActive = true")
    Optional<TrainingPurchase> findByProgramIdAndStudentId(@Param("programId") Long programId,
                                                           @Param("studentId") Long studentId);

    // Проверить, является ли пользователь тренером данной программы
    @Query("SELECT COUNT(tp) > 0 FROM training_purchases tp " +
            "JOIN tp.trainingProgram prog " +
            "WHERE prog.id = :programId AND prog.coach.id = :coachId AND tp.user.id = :studentId AND tp.isActive = true")
    boolean existsByProgramIdAndCoachIdAndStudentId(@Param("programId") Long programId,
                                                    @Param("coachId") Long coachId,
                                                    @Param("studentId") Long studentId);
}
