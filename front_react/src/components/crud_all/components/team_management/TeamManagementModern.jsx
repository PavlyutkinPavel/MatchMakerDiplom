import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import useApplicationStore from 'store/useApplicationStore';

import {
    Box,
    Tab,
    Tabs,
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
    Badge,
    InputAdornment,
    useMediaQuery,
    useTheme,
    Fade
} from "@mui/material";

import {
    Person as PersonIcon,
    Message as MessageIcon,
    Map as MapIcon,
    MoreHoriz as MoreHorizIcon,
    SportsSoccer as SportsSoccerIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Event as EventIcon,
    CalendarToday as CalendarTodayIcon,
    Close as CloseIcon,
    Notifications as NotificationsIcon,
    People as PeopleIcon,
} from "@mui/icons-material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../../shared-theme/AppTheme";
import countries from "../../../../data/countries";
import { CircularProgress } from "@mui/material";

const mockEvents = [
    {
        id: 1,
        title: "Team Practice",
        date: "2025-05-10T15:00:00",
        teamId: 1,
        location: "Main Field",
        type: "Practice"
    },
    {
        id: 2,
        title: "Match vs Red Tigers",
        date: "2025-05-12T18:30:00",
        teamId: 1,
        location: "City Stadium",
        type: "Match"
    },
    {
        id: 3,
        title: "Team Building",
        date: "2025-05-15T14:00:00",
        teamId: 7,
        location: "Sports Complex",
        type: "Team Event"
    }
];

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
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 12px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.05)',
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600
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
                    mb: 3,
                    px: 2,
                    pt: 1,
                    pb: 2,
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #1976d2' : 'none',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    }
                }}
                onClick={() => onSelect(team.id)}
            >
                <CardHeader
                    avatar={
                        <Avatar src={team.logo} aria-label={team.teamName}>
                            {team.teamName.charAt(0)}
                        </Avatar>
                    }
                    title={<Typography variant="h6">{team.teamName}</Typography>}
                    subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip
                                size="small"
                                label={team.teamType}
                                sx={{ mr: 1 }}
                                color={team.status === "ACTIVE" ? "success" : "default"}
                            />
                            <Chip
                                size="small"
                                label={`${team.city}, ${team.country}`}
                                variant="outlined"
                            />
                        </Box>
                    }
                    action={
                        <IconButton>
                            <MoreHorizIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Members
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {membersCount}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Wins
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {team.wins}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                                Next Event
                            </Typography>
                            <Typography variant="body1">
                                {team.nextEvent}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Fade>
    );
}

function MemberListItem({ member, onDelete }) {
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
        <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={handleMenuOpen}>
                    <MoreHorizIcon />
                </IconButton>
            }
        >
            <ListItemAvatar>
                <Avatar src={member.avatar}>{member.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={member.name}
                secondary={
                    <>
                        <Typography component="span" variant="body2">
                            {member.role} • {member.position}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                            {member.stats}
                        </Typography>
                    </>
                }
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDelete}>Remove from team</MenuItem>
            </Menu>
        </ListItem>
    );
}

function EventCard({ event }) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    let eventTypeIcon;
    let bgColor;

    switch (event.type) {
        case 'Practice':
            eventTypeIcon = <FitnessCenterIcon />
            bgColor = '#e3f2fd';
            break;
        case 'Match':
            eventTypeIcon = <SportsSoccerIcon />
            bgColor = '#fff8e1';
            break;
        case 'Team Event':
            eventTypeIcon = <PeopleIcon />
            bgColor = '#f1f8e9';
            break;
        default:
            eventTypeIcon = <EventIcon />
            bgColor = '#f5f5f5';
    }

    return (
        <Card sx={{ mb: 2, backgroundColor: bgColor }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: event.type === 'Match' ? 'warning.main' : 'primary.main' }}>
                        {eventTypeIcon}
                    </Avatar>
                }
                title={event.title}
                subheader={`${formattedDate} at ${formattedTime}`}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Location: {event.location}
                </Typography>
            </CardContent>
        </Card>
    );
}

function TeamMap() {
    return (
        <Box sx={{ height: '500px', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47931.43656890325!2d27.4904518!3d53.9006017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfbc1f7a6bd1%3A0x34ca9fbc765ba123!2sMinsk%2C%20Belarus!5e0!3m2!1sen!2s!4v1633452834502!5m2!1sen!2s"
                style={{ width: '100%', height: '100%', border: 0 }}
                allowFullScreen
                loading="lazy"
            />
        </Box>
    );
}

function ChatComponent() {
    return (
        <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                    <Avatar sx={{ mr: 1, width: 36, height: 36 }}>M</Avatar>
                    <Paper sx={{ p: 1, borderRadius: 2, maxWidth: '70%', bgcolor: 'grey.100' }}>
                        <Typography variant="body2">When is our next practice?</Typography>
                    </Paper>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'flex-end' }}>
                    <Paper sx={{ p: 1, borderRadius: 2, maxWidth: '70%', bgcolor: 'primary.light', color: 'white' }}>
                        <Typography variant="body2">Thursday at 5PM at the main field</Typography>
                    </Paper>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', pt: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Type a message"
                    variant="outlined"
                    size="small"
                />
                <Button sx={{ ml: 1 }} variant="contained">
                    Send
                </Button>
            </Box>
        </Paper>
    );
}

const countryNames = countries.map(country => country.name);

function TeamManagementModern() {
    // Получаем методы и состояние из стора
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
    const [activeTab, setActiveTab] = React.useState(0);
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
    const teamEvents = mockEvents.filter(event => event.teamId === selectedTeamId);

    const handleTeamSelect = async (teamId) => {
        setSelectedTeamId(teamId);
        try {
            await getById(teamId);
            await fetchTeamMembers(teamId);
        } catch (error) {
            console.error("Error loading team:", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
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
                // Используем метод fetchAll из хранилища пользователей
                await store.user.fetchAll();

                // Обновляем teamId в форме
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
            console.log(newMemberData);
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

            console.log("memberData:", memberData); // DEBUG

            if (!Array.isArray(memberData)) {
                console.error("Expected array, got:", memberData);
                setMembers([]);
                return;
            }

            const formattedMembers = memberData.map(member => ({
                id: member.id,
                name: (member.user?.firstName && member.user?.lastName)
                    ? member.user.firstName + ' ' + member.user.lastName
                    : member.username, // Fallback если нет user
                role: member.teamRole || "Player",
                userId: member.userId,
                teamId: member.teamId, // <-- напрямую берем teamId
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
            // let updatedData = {
            //     "teamName": editTeamData.teamName,
            //     "country": editTeamData.country,
            //     "city": editTeamData.city,
            //     "achievements": editTeamData.achievements,
            //     "status": editTeamData.status,
            //     "wins": editTeamData.wins,
            //     "teamType": editTeamData.teamType,
            // };
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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Typography>No teams found. Create a new team to get started.</Typography>
                </Box>
            );
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
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
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ maxHeight: '75vh', overflowY: 'auto', pr: 1 }}>
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
                <Grid item xs={12} md={8} lg={9}>
                    {selectedTeam && (
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'linear-gradient(145deg, #ffffff, #f1f1f1)',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    src={selectedTeam.logo}
                                    sx={{ width: 64, height: 64, mr: 2 }}
                                >
                                    {selectedTeam.teamName.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {selectedTeam.teamName}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {selectedTeam.city}, {selectedTeam.country} • {selectedTeam.teamType}
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 'auto' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        sx={{ mr: 1 }}
                                        onClick={() => toggleEditTeamDialog(selectedTeam)}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                }
                                            }}
                                        >
                                            <Typography variant="h6">
                                                {teamMembers.length}
                                            </Typography>
                                            <Typography variant="body2">
                                                Members
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                }
                                            }}
                                        >
                                            <Typography variant="h6">
                                                {selectedTeam.wins}
                                            </Typography>
                                            <Typography variant="body2">
                                                Wins
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                }
                                            }}
                                        >
                                            <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body1">
                                                Next: {selectedTeam.nextEvent || 'No upcoming events'}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant={isMobile ? "scrollable" : "fullWidth"}
                                scrollButtons={isMobile ? "auto" : false}
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    mb: 3,
                                    backgroundColor: 'background.paper',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                }}
                            >
                                <Tab icon={<PersonIcon />} iconPosition="start" label="Members" />
                                <Tab icon={<EventIcon />} iconPosition="start" label="Events" />
                                <Tab icon={<MessageIcon />} iconPosition="start" label="Team Chat" />
                                <Tab icon={<MapIcon />} iconPosition="start" label="Location" />
                            </Tabs>

                            <Box sx={{ mt: 2 }}>
                                {activeTab === 0 && (
                                    <Box>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Typography variant="h6">Team Members</Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={toggleAddMemberDialog}
                                            >
                                                Add Member
                                            </Button>
                                        </Box>
                                        <Paper elevation={0} sx={{ mt: 2 }}>
                                            {loadingMembers ? (
                                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                                    <CircularProgress size={24} />
                                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                                        Loading team members...
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <>
                                                    {teamMembers.map(member => (
                                                        <React.Fragment key={member.id}>
                                                            <MemberListItem member={member} onDelete={handleRemoveMember} />
                                                            <Divider />
                                                        </React.Fragment>
                                                    ))}
                                                    {teamMembers.length === 0 && (
                                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                                            <Typography variant="body1" color="text.secondary">
                                                                No members found for this team
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        </Paper>
                                    </Box>
                                )}

                                {activeTab === 1 && (
                                    <Box>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Typography variant="h6">Upcoming Events</Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<AddIcon />}
                                            >
                                                Add Event
                                            </Button>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            {teamEvents.map(event => (
                                                <EventCard key={event.id} event={event} />
                                            ))}
                                            {teamEvents.length === 0 && (
                                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                                    <Typography variant="body1" color="text.secondary">
                                                        No events scheduled for this team
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                {activeTab === 2 && (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 2 }}>Team Chat</Typography>
                                        <ChatComponent />
                                    </Box>
                                )}

                                {activeTab === 3 && (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 2 }}>Team Location</Typography>
                                        <TeamMap />
                                    </Box>
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
            <Box>
                <Box
                    sx={{
                        p: 3,
                        minHeight: '100vh',
                        background: 'linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" fontWeight="bold">Team Management</Typography>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={toggleCreateTeamDialog}
                                sx={{ mr: 2 }}
                            >
                                New Team
                            </Button>
                            <IconButton
                                color="primary"
                                sx={{
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.15)',
                                    }
                                }}
                            >
                                <Badge badgeContent={4} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Box>
                    </Box>

                    {renderContent()}
                </Box>

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
                                    {/* ... other Grid items ... */}
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

                {/* Add Member Dialog */}
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
                </Dialog>
            </Box>
        </AppTheme>
    );
}

TeamManagementModern.propTypes = {
    window: PropTypes.func,
};

export default TeamManagementModern;