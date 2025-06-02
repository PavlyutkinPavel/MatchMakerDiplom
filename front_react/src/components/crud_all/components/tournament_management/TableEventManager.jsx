import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Paper, Typography, Button, TextField, MenuItem, FormControl, InputLabel, Select,
    Grid, Chip, Card, CardContent, Container, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, IconButton,
    Tooltip, Divider, Badge, List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress
} from '@mui/material';
import {
    Delete, Add, Save, CalendarMonth, LocationOn, Edit, Visibility, Close,
    Event, Groups, SportsSoccer, EmojiEvents, People, Check, Clear, Sports
} from '@mui/icons-material';
import { styled } from '@mui/system';
import useApplicationStore from 'store/useApplicationStore';
import { toISOString, fromISOToLocal } from 'helpers/dateUtils';
import AppTheme from 'components/shared-theme/AppTheme';
import { Snackbar, Alert } from '@mui/material';
import { SportsBasketball, SportsHockey, SportsTennis, SportsVolleyball } from '../../../../../node_modules/@mui/icons-material/index';

const EventCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const TeamCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    transition: 'all 0.2s',
    '&:hover': {
        boxShadow: theme.shadows[3],
    },
}));

const SPORT_TYPES = [
    { value: 'FOOTBALL', label: 'Football', icon: <SportsSoccer /> },
    { value: 'BASKETBALL', label: 'Basketball', icon: <SportsBasketball /> },
    { value: 'TENNIS', label: 'Tennis', icon: <SportsTennis /> },
    { value: 'HOCKEY', label: 'Hockey', icon: <SportsHockey /> },
    { value: 'VOLLEYBALL', label: 'Volleyball', icon: <SportsVolleyball /> },
];

const STATUS_OPTIONS = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
];

export default function TableEventManager() {
    const store = useApplicationStore();
    const [tabValue, setTabValue] = useState(0);
    const [events, setEvents] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [editingStats, setEditingStats] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [teamsLoading, setTeamsLoading] = useState(false);

    // Form states
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [sportType, setSportType] = useState('FOOTBALL');
    const [maxTeams, setMaxTeams] = useState(4);
    const [status, setStatus] = useState('OPEN');
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Team stats editing
    const [teamStats, setTeamStats] = useState({
        points: 0,
        wins: 0,
        losses: 0,
        draws: 0
    });

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [eventsData, teamsData] = await Promise.all([
                    store.tableEvent.fetchAll(),
                    store.team.fetchAll()
                ]);
                setEvents(eventsData);
                setAllTeams(teamsData);
            } catch (error) {
                showSnackbar(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Load teams for selected event
    const loadEventDetails = useCallback(async (eventId) => {
        if (teamsLoading || !eventId) return;

        setTeamsLoading(true);
        try {
            const eventTeams = await store.tableEvent.fetchTeams(eventId);
            setSelectedEvent(prev => {
                if (prev?.id === eventId && JSON.stringify(prev?.teams) === JSON.stringify(eventTeams)) {
                    return prev;
                }
                return {
                    ...prev,
                    teams: eventTeams
                };
            });
        } catch (error) {
            showSnackbar(error.message, 'error');
        } finally {
            setTeamsLoading(false);
        }
    }, [store.tableEvent, teamsLoading]);

    // Initialize form when entering edit mode
    useEffect(() => {
        if (editMode && selectedEvent) {
            setFormFromEvent(selectedEvent);
        }
    }, [editMode, selectedEvent]);

    // Load teams when viewing event details
    useEffect(() => {
        if (selectedEvent && editMode && tabValue === 1) {
            loadEventDetails(selectedEvent.id);
        }
    }, [selectedEvent, editMode, tabValue]);

    const setFormFromEvent = async (event) => {
        setEventName(event.event.eventName);
        setEventDate(event.event.eventDate.split('T')[0]);
        setEventLocation(event.event.eventLocation);
        setSportType(event.event.sportType || 'FOOTBALL');
        setMaxTeams(event.maxTeams);
        setStatus(event.status);
        setSelectedTeams(event.teams?.map(t => t.teamId) || []);

        // Добавляем загрузку участников
        try {
            const participants = await store.tableEvent.fetchTeams(event.id);
            setSelectedTeams(participants.map(p => p.teamId));
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    const handleCreateEvent = async () => {
        if (!eventName || !eventDate || selectedTeams.length === 0) {
            showSnackbar('Please fill all required fields and select at least one team', 'error');
            return;
        }

        setLoading(true);
        try {
            const eventResponse = await store.event.create({
                eventName,
                eventDate: toISOString(eventDate),
                eventLocation,
                eventType: "TABLE",
                sportType
            });

            await store.tableEvent.create({
                eventId: eventResponse.id,
                maxTeams,
                teamsIds: selectedTeams,
                status
            });

            showSnackbar('Table event created successfully!', 'success');
            const updatedEvents = await store.tableEvent.fetchAll();
            setEvents(updatedEvents);

            resetForm();
            setTabValue(0);
        } catch (error) {
            showSnackbar(error.message || 'Failed to create event', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async () => {
        setLoading(true);
        try {
            await store.event.update(selectedEvent.event.id, {
                eventName,
                eventDate: toISOString(eventDate),
                eventLocation,
                sportType
            });

            await store.tableEvent.update(selectedEvent.id, {
                maxTeams,
                status
            });
            
            const currentTeams = selectedEvent.teams?.map(t => t.teamId) || [];
            const teamsToAdd = selectedTeams.filter(id => !currentTeams.includes(id));
            const teamsToRemove = currentTeams.filter(id => !selectedTeams.includes(id));
            if (teamsToAdd.length > 0) {
                await Promise.all(
                    teamsToAdd.map(teamId => store.tableEvent.addTeam(selectedEvent.id, teamId))
                );
            }

            if (teamsToRemove.length > 0) {
                await Promise.all(
                    teamsToRemove.map(teamId => store.tableEvent.removeTeam(selectedEvent.id, teamId))
                );
            }

            const updatedEvent = await store.tableEvent.fetchById(selectedEvent.id);
            const updatedTeams = await store.tableEvent.fetchTeams(selectedEvent.id);

            setSelectedEvent({
                ...updatedEvent,
                teams: updatedTeams
            });

            showSnackbar('Event updated successfully!', 'success');
            setEditMode(false);
            try {
                const data = await store.tableEvent.fetchAll();
                setEvents(data);
            } catch (error) {
                showSnackbar(error.message, 'error');
            }
        } catch (error) {
            showSnackbar(error.message || 'Failed to update event', 'error');
        } finally {
            setLoading(false);
        }
    };

    const startEditStats = (team) => {
        setEditingStats(team.teamId);
        setTeamStats({
            points: team.points || 0,
            wins: team.wins || 0,
            losses: team.losses || 0,
            draws: team.draws || 0
        });
    };

    const handleUpdateTeamStats = async () => {
        setLoading(true);
        try {
            await store.tableEvent.updateTeamStats(
                selectedEvent.id,
                editingStats,
                {
                    points: teamStats.points,
                    wins: teamStats.wins,
                    losses: teamStats.losses,
                    draws: teamStats.draws
                }
            );
            showSnackbar('Team stats updated successfully!', 'success');
            setEditingStats(null);

            const updatedTeams = await store.tableEvent.fetchTeams(selectedEvent.id);
            setSelectedEvent(prev => ({
                ...prev,
                teams: updatedTeams
            }));
        } catch (error) {
            showSnackbar(error.message || 'Failed to update team stats', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        setLoading(true);
        try {
            await store.tableEvent.delete(eventToDelete.id);
            await store.event.delete(eventToDelete.event.id);
            showSnackbar('Event deleted successfully', 'success');
            setSelectedEvent(null);
            const updatedEvents = await store.tableEvent.fetchAll();
            setEvents(updatedEvents);
            setTabValue(0);
        } catch (error) {
            showSnackbar(error.message || 'Failed to delete event', 'error');
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    };

    const resetForm = () => {
        setEventName('');
        setEventDate('');
        setEventLocation('');
        setSportType('FOOTBALL');
        setMaxTeams(4);
        setStatus('OPEN');
        setSelectedTeams([]);
        setEditMode(false);
        setSelectedEvent(null);
        setEditingStats(null);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredEvents = events.filter(event => {
        const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
        const matchesSearch = event.event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const renderSportIcon = (type) => {
        const sport = SPORT_TYPES.find(t => t.value === type);
        return sport ? sport.icon : <Sports />;
    };

    const getTeamById = (teamId) => {
        return allTeams.find(t => t.id === teamId) || { teamName: 'Unknown Team' };
    };

    const getAvailableTeams = () => {
        if (!selectedEvent || editMode) return allTeams;
        const currentTeamIds = selectedEvent.teams?.map(t => t.teamId) || [];
        return allTeams.filter(team => !currentTeamIds.includes(team.id));
    };

    if (loading) {
        return (
            <AppTheme>
                <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress size={60} />
                </Container>
            </AppTheme>
        );
    }

    return (
        <AppTheme>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={0} sx={{ mb: 4, p: 3 }}>
                    <Tabs value={tabValue} onChange={(e, newValue) => {
                        setTabValue(newValue);
                        if (newValue === 0) {
                            resetForm();
                        }
                    }}>
                        <Tab label="Events List" icon={<Event />} />
                        <Tab
                            label={editMode ? 'Edit Event' : selectedEvent ? 'Event Details' : 'Create Event'}
                            icon={editMode ? <Edit /> : selectedEvent ? <Visibility /> : <Add />}
                        />
                    </Tabs>
                </Paper>

                {tabValue === 1 && (
                    <EventCard>
                        {editMode || !selectedEvent ? (
                            <>
                                <Typography variant="h5" gutterBottom>
                                    {editMode ? 'Edit Table Event' : 'Create New Table Event'}
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            label="Event Name"
                                            fullWidth
                                            value={eventName}
                                            onChange={(e) => setEventName(e.target.value)}
                                            margin="normal"
                                            required
                                        />

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="Event Date"
                                                    type="date"
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    value={eventDate}
                                                    onChange={(e) => setEventDate(e.target.value)}
                                                    margin="normal"
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="Max Teams"
                                                    type="number"
                                                    fullWidth
                                                    value={maxTeams}
                                                    onChange={(e) => setMaxTeams(Math.max(2, parseInt(e.target.value) || 2))}
                                                    margin="normal"
                                                    inputProps={{ min: 2 }}
                                                    required
                                                />
                                            </Grid>
                                        </Grid>

                                        <TextField
                                            label="Location"
                                            fullWidth
                                            value={eventLocation}
                                            onChange={(e) => setEventLocation(e.target.value)}
                                            margin="normal"
                                        />

                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Sport Type</InputLabel>
                                            <Select
                                                value={sportType}
                                                onChange={(e) => setSportType(e.target.value)}
                                                label="Sport Type"
                                            >
                                                {SPORT_TYPES.map((type) => (
                                                    <MenuItem key={type.value} value={type.value}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {type.icon}
                                                            {type.label}
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {editMode && (
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    label="Status"
                                                >
                                                    {STATUS_OPTIONS.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Select Teams ({selectedTeams.length}/{maxTeams})
                                            </Typography>

                                            <TextField
                                                label="Search Teams"
                                                fullWidth
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                margin="normal"
                                            />
                                            <Paper sx={{ maxHeight: 300, overflow: 'auto', mt: 2, p: 2 }}>
                                                {getAvailableTeams().length === 0 ? (
                                                    <Typography color="textSecondary" align="center" sx={{ p: 2 }}>
                                                        No teams available
                                                    </Typography>
                                                ) : (
                                                    getAvailableTeams()
                                                        .filter(team =>
                                                            team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
                                                        )
                                                        .map((team) => (
                                                            <Card
                                                                key={team.id}
                                                                sx={{
                                                                    mb: 1,
                                                                    backgroundColor: selectedTeams.includes(team.id) ? 'action.selected' : 'background.paper'
                                                                }}
                                                            >
                                                                <CardContent sx={{ p: 1 }}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Typography>{team.teamName}</Typography>
                                                                        <IconButton
                                                                            onClick={() => {
                                                                                if (selectedTeams.includes(team.id)) {
                                                                                    setSelectedTeams(selectedTeams.filter(id => id !== team.id));
                                                                                } else {
                                                                                    if (selectedTeams.length < maxTeams) {
                                                                                        setSelectedTeams([...selectedTeams, team.id]);
                                                                                    } else {
                                                                                        showSnackbar(`Maximum ${maxTeams} teams allowed`, 'warning');
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            {selectedTeams.includes(team.id) ? <Check color="primary" /> : <Add />}
                                                                        </IconButton>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        ))
                                                )}
                                            </Paper>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Event Summary
                                                </Typography>

                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Event Name: {eventName || 'Not specified'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Date: {eventDate || 'Not specified'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Location: {eventLocation || 'Not specified'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Sport Type: {SPORT_TYPES.find(t => t.value === sportType)?.label || 'Not specified'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Max Teams: {maxTeams}
                                                    </Typography>
                                                    {editMode && (
                                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                            Status: {status}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Selected Teams: {selectedTeams.length}/{maxTeams}
                                                    </Typography>

                                                    <Box sx={{ mt: 3 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            fullWidth
                                                            onClick={editMode ? handleUpdateEvent : handleCreateEvent}
                                                            startIcon={<Save />}
                                                            disabled={!eventName || !eventDate || selectedTeams.length === 0}
                                                            sx={{
                                                                '&:disabled': {
                                                                    backgroundColor: 'action.disabledBackground',
                                                                    color: 'text.secondary'
                                                                }
                                                            }}
                                                        >
                                                            {editMode ? 'Update Event' : 'Create Event'}
                                                        </Button>

                                                        <Button
                                                            variant="outlined"
                                                            fullWidth
                                                            onClick={() => {
                                                                if (editMode) {
                                                                    setEditMode(false);
                                                                } else {
                                                                    resetForm();
                                                                    setTabValue(0);
                                                                }
                                                            }}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5">
                                        {selectedEvent.event.eventName}
                                    </Typography>
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Edit />}
                                            onClick={() => {
                                                setEditMode(true);
                                            }}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setTabValue(0)}
                                            startIcon={<Close />}
                                        >
                                            Close
                                        </Button>
                                    </Box>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <Card sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Event Details
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Date
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {fromISOToLocal(selectedEvent.event.eventDate)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Location
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {selectedEvent.event.eventLocation}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Sport Type
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                {renderSportIcon(selectedEvent.event.sportType)}
                                                                {SPORT_TYPES.find(t => t.value === selectedEvent.event.sportType)?.label}
                                                            </Box>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Status
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            <Chip
                                                                label={selectedEvent.status}
                                                                color={
                                                                    selectedEvent.status === 'COMPLETED' ? 'success' :
                                                                        selectedEvent.status === 'IN_PROGRESS' ? 'secondary' : 'info'
                                                                }
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Max Teams
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {selectedEvent.maxTeams}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Current Teams
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {selectedEvent.teams?.length || 0}/{selectedEvent.maxTeams}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>

                                        <Typography variant="h6" gutterBottom>
                                            Teams Table
                                        </Typography>

                                        {teamsLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                <CircularProgress size={24} />
                                            </Box>
                                        ) : selectedEvent.teams?.length > 0 ? (
                                            <>
                                                <TableContainer component={Paper}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Team</TableCell>
                                                                <TableCell align="right">Points</TableCell>
                                                                <TableCell align="right">Wins</TableCell>
                                                                <TableCell align="right">Losses</TableCell>
                                                                <TableCell align="right">Draws</TableCell>
                                                                <TableCell>Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {selectedEvent.teams.map((team) => (
                                                                <TableRow key={team.teamId}>
                                                                    <TableCell>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Avatar sx={{ width: 24, height: 24 }}>
                                                                                {getTeamById(team.teamId).teamName.charAt(0)}
                                                                            </Avatar>
                                                                            {getTeamById(team.teamId).teamName}
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell align="right">{team.points || 0}</TableCell>
                                                                    <TableCell align="right">{team.wins || 0}</TableCell>
                                                                    <TableCell align="right">{team.losses || 0}</TableCell>
                                                                    <TableCell align="right">{team.draws || 0}</TableCell>
                                                                    <TableCell>
                                                                        {editingStats === team.teamId ? (
                                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                                <Button
                                                                                    size="small"
                                                                                    variant="contained"
                                                                                    onClick={handleUpdateTeamStats}
                                                                                    startIcon={<Check />}
                                                                                >
                                                                                    Save
                                                                                </Button>
                                                                                <Button
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    onClick={() => setEditingStats(null)}
                                                                                    startIcon={<Clear />}
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                            </Box>
                                                                        ) : (
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                onClick={() => startEditStats(team)}
                                                                                startIcon={<Edit />}
                                                                            >
                                                                                Edit
                                                                            </Button>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>

                                                {editingStats && (
                                                    <Card sx={{ mt: 3 }}>
                                                        <CardContent>
                                                            <Typography variant="h6" gutterBottom>
                                                                Edit Stats for {getTeamById(editingStats).teamName}
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        label="Points"
                                                                        type="number"
                                                                        fullWidth
                                                                        value={teamStats.points}
                                                                        onChange={(e) => setTeamStats({ ...teamStats, points: parseInt(e.target.value) || 0 })}
                                                                        inputProps={{ min: 0 }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        label="Wins"
                                                                        type="number"
                                                                        fullWidth
                                                                        value={teamStats.wins}
                                                                        onChange={(e) => setTeamStats({ ...teamStats, wins: parseInt(e.target.value) || 0 })}
                                                                        inputProps={{ min: 0 }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        label="Losses"
                                                                        type="number"
                                                                        fullWidth
                                                                        value={teamStats.losses}
                                                                        onChange={(e) => setTeamStats({ ...teamStats, losses: parseInt(e.target.value) || 0 })}
                                                                        inputProps={{ min: 0 }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={3}>
                                                                    <TextField
                                                                        label="Draws"
                                                                        type="number"
                                                                        fullWidth
                                                                        value={teamStats.draws}
                                                                        onChange={(e) => setTeamStats({ ...teamStats, draws: parseInt(e.target.value) || 0 })}
                                                                        inputProps={{ min: 0 }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </>
                                        ) : (
                                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                                <Typography color="textSecondary">
                                                    No teams in this event
                                                </Typography>
                                            </Paper>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Event Actions
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        fullWidth
                                                        startIcon={<Delete />}
                                                        onClick={() => {
                                                            setEventToDelete(selectedEvent);
                                                            setConfirmOpen(true);
                                                        }}
                                                    >
                                                        Delete Event
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </EventCard>
                )}

                {tabValue === 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Groups color="primary" /> Table Events
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Search Events"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        label="Status"
                                    >
                                        <MenuItem value="ALL">All Statuses</MenuItem>
                                        {STATUS_OPTIONS.map(option => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event Name</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Max Teams</TableCell>
                                        <TableCell>Sport</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredEvents.map((event) => (
                                        <TableRow key={event.id} hover>
                                            <TableCell>{event.event.eventName}</TableCell>
                                            <TableCell>{fromISOToLocal(event.event.eventDate)}</TableCell>
                                            <TableCell>
                                                {event.maxTeams}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {renderSportIcon(event.event.sportType)}
                                                    {SPORT_TYPES.find(t => t.value === event.event.sportType)?.label}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={event.status}
                                                    color={
                                                        event.status === 'COMPLETED' ? 'success' :
                                                            event.status === 'IN_PROGRESS' ? 'secondary' : 'info'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    startIcon={<Visibility />}
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setTabValue(1);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setEditMode(true);
                                                        setTabValue(1);
                                                    }}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<Delete />}
                                                    color="error"
                                                    onClick={() => {
                                                        setEventToDelete(event);
                                                        setConfirmOpen(true);
                                                    }}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => {
                                    resetForm();
                                    setTabValue(1);
                                }}
                            >
                                Create Event
                            </Button>
                        </Box>
                    </Box>
                )}

                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this event? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={handleDeleteEvent} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </AppTheme>
    );
}