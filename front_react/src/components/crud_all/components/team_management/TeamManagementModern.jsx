import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import useApplicationStore from 'store/useApplicationStore';

import {
    Box,
    Grid,
    Paper,
    Menu,
    Button,
    Avatar,
    Divider,
    Typography,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Chip,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItem,
    ListItemText,
    ListItemAvatar,
    TextField,
    InputAdornment,
    useMediaQuery,
    useTheme,
    Fade,
    Stack
} from "@mui/material";

import {
    Person as PersonIcon,
    MoreHoriz as MoreHorizIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    People as PeopleIcon,
    EmojiEvents as TrophyIcon,
    LocationOn as LocationIcon,
    Sports as SportsIcon
} from "@mui/icons-material";

import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../../shared-theme/AppTheme";
import countries from "../../../../data/countries";
import { CircularProgress } from "@mui/material";

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px'
                }
            }
        }
    }
});

function TeamCard({ team, members, onSelect, isSelected }) {
    const membersCount = members.filter(m => m.teamId === team.id).length;

    return (
        <Fade in={true}>
            <Card
                sx={{
                    mb: 2,
                    cursor: 'pointer',
                    border: isSelected ? '3px solid #1976d2' : '1px solid #e0e0e0',
                    borderRadius: 4,
                    background: isSelected
                        ? 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
                        : 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }
                }}
                onClick={() => onSelect(team.id)}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={team.logo}
                            sx={{
                                width: 48,
                                height: 48,
                                mr: 2,
                                bgcolor: 'primary.main',
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {team.teamName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {team.teamName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    size="small"
                                    label={team.teamType}
                                    color={team.status === "ACTIVE" ? "primary" : "default"}
                                    variant="filled"
                                />
                                <Chip
                                    size="small"
                                    label={`${team.city}, ${team.country}`}
                                    variant="outlined"
                                    icon={<LocationIcon />}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h5" fontWeight="bold" color="primary.main">
                                    {membersCount}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Members
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h5" fontWeight="bold" color="success.main">
                                    {team.wins}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Wins
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Fade>
    );
}

function MemberCard({ member, onDelete }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        onDelete(member.userId);
        handleMenuClose();
    };

    return (
        <Card sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={member.avatar}
                            sx={{
                                width: 56,
                                height: 56,
                                mr: 2,
                                bgcolor: 'secondary.main',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {member.name}
                            </Typography>
                            <Typography variant="body1" color="primary.main" fontWeight="500">
                                {member.role}
                            </Typography>
                            {member.position && (
                                <Typography variant="body2" color="text.secondary">
                                    Position: {member.position}
                                </Typography>
                            )}
                            {member.stats && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {member.stats}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                        <MoreHorizIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}

function TeamManagementModern() {
    const store = useApplicationStore();

    const {
        team: {
            list: teams,
            current: selectedTeam,
            error: teamError,
            fetchAll,
            create,
            update,
            delete: deleteTeam,
            getById,
            addMember,
            removeMember
        },
    } = store;

    const [members, setMembers] = React.useState([]);
    const [loadingMembers, setLoadingMembers] = React.useState(false);
    const availableUsers = store.user.list;

    const [selectedTeamId, setSelectedTeamId] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isCreateTeamOpen, setIsCreateTeamOpen] = React.useState(false);
    const [isEditTeamOpen, setIsEditTeamOpen] = React.useState(false);
    const [editTeamData, setEditTeamData] = React.useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
    const [newMemberData, setNewMemberData] = React.useState({
        userId: '',
        teamId: null,
        role: 'Player',
        position: '',
        stats: ''
    });

    const filteredTeams = teams.filter(team =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.teamType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const teamMembers = members.filter(member => member.teamId === selectedTeamId);

    const handleTeamSelect = async (teamId) => {
        setSelectedTeamId(teamId);
        try {
            await getById(teamId);
            await fetchTeamMembers(teamId);
        } catch (error) {
            console.error("Error loading team:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleCreateTeamDialog = () => {
        setIsCreateTeamOpen(!isCreateTeamOpen);
    };

    const toggleAddMemberDialog = async () => {
        if (!isAddMemberOpen) {
            try {
                await store.user.fetchAll();
                setNewMemberData(prev => ({
                    ...prev,
                    teamId: selectedTeamId
                }));
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
            }
        }
        setIsAddMemberOpen(!isAddMemberOpen);
    };

    const handleNewMemberChange = (e) => {
        const { name, value } = e.target;
        setNewMemberData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const userTeamRelationDto = {
        teamId: newMemberData.teamId,
        userId: newMemberData.userId,
        acceptedInvite: true
    }

    const handleAddMember = async () => {
        try {
            await addMember(userTeamRelationDto);
            await fetchTeamMembers(selectedTeamId);

            setNewMemberData({
                userId: '',
                teamId: selectedTeamId,
                role: 'Player',
                position: '',
                stats: ''
            });
            setIsAddMemberOpen(false);
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const fetchTeamMembers = async (teamId) => {
        try {
            setLoadingMembers(true);
            const memberData = await store.team.getTeamMembers(teamId);

            if (!Array.isArray(memberData)) {
                console.error("Expected array, got:", memberData);
                setMembers([]);
                return;
            }

            const formattedMembers = memberData.map(member => ({
                id: member.id,
                name: (member.user?.firstName && member.user?.lastName)
                    ? member.user.firstName + ' ' + member.user.lastName
                    : member.username,
                role: member.teamRole || "Player",
                userId: member.userId,
                teamId: member.teamId,
                position: member.position,
                avatar: "/api/placeholder/40/40",
                stats: member.stats || "No stats available"
            }));

            setMembers(formattedMembers);
        } catch (error) {
            console.error("Error loading team members:", error);
            setMembers([]);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await removeMember(selectedTeamId, memberId);
            await fetchTeamMembers(selectedTeamId);
        } catch (error) {
            console.error("Error removing member:", error);
        }
    };

    React.useEffect(() => {
        const initialize = async () => {
            try {
                await fetchAll();

                if (teams.length > 0 && !selectedTeamId) {
                    const firstTeamId = teams[0].id;
                    setSelectedTeamId(firstTeamId);
                    await getById(firstTeamId);
                    await fetchTeamMembers(firstTeamId);
                }
            } catch (error) {
                console.error("Error initializing teams:", error);
            }
        };

        initialize();
    }, []);

    const [newTeamData, setNewTeamData] = React.useState({
        teamName: '',
        teamType: 'FOOTBALL',
        status: 'ACTIVE',
        country: '',
        city: '',
        achievements: '',
        wins: '0'
    });

    const handleCreateTeamChange = (e) => {
        const { name, value } = e.target;
        setNewTeamData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateTeam = async () => {
        try {
            await create(newTeamData);
            await fetchAll();
            setNewTeamData({
                teamName: '',
                teamType: 'FOOTBALL',
                status: 'ACTIVE',
                country: '',
                city: '',
                achievements: '',
                wins: '0'
            });

            setIsCreateTeamOpen(false);

            if (teams.length === 1) {
                setSelectedTeamId(teams[0].id);
                await getById(teams[0].id);
                await fetchTeamMembers(teams[0].id);
            }
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    const toggleEditTeamDialog = (team = null) => {
        if (team) {
            setEditTeamData({
                id: team.id,
                teamName: team.teamName,
                teamType: team.teamType,
                status: team.status,
                country: team.country,
                city: team.city,
                achievements: team.achievements || '',
                wins: team.wins || '0'
            });
        }
        setIsEditTeamOpen(!isEditTeamOpen);
    };

    const handleEditTeamChange = (e) => {
        const { name, value } = e.target;
        setEditTeamData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateTeam = async () => {
        try {
            await update(editTeamData);
            await fetchAll();
            setIsEditTeamOpen(false);
        } catch (error) {
            console.error("Error updating team:", error);
        }
    };

    const renderContent = () => {
        if (teams.length === 0) {
            return (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh',
                    textAlign: 'center'
                }}>
                    <SportsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No teams found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first team to get started with team management
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={toggleCreateTeamDialog}
                    >
                        Create New Team
                    </Button>
                </Box>
            );
        }

        return (
            <Grid container spacing={4}>
                <Grid item xs={12} md={5} lg={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            backgroundColor: 'grey.50',
                            border: '1px solid',
                            borderColor: 'grey.200'
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Teams ({filteredTeams.length})
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search teams..."
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                            {filteredTeams.map(team => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    members={members}
                                    onSelect={handleTeamSelect}
                                    isSelected={team.id === selectedTeamId}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7} lg={8}>
                    {selectedTeam && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}
                        >
                            {/* Team Header */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar
                                        src={selectedTeam.logo}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            mr: 3,
                                            bgcolor: 'primary.main',
                                            fontSize: '2rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {selectedTeam.teamName.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                                            {selectedTeam.teamName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Chip
                                                icon={<SportsIcon />}
                                                label={selectedTeam.teamType}
                                                color="primary"
                                                variant="filled"
                                            />
                                            <Chip
                                                icon={<LocationIcon />}
                                                label={`${selectedTeam.city}, ${selectedTeam.country}`}
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={selectedTeam.status}
                                                color={selectedTeam.status === "ACTIVE" ? "success" : "default"}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => toggleEditTeamDialog(selectedTeam)}
                                        size="large"
                                    >
                                        Edit Team
                                    </Button>
                                </Box>

                                {/* Team Stats */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <Paper
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                                                border: '1px solid #e3f2fd'
                                            }}
                                        >
                                            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                                                {teamMembers.length}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                Team Members
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Paper
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #e8f5e8, #ffffff)',
                                                border: '1px solid #e8f5e8'
                                            }}
                                        >
                                            <TrophyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                                {selectedTeam.wins}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                Wins
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Paper
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #fff3e0, #ffffff)',
                                                border: '1px solid #fff3e0'
                                            }}
                                        >
                                            <SportsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                            <Typography variant="body1" fontWeight="bold" color="warning.main">
                                                ACTIVE TEAM
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Status
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {selectedTeam.achievements && (
                                    <Paper sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: 'grey.50' }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Achievements
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedTeam.achievements}
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>

                            {/* Members Section */}
                            <Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        Team Members ({teamMembers.length})
                                    </Typography>
                                    {/*<Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={toggleAddMemberDialog}
                                        size="large"
                                    >
                                        Add Member
                                    </Button>*/}
                                </Box>

                                {loadingMembers ? (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <CircularProgress size={32} />
                                        <Typography variant="body1" sx={{ mt: 2 }}>
                                            Loading team members...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        {teamMembers.map(member => (
                                            <MemberCard
                                                key={member.id}
                                                member={member}
                                                onDelete={handleRemoveMember}
                                            />
                                        ))}
                                        {teamMembers.length === 0 && (
                                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: 'grey.50' }}>
                                                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    No members yet
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                    Start building your team by adding members
                                                </Typography>
                                                {/*<Button
                                                    variant="outlined"
                                                    startIcon={<AddIcon />}
                                                    onClick={toggleAddMemberDialog}
                                                >
                                                    Add First Member
                                                </Button>*/}
                                            </Paper>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        );
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{
                p: 4,
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
            }}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Team Management
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Manage your teams and members efficiently
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={toggleCreateTeamDialog}
                            size="large"
                            sx={{ height: 'fit-content' }}
                        >
                            New Team
                        </Button>
                    </Box>
                </Box>

                {renderContent()}

                {/* Create Team Dialog */}
                <Dialog open={isCreateTeamOpen} onClose={toggleCreateTeamDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Create New Team
                        <IconButton
                            aria-label="close"
                            onClick={toggleCreateTeamDialog}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="teamName"
                                        label="Team Name"
                                        variant="outlined"
                                        value={newTeamData.teamName}
                                        onChange={handleCreateTeamChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="teamType"
                                        label="Sport Type"
                                        variant="outlined"
                                        select
                                        value={newTeamData.teamType}
                                        onChange={handleCreateTeamChange}
                                        required
                                    >
                                        <MenuItem value="FOOTBALL">Football</MenuItem>
                                        <MenuItem value="BASKETBALL">Basketball</MenuItem>
                                        <MenuItem value="TENNIS">Tennis</MenuItem>
                                        <MenuItem value="HOCKEY">Hockey</MenuItem>
                                        <MenuItem value="VOLLEYBALL">Volleyball</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="status"
                                        label="Status"
                                        variant="outlined"
                                        select
                                        value={newTeamData.status}
                                        onChange={handleCreateTeamChange}
                                    >
                                        <MenuItem value="ACTIVE">Active team</MenuItem>
                                        <MenuItem value="INACTIVE">Inactive team</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="country"
                                        label="Country"
                                        variant="outlined"
                                        select
                                        value={newTeamData.country}
                                        onChange={handleCreateTeamChange}
                                        required
                                    >
                                        {countries.map(country => (
                                            <MenuItem key={country.name} value={country.name}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="city"
                                        label="City"
                                        variant="outlined"
                                        value={newTeamData.city}
                                        onChange={handleCreateTeamChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="achievements"
                                        label="Achievements"
                                        variant="outlined"
                                        value={newTeamData.achievements}
                                        onChange={handleCreateTeamChange}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="wins"
                                        label="Wins"
                                        variant="outlined"
                                        type="number"
                                        value={newTeamData.wins}
                                        onChange={handleCreateTeamChange}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleCreateTeamDialog}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateTeam}
                            disabled={!newTeamData.teamName || !newTeamData.country || !newTeamData.city}
                            color="secondary"
                        >
                            Create Team
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Team Dialog */}
                <Dialog open={isEditTeamOpen} onClose={() => toggleEditTeamDialog()} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Edit Team
                        <IconButton
                            aria-label="close"
                            onClick={() => toggleEditTeamDialog()}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        {editTeamData && (
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="teamName"
                                            label="Team Name"
                                            variant="outlined"
                                            value={editTeamData.teamName}
                                            onChange={handleEditTeamChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="teamType"
                                            label="Sport Type"
                                            variant="outlined"
                                            select
                                            value={editTeamData.teamType}
                                            onChange={handleEditTeamChange}
                                            required
                                        >
                                            <MenuItem value="FOOTBALL">Football</MenuItem>
                                            <MenuItem value="BASKETBALL">Basketball</MenuItem>
                                            <MenuItem value="TENNIS">Tennis</MenuItem>
                                            <MenuItem value="HOCKEY">Hockey</MenuItem>
                                            <MenuItem value="VOLLEYBALL">Volleyball</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="status"
                                            label="Status"
                                            variant="outlined"
                                            select
                                            value={editTeamData.status}
                                            onChange={handleEditTeamChange}
                                        >
                                            <MenuItem value="ACTIVE">Active team</MenuItem>
                                            <MenuItem value="INACTIVE">Inactive team</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="country"
                                            label="Country"
                                            variant="outlined"
                                            select
                                            value={editTeamData.country}
                                            onChange={handleEditTeamChange}
                                            required
                                        >
                                            {countries.map(country => (
                                                <MenuItem key={country.name} value={country.name}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="city"
                                            label="City"
                                            variant="outlined"
                                            value={editTeamData.city}
                                            onChange={handleEditTeamChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="achievements"
                                            label="Achievements"
                                            variant="outlined"
                                            value={editTeamData.achievements}
                                            onChange={handleEditTeamChange}
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="wins"
                                            label="Wins"
                                            variant="outlined"
                                            type="number"
                                            value={editTeamData.wins}
                                            onChange={handleEditTeamChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => toggleEditTeamDialog()}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleUpdateTeam}
                            disabled={!editTeamData || !editTeamData.teamName || !editTeamData.country || !editTeamData.city}
                            color="secondary"
                        >
                            Update Team
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Member Dialog
                <Dialog open={isAddMemberOpen} onClose={toggleAddMemberDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Add Team Member
                        <IconButton
                            aria-label="close"
                            onClick={toggleAddMemberDialog}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="userId"
                                        label="Select User"
                                        variant="outlined"
                                        select
                                        value={newMemberData.userId}
                                        onChange={handleNewMemberChange}
                                        required
                                    >
                                        {availableUsers.map(user => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.firstName} {user.lastName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="role"
                                        label="Role"
                                        variant="outlined"
                                        select
                                        value={newMemberData.role}
                                        onChange={handleNewMemberChange}
                                    >
                                        <MenuItem value="Player">Player</MenuItem>
                                        <MenuItem value="Coach">Coach</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Medical Staff">Medical Staff</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="position"
                                        label="Position"
                                        variant="outlined"
                                        value={newMemberData.position}
                                        onChange={handleNewMemberChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="stats"
                                        label="Stats"
                                        variant="outlined"
                                        value={newMemberData.stats}
                                        onChange={handleNewMemberChange}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleAddMemberDialog}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleAddMember}
                            disabled={!newMemberData.userId}
                            color="secondary"
                        >
                            Add Member
                        </Button>
                    </DialogActions>
                </Dialog>*/}
            </Box>
        </AppTheme>
    );
}

TeamManagementModern.propTypes = {
    window: PropTypes.func,
};

export default TeamManagementModern;