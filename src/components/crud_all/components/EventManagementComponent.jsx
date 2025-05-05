import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
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
    Container
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
    Save
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Mock data for demonstration
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

// Custom styled components
const TeamBox = styled(Box)(({ theme }) => ({
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#f9f9f9',
}));

const BracketMatchup = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '8px',
    marginBottom: '8px',
    backgroundColor: 'white',
    width: '200px',
}));

const BracketLine = styled(Box)(({ theme }) => ({
    height: '2px',
    backgroundColor: '#e0e0e0',
    width: '20px',
}));

const BracketConnector = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const EventManagementComponent = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [basicEventUsers, setBasicEventUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [teamA, setTeamA] = useState(null);
    const [teamB, setTeamB] = useState(null);
    const [tableTeams, setTableTeams] = useState([]);
    const [playoffTeams, setPlayoffTeams] = useState([]);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const addUserToBasicEvent = () => {
        if (selectedUser) {
            const user = mockUsers.find(u => u.id === parseInt(selectedUser));
            if (user && !basicEventUsers.some(u => u.id === user.id)) {
                setBasicEventUsers([...basicEventUsers, user]);
            }
            setSelectedUser('');
        }
    };

    const removeUserFromBasicEvent = (userId) => {
        setBasicEventUsers(basicEventUsers.filter(user => user.id !== userId));
    };

    const selectTeamA = (teamId) => {
        const team = mockTeams.find(t => t.id === teamId);
        setTeamA(team);
    };

    const selectTeamB = (teamId) => {
        const team = mockTeams.find(t => t.id === teamId);
        setTeamB(team);
    };

    const addTeamToTable = (teamId) => {
        const team = mockTeams.find(t => t.id === teamId);
        if (team && !tableTeams.some(t => t.id === team.id) && tableTeams.length < 20) {
            setTableTeams([...tableTeams, team]);
        }
    };

    const removeTeamFromTable = (teamId) => {
        setTableTeams(tableTeams.filter(team => team.id !== teamId));
    };

    const addTeamToPlayoff = (teamId) => {
        const team = mockTeams.find(t => t.id === teamId);
        if (team && !playoffTeams.some(t => t.id === team.id)) {
            setPlayoffTeams([...playoffTeams, team]);
        }
    };

    const removeTeamFromPlayoff = (teamId) => {
        setPlayoffTeams(playoffTeams.filter(team => team.id !== teamId));
    };

    const filteredTeams = mockTeams.filter(team =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = mockUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userLogin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePlayoffBracket = () => {
        if (playoffTeams.length < 16) return null;

        // Take first 16 teams for the bracket
        const bracketTeams = playoffTeams.slice(0, 16);

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
                <Typography variant="h6" gutterBottom>Playoff Bracket</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    {/* Round of 16 */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>Round of 16</Typography>
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <BracketMatchup key={`r16-${idx}`}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>{bracketTeams[idx*2]?.teamName}</Typography>
                                    <Chip label="1" size="small" color="primary" sx={{ ml: 1 }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>{bracketTeams[idx*2+1]?.teamName}</Typography>
                                    <Chip label="0" size="small" sx={{ ml: 1 }} />
                                </Box>
                            </BracketMatchup>
                        ))}
                    </Box>

                    {/* Quarter Finals */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>Quarter Finals</Typography>
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <BracketMatchup key={`qf-${idx}`}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>{bracketTeams[idx*2]?.teamName}</Typography>
                                    <Chip label="?" size="small" color="primary" sx={{ ml: 1 }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>TBD</Typography>
                                    <Chip label="?" size="small" sx={{ ml: 1 }} />
                                </Box>
                            </BracketMatchup>
                        ))}
                    </Box>

                    {/* Semi Finals */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>Semi Finals</Typography>
                        {Array.from({ length: 2 }).map((_, idx) => (
                            <BracketMatchup key={`sf-${idx}`}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>TBD</Typography>
                                    <Chip label="?" size="small" color="primary" sx={{ ml: 1 }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>TBD</Typography>
                                    <Chip label="?" size="small" sx={{ ml: 1 }} />
                                </Box>
                            </BracketMatchup>
                        ))}
                    </Box>

                    {/* Final */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
                        <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>Final</Typography>
                        <BracketMatchup>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>TBD</Typography>
                                <Chip label="?" size="small" color="primary" sx={{ ml: 1 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: '140px' }}>TBD</Typography>
                                <Chip label="?" size="small" sx={{ ml: 1 }} />
                            </Box>
                        </BracketMatchup>

                        <Box sx={{ mt: 8 }}>
                            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ textAlign: 'center' }}>Champion</Typography>
                                    <Typography variant="body1" sx={{ textAlign: 'center' }}>TBD</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    };

    const renderTeamTable = () => {
        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Tournament Table
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2} sx={{ fontWeight: 'bold', pb: 1, borderBottom: '1px solid #e0e0e0' }}>
                            <Grid item xs={1}>#</Grid>
                            <Grid item xs={4}>Team</Grid>
                            <Grid item xs={2}>Country</Grid>
                            <Grid item xs={2}>City</Grid>
                            <Grid item xs={2}>Wins</Grid>
                            <Grid item xs={1}>Actions</Grid>
                        </Grid>

                        {tableTeams.map((team, index) => (
                            <Grid container spacing={2} key={team.id} sx={{ py: 1, borderBottom: '1px solid #f0f0f0', '&:hover': { bgcolor: '#f5f5f5' } }}>
                                <Grid item xs={1}>{index + 1}</Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SportsSoccer sx={{ mr: 1, color: 'primary.main' }} />
                                    {team.teamName}
                                </Grid>
                                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Flag sx={{ mr: 1, fontSize: 16 }} />
                                    {team.country}
                                </Grid>
                                <Grid item xs={2}>{team.city}</Grid>
                                <Grid item xs={2}>{team.wins}</Grid>
                                <Grid item xs={1}>
                                    <IconButton size="small" onClick={() => removeTeamFromTable(team.id)} color="error">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        {tableTeams.length === 0 && (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No teams added to the tournament yet
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="event management tabs">
                        <Tab label="Basic Event" icon={<PersonAdd />} iconPosition="start" />
                        <Tab label="Two-side Event" icon={<Group />} iconPosition="start" />
                        <Tab label="Table Tournament" icon={<SportsSoccer />} iconPosition="start" />
                        <Tab label="Playoff Tournament" icon={<EmojiEvents />} iconPosition="start" />
                    </Tabs>
                </Box>

                {/* Common Event Info Fields */}
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Event Name"
                                variant="outlined"
                                fullWidth
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Event Date"
                                type="date"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Basic Event */}
                {activeTab === 0 && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Add Participants to Basic Event
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <TextField
                                        label="Search Users"
                                        variant="outlined"
                                        fullWidth
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{ mr: 1 }}
                                    />
                                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                        <InputLabel id="user-select-label">Select User</InputLabel>
                                        <Select
                                            labelId="user-select-label"
                                            id="user-select"
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                            label="Select User"
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {filteredUsers.map((user) => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.firstName} {user.lastName} ({user.userLogin})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={addUserToBasicEvent}
                                        startIcon={<Add />}
                                        sx={{ ml: 1 }}
                                        disabled={!selectedUser}
                                    >
                                        Add
                                    </Button>
                                </Box>

                                <Typography variant="subtitle1" gutterBottom>
                                    Participants ({basicEventUsers.length})
                                </Typography>

                                <List>
                                    {basicEventUsers.map((user) => (
                                        <ListItem
                                            key={user.id}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => removeUserFromBasicEvent(user.id)} color="error">
                                                    <Delete />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${user.firstName} ${user.lastName}`}
                                                secondary={user.email}
                                            />
                                        </ListItem>
                                    ))}

                                    {basicEventUsers.length === 0 && (
                                        <Box sx={{ py: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No participants added yet
                                            </Typography>
                                        </Box>
                                    )}
                                </List>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Event Summary
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Event Type:</strong> Two-side Event
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Team A:</strong> {teamA ? teamA.teamName : 'Not selected'}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Team B:</strong> {teamB ? teamB.teamName : 'Not selected'}
                                    </Typography>

                                    {(!teamA || !teamB) && (
                                        <Alert severity="warning" sx={{ mt: 2 }}>
                                            Please select both teams to complete the setup
                                        </Alert>
                                    )}

                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={!teamA || !teamB}
                                        >
                                            Save Event
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Table Tournament */}
                {activeTab === 2 && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Table Tournament Setup
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <TextField
                                        label="Search Teams"
                                        variant="outlined"
                                        fullWidth
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{ mr: 1 }}
                                    />
                                </Box>

                                {tableTeams.length < 4 ? (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        You need at least 4 teams for a table tournament. Currently: {tableTeams.length}/4
                                    </Alert>
                                ) : tableTeams.length >= 20 ? (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Maximum team limit reached (20/20)
                                    </Alert>
                                ) : (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        Teams added: {tableTeams.length}/20
                                    </Alert>
                                )}

                                {renderTeamTable()}

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" gutterBottom>
                                    Available Teams
                                </Typography>

                                <Grid container spacing={2}>
                                    {filteredTeams
                                        .filter(team => !tableTeams.some(t => t.id === team.id))
                                        .map((team) => (
                                            <Grid item xs={12} sm={6} md={4} key={team.id}>
                                                <Paper sx={{ p: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
                                                    <Typography variant="subtitle2">{team.teamName}</Typography>
                                                    <Typography variant="body2">{team.country}, {team.city}</Typography>
                                                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<Add />}
                                                            disabled={tableTeams.length >= 20}
                                                            onClick={() => addTeamToTable(team.id)}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Tournament Summary
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Event Type:</strong> Table Tournament
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Teams:</strong> {tableTeams.length}/20
                                    </Typography>

                                    {tableTeams.length < 4 ? (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            You need at least 4 teams to save
                                        </Alert>
                                    ) : null}

                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={tableTeams.length < 4}
                                        >
                                            Save Tournament
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Playoff Tournament */}
                {activeTab === 3 && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Playoff Tournament Setup
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <TextField
                                        label="Search Teams"
                                        variant="outlined"
                                        fullWidth
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{ mr: 1 }}
                                    />
                                </Box>

                                {playoffTeams.length < 16 ? (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        You need at least 16 teams for a playoff tournament. Currently: {playoffTeams.length}/16
                                    </Alert>
                                ) : (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        Teams added: {playoffTeams.length}
                                    </Alert>
                                )}

                                {playoffTeams.length >= 16 && generatePlayoffBracket()}

                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <Paper sx={{ width: '100%', mb: 2 }}>
                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom component="div">
                                                Tournament Teams
                                            </Typography>
                                        </Box>
                                        <Box sx={{ p: 2 }}>
                                            <Grid container spacing={2} sx={{ fontWeight: 'bold', pb: 1, borderBottom: '1px solid #e0e0e0' }}>
                                                <Grid item xs={1}>#</Grid>
                                                <Grid item xs={4}>Team</Grid>
                                                <Grid item xs={2}>Country</Grid>
                                                <Grid item xs={2}>City</Grid>
                                                <Grid item xs={2}>Wins</Grid>
                                                <Grid item xs={1}>Actions</Grid>
                                            </Grid>

                                            {playoffTeams.map((team, index) => (
                                                <Grid container spacing={2} key={team.id} sx={{ py: 1, borderBottom: '1px solid #f0f0f0', '&:hover': { bgcolor: '#f5f5f5' } }}>
                                                    <Grid item xs={1}>{index + 1}</Grid>
                                                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <SportsSoccer sx={{ mr: 1, color: 'primary.main' }} />
                                                        {team.teamName}
                                                    </Grid>
                                                    <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Flag sx={{ mr: 1, fontSize: 16 }} />
                                                        {team.country}
                                                    </Grid>
                                                    <Grid item xs={2}>{team.city}</Grid>
                                                    <Grid item xs={2}>{team.wins}</Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton size="small" onClick={() => removeTeamFromPlayoff(team.id)} color="error">
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ))}

                                            {playoffTeams.length === 0 && (
                                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        No teams added to the tournament yet
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Paper>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" gutterBottom>
                                    Available Teams
                                </Typography>

                                <Grid container spacing={2}>
                                    {filteredTeams
                                        .filter(team => !playoffTeams.some(t => t.id === team.id))
                                        .map((team) => (
                                            <Grid item xs={12} sm={6} md={4} key={team.id}>
                                                <Paper sx={{ p: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
                                                    <Typography variant="subtitle2">{team.teamName}</Typography>
                                                    <Typography variant="body2">{team.country}, {team.city}</Typography>
                                                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<Add />}
                                                            onClick={() => addTeamToPlayoff(team.id)}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Tournament Summary
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Event Type:</strong> Playoff Tournament
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Teams:</strong> {playoffTeams.length}/16 (minimum)
                                    </Typography>

                                    {playoffTeams.length < 16 ? (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            You need at least 16 teams to save
                                        </Alert>
                                    ) : null}

                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={playoffTeams.length < 16}
                                        >
                                            Save Tournament
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default EventManagementComponent;
/*

<Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
        Event Summary
    </Typography>
    <Typography variant="body2">
        <strong>Event Type:</strong> Basic Event
    </Typography>
    <Typography variant="body2">
        <strong>Total Participants:</strong> {basicEventUsers.length}
    </Typography>
    <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" fullWidth>
            Save Event
        </Button>
    </Box>
</Paper>
</Grid>
</Grid>
</Box>
)}

{/!* Two-side Event *!/}
{activeTab === 1 && (
    <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
            Two-side Event Setup
        </Typography>

        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                        label="Search Teams"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TeamBox>
                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <SportsSoccer sx={{ mr: 1 }} /> Team A
                            </Typography>

                            {teamA ? (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body1" fontWeight="bold">{teamA.teamName}</Typography>
                                        <IconButton color="error" onClick={() => setTeamA(null)}>
                                            <Cancel />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="body2">
                                        <strong>Country:</strong> {teamA.country}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>City:</strong> {teamA.city}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Wins:</strong> {teamA.wins}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No team selected
                                    </Typography>
                                </Box>
                            )}
                        </TeamBox>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TeamBox>
                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <SportsSoccer sx={{ mr: 1 }} /> Team B
                            </Typography>

                            {teamB ? (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body1" fontWeight="bold">{teamB.teamName}</Typography>
                                        <IconButton color="error" onClick={() => setTeamB(null)}>
                                            <Cancel />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="body2">
                                        <strong>Country:</strong> {teamB.country}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>City:</strong> {teamB.city}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Wins:</strong> {teamB.wins}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No team selected
                                    </Typography>
                                </Box>
                            )}
                        </TeamBox>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                    Available Teams
                </Typography>

                <Grid container spacing={2}>
                    {filteredTeams.map((team) => (
                        <Grid item xs={12} sm={6} md={4} key={team.id}>
                            <Paper sx={{ p: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
                                <Typography variant="subtitle2">{team.teamName}</Typography>
                                <Typography variant="body2">{team.country}, {team.city}</Typography>
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        disabled={teamA?.id === team.id || teamB?.id === team.id}
                                        onClick={() => selectTeamA(team.id)}
                                    >
                                        Team A
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        disabled={teamA?.id === team.id || teamB?.id === team.id}
                                        onClick={() => selectTeamB(team.id)}
                                    >
                                        Team B
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={12} md={4}>*/
