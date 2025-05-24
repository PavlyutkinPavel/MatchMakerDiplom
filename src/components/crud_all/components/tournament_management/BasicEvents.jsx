import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, TextField, MenuItem, FormControl, InputLabel,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Grid, Divider,
    Alert, Chip, Card, CardContent, Container, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Badge, Tabs, Tab, Switch, FormControlLabel, CircularProgress
} from '@mui/material';
import {
    PersonAdd, Delete, Group, SportsSoccer, EmojiEvents, Add, Check, Flag,
    Save, CalendarMonth, LocationOn, PeopleAlt, Edit, Visibility, Close,
    PersonRemove, CheckCircle, Cancel, Event, Person
} from '@mui/icons-material';
import { styled } from '@mui/system';
import useApplicationStore from 'store/useApplicationStore';
import { toISOString, fromISOToLocal } from 'helpers/dateUtils';
import AppTheme from 'components/shared-theme/AppTheme';
import { Snackbar } from '@mui/material';

// ======= STYLED COMPONENTS ========
const EventCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const ParticipantCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    transition: 'all 0.2s',
    '&:hover': {
        boxShadow: theme.shadows[3],
    },
}));

const StatusBadge = styled(Badge)(({ theme, status }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: status === 'accepted' ? theme.palette.success.main :
            status === 'pending' ? theme.palette.warning.main :
                theme.palette.error.main,
        color: theme.palette.common.white,
    },
}));

// ======= MAIN COMPONENT ========
export default function SingleEventManager() {
    const store = useApplicationStore();
    const [tabValue, setTabValue] = useState(0);
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form states
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(2);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadEvents();
                await loadUsers();
            } catch (error) {
                showSnackbar(error.message, 'error');
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            loadParticipants(selectedEvent.id);
        }
    }, [selectedEvent]);

    const loadEvents = async () => {
        try {
            const data = await store.singleEvent.fetchAll();
            setEvents(data);
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    const loadUsers = async () => {
        try {
            const data = await store.user.fetchAll();
            setUsers(data);
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    const loadParticipants = async (eventId) => {
        try {
            const data = await store.singleEvent.fetchParticipants(eventId);
            setParticipants(data);

            if (editMode) {
                setSelectedUsers(data.map(p => p.user.id));
            }
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    const handleCreateEvent = async () => {
        if (!eventName || !eventDate || selectedUsers.length < 2) {
            showSnackbar('Please fill all required fields and add at least 2 participants', 'error');
            return;
        }

        try {
            // Create main event
            const eventResponse = await store.event.create({
                eventName,
                eventDate: toISOString(eventDate),
                eventLocation,
                eventType: "SINGLE"
            });

            // Create single event
            await store.singleEvent.create({
                eventId: eventResponse.id,
                participantIds: selectedUsers,
                maxParticipants: Math.max(maxParticipants, selectedUsers.length),
            });

            showSnackbar('Event created successfully!', 'success');
            resetForm();
            await loadEvents();
            setTabValue(0);
        } catch (error) {
            showSnackbar(error.message || 'Event creation failed', 'error');
        }
    };

    const handleUpdateEvent = async () => {
        try {
            await store.event.update(selectedEvent.event.id, {
                eventName,
                eventDate: toISOString(eventDate),
                eventLocation
            });

            await store.singleEvent.update(selectedEvent.id, {
                maxParticipants
            });

            const currentParticipants = participants.map(p => p.user.id);
            const newParticipants = selectedUsers;

            const participantsToAdd = newParticipants.filter(
                id => !currentParticipants.includes(id)
            );

            const participantsToRemove = currentParticipants.filter(
                id => !newParticipants.includes(id)
            );

            if (participantsToAdd.length > 0) {
                await store.singleEvent.addParticipants(selectedEvent.id, participantsToAdd);
            }

            if (participantsToRemove.length > 0) {
                await Promise.all(
                    participantsToRemove.map(userId =>
                        store.singleEvent.removeParticipant(selectedEvent.id, userId)
                    )
                );
            }

            showSnackbar('Event updated successfully!', 'success');
            setEditMode(false);
            await loadEvents();
            await loadParticipants(selectedEvent.id);
        } catch (error) {
            showSnackbar(error.message || 'Update failed', 'error');
        }
    };

    const handleDeleteEvent = async () => {
        try {
            await store.singleEvent.delete(eventToDelete.id);
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

    const handleParticipantStatus = async (participantId, accepted) => {
        try {
            const updatedParticipants = participants.map(p =>
                p.user.id === participantId ? { ...p, accepted } : p
            );
            setParticipants(updatedParticipants);
            showSnackbar(`Participant status updated`, 'success');
        } catch (error) {
            showSnackbar(error.message || 'Update failed', 'error');
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        try {
            if (!selectedEvent?.id) {
                throw new Error('No event selected');
            }

            await store.singleEvent.removeParticipant(selectedEvent.id, participantId);
            showSnackbar('Participant removed successfully', 'success');

            const updatedParticipants = participants.filter(p => p.user.id !== participantId);
            setParticipants(updatedParticipants);
            setSelectedUsers(selectedUsers.filter(id => id !== participantId));

        } catch (error) {
            showSnackbar(error.response?.data?.message || error.message || 'Failed to remove participant', 'error');
        }
    };

    const resetForm = () => {
        setEventName('');
        setEventDate('');
        setEventLocation('');
        setMaxParticipants(2);
        setSelectedUsers([]);
        setEditMode(false);
        setSelectedEvent(null);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userLogin.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                {tabValue === 0 && (
                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SportsSoccer color="primary" /> Single Events
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event Name</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Max Participants</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {events.map((event) => (
                                        <TableRow key={event.id} hover>
                                            <TableCell>{event.event.eventName}</TableCell>
                                            <TableCell>{fromISOToLocal(event.event.eventDate)}</TableCell>
                                            <TableCell>{event.event.eventLocation}</TableCell>
                                            <TableCell>
                                                {event.maxParticipants}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={event.status}
                                                    color={
                                                        event.status === 'ACTIVE' ? 'success' :
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
                                                        setEventName(event.event.eventName);
                                                        setEventDate(event.event.eventDate.split('T')[0]);
                                                        setEventLocation(event.event.eventLocation);
                                                        setMaxParticipants(event.maxParticipants);
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
                                    {editMode ? 'Edit Event' : 'Create New Event'}
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
                                                    label="Max Participants"
                                                    type="number"
                                                    fullWidth
                                                    value={maxParticipants}
                                                    onChange={(e) => setMaxParticipants(Math.max(2, parseInt(e.target.value) || 2))}
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

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Participants ({selectedUsers.length}/{maxParticipants})
                                            </Typography>

                                            <TextField
                                                label="Search Users"
                                                fullWidth
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                margin="normal"
                                            />
                                            <Paper sx={{ maxHeight: 300, overflow: 'auto', mt: 2, p: 2 }}>
                                                {filteredUsers.length > 0 ? (
                                                    <List>
                                                        {filteredUsers.map((user) => (
                                                            <ListItem
                                                                key={user.id}
                                                                secondaryAction={
                                                                    <IconButton
                                                                        edge="end"
                                                                        onClick={() => {
                                                                            if (selectedUsers.includes(user.id)) {
                                                                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                                                            } else {
                                                                                if (selectedUsers.length < maxParticipants) {
                                                                                    setSelectedUsers([...selectedUsers, user.id]);
                                                                                } else {
                                                                                    showSnackbar(`Maximum ${maxParticipants} participants allowed`, 'warning');
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        {selectedUsers.includes(user.id) ? <Check color="primary" /> : <Add />}
                                                                    </IconButton>
                                                                }
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar>
                                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={`${user.firstName} ${user.lastName}`}
                                                                    secondary={user.userLogin}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                ) : (
                                                    <Typography color="textSecondary" align="center" sx={{ p: 2 }}>
                                                        No users found
                                                    </Typography>
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
                                                        Max Participants: {maxParticipants}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Selected Participants: {selectedUsers.length}/{maxParticipants}
                                                    </Typography>

                                                    <Box sx={{ mt: 3 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            fullWidth
                                                            onClick={editMode ? handleUpdateEvent : handleCreateEvent}
                                                            startIcon={<Save />}
                                                            disabled={!eventName || !eventDate || selectedUsers.length < 2}
                                                            sx={{
                                                                '&:disabled': {
                                                                    backgroundColor: 'action.disabledBackground',
                                                                    color: 'text.disabled'
                                                                }
                                                            }}
                                                        >
                                                            {editMode ? 'Update Event' : 'Create Event'}
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
                                                setEventName(selectedEvent.event.eventName);
                                                setEventDate(selectedEvent.event.eventDate.split('T')[0]);
                                                setEventLocation(selectedEvent.event.eventLocation);
                                                setMaxParticipants(selectedEvent.maxParticipants);
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
                                                            Status
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            <Chip
                                                                label={selectedEvent.status}
                                                                color={
                                                                    selectedEvent.status === 'ACTIVE' ? 'success' :
                                                                        selectedEvent.status === 'PENDING' ? 'warning' : 'default'
                                                                }
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Participants
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {participants.filter(p => p.accepted).length} / {selectedEvent.maxParticipants}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>

                                        <Typography variant="h6" gutterBottom>
                                            Participants
                                        </Typography>

                                        {participants.length > 0 ? (
                                            participants.map((participant) => (
                                                <ParticipantCard key={participant.user.id} elevation={1}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <StatusBadge
                                                                badgeContent=" "
                                                                variant="dot"
                                                                status={participant.accepted ? 'accepted' : 'pending'}
                                                                sx={{ mr: 2 }}
                                                            >
                                                                <Avatar>
                                                                    {participant.user.firstName.charAt(0)}{participant.user.lastName.charAt(0)}
                                                                </Avatar>
                                                            </StatusBadge>
                                                            <Box>
                                                                <Typography variant="subtitle1">
                                                                    {participant.user.firstName} {participant.user.lastName}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {participant.user.userLogin}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box>
                                                            <Tooltip title={participant.accepted ? "Accept" : "Reject"}>
                                                                <IconButton
                                                                    onClick={() => handleParticipantStatus(participant.user.id, !participant.accepted)}
                                                                    color={participant.accepted ? "success" : "default"}
                                                                >
                                                                    {participant.accepted ? <CheckCircle /> : <Cancel />}
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Remove participant">
                                                                <IconButton
                                                                    onClick={() => handleRemoveParticipant(participant.user.id)}
                                                                    color="error"
                                                                    disabled={!selectedEvent?.id}
                                                                >
                                                                    <PersonRemove />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                    {participant.joinedAt && (
                                                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                                            Joined at: {fromISOToLocal(participant.joinedAt)}
                                                        </Typography>
                                                    )}
                                                </ParticipantCard>
                                            ))
                                        ) : (
                                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                                <Typography color="textSecondary">
                                                    No participants yet
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
                                                    {/* <Button
                                                        variant="contained"
                                                        color="primary"
                                                        fullWidth
                                                        startIcon={<PersonAdd />}
                                                    >
                                                        Invite More Participants
                                                    </Button>
                                                    <FormControlLabel
                                                        control={<Switch checked={selectedEvent.status === 'ACTIVE'} />}
                                                        label={selectedEvent.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                                    /> */}
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