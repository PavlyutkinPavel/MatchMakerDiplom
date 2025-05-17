import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Grid,
    Divider,
    Alert,
    Chip,
    Card,
    CardContent,
    FormHelperText,
    Container,
    Tooltip,
    CircularProgress,
    Fade,
    Stack,
    Backdrop,
    Snackbar
} from '@mui/material';
import {
    PersonAdd,
    Delete,
    Group,
    SportsSoccer,
    EmojiEvents,
    Add,
    Cancel,
    Check,
    Flag,
    Save,
    CalendarMonth,
    LocationOn,
    PeopleAlt,
    Refresh,
    Search,
    StarBorder,
    DonutLarge,
    Edit,
    PlayArrow,
    GroupAdd
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { alpha } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../../shared-theme/AppTheme";

// ======= MOCK DATA ========
const mockTeams = [
    { id: 1, teamName: "FC Barcelona", country: "Spain", city: "Barcelona", achievements: "5 UCL titles", status: "Active", wins: "26", teamType: "FOOTBALL" },
    { id: 2, teamName: "Real Madrid", country: "Spain", city: "Madrid", achievements: "14 UCL titles", status: "Active", wins: "35", teamType: "FOOTBALL" },
    { id: 3, teamName: "Manchester United", country: "England", city: "Manchester", achievements: "3 UCL titles", status: "Active", wins: "20", teamType: "FOOTBALL" },
    { id: 4, teamName: "Bayern Munich", country: "Germany", city: "Munich", achievements: "6 UCL titles", status: "Active", wins: "32", teamType: "FOOTBALL" },
    { id: 5, teamName: "Liverpool", country: "England", city: "Liverpool", achievements: "6 UCL titles", status: "Active", wins: "19", teamType: "FOOTBALL" },
    { id: 6, teamName: "Chelsea", country: "England", city: "London", achievements: "2 UCL titles", status: "Active", wins: "6", teamType: "FOOTBALL" },
    { id: 7, teamName: "PSG", country: "France", city: "Paris", achievements: "0 UCL titles", status: "Active", wins: "10", teamType: "FOOTBALL" },
    { id: 8, teamName: "Juventus", country: "Italy", city: "Turin", achievements: "2 UCL titles", status: "Active", wins: "36", teamType: "FOOTBALL" },
    { id: 9, teamName: "AC Milan", country: "Italy", city: "Milan", achievements: "7 UCL titles", status: "Active", wins: "18", teamType: "FOOTBALL" },
    { id: 10, teamName: "Inter Milan", country: "Italy", city: "Milan", achievements: "3 UCL titles", status: "Active", wins: "19", teamType: "FOOTBALL" },
    { id: 11, teamName: "Arsenal", country: "England", city: "London", achievements: "0 UCL titles", status: "Active", wins: "13", teamType: "FOOTBALL" },
    { id: 12, teamName: "Borussia Dortmund", country: "Germany", city: "Dortmund", achievements: "1 UCL title", status: "Active", wins: "8", teamType: "FOOTBALL" },
    { id: 13, teamName: "Ajax", country: "Netherlands", city: "Amsterdam", achievements: "4 UCL titles", status: "Active", wins: "36", teamType: "FOOTBALL" },
    { id: 14, teamName: "FC Porto", country: "Portugal", city: "Porto", achievements: "2 UCL titles", status: "Active", wins: "29", teamType: "FOOTBALL" },
    { id: 15, teamName: "Atletico Madrid", country: "Spain", city: "Madrid", achievements: "0 UCL titles", status: "Active", wins: "11", teamType: "FOOTBALL" },
    { id: 16, teamName: "Marseille", country: "France", city: "Marseille", achievements: "1 UCL title", status: "Active", wins: "9", teamType: "FOOTBALL" },
];

const mockUsers = [
    { id: 1, firstName: "John", lastName: "Doe", userLogin: "johndoe", createdAt: "2024-01-15T10:00:00.000Z", email: "johndoe@example.com" },
    { id: 2, firstName: "Jane", lastName: "Smith", userLogin: "janesmith", createdAt: "2024-01-20T15:30:00.000Z", email: "janesmith@example.com" },
    { id: 3, firstName: "Alex", lastName: "Johnson", userLogin: "alexj", createdAt: "2024-02-05T09:15:00.000Z", email: "alexj@example.com" },
    { id: 4, firstName: "Maria", lastName: "Garcia", userLogin: "mariag", createdAt: "2024-02-10T14:45:00.000Z", email: "mariag@example.com" },
    { id: 5, firstName: "David", lastName: "Brown", userLogin: "davidb", createdAt: "2024-02-15T11:20:00.000Z", email: "davidb@example.com" },
    { id: 6, firstName: "Emma", lastName: "Wilson", userLogin: "emmaw", createdAt: "2024-02-20T16:40:00.000Z", email: "emmaw@example.com" },
    { id: 7, firstName: "Michael", lastName: "Taylor", userLogin: "michaelt", createdAt: "2024-03-01T10:30:00.000Z", email: "michaelt@example.com" },
    { id: 8, firstName: "Sophia", lastName: "Martinez", userLogin: "sophiam", createdAt: "2024-03-05T13:15:00.000Z", email: "sophiam@example.com" },
    { id: 9, firstName: "James", lastName: "Anderson", userLogin: "jamesa", createdAt: "2024-03-10T09:50:00.000Z", email: "jamesa@example.com" },
    { id: 10, firstName: "Olivia", lastName: "Thomas", userLogin: "oliviat", createdAt: "2024-03-15T15:00:00.000Z", email: "oliviat@example.com" },
    { id: 11, firstName: "Robert", lastName: "Jackson", userLogin: "robertj", createdAt: "2024-03-20T11:45:00.000Z", email: "robertj@example.com" },
    { id: 12, firstName: "Emily", lastName: "White", userLogin: "emilyw", createdAt: "2024-03-25T14:20:00.000Z", email: "emilyw@example.com" },
    { id: 13, firstName: "William", lastName: "Harris", userLogin: "williamh", createdAt: "2024-04-01T10:10:00.000Z", email: "williamh@example.com" },
    { id: 14, firstName: "Ava", lastName: "Clark", userLogin: "avac", createdAt: "2024-04-05T16:30:00.000Z", email: "avac@example.com" },
    { id: 15, firstName: "Daniel", lastName: "Lewis", userLogin: "daniell", createdAt: "2024-04-10T12:00:00.000Z", email: "daniell@example.com" },
    { id: 16, firstName: "Isabella", lastName: "Walker", userLogin: "isabellaw", createdAt: "2024-04-15T09:40:00.000Z", email: "isabellaw@example.com" },
];

// ======= STYLED COMPONENTS ========
const EventCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
    },
}));

const TeamBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
        boxShadow: theme.shadows[8],
        backgroundColor: alpha(theme.palette.background.paper, 1),
    },
}));

const GradientDivider = styled(Divider)(({ theme }) => ({
    background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    height: '2px',
    margin: theme.spacing(3, 0),
}));

const BracketMatchup = styled(Box)(({ theme, selected }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    backgroundColor: selected ? alpha(theme.palette.primary.light, 0.2) : theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: selected ? `0 0 0 2px ${theme.palette.primary.main}` : theme.shadows[2],
    width: '220px',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: theme.shadows[6],
        transform: 'translateY(-2px)'
    }
}));

const BracketRound = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: -12,
        width: '2px',
        background: `linear-gradient(to bottom, transparent 10%, ${theme.palette.divider} 10%, ${theme.palette.divider} 90%, transparent 90%)`,
        zIndex: 0
    },
    '&:last-child::after': {
        display: 'none'
    }
}));

const BracketContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflowX: 'auto',
    padding: theme.spacing(4, 2),
    gap: theme.spacing(5),
    '&::-webkit-scrollbar': {
        height: '8px',
        backgroundColor: theme.palette.action.hover
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.primary.light,
        borderRadius: '4px'
    }
}));

const TeamSearchCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease',
    borderLeft: `3px solid transparent`,
    '&:hover': {
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        backgroundColor: alpha(theme.palette.primary.light, 0.05),
        transform: 'translateX(4px)'
    }
}));

const EventInfoSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

const ActionButton = styled(Button)(({ theme, color = 'primary' }) => ({
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: 'none',
    transition: 'all 0.2s',
    '&:hover': {
        boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.2)}`,
        transform: 'translateY(-2px)'
    }
}));

const SummaryCard = styled(Card)(({ theme }) => ({
    position: 'sticky',
    top: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
    overflow: 'visible',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        borderTopLeftRadius: theme.shape.borderRadius * 1.5,
        borderTopRightRadius: theme.shape.borderRadius * 1.5
    }
}));

// ======= UTILITY COMPONENTS ========
const EventInfoFields = ({ eventName, setEventName, eventDate, setEventDate, eventLocation, setEventLocation }) => (
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6) }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Event Information
        </Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <TextField
                    label="Event Name"
                    variant="outlined"
                    fullWidth
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    InputProps={{
                        startAdornment: <EmojiEvents sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    label="Event Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    InputProps={{
                        startAdornment: <CalendarMonth sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    label="Event Location"
                    variant="outlined"
                    fullWidth
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    InputProps={{
                        startAdornment: <LocationOn sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                    }}
                />
            </Grid>
        </Grid>
    </Box>
);

const StatusChip = ({ status }) => {
    let color = 'default';
    switch (status?.toLowerCase()) {
        case 'active': color = 'success'; break;
        case 'pending': color = 'warning'; break;
        case 'completed': color = 'info'; break;
        case 'inactive': color = 'error'; break;
        default: color = 'default';
    }

    return <Chip size="small" label={status} color={color} sx={{ fontWeight: 500 }} />;
};

const TeamListItem = ({ team, onRemove, rankNumber }) => (
    <Box sx={{ py: 1, borderBottom: '1px solid #f0f0f0', '&:hover': { bgcolor: '#f5f5f5' } }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={1}>
                <Typography variant="body2" fontWeight={500}>{rankNumber}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <SportsSoccer sx={{ mr: 1, color: 'primary.main' }} fontSize="small" />
                <Typography noWrap sx={{ fontWeight: 500 }}>{team.teamName}</Typography>
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Flag sx={{ mr: 1, fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2">{team.country}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="body2">{team.city}</Typography>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <Chip size="small" label={team.wins} color="primary" variant="outlined" />
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'right' }}>
                <Tooltip title="Remove team">
                    <IconButton size="small" onClick={() => onRemove(team.id)} color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    </Box>
);

const TeamSearchResult = ({ team, onAdd, disabled = false }) => (
    <TeamSearchCard elevation={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{team.teamName}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Flag sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {team.country}, {team.city}
                    </Typography>
                </Box>
            </Box>
            <Tooltip title={disabled ? "Team already added" : "Add team"}>
                <span>
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={disabled ? <Check /> : <Add />}
                        disabled={disabled}
                        onClick={() => onAdd(team.id)}
                        sx={{ minWidth: 90 }}
                    >
                        {disabled ? 'Added' : 'Add'}
                    </Button>
                </span>
            </Tooltip>
        </Box>
    </TeamSearchCard>
);

const NoContent = ({ message }) => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
            {message}
        </Typography>
    </Box>
);

// ======= BASIC EVENT COMPONENT ========
export default  function BasicEventComponent()  {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [participants, setParticipants] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const addParticipant = () => {
        if (selectedUser) {
            const user = mockUsers.find(u => u.id === parseInt(selectedUser));
            if (user && !participants.some(u => u.id === user.id)) {
                setParticipants([...participants, user]);
                handleSnackbar(`${user.firstName} ${user.lastName} added successfully`);
            }
            setSelectedUser('');
        }
    };

    const removeParticipant = (userId) => {
        const user = mockUsers.find(u => u.id === userId);
        setParticipants(participants.filter(user => user.id !== userId));
        if (user) {
            handleSnackbar(`${user.firstName} ${user.lastName} removed`, 'info');
        }
    };

    const saveEvent = () => {
        if (!eventName) {
            handleSnackbar('Please enter an event name', 'error');
            return;
        }
        if (!eventDate) {
            handleSnackbar('Please select an event date', 'error');
            return;
        }
        if (participants.length === 0) {
            handleSnackbar('Please add at least one participant', 'error');
            return;
        }

        // In a real scenario, this would be an API call
        handleSnackbar('Basic event created successfully!', 'success');

        // Clear form (optional)
        // setEventName('');
        // setEventDate('');
        // setEventLocation('');
        // setParticipants([]);
    };

    const filteredUsers = mockUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userLogin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <EventCard>
                <EventInfoFields
                    eventName={eventName}
                    setEventName={setEventName}
                    eventDate={eventDate}
                    setEventDate={setEventDate}
                    eventLocation={eventLocation}
                    setEventLocation={setEventLocation}
                />

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PeopleAlt color="primary" />
                                Participants Management
                            </Typography>

                            <Box sx={{ mb: 3, display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: 2 }}>
                                <TextField
                                    label="Search users"
                                    variant="outlined"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Search color="action" sx={{ mr: 1 }} />
                                    }}
                                />

                                <FormControl variant="outlined" sx={{ minWidth: {xs: '100%', sm: 220} }}>
                                    <InputLabel id="user-select-label">Select user</InputLabel>
                                    <Select
                                        labelId="user-select-label"
                                        id="user-select"
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        label="Select user"
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {filteredUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.firstName} {user.lastName} ({user.userLogin})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <ActionButton
                                    variant="contained"
                                    color="primary"
                                    onClick={addParticipant}
                                    startIcon={<Add />}
                                    disabled={!selectedUser}
                                    sx={{ whiteSpace: 'nowrap', px: 3 }}
                                >
                                    Add User
                                </ActionButton>
                            </Box>

                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                Participants ({participants.length})
                            </Typography>

                            <Paper variant="outlined" sx={{ maxHeight: '400px', overflow: 'auto', borderRadius: 2 }}>
                                {participants.length > 0 ? (
                                    <List disablePadding>
                                        {participants.map((user) => (
                                            <ListItem
                                                key={user.id}
                                                divider
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={() => removeParticipant(user.id)} color="error" size="small">
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {user.firstName} {user.lastName}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {user.email}
                                                            </Typography>
                                                            <Chip
                                                                label={user.userLogin}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                                            />
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <NoContent message="No participants added yet" />
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <SummaryCard elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Event Summary
                                    </Typography>

                                    <Box sx={{ mt: 2, mb: 3 }}>
                                        <EventInfoSection>
                                            <EmojiEvents color="primary" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Event Name
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {eventName || "Not specified"}
                                                </Typography>
                                            </Box>
                                        </EventInfoSection>

                                        <EventInfoSection>
                                            <CalendarMonth color="primary" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Event Date
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {eventDate || "Not specified"}
                                                </Typography>
                                            </Box>
                                        </EventInfoSection>

                                        <EventInfoSection>
                                            <LocationOn color="primary" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Location
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {eventLocation || "Not specified"}
                                                </Typography>
                                            </Box>
                                        </EventInfoSection>

                                        <EventInfoSection>
                                            <PeopleAlt color="primary" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Participants
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {participants.length} {participants.length === 1 ? 'person' : 'people'}
                                                </Typography>
                                            </Box>
                                        </EventInfoSection>
                                    </Box>

                                    <GradientDivider />

                                    {(!eventName || !eventDate || participants.length === 0) && (
                                        <Alert severity="info" sx={{ mb: 2 }} variant="outlined">
                                            <Typography variant="body2">
                                                Please complete all required fields to create your event.
                                            </Typography>
                                        </Alert>
                                    )}

                                    <ActionButton
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        onClick={saveEvent}
                                        startIcon={<Save />}
                                        disabled={!eventName || !eventDate || participants.length === 0}
                                        sx={{ mt: 2 }}
                                    >
                                        Create Event
                                    </ActionButton>

                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                                        This event can be started immediately after creation
                                    </Typography>
                                </CardContent>
                            </SummaryCard>
                        </Grid>
                    </Grid>
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </EventCard>
        </AppTheme>
    );
};