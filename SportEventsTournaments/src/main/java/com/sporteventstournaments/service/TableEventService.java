package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Event;
import com.sporteventstournaments.domain.TableEvent;
import com.sporteventstournaments.domain.TableEventTeam;
import com.sporteventstournaments.domain.TableEventTeamId;
import com.sporteventstournaments.domain.dto.TableEventDTO;
import com.sporteventstournaments.exception.EventNotFoundException;
import com.sporteventstournaments.exception.ForbiddenOperationException;
import com.sporteventstournaments.exception.InvalidOperationException;
import com.sporteventstournaments.repository.EventRepository;
import com.sporteventstournaments.repository.TableEventRepository;
import com.sporteventstournaments.repository.TableEventTeamRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class TableEventService {
    private final TableEventRepository tableEventRepository;
    private final TableEventTeamRepository tableEventTeamRepository;
    private final EventRepository eventRepository;
    private final SecurityService securityService;

    public List<TableEvent> getAllTableEvents() {
        return tableEventRepository.findAll();
    }

    public TableEvent getTableEventById(Long id) {
        return tableEventRepository.findById(id).orElseThrow(EventNotFoundException::new);
    }

    public List<TableEvent> getTableEventsByStatus(TableEvent.TableEventStatus status) {
        return tableEventRepository.findByStatus(status);
    }

    @Transactional
    public TableEvent createTableEvent(TableEventDTO tableEventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        // Create event first (assuming the EventService has been called to create the general Event)
        Event event = eventRepository.findById(tableEventDTO.getEventId())
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!event.getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can create a table event for this event");
        }

        TableEvent tableEvent = new TableEvent();
        tableEvent.setEventId(event.getId());
        tableEvent.setEvent(event);
        tableEvent.setMaxTeams(tableEventDTO.getMaxTeams());
        tableEvent.setStatus(TableEvent.TableEventStatus.OPEN);

        return tableEventRepository.save(tableEvent);
    }

    public TableEvent updateTableEvent(Long id, TableEventDTO tableEventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        TableEvent existingTableEvent = tableEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingTableEvent.getEvent().getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can update this table event");
        }

        existingTableEvent.setMaxTeams(tableEventDTO.getMaxTeams());
        existingTableEvent.setStatus(tableEventDTO.getStatus());

        return tableEventRepository.save(existingTableEvent);
    }

    @Transactional
    public void deleteTableEvent(Long id, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        TableEvent existingTableEvent = tableEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingTableEvent.getEvent().getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can delete this table event");
        }

        // Delete all teams first (cascade would work too with proper setup)
        List<TableEventTeam> teams = tableEventTeamRepository.findByEventIdOrderByPointsDesc(id);
        tableEventTeamRepository.deleteAll(teams);

        // Then delete the table event
        tableEventRepository.deleteById(id);
    }

    @Transactional
    public TableEventTeam addTeam(Long eventId, Long teamId, Principal principal) {
        TableEvent tableEvent = tableEventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        // Check if the event allows more teams
        int currentTeams = tableEventTeamRepository.countTeamsByEventId(eventId);
        if (currentTeams >= tableEvent.getMaxTeams()) {
            throw new InvalidOperationException("This event has reached its maximum number of teams");
        }

        // Check if the team is already added
        TableEventTeamId id = new TableEventTeamId(eventId, teamId);
        if (tableEventTeamRepository.existsById(id)) {
            throw new InvalidOperationException("Team is already part of this event");
        }

        TableEventTeam team = new TableEventTeam();
        team.setEventId(eventId);
        team.setTeamId(teamId);
        team.setTableEvent(tableEvent);
        team.setPoints(0);
        team.setWins(0);
        team.setLosses(0);
        team.setDraws(0);

        return tableEventTeamRepository.save(team);
    }

    @Transactional
    public void removeTeam(Long eventId, Long teamId, Principal principal) {
        TableEvent tableEvent = tableEventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        // Only the event creator or admin can remove teams
        Long currentUserId = securityService.getUserIdByLogin(principal.getName());
        if (!tableEvent.getEvent().getCreatedBy().equals(currentUserId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can remove teams");
        }

        TableEventTeamId id = new TableEventTeamId(eventId, teamId);
        tableEventTeamRepository.deleteById(id);
    }

    public List<TableEventTeam> getTeamsByEventId(Long eventId) {
        return tableEventTeamRepository.findByEventIdOrderByPointsDesc(eventId);
    }

    public List<TableEventTeam> getEventsByTeamId(Long teamId) {
        return tableEventTeamRepository.findByTeamId(teamId);
    }

    public TableEventTeam updateTeamStats(Long eventId, Long teamId, Integer points, Integer wins, Integer losses, Integer draws, Principal principal) {
        TableEvent tableEvent = tableEventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        // Only the event creator or admin can update team stats
        Long currentUserId = securityService.getUserIdByLogin(principal.getName());
        if (!tableEvent.getEvent().getCreatedBy().equals(currentUserId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can update team stats");
        }

        TableEventTeamId id = new TableEventTeamId(eventId, teamId);
        TableEventTeam team = tableEventTeamRepository.findById(id)
                .orElseThrow(() -> new InvalidOperationException("Team is not part of this event"));

        team.setPoints(points);
        team.setWins(wins);
        team.setLosses(losses);
        team.setDraws(draws);

        return tableEventTeamRepository.save(team);
    }
}