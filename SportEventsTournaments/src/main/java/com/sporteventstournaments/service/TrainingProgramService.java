package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.*;
import com.sporteventstournaments.domain.dto.CoachStudentsDTO;
import com.sporteventstournaments.domain.dto.StudentProgressDTO;
import com.sporteventstournaments.domain.dto.TrainingProgramDTO;
import com.sporteventstournaments.exception.ResourceNotFoundException;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.TrainingProgramRepository;
import com.sporteventstournaments.repository.TrainingPurchaseRepository;
import com.sporteventstournaments.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final TrainingPurchaseRepository trainingPurchaseRepository;
    private final UserRepository userRepository;
    private final User user;

    /**
     * Получить все активные программы тренировок с информацией о покупках для текущего пользователя
     */
    @Transactional(readOnly = true)
    public List<TrainingProgramDTO> getAllActivePrograms(Principal principal) {
        List<TrainingProgram> programs = trainingProgramRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        return programs.stream()
                .map(program -> convertToDTO(program, principal))
                .collect(Collectors.toList());
    }

    /**
     * Получить программы конкретного тренера
     */
    @Transactional(readOnly = true)
    public List<TrainingProgramDTO> getCoachPrograms(Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        if (!isCoach(coach)) {
            throw new RuntimeException("User is not a coach");
        }

        List<TrainingProgram> programs = trainingProgramRepository.findByCoachAndIsActiveTrueOrderByCreatedAtDesc(coach);
        return programs.stream()
                .map(program -> convertToDTO(program, principal))
                .collect(Collectors.toList());
    }

    /**
     * Получить купленные программы пользователя
     */
    @Transactional(readOnly = true)
    public List<TrainingProgramDTO> getUserPurchasedPrograms(Principal principal) {
        User user = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        List<TrainingPurchase> purchases = trainingPurchaseRepository.findByUserAndIsActiveTrueOrderByPurchaseDateDesc(user);
        return purchases.stream()
                .map(purchase -> {
                    TrainingProgramDTO dto = convertToDTO(purchase.getTrainingProgram(), principal);
                    dto.setUserProgress(purchase.getUserProgress());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Получить программу по ID
     */
    @Transactional(readOnly = true)
    public TrainingProgramDTO getProgram(Long id, Principal principal) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        if (!program.getIsActive()) {
            throw new RuntimeException("Training program is not active");
        }

        return convertToDTO(program, principal);
    }

    /**
     * Поиск программ по ключевому слову
     */
    @Transactional(readOnly = true)
    public List<TrainingProgramDTO> searchPrograms(String keyword, Principal principal) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllActivePrograms(principal);
        }

        List<TrainingProgram> programs = trainingProgramRepository.searchByKeyword(keyword.trim());
        return programs.stream()
                .map(program -> convertToDTO(program, principal))
                .collect(Collectors.toList());
    }

    /**
     * Создать новую программу тренировок
     */
    public TrainingProgramDTO createTrainingProgram(TrainingProgramDTO programDTO, Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        if (!isCoach(coach)) {
            throw new RuntimeException("Only coaches can create training programs");
        }

        validateProgramDTO(programDTO);

        TrainingProgram program = new TrainingProgram();
        mapDTOToEntity(programDTO, program);
        program.setCoach(coach);
        program.setIsActive(true);
        program.setRating(0.0);
        program.setStudentsCount(0);

        TrainingProgram savedProgram = trainingProgramRepository.save(program);
        return convertToDTO(savedProgram, principal);
    }

    /**
     * Обновить программу тренировок
     */
    public TrainingProgramDTO updateTrainingProgram(Long id, TrainingProgramDTO programDTO, Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        TrainingProgram existingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        // Проверяем, что пользователь является владельцем программы
        if (!existingProgram.getCoach().getId().equals(coach.getId())) {
            throw new RuntimeException("You can only update your own training programs");
        }

        validateProgramDTO(programDTO);

        mapDTOToEntity(programDTO, existingProgram);

        TrainingProgram updatedProgram = trainingProgramRepository.save(existingProgram);
        return convertToDTO(updatedProgram, principal);
    }

    /**
     * Удалить программу тренировок (мягкое удаление)
     */
    public void deleteProgram(Long id, Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        // Проверяем, что пользователь является владельцем программы
        if (!program.getCoach().getId().equals(coach.getId())) {
            throw new RuntimeException("You can only delete your own training programs");
        }

        // Мягкое удаление - помечаем как неактивную
        program.setIsActive(false);
        trainingProgramRepository.save(program);
    }

    /**
     * Купить программу тренировок
     */
    public TrainingPurchase purchaseProgram(Long programId, String paymentMethod, Principal principal) {
        User user = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        TrainingProgram program = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Training program not found"));

        if (!program.getIsActive()) {
            System.out.println("Training program is not available for purchase");
            throw new RuntimeException("Training program is not available for purchase");
        }

        // Проверяем, что пользователь не покупает свою собственную программу
        if (program.getCoach().getId().equals(user.getId())) {
            System.out.println("You cannot purchase your own training program");
            throw new RuntimeException("You cannot purchase your own training program");
        }

        // Проверяем, что программа еще не куплена
        if (trainingPurchaseRepository.existsByUserAndTrainingProgramAndIsActiveTrue(user, program)) {
            System.out.println("You have already purchased this training program");
            throw new RuntimeException("You have already purchased this training program");
        }

        // Создаем покупку
        TrainingPurchase purchase = new TrainingPurchase();
        purchase.setUser(user);
        purchase.setTrainingProgram(program);
        purchase.setAmountPaid(program.getPrice());
        purchase.setCurrency(program.getCurrency());
        purchase.setPaymentMethod(paymentMethod);
        purchase.setUserProgress(0);
        purchase.setIsActive(true);

        TrainingPurchase savedPurchase = trainingPurchaseRepository.save(purchase);

        // Обновляем количество студентов в программе
        updateStudentsCount(program);

        return savedPurchase;
    }

    /**
     * Обновить прогресс пользователя по программе
     */
    public void updateUserProgress(Long programId, Integer progress, Principal principal) {
        User user = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        TrainingProgram program = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        TrainingPurchase purchase = trainingPurchaseRepository.findByUserAndTrainingProgramAndIsActiveTrue(user, program)
                .orElseThrow(() -> new RuntimeException("You haven't purchased this training program"));

        if (progress < 0 || progress > 100) {
            throw new RuntimeException("Progress must be between 0 and 100");
        }

        purchase.setUserProgress(progress);

        // Если прогресс достиг 100%, отмечаем дату завершения
        if (progress == 100 && purchase.getCompletedAt() == null) {
            purchase.setCompletedAt(LocalDateTime.now());
        }

        // Если прогресс начался, отмечаем дату начала
        if (progress > 0 && purchase.getStartedAt() == null) {
            purchase.setStartedAt(LocalDateTime.now());
        }

        trainingPurchaseRepository.save(purchase);
    }

    /**
     * Получить статистику программы для тренера
     */
    @Transactional(readOnly = true)
    public TrainingProgramStatsDTO getProgramStats(Long programId, Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        TrainingProgram program = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        if (!program.getCoach().getId().equals(coach.getId())) {
            throw new RuntimeException("You can only view stats for your own programs");
        }

        List<TrainingPurchase> purchases = trainingPurchaseRepository.findByTrainingProgramAndIsActiveTrueOrderByPurchaseDateDesc(program);

        TrainingProgramStatsDTO stats = new TrainingProgramStatsDTO();
        stats.setProgramId(programId);
        stats.setTotalPurchases(purchases.size());
        stats.setTotalRevenue(purchases.stream()
                .map(TrainingPurchase::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        long completedCount = purchases.stream()
                .filter(p -> p.getUserProgress() != null && p.getUserProgress() == 100)
                .count();

        stats.setCompletedCount(Math.toIntExact(completedCount));

        if (!purchases.isEmpty()) {
            double avgProgress = purchases.stream()
                    .filter(p -> p.getUserProgress() != null)
                    .mapToInt(TrainingPurchase::getUserProgress)
                    .average()
                    .orElse(0.0);
            stats.setAverageProgress(avgProgress);
        }

        return stats;
    }

    // === Приватные вспомогательные методы ===

    private User getUserByPrincipal(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private boolean isCoach(User user) {
        return user.getInGameRole() == InGameRole.COACH || user.getInGameRole() == InGameRole.ADMIN;
    }

    private void validateProgramDTO(TrainingProgramDTO programDTO) {
        if (programDTO.getTitle() == null || programDTO.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Program title is required");
        }

        if (programDTO.getDescription() == null || programDTO.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Program description is required");
        }

        if (programDTO.getPrice() == null || programDTO.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Program price must be greater than 0");
        }

        if (programDTO.getDurationWeeks() == null || programDTO.getDurationWeeks() <= 0) {
            throw new RuntimeException("Duration in weeks must be greater than 0");
        }

        if (programDTO.getSessionsPerWeek() == null || programDTO.getSessionsPerWeek() <= 0) {
            throw new RuntimeException("Sessions per week must be greater than 0");
        }

        if (programDTO.getDifficultyLevel() == null) {
            throw new RuntimeException("Difficulty level is required");
        }

        if (programDTO.getSportType() == null || programDTO.getSportType().trim().isEmpty()) {
            throw new RuntimeException("Sport type is required");
        }
    }

    private void mapDTOToEntity(TrainingProgramDTO dto, TrainingProgram entity) {
        entity.setTitle(dto.getTitle().trim());
        entity.setDescription(dto.getDescription().trim());
        entity.setPrice(dto.getPrice());
        entity.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "RUB");
        entity.setDurationWeeks(dto.getDurationWeeks());
        entity.setSessionsPerWeek(dto.getSessionsPerWeek());
        entity.setDifficultyLevel(dto.getDifficultyLevel());
        entity.setSportType(dto.getSportType().trim());
        entity.setContent(dto.getContent() != null ? dto.getContent().trim() : "");
    }

    private TrainingProgramDTO convertToDTO(TrainingProgram program, Principal principal) {
        TrainingProgramDTO dto = new TrainingProgramDTO();
        dto.setId(program.getId());
        dto.setTitle(program.getTitle());
        dto.setDescription(program.getDescription());
        dto.setPrice(program.getPrice());
        dto.setCurrency(program.getCurrency());
        dto.setDurationWeeks(program.getDurationWeeks());
        dto.setSessionsPerWeek(program.getSessionsPerWeek());
        dto.setDifficultyLevel(program.getDifficultyLevel());
        dto.setSportType(program.getSportType());
        dto.setContent(program.getContent());
        dto.setRating(program.getRating());
        dto.setStudentsCount(program.getStudentsCount());
        dto.setCreatedAt(program.getCreatedAt());

        // Информация о тренере
        if (program.getCoach() != null) {
            dto.setCoachName(program.getCoach().getFirstName() + " " + program.getCoach().getLastName());
            dto.setCoachId(program.getCoach().getId());
        }

        dto.setIsActive(program.getIsActive());

        // Проверяем, куплена ли программа текущим пользователем
        dto.setIsPurchased(false);
        dto.setUserProgress(0);

        if (principal != null) {
            try {
                User user = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
                Optional<TrainingPurchase> purchase = trainingPurchaseRepository
                        .findByUserAndTrainingProgramAndIsActiveTrue(user, program);

                if (purchase.isPresent()) {
                    dto.setIsPurchased(true);
                    dto.setUserProgress(purchase.get().getUserProgress());
                }
            } catch (RuntimeException e) {
                // Игнорируем ошибки при получении пользователя для анонимных запросов
            }
        }

        return dto;
    }

    private void updateStudentsCount(TrainingProgram program) {
        long count = trainingPurchaseRepository.countByTrainingProgramAndIsActiveTrue(program);
        program.setStudentsCount(Math.toIntExact(count));
        trainingProgramRepository.save(program);
    }

    // === DTO для статистики (нужно создать отдельно) ===
    public static class TrainingProgramStatsDTO {
        private Long programId;
        private Integer totalPurchases;
        private BigDecimal totalRevenue;
        private Integer completedCount;
        private Double averageProgress;

        // Геттеры и сеттеры
        public Long getProgramId() { return programId; }
        public void setProgramId(Long programId) { this.programId = programId; }

        public Integer getTotalPurchases() { return totalPurchases; }
        public void setTotalPurchases(Integer totalPurchases) { this.totalPurchases = totalPurchases; }

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public Integer getCompletedCount() { return completedCount; }
        public void setCompletedCount(Integer completedCount) { this.completedCount = completedCount; }

        public Double getAverageProgress() { return averageProgress; }
        public void setAverageProgress(Double averageProgress) { this.averageProgress = averageProgress; }
    }

    /**
     * Получить учеников конкретной программы тренера
     */
    @Transactional(readOnly = true)
    public CoachStudentsDTO getProgramStudents(Long programId, Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        if (!isCoach(coach)) {
            throw new RuntimeException("User is not a coach");
        }

        TrainingProgram program = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        // Проверяем, что программа принадлежит тренеру
        if (!program.getCoach().getId().equals(coach.getId())) {
            throw new RuntimeException("You can only view students of your own programs");
        }

        List<TrainingPurchase> purchases = trainingPurchaseRepository
                .findByTrainingProgramAndIsActiveTrueOrderByPurchaseDateDesc(program);

        List<StudentProgressDTO> students = purchases.stream()
                .map(this::convertPurchaseToStudentDTO)
                .collect(Collectors.toList());

        // Вычисляем средний прогресс
        double averageProgress = students.stream()
                .filter(s -> s.getUserProgress() != null)
                .mapToInt(StudentProgressDTO::getUserProgress)
                .average()
                .orElse(0.0);

        CoachStudentsDTO result = new CoachStudentsDTO();
        result.setProgramId(programId);
        result.setProgramTitle(program.getTitle());
        result.setTotalStudents(students.size());
        result.setAverageProgress(averageProgress);
        result.setStudents(students);

        return result;
    }

    /**
     * Получить всех учеников тренера по всем программам
     */
    @Transactional(readOnly = true)
    public List<CoachStudentsDTO> getAllCoachStudents(Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        if (!isCoach(coach)) {
            throw new RuntimeException("User is not a coach");
        }

        List<TrainingProgram> coachPrograms = trainingProgramRepository
                .findByCoachAndIsActiveTrueOrderByCreatedAtDesc(coach);

        return coachPrograms.stream()
                .map(program -> {
                    List<TrainingPurchase> purchases = trainingPurchaseRepository
                            .findByTrainingProgramAndIsActiveTrueOrderByPurchaseDateDesc(program);

                    List<StudentProgressDTO> students = purchases.stream()
                            .map(this::convertPurchaseToStudentDTO)
                            .collect(Collectors.toList());

                    double averageProgress = students.stream()
                            .filter(s -> s.getUserProgress() != null)
                            .mapToInt(StudentProgressDTO::getUserProgress)
                            .average()
                            .orElse(0.0);

                    CoachStudentsDTO dto = new CoachStudentsDTO();
                    dto.setProgramId(program.getId());
                    dto.setProgramTitle(program.getTitle());
                    dto.setTotalStudents(students.size());
                    dto.setAverageProgress(averageProgress);
                    dto.setStudents(students);

                    return dto;
                })
                .filter(dto -> dto.getTotalStudents() > 0) // Показываем только программы с учениками
                .collect(Collectors.toList());
    }

    /**
     * Обновить прогресс ученика (только для тренеров)
     */
    public void updateStudentProgress(Long programId, Long studentId, Integer progress, Principal principal) {
        User coach = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        if (!isCoach(coach)) {
            throw new RuntimeException("User is not a coach");
        }

        // Проверяем валидность прогресса
        if (progress < 0 || progress > 100) {
            throw new RuntimeException("Progress must be between 0 and 100");
        }

        // Проверяем, что программа принадлежит тренеру
        TrainingProgram program = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Training program not found"));

        if (!program.getCoach().getId().equals(coach.getId())) {
            throw new RuntimeException("You can only update progress for your own programs");
        }

        // Находим покупку студента
        TrainingPurchase purchase = trainingPurchaseRepository
                .findByProgramIdAndStudentId(programId, studentId)
                .orElseThrow(() -> new RuntimeException("Student purchase not found"));

        // Обновляем прогресс
        purchase.setUserProgress(progress);

        // Если прогресс достиг 100%, отмечаем дату завершения
        if (progress == 100 && purchase.getCompletedAt() == null) {
            purchase.setCompletedAt(LocalDateTime.now());
        }

        // Если прогресс начался, отмечаем дату начала
        if (progress > 0 && purchase.getStartedAt() == null) {
            purchase.setStartedAt(LocalDateTime.now());
        }

        // Если прогресс уменьшился с 100%, убираем дату завершения
        if (progress < 100 && purchase.getCompletedAt() != null) {
            purchase.setCompletedAt(null);
        }

        trainingPurchaseRepository.save(purchase);
    }

    /**
     * Конвертировать покупку в DTO ученика
     */
    private StudentProgressDTO convertPurchaseToStudentDTO(TrainingPurchase purchase) {
        User student = purchase.getUser();
        TrainingProgram program = purchase.getTrainingProgram();

        return new StudentProgressDTO(
                purchase.getId(),
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                program.getId(),
                program.getTitle(),
                purchase.getUserProgress(),
                purchase.getPurchaseDate(),
                purchase.getStartedAt(),
                purchase.getCompletedAt(),
                purchase.getPaymentMethod()
        );
    }
}