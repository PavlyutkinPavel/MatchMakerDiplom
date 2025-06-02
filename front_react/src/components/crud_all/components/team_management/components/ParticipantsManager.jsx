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

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// API Service functions
const apiService = {
    // Fetch user teams
    async getUserTeams() {
        try {
            const response = await fetch(`${API_BASE_URL}/team`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user teams:', error);
            throw error;
        }
    },

    // Fetch team members
    async getTeamMembers(teamId) {
        try {
            const response = await fetch(`${API_BASE_URL}/team/members/team/${teamId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching team members:', error);
            throw error;
        }
    },

    // Add team member - ИСПРАВЛЕНО
    async addTeamMember(memberData) {
        try {
            const response = await fetch(`${API_BASE_URL}/team/member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
                },
                credentials: 'include',
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.status === 201 || response.status === 200;
        } catch (error) {
            console.error('Error adding team member:', error);
            throw error;
        }
    },

    // Remove team member - ИСПРАВЛЕНО путь
    async removeTeamMember(teamId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/team/${teamId}/members/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.status === 204 || response.status === 200;
        } catch (error) {
            console.error('Error removing team member:', error);
            throw error;
        }
    },

    // Get available users to invite - ИСПРАВЛЕНО на реальный эндпоинт
    async getAvailableUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching available users:', error);
            throw error;
        }
    }
};

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

// Helper function to transform backend UserTeamRelation to frontend format
const transformMemberData = (backendMember) => {
    return {
        id: backendMember.userId,
        name: backendMember.username,
        position: backendMember.position || 'Not specified',
        teamId: backendMember.teamId,
        avatar: `/api/placeholder/50/50`,
        isFriend: false,
        country: 'Unknown',
        teamRole: backendMember.teamRole,
        stats: backendMember.stats || '',
        acceptedInvite: backendMember.acceptedInvite
    };
};

// Helper function to transform user data for invite dialog
const transformUserData = (user) => {
    return {
        id: user.id,
        username: user.userLogin || user.username,
        position: user.position || 'Player',
        country: user.country || 'Unknown',
        age: user.age,
        teamRole: 'PLAYER' // по умолчанию, можно добавить выбор роли
    };
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
    const [selectedInviteRoles, setSelectedInviteRoles] = React.useState({}); // Для хранения ролей
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [filterType, setFilterType] = React.useState('all');
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        fetchUserTeams();
    }, []);

    React.useEffect(() => {
        if (selectedTeam) {
            fetchParticipants();
        }
    }, [selectedTeam, filterType]);

    const fetchUserTeams = async () => {
        try {
            setLoading(true);
            setError(null);
            const teams = await apiService.getUserTeams();
            setUserTeams(teams || []);
        } catch (error) {
            console.error('Error fetching user teams:', error);
            setError('Failed to load teams. Please try again.');
            setUserTeams([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async () => {
        if (!selectedTeam) return;

        try {
            setLoading(true);
            setError(null);
            const members = await apiService.getTeamMembers(selectedTeam);

            // Transform backend data to frontend format
            const transformedMembers = members.map(transformMemberData);

            // Filter by type if needed
            let filteredMembers = transformedMembers;
            if (filterType === 'player') {
                filteredMembers = transformedMembers.filter(m => m.teamRole === 'PLAYER');
            } else if (filterType === 'coach') {
                filteredMembers = transformedMembers.filter(m => m.teamRole === 'COACH');
            }

            setParticipants(filteredMembers);
        } catch (error) {
            console.error('Error fetching participants:', error);
            setError('Failed to load team members. Please try again.');
            setParticipants([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        setPage(0);
        setParticipants([]);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
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

    const handleOpenInviteDialog = async () => {
        try {
            setLoading(true);
            const availableUsers = await apiService.getAvailableUsers();

            // Фильтруем пользователей, которые уже не в команде
            const currentMemberIds = participants.map(p => p.id);
            const filteredUsers = availableUsers.filter(user => !currentMemberIds.includes(user.id));

            const transformedUsers = filteredUsers.map(transformUserData);
            setInviteList(transformedUsers);
            setOpenInviteDialog(true);
        } catch (error) {
            console.error('Error loading available users:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load available users',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseInviteDialog = () => {
        setOpenInviteDialog(false);
        setSelectedInvites([]);
        setSelectedInviteRoles({});
    };

    const handleSelectInvite = (participantId) => {
        setSelectedInvites(prevSelected => {
            if (prevSelected.includes(participantId)) {
                // Remove from selected and also remove role
                const newRoles = { ...selectedInviteRoles };
                delete newRoles[participantId];
                setSelectedInviteRoles(newRoles);
                return prevSelected.filter(id => id !== participantId);
            } else {
                // Add to selected and set default role
                setSelectedInviteRoles(prev => ({
                    ...prev,
                    [participantId]: 'PLAYER'
                }));
                return [...prevSelected, participantId];
            }
        });
    };

    const handleRoleChange = (userId, role) => {
        setSelectedInviteRoles(prev => ({
            ...prev,
            [userId]: role
        }));
    };

    // ИСПРАВЛЕНО: отправка данных согласно UserTeamRelationDTO
    const handleSendInvites = async () => {
        if (!selectedTeam || selectedInvites.length === 0) return;

        try {
            setLoading(true);

            // Send invites for each selected user
            const invitePromises = selectedInvites.map(userId => {
                const selectedUser = inviteList.find(user => user.id === userId);
                const memberData = {
                    userId: userId,
                    teamId: parseInt(selectedTeam),
                    acceptedInvite: false, // Initially false, user needs to accept
                    username: selectedUser.username,
                    position: selectedUser.position,
                    stats: '', // Пустая строка по умолчанию
                    teamRole: selectedInviteRoles[userId] || 'PLAYER'
                };

                console.log('Sending member data:', memberData); // Для отладки
                return apiService.addTeamMember(memberData);
            });

            await Promise.all(invitePromises);

            setSnackbar({
                open: true,
                message: `Successfully sent ${selectedInvites.length} invitation${selectedInvites.length !== 1 ? 's' : ''}!`,
                severity: 'success'
            });

            handleCloseInviteDialog();
            fetchParticipants(); // Refresh the participants list
        } catch (error) {
            console.error('Error sending invites:', error);
            setSnackbar({
                open: true,
                message: 'Failed to send invitations. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (participantId) => {
        if (!selectedTeam) return;

        try {
            setLoading(true);
            await apiService.removeTeamMember(selectedTeam, participantId);

            setSnackbar({
                open: true,
                message: 'Member removed successfully!',
                severity: 'success'
            });

            fetchParticipants(); // Refresh the participants list
        } catch (error) {
            console.error('Error removing member:', error);
            setSnackbar({
                open: true,
                message: 'Failed to remove member. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
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
        return participant.teamRole === 'PLAYER' ? 'player' : 'coach';
    };

    const renderDetailInfo = (participant) => {
        const participantType = getParticipantType(participant);

        return (
            <Box>
                <Typography variant="subtitle2" color="textSecondary">Role</Typography>
                <Typography variant="body2">{participant.teamRole}</Typography>
                {participant.stats && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">Stats</Typography>
                        <Typography variant="body2">{participant.stats}</Typography>
                    </Box>
                )}
                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip
                        size="small"
                        label={participant.acceptedInvite ? "Accepted" : "Pending"}
                        color={participant.acceptedInvite ? "success" : "warning"}
                    />
                </Box>
            </Box>
        );
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
                                    {renderDetailInfo(participant)}
                                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                        <Chip
                                            size="small"
                                            label={participantType === 'player' ? 'Player' : 'Coach'}
                                            color={participantType === 'player' ? 'primary' : 'secondary'}
                                        />
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRemoveMember(participant.id)}
                                        >
                                            Remove
                                        </Button>
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
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
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
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={participantType === 'player' ? 'Player' : 'Coach'}
                                            color={participantType === 'player' ? 'primary' : 'secondary'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={participant.acceptedInvite ? "Accepted" : "Pending"}
                                            color={participant.acceptedInvite ? "success" : "warning"}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    color="info"
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
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemoveMember(participant.id)}
                                            >
                                                Remove
                                            </Button>
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
                            disabled={!selectedTeam || loading}
                        >
                            Invite Participants
                        </Button>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2} alignItems="center" marginBottom={2}>
                    <Grid item xs={12} md={compact ? 6 : 4}>
                        <FormControl fullWidth size={compact ? "small" : "medium"}>
                            <InputLabel id="team-select-label">Select Team</InputLabel>
                            <Select
                                labelId="team-select-label"
                                value={selectedTeam}
                                label="Select Team"
                                onChange={handleTeamChange}
                                disabled={loading}
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
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Search by name, position..."
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
                                    disabled={loading}
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

            {/* Invite Dialog - ИСПРАВЛЕНО */}
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
                                    <TableCell>Username</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Team Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inviteList.map((person) => (
                                    <TableRow
                                        key={person.id}
                                        hover
                                        selected={selectedInvites.includes(person.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Chip
                                                size="small"
                                                icon={selectedInvites.includes(person.id) ? <CheckIcon /> : null}
                                                label={selectedInvites.includes(person.id) ? "Selected" : "Select"}
                                                color={selectedInvites.includes(person.id) ? "success" : "default"}
                                                variant={selectedInvites.includes(person.id) ? "filled" : "outlined"}
                                                onClick={() => handleSelectInvite(person.id)}
                                            />
                                        </TableCell>
                                        <TableCell onClick={() => handleSelectInvite(person.id)}>
                                            {person.username}
                                        </TableCell>
                                        <TableCell onClick={() => handleSelectInvite(person.id)}>
                                            {person.position}
                                        </TableCell>
                                        <TableCell onClick={() => handleSelectInvite(person.id)}>
                                            {person.country}
                                        </TableCell>
                                        <TableCell>
                                            {selectedInvites.includes(person.id) ? (
                                                <FormControl size="small" sx={{ minWidth: 100 }}>
                                                    <Select
                                                        value={selectedInviteRoles[person.id] || 'PLAYER'}
                                                        onChange={(e) => handleRoleChange(person.id, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MenuItem value="PLAYER">Player</MenuItem>
                                                        <MenuItem value="COACH">Coach</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    Select first
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInviteDialog} disabled={loading}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MailIcon />}
                        onClick={handleSendInvites}
                        disabled={selectedInvites.length === 0 || loading}
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