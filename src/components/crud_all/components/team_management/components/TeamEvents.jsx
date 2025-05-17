import * as React from 'react';
import {
    Box,
    CircularProgress,
    Grid,
    Paper,
    Typography,
    Chip,
    Card,
    CardContent,
    CardActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Divider
} from '@mui/material';
import {
    SportsBasketball,
    SportsSoccer,
    SportsTennis,
    SportsHockey,
    SportsVolleyball
} from '@mui/icons-material';


// Helper function to get sport icon
const getSportIcon = (sportType) => {
    switch (sportType) {
        case 'FOOTBALL':
            return <SportsSoccer />;
        case 'BASKETBALL':
            return <SportsBasketball />;
        case 'TENNIS':
            return <SportsTennis />;
        case 'HOCKEY':
            return <SportsHockey />;
        case 'VOLLEYBALL':
            return <SportsVolleyball />;
        default:
            return <SportsSoccer />;
    }
};

// Mock API endpoints (you'll replace these with real endpoints)
const API_URL = "http://localhost:8080";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

// Mock data for testing
const mockUserTeams = [
    { id: 1, teamName: 'FC Barcelona', teamType: 'FOOTBALL', status: 'Active team', country: 'Spain', city: 'Barcelona' },
    { id: 2, teamName: 'LA Lakers', teamType: 'BASKETBALL', status: 'Active team', country: 'United States', city: 'Los Angeles' },
    { id: 3, teamName: 'Tennis Club', teamType: 'TENNIS', status: 'Active team', country: 'France', city: 'Paris' }
];

// Team Events component
export const TeamEvents = () => {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [userTeams, setUserTeams] = React.useState([]);
    const [selectedTeam, setSelectedTeam] = React.useState('');

    // Mock events data
    const mockEvents = [
        {
            id: 1,
            title: 'Team Practice',
            teamId: 1,
            date: '2023-10-20',
            time: '14:00',
            location: 'Main Stadium',
            description: 'Regular practice session focusing on defensive strategies.',
            status: 'upcoming'
        },
        {
            id: 2,
            title: 'Championship Game',
            teamId: 1,
            date: '2023-10-25',
            time: '19:30',
            location: 'Central Arena',
            description: 'Final game of the season against main rivals.',
            status: 'upcoming'
        },
        {
            id: 3,
            title: 'Team Meeting',
            teamId: 2,
            date: '2023-10-18',
            time: '10:00',
            location: 'Conference Room',
            description: 'Season review and planning meeting.',
            status: 'upcoming'
        },
        {
            id: 4,
            title: 'Friendly Match',
            teamId: 3,
            date: '2023-10-22',
            time: '16:00',
            location: 'Tennis Club',
            description: 'Friendly match with guest players.',
            status: 'upcoming'
        }
    ];

    React.useEffect(() => {
        // In a real app, fetch user teams from API
        const fetchUserTeams = async () => {
            try {
                // const response = await fetch(`${API_URL}/team/user`, {
                //   headers: getHeaders(),
                // });
                // const data = await response.json();
                // setUserTeams(data);
                setUserTeams(mockUserTeams);
            } catch (error) {
                console.error('Error fetching user teams:', error);
                setUserTeams(mockUserTeams); // Fallback to mock data
            }
        };

        fetchUserTeams();
    }, []);

    React.useEffect(() => {
        if (selectedTeam) {
            fetchEvents();
        }
    }, [selectedTeam]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // In a real implementation, fetch from API
            // const response = await fetch(`${API_URL}/team/${selectedTeam}/events`, {
            //   headers: getHeaders(),
            // });
            // const data = await response.json();
            // setEvents(data);

            // Mock data for testing
            setTimeout(() => {
                setEvents(mockEvents.filter(event => event.teamId === parseInt(selectedTeam)));
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]); // Clear on error
            setLoading(false);
        }
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Team Events
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="team-select-events-label">Select Team</InputLabel>
                    <Select
                        labelId="team-select-events-label"
                        value={selectedTeam}
                        label="Select Team"
                        onChange={handleTeamChange}
                        startAdornment={userTeams.length > 0 && selectedTeam &&
                            React.cloneElement(
                                getSportIcon(userTeams.find(team => team.id === parseInt(selectedTeam))?.teamType || 'FOOTBALL'),
                                { style: { marginRight: 8 } }
                            )
                        }
                    >
                        {userTeams.map((team) => (
                            <MenuItem key={team.id} value={team.id}>
                                {team.teamName} ({team.teamType})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : !selectedTeam ? (
                    <Alert severity="info">Please select a team to view its events</Alert>
                ) : events.length === 0 ? (
                    <Alert severity="info">No events found for this team</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {events.map((event) => (
                            <Grid item xs={12} md={6} key={event.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {event.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="textSecondary">
                                                Date: {event.date}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Time: {event.time}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Location: {event.location}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2">
                                            {event.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Chip
                                            label={event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                                            color={event.status === 'upcoming' ? 'primary' : 'default'}
                                            size="small"
                                        />
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default {
    TeamEvents
};