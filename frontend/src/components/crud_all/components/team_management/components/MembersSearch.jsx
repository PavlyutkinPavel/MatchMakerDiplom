import * as React from 'react';
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
} from '@mui/material';
import {
    Person as PersonIcon,
    PersonAdd as PersonAddIcon,
    Search as SearchIcon,
    SportsBasketball,
    SportsSoccer,
    SportsTennis,
    SportsHockey,
    SportsVolleyball
} from '@mui/icons-material';
import { useDemoRouter } from '@toolpad/core/internal';


// Mock data for testing
const mockUserTeams = [
    { id: 1, teamName: 'FC Barcelona', teamType: 'FOOTBALL', status: 'Active team', country: 'Spain', city: 'Barcelona' },
    { id: 2, teamName: 'LA Lakers', teamType: 'BASKETBALL', status: 'Active team', country: 'United States', city: 'Los Angeles' },
    { id: 3, teamName: 'Tennis Club', teamType: 'TENNIS', status: 'Active team', country: 'France', city: 'Paris' }
];


const mockPlayers = [
    { id: 1, name: 'Lionel Messi', position: 'Forward', teamId: 1, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Argentina', age: 34 },
    { id: 2, name: 'LeBron James', position: 'Forward', teamId: 2, avatar: '/api/placeholder/50/50', isFriend: true, country: 'USA', age: 36 },
    { id: 3, name: 'Rafael Nadal', position: 'Player', teamId: 3, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Spain', age: 35 },
    { id: 4, name: 'Cristiano Ronaldo', position: 'Forward', teamId: 1, avatar: '/api/placeholder/50/50', isFriend: true, country: 'Portugal', age: 36 },
    { id: 5, name: 'Stephen Curry', position: 'Guard', teamId: 2, avatar: '/api/placeholder/50/50', isFriend: false, country: 'USA', age: 33 }
];

const mockCoaches = [
    { id: 101, name: 'Pep Guardiola', position: 'Head Coach', teamId: 1, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Spain', experience: '15 years' },
    { id: 102, name: 'Frank Vogel', position: 'Head Coach', teamId: 2, avatar: '/api/placeholder/50/50', isFriend: true, country: 'USA', experience: '10 years' },
    { id: 103, name: 'Carlos Moya', position: 'Head Coach', teamId: 3, avatar: '/api/placeholder/50/50', isFriend: false, country: 'Spain', experience: '8 years' }
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


// Member search component (Players or Coaches based on path)
export const MemberSearch = () => {
    const router = useDemoRouter();
    const [userTeams, setUserTeams] = React.useState([]);
    const [members, setMembers] = React.useState([]);
    const [selectedTeam, setSelectedTeam] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

    // Determine if we're looking for players or coaches based on the route
    const memberType = router.pathname.includes('/members/players') ? 'player' : 'coach';

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
            fetchMembers();
        }
    }, [selectedTeam, memberType]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            // In a real implementation, fetch from API
            // const response = await fetch(`${API_URL}/team/${selectedTeam}/${memberType}s`, {
            //   headers: getHeaders(),
            // });
            // const data = await response.json();
            // setMembers(data);

            // Mock data for testing
            setTimeout(() => {
                setMembers(memberType === 'player' ? mockPlayers.filter(p => p.teamId === parseInt(selectedTeam)) :
                    mockCoaches.filter(c => c.teamId === parseInt(selectedTeam)));
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error(`Error fetching ${memberType}s:`, error);
            setMembers([]); // Clear on error
            setLoading(false);
        }
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset to first page on new search
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddFriend = async (memberId) => {
        try {
            // In a real implementation, call API
            // await fetch(`${API_URL}/friends/add`, {
            //   method: 'POST',
            //   headers: getHeaders(),
            //   body: JSON.stringify({ friendId: memberId }),
            // });

            // Update local state (mock implementation)
            setMembers(members.map(member =>
                member.id === memberId ? { ...member, isFriend: true } : member
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

    // Filter members based on search query
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.position && member.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.country && member.country.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Paginate members
    const displayedMembers = filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ padding: 2 }}>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h5" gutterBottom>
                    {memberType === 'player' ? 'Players' : 'Coaches'} Search
                </Typography>
                <Grid container spacing={2} alignItems="center" marginBottom={2}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
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
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label={`Search ${memberType === 'player' ? 'Players' : 'Coaches'}`}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                            placeholder="Search by name, position, or country..."
                        />
                    </Grid>
                </Grid>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : !selectedTeam ? (
                    <Alert severity="info">Please select a team to view its {memberType === 'player' ? 'players' : 'coaches'}</Alert>
                ) : displayedMembers.length === 0 ? (
                    <Alert severity="info">No {memberType === 'player' ? 'players' : 'coaches'} found</Alert>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Profile</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Position</TableCell>
                                        <TableCell>Country</TableCell>
                                        {memberType === 'player' ? (
                                            <TableCell>Age</TableCell>
                                        ) : (
                                            <TableCell>Experience</TableCell>
                                        )}
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedMembers.map((member) => (
                                        <TableRow key={member.id} hover>
                                            <TableCell>
                                                <Avatar src={member.avatar} alt={member.name} />
                                            </TableCell>
                                            <TableCell>{member.name}</TableCell>
                                            <TableCell>{member.position}</TableCell>
                                            <TableCell>{member.country}</TableCell>
                                            <TableCell>
                                                {memberType === 'player' ? member.age : member.experience}
                                            </TableCell>
                                            <TableCell align="right">
                                                {member.isFriend ? (
                                                    <Chip
                                                        label="Friend"
                                                        color="primary"
                                                        icon={<PersonIcon />}
                                                    />
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<PersonAddIcon />}
                                                        onClick={() => handleAddFriend(member.id)}
                                                    >
                                                        Add Friend
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredMembers.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>
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

export default MemberSearch;