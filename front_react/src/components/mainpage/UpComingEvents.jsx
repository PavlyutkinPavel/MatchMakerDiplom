import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, TextField, MenuItem, FormControl, InputLabel, Select,
    Grid, Chip, Card, CardContent, Container, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tabs, Tab, CircularProgress, List, ListItem, ListItemText,
    ListItemAvatar, Avatar, Badge, Divider, Tooltip
} from '@mui/material';
import {
    Event, Groups, SportsSoccer, SportsBasketball, SportsTennis, SportsHockey, SportsVolleyball,
    People, PersonAdd, CalendarMonth, LocationOn, Visibility, Search, EmojiEvents, Info
} from '@mui/icons-material';
import { styled } from '@mui/system';
import useApplicationStore from 'store/useApplicationStore';
import { fromISOToLocal } from 'helpers/dateUtils';
import AppTheme from 'components/shared-theme/AppTheme';
import { Snackbar, Alert } from '@mui/material';
import AppAppBar from 'components/blog/components/AppAppBar';
import CssBaseline from "@mui/material/CssBaseline";

const EventCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginTop: theme.spacing(8), // Добавляем отступ сверху
}));

const SPORT_TYPES = [
    { value: 'FOOTBALL', label: 'Football', icon: <SportsSoccer /> },
    { value: 'BASKETBALL', label: 'Basketball', icon: <SportsBasketball /> },
    { value: 'TENNIS', label: 'Tennis', icon: <SportsTennis /> },
    { value: 'HOCKEY', label: 'Hockey', icon: <SportsHockey /> },
    { value: 'VOLLEYBALL', label: 'Volleyball', icon: <SportsVolleyball /> },
];

const STATUS_OPTIONS = {
    TABLE: [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'OPEN', label: 'Open' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'COMPLETED', label: 'Completed' }
    ],
    TWO_TEAMS: [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'SCHEDULED', label: 'Scheduled' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ],
    SINGLE: [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'SCHEDULED', label: 'Scheduled' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ]
};

export default function UpComingEvents() {
    const store = useApplicationStore();
    const [tabValue, setTabValue] = useState(0);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateSort, setDateSort] = useState('newest');
    const [participants, setParticipants] = useState([]);
    const [teams, setTeams] = useState([]);

    const currentUser = store.user.myAuth;
    const eventTypes = ['TABLE', 'TWO_TEAMS', 'SINGLE'];
    const currentEventType = eventTypes[tabValue];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let eventsData;
                switch (currentEventType) {
                    case 'TABLE':
                        eventsData = await store.tableEvent.fetchAll();
                        break;
                    case 'TWO_TEAMS':
                        eventsData = await store.twoTeamEvent.fetchAll();
                        break;
                    case 'SINGLE':
                        eventsData = await store.singleEvent.fetchAll();
                        break;
                    default:
                        eventsData = [];
                }

                const teamsData = await store.team.fetchAll();
                setEvents(eventsData);
                setTeams(teamsData);
            } catch (error) {
                showSnackbar(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [tabValue, currentEventType]);

    useEffect(() => {
        if (selectedEvent) {
            const loadEventDetails = async () => {
                try {
                    if (currentEventType === 'SINGLE') {
                        const participantsData = await store.singleEvent.fetchParticipants(selectedEvent.id);
                        setParticipants(participantsData);
                    } else if (currentEventType === 'TABLE') {
                        const teamsData = await store.tableEvent.fetchTeams(selectedEvent.id);
                        setParticipants(teamsData);
                    }
                } catch (error) {
                    showSnackbar(error.message, 'error');
                }
            };
            loadEventDetails();
        }
    }, [selectedEvent, currentEventType]);

    const handleParticipate = async () => {
        if (!selectedEvent || currentEventType !== 'SINGLE' || !currentUser?.id) return;

        setLoading(true);
        try {
            await store.singleEvent.addParticipants(selectedEvent.id, [currentUser.id]);
            showSnackbar('You have successfully joined the event!', 'success');

            const updatedParticipants = await store.singleEvent.fetchParticipants(selectedEvent.id);
            setParticipants(updatedParticipants);

            const updatedEvents = await store.singleEvent.fetchAll();
            setEvents(updatedEvents);
        } catch (error) {
            showSnackbar(error.message || 'Failed to join the event', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const renderSportIcon = (type) => {
        const sport = SPORT_TYPES.find(t => t.value === type);
        return sport ? sport.icon : <SportsSoccer />;
    };

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team ? team.teamName : 'Unknown Team';
    };

    const getEventIcon = () => {
        switch (currentEventType) {
            case 'TABLE': return <EmojiEvents />;
            case 'TWO_TEAMS': return <Groups />;
            case 'SINGLE': return <People />;
            default: return <Event />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'SCHEDULED':
                return 'info';
            case 'OPEN':
                return 'primary';
            case 'IN_PROGRESS':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getParticipationStatus = () => {
        if (!currentUser?.id || currentEventType !== 'SINGLE') return null;

        const participant = participants.find(p => p.user?.id === currentUser.id);

        if (!participant) {
            if (selectedEvent.status !== 'PENDING') {
                return {
                    text: 'Event is not accepting participants',
                    tooltip: 'This event is not in PENDING status'
                };
            }
            return null;
        }

        if (participant.accepted) {
            return {
                text: 'You are participating',
                tooltip: 'Your participation has been accepted'
            };
        }

        return {
            text: 'Your request is pending',
            tooltip: 'Waiting for organizer approval'
        };
    };

    const filteredEvents = events
        .filter(event => {
            const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
            const matchesSearch = event.event?.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.event?.eventLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.eventLocation?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.event?.eventDate || a.eventDate);
            const dateB = new Date(b.event?.eventDate || b.eventDate);
            return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

    const renderEventDetails = () => {
        if (!selectedEvent) return null;

        const eventData = selectedEvent.event ? selectedEvent.event : selectedEvent;
        const isSingleEvent = currentEventType === 'SINGLE';
        const isTableEvent = currentEventType === 'TABLE';
        const isTwoTeamEvent = currentEventType === 'TWO_TEAMS';

        const canParticipate = isSingleEvent &&
            selectedEvent.status === 'PENDING' &&
            currentUser?.id &&
            !participants.some(p => p.user?.id === currentUser.id);

        const participationStatus = getParticipationStatus();

        return (
            <EventCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        {eventData.eventName}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setSelectedEvent(null)}
                        startIcon={<Visibility />}
                    >
                        Back to list
                    </Button>
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
                                            {fromISOToLocal(eventData.eventDate)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Location
                                        </Typography>
                                        <Typography variant="body1">
                                            {eventData.eventLocation}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Sport Type
                                        </Typography>
                                        <Typography variant="body1">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {renderSportIcon(eventData.sportType)}
                                                {SPORT_TYPES.find(t => t.value === eventData.sportType)?.label}
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
                                                color={getStatusColor(selectedEvent.status)}
                                            />
                                        </Typography>
                                    </Grid>
                                    {isTableEvent && (
                                        <>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Teams Limit
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedEvent.maxTeams}
                                                </Typography>
                                            </Grid>
                                        </>
                                    )}
                                    {isSingleEvent && (
                                        <>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Participants Limit
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedEvent.maxParticipants}
                                                </Typography>
                                            </Grid>
                                        </>
                                    )}
                                    {isTwoTeamEvent && (
                                        <>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Team 1
                                                </Typography>
                                                <Typography variant="body1">
                                                    {getTeamName(selectedEvent.team1Id)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Team 2
                                                </Typography>
                                                <Typography variant="body1">
                                                    {getTeamName(selectedEvent.team2Id)}
                                                </Typography>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>

                        {isSingleEvent && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Participants
                                </Typography>

                                {participants.length > 0 ? (
                                    <List>
                                        {participants.map((participant) => (
                                            <ListItem key={participant.user?.id || participant.id}>
                                                <ListItemAvatar>
                                                    <Badge
                                                        badgeContent=" "
                                                        color={participant.accepted ? 'success' : 'warning'}
                                                        variant="dot"
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'right',
                                                        }}
                                                    >
                                                        <Avatar>
                                                            {participant.user?.firstName?.charAt(0)}{participant.user?.lastName?.charAt(0)}
                                                        </Avatar>
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${participant.user?.firstName} ${participant.user?.lastName}`}
                                                    secondary={participant.user?.userLogin}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="textSecondary">
                                            No participants yet
                                        </Typography>
                                    </Paper>
                                )}
                            </>
                        )}

                        {isTableEvent && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Teams
                                </Typography>

                                {participants.length > 0 ? (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Team</TableCell>
                                                    <TableCell align="right">Points</TableCell>
                                                    <TableCell align="right">Wins</TableCell>
                                                    <TableCell align="right">Losses</TableCell>
                                                    <TableCell align="right">Draws</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {participants.map((team) => (
                                                    <TableRow key={team.teamId}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Avatar sx={{ width: 24, height: 24 }}>
                                                                    {getTeamName(team.teamId).charAt(0)}
                                                                </Avatar>
                                                                {getTeamName(team.teamId)}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right">{team.points || 0}</TableCell>
                                                        <TableCell align="right">{team.wins || 0}</TableCell>
                                                        <TableCell align="right">{team.losses || 0}</TableCell>
                                                        <TableCell align="right">{team.draws || 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="textSecondary">
                                            No teams in this event
                                        </Typography>
                                    </Paper>
                                )}
                            </>
                        )}

                        {isTwoTeamEvent && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Match Results
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {getTeamName(selectedEvent.team1Id)}
                                                </Typography>
                                                <Typography variant="h4" color="primary">
                                                    {selectedEvent.team1Score !== null ? selectedEvent.team1Score : '-'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {getTeamName(selectedEvent.team2Id)}
                                                </Typography>
                                                <Typography variant="h4" color="primary">
                                                    {selectedEvent.team2Score !== null ? selectedEvent.team2Score : '-'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                {isSingleEvent && (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            Participation
                                        </Typography>
                                        {canParticipate ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    startIcon={<PersonAdd />}
                                                    onClick={handleParticipate}
                                                    disabled={loading}
                                                    sx={{ mb: 2 }}
                                                >
                                                    Participate
                                                </Button>
                                                <Typography variant="body2" color="textSecondary">
                                                    Join this event as a participant
                                                </Typography>
                                            </>
                                        ) : participationStatus ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <Tooltip title={participationStatus.tooltip}>
                                                    <Info color="info" />
                                                </Tooltip>
                                                <Typography variant="body1">
                                                    {participationStatus.text}
                                                </Typography>
                                            </Box>
                                        ) : null}
                                        <Divider sx={{ my: 2 }} />
                                    </>
                                )}
                                <Typography variant="body2" color="textSecondary">
                                    Created at: {fromISOToLocal(selectedEvent.createdAt || eventData.createdAt)}
                                </Typography>
                                {selectedEvent.updatedAt && (
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Updated at: {fromISOToLocal(selectedEvent.updatedAt)}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </EventCard>
        );
    };

    const renderEventList = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getEventIcon()} {currentEventType.replace('_', ' ')} Events
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Search"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Status"
                        >
                            {STATUS_OPTIONS[currentEventType].map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Date</InputLabel>
                        <Select
                            value={dateSort}
                            onChange={(e) => setDateSort(e.target.value)}
                            label="Date"
                        >
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="oldest">Oldest First</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : filteredEvents.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">
                        No events found matching your criteria
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Event Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Sport</TableCell>
                                <TableCell>Status</TableCell>
                                {currentEventType === 'TABLE' && <TableCell>Teams Limit</TableCell>}
                                {currentEventType === 'SINGLE' && <TableCell>Participants Limit</TableCell>}
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEvents.map((event) => {
                                const eventData = event.event ? event.event : event;
                                return (
                                    <TableRow key={event.id} hover>
                                        <TableCell>{eventData.eventName}</TableCell>
                                        <TableCell>{fromISOToLocal(eventData.eventDate)}</TableCell>
                                        <TableCell>{eventData.eventLocation}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {renderSportIcon(eventData.sportType)}
                                                {SPORT_TYPES.find(t => t.value === eventData.sportType)?.label}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={event.status}
                                                color={getStatusColor(event.status)}
                                            />
                                        </TableCell>
                                        {currentEventType === 'TABLE' && (
                                            <TableCell>
                                                {event.maxTeams}
                                            </TableCell>
                                        )}
                                        {currentEventType === 'SINGLE' && (
                                            <TableCell>
                                                {event.maxParticipants}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Button
                                                size="small"
                                                startIcon={<Visibility />}
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={0} sx={{ mb: 3, mt: 6 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => {
                            setTabValue(newValue);
                            setSelectedEvent(null);
                            setStatusFilter('ALL');
                        }}
                        variant="fullWidth"
                    >
                        <Tab label="Table Events" icon={<EmojiEvents />} />
                        <Tab label="Two Teams Events" icon={<Groups />} />
                        <Tab label="Single Events" icon={<People />} />
                    </Tabs>
                </Paper>

                {selectedEvent ? renderEventDetails() : renderEventList()}

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