package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Event;
import com.sporteventstournaments.domain.SingleEvent;
import com.sporteventstournaments.domain.SingleEventParticipant;
import com.sporteventstournaments.domain.SingleEventParticipantId;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.exception.EventNotFoundException;
import com.sporteventstournaments.exception.ForbiddenOperationException;
import com.sporteventstournaments.exception.InvalidOperationException;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.EventRepository;
import com.sporteventstournaments.repository.SingleEventParticipantRepository;
import com.sporteventstournaments.repository.SingleEventRepository;
import com.sporteventstournaments.repository.UserRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class SingleEventService {
    private final SingleEventRepository singleEventRepository;
    private final EventRepository eventRepository;
    private final SingleEventParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final SecurityService securityService;

    public List<SingleEvent> getAllSingleEvents() {
        return singleEventRepository.findAll();
    }

    public SingleEvent getSingleEventById(Long id) {
        return singleEventRepository.findById(id).orElseThrow(EventNotFoundException::new);
    }

    public List<SingleEvent> getSingleEventsByStatus(SingleEvent.SingleEventStatus status) {
        return singleEventRepository.findByStatus(status);
    }

    @Transactional
    public SingleEvent createSingleEvent(Long eventId, Integer maxParticipants,
                                         List<Long> participantIds, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        // Получаем базовое событие
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Base event not found"));

        // Проверяем права пользователя
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!event.getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can create a single event for this event");
        }

        // Проверяем, что SingleEvent еще не существует для данного Event
        if (singleEventRepository.existsById(eventId)) {
            throw new InvalidOperationException("Single event already exists for this base event");
        }

        // Создаем SingleEvent
        SingleEvent singleEvent = new SingleEvent();
        singleEvent.setEvent(event);
        singleEvent.setMaxParticipants(maxParticipants);
        singleEvent.setStatus(SingleEvent.SingleEventStatus.PENDING);

        SingleEvent savedEvent = singleEventRepository.save(singleEvent);

        // Добавляем участников, если они указаны
        if (participantIds != null && !participantIds.isEmpty()) {
            addParticipants(savedEvent.getId(), participantIds, principal);
        }

        return savedEvent;
    }

    @Transactional
    public SingleEvent updateSingleEvent(Long id, Integer maxParticipants,
                                         SingleEvent.SingleEventStatus status, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        SingleEvent existingSingleEvent = singleEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Проверяем права пользователя
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingSingleEvent.getEvent().getCreatedBy().equals(userId) &&
                !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can update this single event");
        }

        // Обновляем только переданные поля
        if (maxParticipants != null) {
            // Проверяем, что новое максимальное количество не меньше текущего количества участников
            int currentParticipants = participantRepository.countParticipantsByEventId(id);
            if (maxParticipants < currentParticipants) {
                throw new InvalidOperationException(
                        String.format("Cannot set max participants to %d. Current participants: %d",
                                maxParticipants, currentParticipants));
            }
            existingSingleEvent.setMaxParticipants(maxParticipants);
        }

        if (status != null) {
            existingSingleEvent.setStatus(status);
        }

        return singleEventRepository.saveAndFlush(existingSingleEvent);
    }

    @Transactional
    public SingleEvent updateEventStatus(Long id, SingleEvent.SingleEventStatus status, Principal principal) {
        return updateSingleEvent(id, null, status, principal);
    }

    @Transactional
    public SingleEvent updateMaxParticipants(Long id, Integer maxParticipants, Principal principal) {
        return updateSingleEvent(id, maxParticipants, null, principal);
    }

    @Transactional
    public void deleteSingleEvent(Long id, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        SingleEvent existingSingleEvent = singleEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Проверяем права пользователя
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingSingleEvent.getEvent().getCreatedBy().equals(userId) &&
                !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can delete this single event");
        }

        // Удаляем всех участников
        List<SingleEventParticipant> participants = participantRepository.findByEventId(id);
        participantRepository.deleteAll(participants);

        // Удаляем само событие
        singleEventRepository.deleteById(id);
    }

    @Transactional
    public SingleEventParticipant addParticipant(Long eventId, Long userId, Principal principal) {
        // Проверяем существование события
        SingleEvent singleEvent = singleEventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Single event not found"));

        // Проверяем существование пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        // Проверяем лимит участников
        int currentParticipants = participantRepository.countParticipantsByEventId(eventId);
        if (currentParticipants >= singleEvent.getMaxParticipants()) {
            throw new InvalidOperationException("This event has reached its maximum number of participants");
        }

        // Проверяем, что участник еще не добавлен
        SingleEventParticipantId id = new SingleEventParticipantId(eventId, userId);
        if (participantRepository.existsById(id)) {
            throw new InvalidOperationException("User is already a participant in this event");
        }

        SingleEventParticipant participant = new SingleEventParticipant();
        participant.setEventId(eventId);
        participant.setUserId(userId);
        participant.setSingleEvent(singleEvent);
        participant.setUser(user); // Устанавливаем ссылку на пользователя
        participant.setInvitationSent(false);
        participant.setAccepted(false);
        participant.setJoinedAt(LocalDateTime.now());

        return participantRepository.save(participant);
    }

    @Transactional
    public List<SingleEventParticipant> addParticipants(Long eventId, List<Long> userIds, Principal principal) {
        if (userIds == null || userIds.isEmpty()) {
            return new ArrayList<>();
        }

        // Проверяем существование события
        SingleEvent singleEvent = singleEventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Single event not found"));

        // Проверяем текущее количество участников
        int currentParticipants = participantRepository.countParticipantsByEventId(eventId);

        // Проверяем, что все пользователи существуют
        List<User> users = userRepository.findAllById(userIds);
        if (users.size() != userIds.size()) {
            throw new UserNotFoundException();
        }

        // Фильтруем пользователей, которые еще не участвуют
        List<Long> existingParticipantIds = participantRepository.findByEventId(eventId)
                .stream()
                .map(SingleEventParticipant::getUserId)
                .toList();

        List<Long> newUserIds = userIds.stream()
                .filter(userId -> !existingParticipantIds.contains(userId))
                .toList();

        // Проверяем лимит с учетом новых участников
        if (currentParticipants + newUserIds.size() > singleEvent.getMaxParticipants()) {
            throw new InvalidOperationException(
                    String.format("Cannot add %d participants. Current: %d, Max: %d, Available slots: %d",
                            newUserIds.size(), currentParticipants, singleEvent.getMaxParticipants(),
                            singleEvent.getMaxParticipants() - currentParticipants));
        }

        List<SingleEventParticipant> addedParticipants = new ArrayList<>();

        for (Long userId : newUserIds) {
            User user = users.stream()
                    .filter(u -> u.getId().equals(userId))
                    .findFirst()
                    .orElseThrow((UserNotFoundException::new));

            SingleEventParticipant participant = new SingleEventParticipant();
            participant.setEventId(eventId);
            participant.setUserId(userId);
            participant.setSingleEvent(singleEvent);
            participant.setUser(user); // Устанавливаем ссылку на пользователя
            participant.setInvitationSent(false);
            participant.setAccepted(false);
            participant.setJoinedAt(LocalDateTime.now());

            addedParticipants.add(participantRepository.save(participant));
        }

        return addedParticipants;
    }

    @Transactional
    public void removeParticipant(Long eventId, Long userId, Principal principal) {
        SingleEvent singleEvent = singleEventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        // Проверяем права пользователя
        Long currentUserId = securityService.getUserIdByLogin(principal.getName());
        if (!singleEvent.getEvent().getCreatedBy().equals(currentUserId) &&
                !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can remove participants");
        }

        SingleEventParticipantId id = new SingleEventParticipantId(eventId, userId);
        if (!participantRepository.existsById(id)) {
            throw new InvalidOperationException("User is not a participant in this event");
        }

        participantRepository.deleteById(id);
    }

    public List<SingleEventParticipant> getParticipantsByEventId(Long eventId) {
        return participantRepository.findByEventId(eventId);
    }

    public List<SingleEventParticipant> getEventsByUserId(Long userId, Principal principal) {
        // Проверяем права доступа
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        Long currentUserId = securityService.getUserIdByLogin(principal.getName());
        boolean isAdmin = securityService.checkIfAdmin(principal.getName());

        // Пользователь может получить только свои события или админ может получить любые
        if (!currentUserId.equals(userId) && !isAdmin) {
            throw new ForbiddenOperationException("You can only view your own events");
        }

        return participantRepository.findByUserId(userId);
    }

    public int getParticipantCount(Long eventId) {
        return participantRepository.countParticipantsByEventId(eventId);
    }

    // Дополнительные методы для удобства

    public boolean isEventFull(Long eventId) {
        SingleEvent event = getSingleEventById(eventId);
        int currentParticipants = getParticipantCount(eventId);
        return currentParticipants >= event.getMaxParticipants();
    }

    public boolean isUserParticipant(Long eventId, Long userId) {
        SingleEventParticipantId id = new SingleEventParticipantId(eventId, userId);
        return participantRepository.existsById(id);
    }

    public int getAvailableSlots(Long eventId) {
        SingleEvent event = getSingleEventById(eventId);
        int currentParticipants = getParticipantCount(eventId);
        return event.getMaxParticipants() - currentParticipants;
    }
}