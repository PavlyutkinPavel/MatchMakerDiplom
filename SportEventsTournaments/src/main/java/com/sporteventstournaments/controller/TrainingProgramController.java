package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.TrainingProgram;
import com.sporteventstournaments.domain.dto.CoachStudentsDTO;
import com.sporteventstournaments.domain.dto.TrainingProgramDTO;
import com.sporteventstournaments.domain.TrainingPurchase;
import com.sporteventstournaments.domain.dto.TrainingPurchaseDTO;
import com.sporteventstournaments.service.TrainingProgramService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Tag(name = "Training Program Controller", description = "Управление программами тренировок")
@RestController
@AllArgsConstructor
@RequestMapping("/training-programs")
@CrossOrigin(origins = "*")
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @Operation(summary = "Получить все активные программы тренировок")
    @GetMapping
    public ResponseEntity<List<TrainingProgramDTO>> getAllPrograms(Principal principal) {
        List<TrainingProgramDTO> programs = trainingProgramService.getAllActivePrograms(principal);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    @Operation(summary = "Получить программы тренировок тренера")
    @GetMapping("/my")
    public ResponseEntity<List<TrainingProgramDTO>> getMyPrograms(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TrainingProgramDTO> programs = trainingProgramService.getCoachPrograms(principal);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    @Operation(summary = "Получить купленные программы пользователя")
    @GetMapping("/purchased")
    public ResponseEntity<List<TrainingProgramDTO>> getPurchasedPrograms(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TrainingProgramDTO> programs = trainingProgramService.getUserPurchasedPrograms(principal);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    @Operation(summary = "Получить программу по ID")
    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> getProgram(@PathVariable Long id, Principal principal) {
        try {
            TrainingProgramDTO program = trainingProgramService.getProgram(id, principal);
            return new ResponseEntity<>(program, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Поиск программ тренировок")
    @GetMapping("/search")
    public ResponseEntity<List<TrainingProgramDTO>> searchPrograms(
            @RequestParam String keyword,
            Principal principal) {
        List<TrainingProgramDTO> programs = trainingProgramService.searchPrograms(keyword, principal);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    @Operation(summary = "Создать программу тренировок (только для тренеров)")
    @PostMapping
    public ResponseEntity<TrainingProgramDTO> createProgram(
            @RequestBody TrainingProgramDTO programDTO,
            Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            TrainingProgramDTO program = trainingProgramService.createTrainingProgram(programDTO, principal);
            return new ResponseEntity<>(program, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Обновить программу тренировок")
    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> updateProgram(
            @PathVariable Long id,
            @RequestBody TrainingProgramDTO programDTO,
            Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            TrainingProgramDTO program = trainingProgramService.updateTrainingProgram(id, programDTO, principal);
            return new ResponseEntity<>(program, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "Удалить программу тренировок")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteProgram(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            trainingProgramService.deleteProgram(id, principal);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "Купить программу тренировок")
    @PostMapping("/{id}/purchase")
    public ResponseEntity<TrainingPurchaseDTO> purchaseProgram(
            @PathVariable Long id,
            @RequestParam String paymentMethod,
            Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
            TrainingPurchase purchase = trainingProgramService.purchaseProgram(id, paymentMethod, principal);
            TrainingPurchaseDTO dto = toDto(purchase);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    public TrainingPurchaseDTO toDto(TrainingPurchase purchase) {
        TrainingPurchaseDTO dto = new TrainingPurchaseDTO();
        dto.setId(purchase.getId());
        dto.setUserId(purchase.getUser().getId());
        dto.setUserLogin(purchase.getUser().getUserLogin());
        dto.setTrainingProgramId(purchase.getTrainingProgram().getId());
        dto.setTrainingProgramTitle(purchase.getTrainingProgram().getTitle());
        dto.setPurchaseDate(purchase.getPurchaseDate());
        dto.setAmountPaid(purchase.getAmountPaid());
        dto.setCurrency(purchase.getCurrency());
        dto.setPaymentMethod(purchase.getPaymentMethod());
        dto.setUserProgress(purchase.getUserProgress());
        dto.setStartedAt(purchase.getStartedAt());
        dto.setCompletedAt(purchase.getCompletedAt());
        dto.setIsActive(purchase.getIsActive());
        return dto;
    }


    @Operation(summary = "Обновить прогресс программы")
    @PutMapping("/{id}/progress")
    public ResponseEntity<Void> updateProgress(
            @PathVariable Long id,
            @RequestParam Integer progress,
            Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            trainingProgramService.updateUserProgress(id, progress, principal);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Добавьте эти методы в ваш TrainingProgramController

    @Operation(summary = "Получить учеников тренера по программе")
    @GetMapping("/{id}/students")
    public ResponseEntity<CoachStudentsDTO> getProgramStudents(
            @PathVariable Long id,
            Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            CoachStudentsDTO students = trainingProgramService.getProgramStudents(id, principal);
            return new ResponseEntity<>(students, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "Получить всех учеников тренера")
    @GetMapping("/my/students")
    public ResponseEntity<List<CoachStudentsDTO>> getAllMyStudents(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            List<CoachStudentsDTO> students = trainingProgramService.getAllCoachStudents(principal);
            return new ResponseEntity<>(students, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "Обновить прогресс ученика (только для тренеров)")
    @PutMapping("/{programId}/students/{studentId}/progress")
    public ResponseEntity<Void> updateStudentProgress(
            @PathVariable Long programId,
            @PathVariable Long studentId,
            @RequestParam Integer progress,
            Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            trainingProgramService.updateStudentProgress(programId, studentId, progress, principal);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}