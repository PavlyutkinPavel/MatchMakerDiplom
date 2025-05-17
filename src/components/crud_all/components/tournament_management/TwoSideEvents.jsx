import React, { useState } from 'react';
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
    Alert,
    Card,
    CardContent,
    Container,
    Chip
} from '@mui/material';
import {
    PersonAdd,
    Delete,
    SportsSoccer,
    EmojiEvents,
    Add,
    Check,
    Flag,
    Save,
    Timer,
    PlayArrow
} from '@mui/icons-material';
import { styled } from '@mui/system';


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




// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
}));

const TeamBox = styled(Box)(({ theme }) => ({
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

// Two-Side Event Component
export default function TwoSideEventComponent() {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [teamA, setTeamA] = useState(null);
    const [teamB, setTeamB] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [canStart, setCanStart] = useState(false);

    const handleSelectTeam = (team, side) => {
        if (side === 'A') {
            setTeamA(team);
        } else {
            setTeamB(team);
        }
    };

    React.useEffect(() => {
        setCanStart(teamA && teamB && eventName && eventDate);
    }, [teamA, teamB, eventName, eventDate]);

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom color="primary">
                        Two-Side Event Setup
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Event Name"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Event Date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Select two teams for a head-to-head match. The event can start once both teams are assigned.
                            </Alert>
                            <TextField
                                fullWidth
                                label="Search Teams"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            backgroundColor: teamA ? 'primary.light' : 'background.paper',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            Team A
                                        </Typography>
                                        {teamA ? (
                                            <Box>
                                                <Typography variant="h5">{teamA.teamName}</Typography>
                                                <Typography color="textSecondary">
                                                    {teamA.city}, {teamA.country}
                                                </Typography>
                                                <Chip
                                                    icon={<EmojiEvents />}
                                                    label={teamA.achievements}
                                                    sx={{ mt: 1 }}
                                                />
                                                <Button
                                                    startIcon={<Delete />}
                                                    color="error"
                                                    onClick={() => setTeamA(null)}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Typography color="textSecondary">
                                                Select Team A
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            backgroundColor: teamB ? 'secondary.light' : 'background.paper',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            Team B
                                        </Typography>
                                        {teamB ? (
                                            <Box>
                                                <Typography variant="h5">{teamB.teamName}</Typography>
                                                <Typography color="textSecondary">
                                                    {teamB.city}, {teamB.country}
                                                </Typography>
                                                <Chip
                                                    icon={<EmojiEvents />}
                                                    label={teamB.achievements}
                                                    sx={{ mt: 1 }}
                                                />
                                                <Button
                                                    startIcon={<Delete />}
                                                    color="error"
                                                    onClick={() => setTeamB(null)}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Typography color="textSecondary">
                                                Select Team B
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save />}
                            disabled={!canStart}
                        >
                            Save Event
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PlayArrow />}
                            disabled={!canStart}
                        >
                            Start Event
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </AppTheme>
    );
};