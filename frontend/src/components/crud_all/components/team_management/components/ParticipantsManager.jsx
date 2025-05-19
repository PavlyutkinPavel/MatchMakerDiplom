import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Avatar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Snackbar,
    Tab,
    Tabs,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Card,
    CardContent,
    Divider,
    useTheme,
    useMediaQuery,
    Tooltip
} from '@mui/material';
import {
    Person as PersonIcon,
    PersonAdd as PersonAddIcon,
    Search as SearchIcon,
    Add as AddIcon,
    FilterList as FilterListIcon,
    SportsBasketball,
    SportsSoccer,
    SportsTennis,
    SportsHockey,
    SportsVolleyball,
    Mail as MailIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    Help as HelpIcon
} from '@mui/icons-material';
import { useDemoRouter } from '@toolpad/core/internal';

// Mock data for testing
const mockUserTeams = [
    { id: 1, teamName: 'FC Barcelona', teamType: 'FOOTBALL', status: 'Active team', country: 'Spain', city: 'Barcelona' },
    { id: 2, teamName: 'LA Lakers', teamType: 'BASKETBALL', status: 'Active team', country: 'United States', city: 'Los Angeles' },
    { id: 3, teamName: 'Tennis Club', teamType: 'TENNIS', status: 'Active team', country: 'France', city: 'Paris' }
];

const mockPlayers = [
    { id: 1, name: 'Lionel Messi', position: 'Forward', teamId: 1, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Argentina', age: 34, achievements: '7x Ballon d\'Or winner', stats: { goals: 672, assists: 301 } },
    { id: 2, name: 'LeBron James', position: 'Forward', teamId: 2, avatar: '/api/placeholder/50/50', isFriend: true, country: 'USA', age: 36, achievements: '4x NBA Champion', stats: { points: 35000, assists: 9500 } },
    { id: 3, name: 'Rafael Nadal', position: 'Player', teamId: 3, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Spain', age: 35, achievements: '21x Grand Slam winner', stats: { titles: 90, winPercentage: 83.2 } },
    { id: 4, name: 'Cristiano Ronaldo', position: 'Forward', teamId: 1, avatar: '/api/placeholder/50/50', isFriend: true, country: 'Portugal', age: 36, achievements: '5x Ballon d\'Or winner', stats: { goals: 701, assists: 220 } },
    { id: 5, name: 'Stephen Curry', position: 'Guard', teamId: 2, avatar: '/api/placeholder/50/50', isFriend: false, country: 'USA', age: 33, achievements: '3x NBA Champion', stats: { points: 18000, threePointers: 2800 } }
];

const mockCoaches = [
    { id: 101, name: 'Pep Guardiola', position: 'Head Coach', teamId: 1, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Spain', experience: '15 years', achievements: '3x Champions League winner', specialty: 'Possession football' },
    { id: 102, name: 'Frank Vogel', position: 'Head Coach', teamId: 2, avatar: '/api/placeholder/50/50', isFriend: true, country: 'USA', experience: '10 years', achievements: '1x NBA Champion', specialty: 'Defense' },
    { id: 103, name: 'Carlos Moya', position: 'Head Coach', teamId: 3, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Spain', experience: '8 years', achievements: 'Former World No.1', specialty: 'Clay court tennis' }
];

// Mock data for available participants to invite
const mockAvailableParticipants = [
    { id: 201, name: 'Kevin De Bruyne', role: 'player', position: 'Midfielder', country: 'Belgium', age: 30, avatar: '/api/placeholder/50/50' },
    { id: 202, name: 'Kawhi Leonard', role: 'player', position: 'Forward', country: 'USA', age: 30, avatar: '/api/placeholder/50/50' },
    { id: 203, name: 'Jürgen Klopp', role: 'coach', position: 'Head Coach', country: 'Germany', experience: '20 years', avatar: '/api/placeholder/50/50' },
    { id: 204, name: 'Novak Djokovic', role: 'player', position: 'Player', country: 'Serbia', age: 34, avatar: '/api/placeholder/50/50' },
    { id: 205, name: 'Steve Kerr', role: 'coach', position: 'Head Coach', country: 'USA', experience: '8 years', avatar: '/api/placeholder/50/50' }
];

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

// Participants Manager Component
export const ParticipantsManager = ({ compact = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useDemoRouter();
    const [userTeams, setUserTeams] = React.useState([]);
    const [participants, setParticipants] = React.useState([]);
    const [selectedTeam, setSelectedTeam] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [tabValue, setTabValue] = React.useState(0);
    const [openInviteDialog, setOpenInviteDialog] = React.useState(false);
    const [inviteList, setInviteList] = React.useState([]);
    const [selectedInvites, setSelectedInvites] = React.useState([]);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [filterType, setFilterType] = React.useState('all');

    React.useEffect(() => {
        // In a real app, fetch user teams from API
        const fetchUserTeams = async () => {
            try {
                // Simulating API call
                setLoading(true);
                setTimeout(() => {
                    setUserTeams(mockUserTeams);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error fetching user teams:', error);
                setUserTeams(mockUserTeams); // Fallback to mock data
                setLoading(false);
            }
        };

        fetchUserTeams();
    }, []);

    React.useEffect(() => {
        if (selectedTeam) {
            fetchParticipants();
        }
    }, [selectedTeam, tabValue, filterType]);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            // In a real implementation, fetch from API
            setTimeout(() => {
                let result = [];

                if (filterType === 'player' || filterType === 'all') {
                    result = [...result, ...mockPlayers.filter(p => p.teamId === parseInt(selectedTeam))];
                }

                if (filterType === 'coach' || filterType === 'all') {
                    result = [...result, ...mockCoaches.filter(c => c.teamId === parseInt(selectedTeam))];
                }

                setParticipants(result);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error('Error fetching participants:', error);
            setParticipants([]); // Clear on error
            setLoading(false);
        }
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset to first page on new search
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenInviteDialog = () => {
        setInviteList(mockAvailableParticipants);
        setOpenInviteDialog(true);
    };

    const handleCloseInviteDialog = () => {
        setOpenInviteDialog(false);
        setSelectedInvites([]);
    };

    const handleSelectInvite = (participantId) => {
        setSelectedInvites(prevSelected => {
            if (prevSelected.includes(participantId)) {
                return prevSelected.filter(id => id !== participantId);
            } else {
                return [...prevSelected, participantId];
            }
        });
    };

    const handleSendInvites = () => {
        // In a real implementation, call API to send invites
        setSnackbar({
            open: true,
            message: `Successfully sent ${selectedInvites.length} invitation${selectedInvites.length !== 1 ? 's' : ''}!`,
            severity: 'success'
        });
        handleCloseInviteDialog();
    };

    const handleAddFriend = async (participantId) => {
        try {
            // In a real implementation, call API
            // Update local state (mock implementation)
            setParticipants(participants.map(p =>
                p.id === participantId ? { ...p, isFriend: true } : p
            ));

            setSnackbar({
                open: true,
                message: 'Friend added successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding friend:', error);
            setSnackbar({
                open: true,
                message: 'Failed to add friend. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Filter participants based on search query
    const filteredParticipants = participants.filter(participant =>
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (participant.position && participant.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (participant.country && participant.country.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Paginate participants
    const displayedParticipants = filteredParticipants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Helper function to determine if a participant is a player or coach
    const getParticipantType = (participant) => {
        return participant.hasOwnProperty('age') ? 'player' : 'coach';
    };

    const renderDetailInfo = (participant) => {
        const participantType = getParticipantType(participant);

        if (participantType === 'player') {
            return (
                <>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">Achievements</Typography>
                        <Typography variant="body2">{participant.achievements}</Typography>
                    </Box>
                    {participant.stats && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">Key Stats</Typography>
                            <Grid container spacing={1}>
                                {Object.entries(participant.stats).map(([key, value]) => (
                                    <Grid item key={key}>
                                        <Chip
                                            size="small"
                                            label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                                            color="info"
                                            variant="outlined"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </>
            );
        } else {
            return (
                <>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">Achievements</Typography>
                        <Typography variant="body2">{participant.achievements}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">Specialty</Typography>
                        <Typography variant="body2">{participant.specialty}</Typography>
                    </Box>
                </>
            );
        }
    };

    // Compact view with cards
    const renderCompactView = () => {
        return (
            <Grid container spacing={2}>
                {displayedParticipants.map((participant) => {
                    const participantType = getParticipantType(participant);
                    return (
                        <Grid item xs={12} sm={6} md={4} key={participant.id}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar src={participant.avatar} alt={participant.name} sx={{ width: 50, height: 50, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h6">{participant.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {participant.position} • {participant.country}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        {participantType === 'player' ? `Age: ${participant.age}` : `Experience: ${participant.experience}`}
                                    </Typography>
                                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                        <Chip
                                            size="small"
                                            label={participantType === 'player' ? 'Player' : 'Coach'}
                                            color={participantType === 'player' ? 'primary' : 'secondary'}
                                        />
                                        {participant.isFriend ? (
                                            <Chip
                                                size="small"
                                                label="Friend"
                                                color="success"
                                                icon={<PersonIcon />}
                                            />
                                        ) : (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<PersonAddIcon />}
                                                onClick={() => handleAddFriend(participant.id)}
                                            >
                                                Add Friend
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    // Full view with table
    const renderFullView = () => {
        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>
                                {filterType === 'player' || filterType === 'all' ? 'Age' : 'Experience'}
                            </TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedParticipants.map((participant) => {
                            const participantType = getParticipantType(participant);
                            return (
                                <TableRow key={participant.id} hover>
                                    <TableCell>
                                        <Avatar src={participant.avatar} alt={participant.name} />
                                    </TableCell>
                                    <TableCell>{participant.name}</TableCell>
                                    <TableCell>{participant.position}</TableCell>
                                    <TableCell>{participant.country}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={participantType === 'player' ? 'Player' : 'Coach'}
                                            color={participantType === 'player' ? 'primary' : 'secondary'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {participantType === 'player' ? participant.age : participant.experience}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end">
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    sx={{ mr: 1 }}
                                                    onClick={() => {
                                                        setSnackbar({
                                                            open: true,
                                                            message: `Viewing details for ${participant.name}`,
                                                            severity: 'info'
                                                        });
                                                    }}
                                                >
                                                    <HelpIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            {participant.isFriend ? (
                                                <Chip
                                                    size="small"
                                                    label="Friend"
                                                    color="success"
                                                    icon={<PersonIcon />}
                                                />
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<PersonAddIcon />}
                                                    onClick={() => handleAddFriend(participant.id)}
                                                >
                                                    Add Friend
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box sx={{ padding: compact ? 0 : 2 }}>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                    <Typography variant="h5" component="h2">
                        Participants Manager
                    </Typography>
                    {!compact && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenInviteDialog}
                        >
                            Invite Participants
                        </Button>
                    )}
                </Box>

                <Grid container spacing={2} alignItems="center" marginBottom={2}>
                    <Grid item xs={12} md={compact ? 6 : 4}>
                        <FormControl fullWidth size={compact ? "small" : "medium"}>
                            <InputLabel id="team-select-label">Select Team</InputLabel>
                            <Select
                                labelId="team-select-label"
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
                    </Grid>
                    <Grid item xs={12} md={compact ? 6 : 5}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Search Participants"
                            size={compact ? "small" : "medium"}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Search by name, position, country..."
                        />
                    </Grid>
                    {!compact && (
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel id="filter-type-label">Filter By Type</InputLabel>
                                <Select
                                    labelId="filter-type-label"
                                    value={filterType}
                                    label="Filter By Type"
                                    onChange={handleFilterTypeChange}
                                    startIcon={<FilterListIcon />}
                                >
                                    <MenuItem value="all">All Participants</MenuItem>
                                    <MenuItem value="player">Players Only</MenuItem>
                                    <MenuItem value="coach">Coaches Only</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>

                {!compact && (
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="participant tabs">
                            <Tab label="Table View" />
                            <Tab label="Card View" />
                        </Tabs>
                    </Box>
                )}

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : !selectedTeam ? (
                    <Alert severity="info">Please select a team to view its participants</Alert>
                ) : displayedParticipants.length === 0 ? (
                    <Alert severity="info">No participants found matching your criteria</Alert>
                ) : (
                    <>
                        {compact || tabValue === 0 ? renderFullView() : renderCompactView()}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredParticipants.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>

            {/* Invite Dialog */}
            <Dialog open={openInviteDialog} onClose={handleCloseInviteDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Invite New Participants</Typography>
                        <IconButton edge="end" color="inherit" onClick={handleCloseInviteDialog} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText paragraph>
                        Select participants you would like to invite to your team:
                    </DialogContentText>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox"></TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inviteList.map((person) => (
                                    <TableRow
                                        key={person.id}
                                        hover
                                        selected={selectedInvites.includes(person.id)}
                                        onClick={() => handleSelectInvite(person.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Chip
                                                size="small"
                                                icon={selectedInvites.includes(person.id) ? <CheckIcon /> : null}
                                                label={selectedInvites.includes(person.id) ? "Selected" : "Select"}
                                                color={selectedInvites.includes(person.id) ? "success" : "default"}
                                                variant={selectedInvites.includes(person.id) ? "filled" : "outlined"}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar src={person.avatar} alt={person.name} sx={{ mr: 1, width: 40, height: 40 }} />
                                                {person.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={person.role === 'player' ? 'Player' : 'Coach'}
                                                color={person.role === 'player' ? 'primary' : 'secondary'}
                                            />
                                        </TableCell>
                                        <TableCell>{person.position}</TableCell>
                                        <TableCell>{person.country}</TableCell>
                                        <TableCell>{person.role === 'player' ? `Age: ${person.age}` : `Experience: ${person.experience}`}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInviteDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MailIcon />}
                        onClick={handleSendInvites}
                        disabled={selectedInvites.length === 0}
                    >
                        Send {selectedInvites.length} Invitation{selectedInvites.length !== 1 ? 's' : ''}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

ParticipantsManager.propTypes = {
    compact: PropTypes.bool
};

export default ParticipantsManager;