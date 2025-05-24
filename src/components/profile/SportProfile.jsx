import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";
import {useNavigate} from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '90%',
        maxWidth: '1000px',
    },
    ...theme.applyStyles?.('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
    backgroundImage: theme.palette.mode === 'dark'
        ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
        : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    padding: theme.spacing(2),
    minHeight: '100vh',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(3),
    position: 'relative',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        textAlign: 'left',
        alignItems: 'flex-start',
    },
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `4px solid ${theme.palette.background.paper}`,
    margin: theme.spacing(0, 0, 2, 0),
    [theme.breakpoints.up('md')]: {
        margin: theme.spacing(0, 4, 0, 0),
    },
}));

const ContentSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'hsla(220, 30%, 5%, 0.03) 0px 3px 8px 0px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 'hsla(220, 30%, 5%, 0.08) 0px 5px 15px 0px',
    },
    ...theme.applyStyles?.('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.2) 0px 3px 8px 0px',
        '&:hover': {
            boxShadow: 'hsla(220, 30%, 5%, 0.3) 0px 8px 20px 0px',
        },
    }),
}));

const AchievementCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'hsla(220, 30%, 5%, 0.03) 0px 2px 5px 0px',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: 'hsla(220, 30%, 5%, 0.08) 0px 4px 10px 0px',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.01)',
    },
}));

const TeamCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'hsla(220, 30%, 5%, 0.03) 0px 2px 5px 0px',
    '&:hover': {
        boxShadow: 'hsla(220, 30%, 5%, 0.08) 0px 4px 10px 0px',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.01)',
    },
}));

const EditButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
}));

const SkillProgress = ({ sport, level, experience, icon }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {icon}
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>{sport}</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
                    {level} � {experience} years
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={level === 'Beginner' ? 25 : level === 'Intermediate' ? 50 : level === 'Advanced' ? 75 : 90}
                sx={{ height: 8, borderRadius: 4 }}
            />
        </Box>
    );
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const fetchUserProfile = async () => {
    try {
        const response = await fetch(`http://localhost:8080/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const profileData = await response.json();
        return profileData;
    } catch (error) {
        console.error("Failed to fetch profile data:", error);
        return null;
    }
};

// Функция для преобразования данных API в формат, необходимый для компонента
const formatUserData = (profileData) => {
    // Значения по умолчанию для случаев, когда данные отсутствуют
    const defaultValues = {
        name: 'User',
        username: '@user',
        bio: 'No bio available',
        location: 'Not specified',
        email: 'Not available',
        memberSince: 'Unknown',
        avatar: null
    };

    // Если запрос не удался, возвращаем данные по умолчанию с некоторыми примерами
    if (!profileData) {
        return {
            name: defaultValues.name,
            username: defaultValues.username,
            bio: defaultValues.bio,
            location: defaultValues.location,
            email: defaultValues.email,
            memberSince: defaultValues.memberSince,
            avatar: defaultValues.avatar,
            sports: [
                { name: 'Basketball', level: 'Beginner', experience: 1, icon: <SportsBasketballIcon color="primary" /> }
            ],
            teams: [],
            achievements: [],
            upcomingEvents: []
        };
    }

    // Обработка полученных данных с проверкой на null или "-"
    return {
        id: profileData.id || 0,
        userId: profileData.user_id || 0,
        name: profileData.name && profileData.name !== "-" ? profileData.name : defaultValues.name,
        username: profileData.username && profileData.username !== "-" ? profileData.username : defaultValues.username,
        bio: profileData.bio && profileData.bio !== "-" ? profileData.bio : defaultValues.bio,
        location: profileData.location && profileData.location !== "-" ? profileData.location : defaultValues.location,
        email: profileData.email && profileData.email !== "-" ? profileData.email : defaultValues.email,
        memberSince: profileData.memberSince && profileData.memberSince !== "-"
            ? new Date(profileData.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : defaultValues.memberSince,
        avatar: profileData.avatar && profileData.avatar.length > 0 ? profileData.avatar[0] : null,

        // Здесь эти данные захардкожены для примера, но в реальности вы должны добавить в API эти поля
        // или создать отдельные эндпоинты для их получения
        sports: [
            { name: 'Basketball', level: 'Expert', experience: 20, icon: <SportsBasketballIcon color="primary" /> },
            { name: 'Tennis', level: 'Advanced', experience: 8, icon: <SportsTennisIcon color="primary" /> },
            { name: 'Soccer', level: 'Intermediate', experience: 5, icon: <SportsSoccerIcon color="primary" /> },
            { name: 'Weight Training', level: 'Advanced', experience: 15, icon: <FitnessCenterIcon color="primary" /> }
        ],
        teams: [
            { name: 'Chicago Bulls', role: 'Captain', sport: 'Basketball', members: 12, avatar: 'CB' },
            { name: 'Lakeside Tennis Club', role: 'Member', sport: 'Tennis', members: 24, avatar: 'LT' },
            { name: 'Weekend Warriors', role: 'Member', sport: 'Soccer', members: 18, avatar: 'WW' }
        ],
        achievements: [
            { title: 'City Championship', description: 'Won the Chicago City Basketball Tournament 2024', date: 'April 2024', icon: <EmojiEventsIcon sx={{ color: '#FFD700' }} /> },
            { title: 'MVP', description: 'Most Valuable Player in Regional Basketball League', date: 'November 2023', icon: <EmojiEventsIcon sx={{ color: '#C0C0C0' }} /> },
            { title: 'Tennis Open Finalist', description: 'Runner-up in Chicago Tennis Open Tournament', date: 'July 2023', icon: <EmojiEventsIcon sx={{ color: '#CD7F32' }} /> },
            { title: '100 Matches', description: 'Participated in 100 matches on MatchMaker platform', date: 'March 2023', icon: <EmojiEventsIcon sx={{ color: '#1976d2' }} /> }
        ],
        upcomingEvents: [
            { name: 'Summer Basketball League', date: 'June 15, 2025', location: 'Chicago Sports Center' },
            { name: 'Tennis Doubles Tournament', date: 'July 8, 2025', location: 'Lakeside Tennis Club' }
        ]
    };
};

export default function SportProfile() {
    const [tabValue, setTabValue] = useState(0);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Получение данных профиля при загрузке компонента
    useEffect(() => {
        const getUserProfile = async () => {
            setLoading(true);
            try {
                const profileData = await fetchUserProfile();
                const formattedData = formatUserData(profileData);
                setUserData(formattedData);
                setError(null);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile data");
                setUserData(formatUserData(null));
            } finally {
                setLoading(false);
            }
        };

        getUserProfile();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEdit = () => {
        setTimeout(() => navigate("/edit_profile"), 1000);
    };

    if (loading) {
        return (
            <AppTheme>
                <AppAppBar />
                <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h5">Loading profile...</Typography>
                </Container>
            </AppTheme>
        );
    }

    // Отображаем ошибку, если она есть
    if (error && !userData) {
        return (
            <AppTheme>
                <AppAppBar />
                <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">{error}</Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </Container>
            </AppTheme>
        );
    }

    return (
        <AppTheme>
            <AppAppBar />
            <ProfileContainer>
                <CssBaseline enableColorScheme />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <StyledCard variant="outlined">
                        <ProfileHeader>
                            <LargeAvatar alt={userData.name} src={userData.avatar || "/path-to-default-avatar.jpg"}>
                                {userData.name.charAt(0)}
                            </LargeAvatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {userData.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                                    {userData.username} • {userData.location}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <Chip
                                        label={`${userData.sports.length} Sports`}
                                        size="small"
                                        icon={<SportsSoccerIcon />}
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={`${userData.teams.length} Teams`}
                                        size="small"
                                        icon={<GroupsIcon />}
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={`${userData.achievements.length} Achievements`}
                                        size="small"
                                        icon={<EmojiEventsIcon />}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Stack>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {userData.bio}
                                </Typography>
                                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                    <Button variant="contained" startIcon={<EmailIcon />}>
                                        Contact
                                    </Button>
                                    <Button variant="outlined">Follow</Button>
                                </Stack>
                            </Box>
                            <EditButton onClick={handleEdit} variant="outlined" startIcon={<EditIcon />} size="small">
                                Edit Profile
                            </EditButton>
                        </ProfileHeader>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="profile tabs"
                                centered
                                variant="fullWidth"
                            >
                                <Tab label="About" />
                                <Tab label="Teams" />
                                <Tab label="Achievements" />
                                <Tab label="Events" />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            <ContentSection>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                    Sports & Skills
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {userData.sports.map((sport, index) => (
                                    <SkillProgress
                                        key={index}
                                        sport={sport.name}
                                        level={sport.level}
                                        experience={sport.experience}
                                        icon={sport.icon}
                                    />
                                ))}
                            </ContentSection>

                            <ContentSection>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                    Contact Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {userData.email}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Location
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {userData.location}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Member Since
                                        </Typography>
                                        <Typography variant="body1">
                                            {userData.memberSince}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ContentSection>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <ContentSection>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                    Current Teams
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {userData.teams.length > 0 ? (
                                    userData.teams.map((team, index) => (
                                        <TeamCard key={index}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>{team.avatar}</Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                        {team.name}
                                                    </Typography>
                                                    <Chip
                                                        label={team.role}
                                                        size="small"
                                                        color={team.role === 'Captain' ? 'success' : 'default'}
                                                    />
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {team.sport} • {team.members} members
                                                </Typography>
                                            </Box>
                                        </TeamCard>
                                    ))
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                                        No teams joined yet
                                    </Typography>
                                )}
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button variant="outlined">Find More Teams</Button>
                                </Box>
                            </ContentSection>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <ContentSection>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                    Achievements & Trophies
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {userData.achievements.length > 0 ? (
                                    userData.achievements.map((achievement, index) => (
                                        <AchievementCard key={index}>
                                            {achievement.icon}
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                        {achievement.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {achievement.date}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2">
                                                    {achievement.description}
                                                </Typography>
                                            </Box>
                                        </AchievementCard>
                                    ))
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                                        No achievements yet
                                    </Typography>
                                )}
                            </ContentSection>
                        </TabPanel>

                        <TabPanel value={tabValue} index={3}>
                            <ContentSection>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                    Upcoming Events
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {userData.upcomingEvents.length > 0 ? (
                                    userData.upcomingEvents.map((event, index) => (
                                        <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                {event.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {event.date}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                                        No upcoming events
                                    </Typography>
                                )}
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button variant="contained" color="primary">
                                        Browse All Events
                                    </Button>
                                </Box>
                            </ContentSection>
                        </TabPanel>
                    </StyledCard>
                </Container>
            </ProfileContainer>
        </AppTheme>
    );
}