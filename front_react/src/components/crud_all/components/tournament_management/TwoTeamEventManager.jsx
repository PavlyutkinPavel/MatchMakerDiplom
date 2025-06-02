import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, TextField, MenuItem, FormControl, InputLabel, Select,
    Grid, Chip, Card, CardContent, Container, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tabs, Tab, CircularProgress
} from '@mui/material';
import {
    Delete, SportsSoccer, Add, Save, CalendarMonth, LocationOn, Edit, Visibility, Close,
    Event, Groups, SportsFootball, SportsBasketball, SportsTennis, SportsHockey, SportsVolleyball,
    Check, Clear
} from '@mui/icons-material';
import { styled } from '@mui/system';
import useApplicationStore from 'store/useApplicationStore';
import { toISOString, fromISOToLocal } from 'helpers/dateUtils';
import AppTheme from 'components/shared-theme/AppTheme';
import { Snackbar, Alert } from '@mui/material';
import { ImageListItem } from '../../../../../node_modules/@mui/material/index';

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
    { value: 'PENDING', label: 'Pending' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

export default function TwoTeamEventManager() {
    const store = useApplicationStore();
    const [tabValue, setTabValue] = useState(0);
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [editingScores, setEditingScores] = useState(false);
    const [tempTeam1Score, setTempTeam1Score] = useState(0);
    const [tempTeam2Score, setTempTeam2Score] = useState(0);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [sportType, setSportType] = useState('FOOTBALL');
    const [team1Id, setTeam1Id] = useState('');
    const [team2Id, setTeam2Id] = useState('');
    const [status, setStatus] = useState('PENDING');
    const user = useApplicationStore((state) => state.user.myAuth);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsData, teamsData] = await Promise.all([
                    store.twoTeamEvent.fetchAll(),
                    store.team.fetchAll()
                ]);
                setEvents(eventsData);
                setTeams(teamsData);
            } catch (error) {
                showSnackbar(error.message, 'error');
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            setEventName(selectedEvent.event.eventName);
            setEventDate(selectedEvent.event.eventDate.split('T')[0]);
            setEventLocation(selectedEvent.event.eventLocation);
            setSportType(selectedEvent.event.sportType || 'FOOTBALL');
            setTeam1Id(selectedEvent.team1Id);
            setTeam2Id(selectedEvent.team2Id);
            setStatus(selectedEvent.status);
            setTempTeam1Score(selectedEvent.team1Score || 0);
            setTempTeam2Score(selectedEvent.team2Score || 0);
        }
    }, [selectedEvent]);

    const filteredEvents = events.filter(event => {
        const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
        const matchesSearch = event.event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const loadEvents = async () => {
        try {
            const data = await store.twoTeamEvent.fetchAll();
            setEvents(data);
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    const loadTeams = async () => {
        try {
            const data = await store.team.fetchAll();
            setTeams(data);
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    const handleCreateEvent = async () => {
        if (!eventName || !eventDate || !team1Id || !team2Id) {
            showSnackbar('Please fill all required fields', 'error');
            return;
        }

        if (team1Id === team2Id) {
            showSnackbar('Team 1 and Team 2 cannot be the same', 'error');
            return;
        }

        try {
            const eventResponse = await store.event.create({
                eventName,
                eventDate: toISOString(eventDate),
                eventLocation,
                eventType: "TWO_TEAMS",
                sportType
            });

            await store.twoTeamEvent.create({
                eventId: eventResponse.id,
                team1Id,
                team2Id,
                status
            });

            showSnackbar('Two-team event created successfully!', 'success');
            resetForm();
            await loadEvents();
            setTabValue(0);
        } catch (error) {
            showSnackbar(error.message || 'Event creation failed', 'error');
        }
    };

    const handleUpdateEvent = async () => {
        try {
            const updatedEvent = await store.event.update(selectedEvent.event.id, {
                eventName,
                eventDate: toISOString(eventDate),
                eventLocation,
                sportType
            });

            const updatedTwoTeamEvent = await store.twoTeamEvent.update(selectedEvent.id, {
                team1Id,
                team2Id,
                status
            });

            setSelectedEvent({
                ...selectedEvent,
                event: updatedEvent,
                team1Id: updatedTwoTeamEvent.team1Id,
                team2Id: updatedTwoTeamEvent.team2Id,
                status: updatedTwoTeamEvent.status
            });

            showSnackbar('Event updated successfully!', 'success');
            setEditMode(false);
            await loadEvents();
        } catch (error) {
            showSnackbar(error.message || 'Update failed', 'error');
        }
    };

    const handleUpdateScores = async () => {
        try {
            const updatedEvent = await store.twoTeamEvent.updateScores(selectedEvent.id, {
                team1Score: tempTeam1Score,
                team2Score: tempTeam2Score
            });

            setSelectedEvent({
                ...selectedEvent,
                team1Score: updatedEvent.team1Score,
                team2Score: updatedEvent.team2Score
            });

            showSnackbar('Scores updated successfully!', 'success');
            await loadEvents();
        } catch (error) {
            showSnackbar(error.message || 'Failed to update scores', 'error');
        }
    };

    const handleDeleteEvent = async () => {
        try {
            await store.twoTeamEvent.delete(eventToDelete.id);
            await store.event.delete(eventToDelete.event.id);
            showSnackbar('Event deleted successfully', 'success');
            setSelectedEvent(null);
            await loadEvents();
        } catch (error) {
            showSnackbar(error.message || 'Deletion failed', 'error');
        } finally {
            setConfirmOpen(false);
        }
    };

    const resetForm = () => {
        setEventName('');
        setEventDate('');
        setEventLocation('');
        setSportType('FOOTBALL');
        setTeam1Id('');
        setTeam2Id('');
        setStatus('PENDING');
        setEditMode(false);
        setSelectedEvent(null);
        setEditingScores(false);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const renderSportType = (type) => {
        const sport = SPORT_TYPES.find(t => t.value === type);
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {sport?.icon}
                {sport?.label}
            </Box>
        );
    };

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team ? team.teamName : 'Unknown Team';
    };

    const startEditingScores = () => {
        setTempTeam1Score(selectedEvent.team1Score || 0);
        setTempTeam2Score(selectedEvent.team2Score || 0);
        setEditingScores(true);
    };

    const cancelEditingScores = () => {
        setEditingScores(false);
    };

    return (
        <AppTheme>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={0} sx={{ mb: 4, p: 3 }}>
                    <Tabs value={tabValue} onChange={(e, newValue) => {
                        setTabValue(newValue);
                        console.log(tabValue);
                        console.log(editMode);
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

                {tabValue === 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Groups color="primary" /> Two-Team Events
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
                                        <TableCell>Teams</TableCell>
                                        <TableCell>Score</TableCell>
                                        <TableCell>Sport Type</TableCell>
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
                                                {getTeamName(event.team1Id)} vs {getTeamName(event.team2Id)}
                                            </TableCell>
                                            <TableCell>
                                                {event.team1Score !== null && event.team2Score !== null
                                                    ? `${event.team1Score} - ${event.team2Score}`
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {renderSportType(event.event.sportType)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={event.status}
                                                    color={
                                                        event.status === 'SCHEDULED' ? 'success' :
                                                            event.status === 'COMPLETED' ? 'primary' :
                                                                event.status === 'PENDING' ? 'warning' : 'default'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    startIcon={<Visibility />}
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setEditMode(false);
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

                {tabValue === 1 && (
                    <EventCard>
                        {editMode || !selectedEvent ? (
                            <>
                                <Typography variant="h5" gutterBottom>
                                    {editMode ? 'Edit Two-Team Event' : 'Create New Two-Team Event'}
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
                                            <Grid item xs={12} md={editMode ? 6 : 12}>
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
                                            {editMode && (
                                                <Grid item xs={12} md={6}>
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
                                                </Grid>
                                            )}
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

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Teams
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth margin="normal">
                                                        <InputLabel>Team 1</InputLabel>
                                                        <Select
                                                            value={team1Id}
                                                            onChange={(e) => setTeam1Id(e.target.value)}
                                                            label="Team 1"
                                                            required
                                                        >
                                                            {teams.map((team) => (
                                                                <MenuItem key={team.id} value={team.id}>
                                                                    {team.teamName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth margin="normal">
                                                        <InputLabel>Team 2</InputLabel>
                                                        <Select
                                                            value={team2Id}
                                                            onChange={(e) => setTeam2Id(e.target.value)}
                                                            label="Team 2"
                                                            required
                                                        >
                                                            {teams.map((team) => (
                                                                <MenuItem key={team.id} value={team.id}>
                                                                    {team.teamName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
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
                                                        Sport Type: {sportType ? SPORT_TYPES.find(t => t.value === sportType)?.label : 'Not specified'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Team 1: {team1Id ? getTeamName(team1Id) : 'Not selected'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Team 2: {team2Id ? getTeamName(team2Id) : 'Not selected'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Status: {status}
                                                    </Typography>

                                                    <Box sx={{ mt: 3 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            fullWidth
                                                            onClick={selectedEvent ? handleUpdateEvent : handleCreateEvent}
                                                            startIcon={<Save />}
                                                            disabled={!eventName || !eventDate || !team1Id || !team2Id}
                                                            sx={{
                                                                '&:disabled': {
                                                                    backgroundColor: 'action.disabledBackground',
                                                                    color: 'text.secondary'
                                                                }
                                                            }}
                                                        >
                                                            {selectedEvent ? 'Update Event' : 'Create Event'}
                                                        </Button>

                                                        <Button
                                                            variant="outlined"
                                                            fullWidth
                                                            onClick={() => {
                                                                resetForm();
                                                                setTabValue(0);
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
                                                            {renderSportType(selectedEvent.event.sportType)}
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
                                                                    selectedEvent.status === 'SCHEDULED' ? 'success' :
                                                                        selectedEvent.status === 'COMPLETED' ? 'primary' :
                                                                            selectedEvent.status === 'PENDING' ? 'warning' : 'default'
                                                                }
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>

                                        <Typography variant="h6" gutterBottom>
                                            Teams and Scores
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TeamCard elevation={1}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {getTeamName(selectedEvent.team1Id)}
                                                    </Typography>
                                                    {editingScores ? (
                                                        <TextField
                                                            label="Score"
                                                            type="number"
                                                            fullWidth
                                                            value={tempTeam1Score}
                                                            onChange={(e) => setTempTeam1Score(parseInt(e.target.value) || 0)}
                                                            inputProps={{ min: 0 }}
                                                        />
                                                    ) : (
                                                        <Typography variant="h4" color="primary">
                                                            {selectedEvent.team1Score !== null ? selectedEvent.team1Score : '-'}
                                                        </Typography>
                                                    )}
                                                </TeamCard>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TeamCard elevation={1}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {getTeamName(selectedEvent.team2Id)}
                                                    </Typography>
                                                    {editingScores ? (
                                                        <TextField
                                                            label="Score"
                                                            type="number"
                                                            fullWidth
                                                            value={tempTeam2Score}
                                                            onChange={(e) => setTempTeam2Score(parseInt(e.target.value) || 0)}
                                                            inputProps={{ min: 0 }}
                                                        />
                                                    ) : (
                                                        <Typography variant="h4" color="primary">
                                                            {selectedEvent.team2Score !== null ? selectedEvent.team2Score : '-'}
                                                        </Typography>
                                                    )}
                                                </TeamCard>
                                            </Grid>
                                        </Grid>

                                        {editingScores ? (
                                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Check />}
                                                    onClick={handleUpdateScores}
                                                >
                                                    Save Scores
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    startIcon={<Clear />}
                                                    onClick={cancelEditingScores}
                                                >
                                                    Cancel
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Box sx={{ mt: 3 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Edit />}
                                                    onClick={startEditingScores}
                                                >
                                                    Edit Scores
                                                </Button>
                                            </Box>
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