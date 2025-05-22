package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Event;
import com.sporteventstournaments.domain.TwoTeamEvent;
import com.sporteventstournaments.exception.EventNotFoundException;
import com.sporteventstournaments.exception.ForbiddenOperationException;
import com.sporteventstournaments.repository.EventRepository;
import com.sporteventstournaments.repository.TwoTeamEventRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class TwoTeamEventService {
    private final TwoTeamEventRepository twoTeamEventRepository;
    private final EventRepository eventRepository;
    private final SecurityService securityService;

    // ================ ОСНОВНЫЕ CRUD ОПЕРАЦИИ ================

    /**
     * Получить все двухкомандные события
     */
    public List<TwoTeamEvent> getAllTwoTeamEvents() {
        log.debug("Fetching all two-team events");
        return twoTeamEventRepository.findAll();
    }

    /**
     * Получить двухкомандное событие по ID события
     */
    public TwoTeamEvent getTwoTeamEventById(Long eventId) {
        log.debug("Fetching two-team event with eventId: {}", eventId);
        return twoTeamEventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Two team event not found with id: " + eventId));
    }

    /**
     * Получить двухкомандное событие по ID события (Optional)
     */
    public Optional<TwoTeamEvent> findTwoTeamEventById(Long eventId) {
        log.debug("Finding two-team event with eventId: {}", eventId);
        return twoTeamEventRepository.findById(eventId);
    }

    /**
     * Создать новое двухкомандное событие
     */
    @Transactional
    public TwoTeamEvent createTwoTeamEvent(Long eventId, Long team1Id, Long team2Id, Principal principal) {
        log.info("Creating two-team event for eventId: {} with teams: {} vs {}", eventId, team1Id, team2Id);

        // Валидация входных параметров
        if (eventId == null) {
            throw new IllegalArgumentException("Event ID cannot be null");
        }
        if (team1Id == null) {
            throw new IllegalArgumentException("Team 1 ID cannot be null");
        }
        if (team2Id == null) {
            throw new IllegalArgumentException("Team 2 ID cannot be null");
        }

        validateAuthentication(principal);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with id: " + eventId));

        validateEventAccess(event, principal, "create a two team event");

        if (twoTeamEventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Two team event already exists for event id: " + eventId);
        }

        validateDifferentTeams(team1Id, team2Id);

        try {
            TwoTeamEvent twoTeamEvent = new TwoTeamEvent();
            twoTeamEvent.setEvent(event);
            twoTeamEvent.setTeam1Id(team1Id);
            twoTeamEvent.setTeam2Id(team2Id);
            twoTeamEvent.setStatus(TwoTeamEvent.TwoTeamEventStatus.PENDING);
            twoTeamEvent.setTeam1Score(0);
            twoTeamEvent.setTeam2Score(0);

            TwoTeamEvent saved = twoTeamEventRepository.save(twoTeamEvent);
            log.info("Successfully created two-team event with ID: {}", saved.getId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating two-team event for eventId: {}", eventId, e);
            throw new RuntimeException("Failed to create two-team event: " + e.getMessage(), e);
        }
    }

    /**
     * Обновить двухкомандное событие
     */
    @Transactional
    public TwoTeamEvent updateTwoTeamEvent(Long eventId, Long team1Id, Long team2Id,
                                           TwoTeamEvent.TwoTeamEventStatus status, Principal principal) {
        log.info("Updating two-team event with eventId: {}", eventId);

        validateAuthentication(principal);

        TwoTeamEvent existingTwoTeamEvent = getTwoTeamEventById(eventId);
        validateEventAccess(existingTwoTeamEvent.getEvent(), principal, "update this two team event");

        // Обновляем только те поля, которые переданы
        if (team1Id != null && team2Id != null) {
            validateDifferentTeams(team1Id, team2Id);
            existingTwoTeamEvent.setTeam1Id(team1Id);
            existingTwoTeamEvent.setTeam2Id(team2Id);
        }

        if (status != null) {
            existingTwoTeamEvent.setStatus(status);
        }

        TwoTeamEvent updated = twoTeamEventRepository.saveAndFlush(existingTwoTeamEvent);
        log.info("Successfully updated two-team event with ID: {}", updated.getId());
        return updated;
    }

    /**
     * Удалить двухкомандное событие
     */
    @Transactional
    public void deleteTwoTeamEvent(Long eventId, Principal principal) {
        log.info("Deleting two-team event with eventId: {}", eventId);

        validateAuthentication(principal);

        TwoTeamEvent existingTwoTeamEvent = getTwoTeamEventById(eventId);
        validateEventAccess(existingTwoTeamEvent.getEvent(), principal, "delete this two team event");

        twoTeamEventRepository.deleteById(eventId);
        log.info("Successfully deleted two-team event with ID: {}", eventId);
    }

    // ================ СПЕЦИФИЧЕСКИЕ ОПЕРАЦИИ ================

    /**
     * Обновить только статус события
     */
    @Transactional
    public TwoTeamEvent updateStatus(Long eventId, TwoTeamEvent.TwoTeamEventStatus status, Principal principal) {
        log.info("Updating status of two-team event {} to {}", eventId, status);

        validateAuthentication(principal);

        TwoTeamEvent existingTwoTeamEvent = getTwoTeamEventById(eventId);
        validateEventAccess(existingTwoTeamEvent.getEvent(), principal, "update status");

        existingTwoTeamEvent.setStatus(status);
        TwoTeamEvent updated = twoTeamEventRepository.saveAndFlush(existingTwoTeamEvent);

        log.info("Successfully updated status of two-team event {} to {}", eventId, status);
        return updated;
    }

    /**
     * Обновить очки команд
     */
    @Transactional
    public TwoTeamEvent updateScores(Long eventId, Integer team1Score, Integer team2Score, Principal principal) {
        log.info("Updating scores for two-team event {}: {} - {}", eventId, team1Score, team2Score);

        validateAuthentication(principal);

        TwoTeamEvent existingTwoTeamEvent = getTwoTeamEventById(eventId);
        validateEventAccess(existingTwoTeamEvent.getEvent(), principal, "update scores");

        // Валидация очков
        validateScores(team1Score, team2Score);

        existingTwoTeamEvent.setTeam1Score(team1Score);
        existingTwoTeamEvent.setTeam2Score(team2Score);

        // Автоматически устанавливаем статус COMPLETED при обновлении очков
        if (existingTwoTeamEvent.getStatus() == TwoTeamEvent.TwoTeamEventStatus.SCHEDULED) {
            existingTwoTeamEvent.setStatus(TwoTeamEvent.TwoTeamEventStatus.COMPLETED);
            log.info("Automatically changed status to COMPLETED for event {}", eventId);
        }

        TwoTeamEvent updated = twoTeamEventRepository.saveAndFlush(existingTwoTeamEvent);
        log.info("Successfully updated scores for two-team event {}", eventId);
        return updated;
    }

    // ================ МЕТОДЫ ПОИСКА ================

    /**
     * Получить события по статусу
     */
    public List<TwoTeamEvent> getTwoTeamEventsByStatus(TwoTeamEvent.TwoTeamEventStatus status) {
        log.debug("Fetching two-team events with status: {}", status);
        return twoTeamEventRepository.findByStatus(status);
    }

    /**
     * Получить события по ID команды
     */
    public List<TwoTeamEvent> getTwoTeamEventsByTeamId(Long teamId) {
        log.debug("Fetching two-team events for team: {}", teamId);
        return twoTeamEventRepository.findByTeamId(teamId);
    }

    /**
     * Получить события по списку ID событий
     */
    public List<TwoTeamEvent> getTwoTeamEventsByEventIds(List<Long> eventIds) {
        log.debug("Fetching two-team events for event IDs: {}", eventIds);
        if (eventIds == null || eventIds.isEmpty()) {
            return List.of();
        }
        return twoTeamEventRepository.findByEventIdIn(eventIds);
    }

    /**
     * Получить активные события (PENDING или SCHEDULED)
     */
    public List<TwoTeamEvent> getActiveTwoTeamEvents() {
        log.debug("Fetching active two-team events");
        return twoTeamEventRepository.findByStatusIn(
                Arrays.asList(
                        TwoTeamEvent.TwoTeamEventStatus.PENDING,
                        TwoTeamEvent.TwoTeamEventStatus.SCHEDULED
                )
        );
    }

    /**
     * Получить завершенные события
     */
    public List<TwoTeamEvent> getCompletedTwoTeamEvents() {
        log.debug("Fetching completed two-team events");
        return twoTeamEventRepository.findByStatus(TwoTeamEvent.TwoTeamEventStatus.COMPLETED);
    }

    // ================ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ================

    /**
     * Проверить существование двухкомандного события
     */
    public boolean existsTwoTeamEvent(Long eventId) {
        log.debug("Checking if two-team event exists for eventId: {}", eventId);
        return twoTeamEventRepository.existsById(eventId);
    }

    // ================ ВАЛИДАЦИЯ ================

    /**
     * Проверка аутентификации
     */
    private void validateAuthentication(Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }
    }

    /**
     * Проверка доступа к событию
     */
    private void validateEventAccess(Event event, Principal principal, String action) {
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!event.getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can " + action);
        }
    }

    /**
     * Проверка что команды разные
     */
    private void validateDifferentTeams(Long team1Id, Long team2Id) {
        if (team1Id.equals(team2Id)) {
            throw new IllegalArgumentException("Team1 and Team2 cannot be the same");
        }
    }

    /**
     * Проверка очков
     */
    private void validateScores(Integer team1Score, Integer team2Score) {
        if (team1Score == null || team2Score == null) {
            throw new IllegalArgumentException("Scores cannot be null");
        }
        if (team1Score < 0 || team2Score < 0) {
            throw new IllegalArgumentException("Scores cannot be negative");
        }
    }
}