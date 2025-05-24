import React, { useState, useEffect, useActionState } from 'react';
import {
    AppBar, Alert, Toolbar, Typography, Button, Container, Grid, Card, CardContent,
    CardMedia, Box, IconButton, Chip, Paper, useMediaQuery, Switch,
    FormControlLabel, CircularProgress, Tabs, Tab, Drawer, List, ListItem,
    ListItemText, ListItemIcon, Divider, ImageList, ImageListItem, Stepper, Step, StepLabel
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Menu as MenuIcon,
    SportsSoccer,
    SportsBasketball,
    SportsVolleyball,
    SportsRugby,
    Event,
    LocationOn,
    People,
    EmojiEvents,
    Search,
    DarkMode,
    LightMode,
    ArrowForward,
    Instagram,
    Facebook,
    Twitter,
    YouTube,
    PlayArrow
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/system';
import AppTheme from "../shared-theme/AppTheme";
import AppAppBar from "../blog/components/AppAppBar";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import { useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';
import HighlightReel from "./HighlightReel";
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useApplicationStore from 'store/useApplicationStore';



const HeroSection = styled(Box)(({ theme }) => ({
    height: '80vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.6), rgba(0, 0, 0, 0.6))',
        zIndex: 1,
    },
}));


const GlassCard = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: theme.spacing(4),
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    border: '1px solid rgba(255, 255, 255, 0.18)',
}));


const HeroContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    textAlign: 'center',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: theme.shadows[10],
    },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const CTASection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 0),
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #303030 30%, #424242 90%)'
        : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    color: 'white',
    borderRadius: theme.spacing(2),
    margin: theme.spacing(4, 0),
}));

const CustomButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    padding: theme.spacing(1, 4),
    fontWeight: 'bold',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.2)',
        transform: 'translateX(-100%)',
        transition: 'transform 0.3s ease',
    },
    '&:hover::after': {
        transform: 'translateX(0)',
    },
}));

const ambassadors = [
    { name: 'Anna Petrova', role: 'Football Player', image: '/images/avatar1.jpg', quote: 'MatchMaker helped me find my dream team.' },
    { name: 'Ivan Belov', role: 'Basketball Coach', image: '/images/avatar2.jpg', quote: 'Best platform for organizing tournaments!' },
    { name: 'Maria Lis', role: 'Volleyball Organizer', image: '/images/avatar3.jpg', quote: 'Smooth and professional process every time.' },
];

const steps = [
    'Sign up and create an account',
    'Create or join a tournament',
    'Invite players and manage schedule',
    'Compete and track results',
];

// Пример данных
// Featured events data

const mockFeaturedEvents = [
    {
        id: 1,
        title: 'City Football Championship',
        date: 'June 15, 2025',
        time: '10:00 AM',
        location: 'Central Stadium',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%2334495e" width="800" height="400"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EФутбольный турнир%3C/text%3E%3Ccircle cx="400" cy="200" r="80" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Cpolygon fill="%23ecf0f1" points="400,155 415,195 460,195 425,220 435,265 400,240 365,265 375,220 340,195 385,195"/%3E%3C/svg%3E',
        category: 'Football',
        icon: <SportsSoccer />,
        bgColor: '#2196f3',
        participants: 120,
        description: 'Join the most anticipated football tournament of the year with teams from across the region competing for the city championship title.'
    },
    {
        id: 2,
        title: 'Basketball Tournament "3x3"',
        date: 'June 22, 2025',
        time: '2:00 PM',
        location: 'Olympic Sports Complex',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%23e74c3c" width="800" height="400"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EБаскетбольный турнир%3C/text%3E%3Ccircle cx="400" cy="200" r="85" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Cline x1="400" y1="120" x2="400" y2="280" stroke="%23ecf0f1" stroke-width="6"/%3E%3C/svg%3E',
        category: 'Basketball',
        icon: <SportsBasketball />,
        bgColor: '#e74c3c',
        participants: 80,
        description: 'Fast-paced 3x3 basketball competition with amazing prizes and special guest appearances from professional players.'
    },
    {
        id: 3,
        title: 'City Volleyball Tournament',
        date: 'June 29, 2025',
        time: '11:00 AM',
        location: 'Sunny Beach',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%232ecc71" width="800" height="400"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EВолейбольный турнир%3C/text%3E%3Cline x1="150" y1="200" x2="650" y2="200" stroke="%23ecf0f1" stroke-width="8"/%3E%3Ccircle cx="400" cy="180" r="70" stroke="%23ecf0f1" stroke-width="6" fill="none"/%3E%3C/svg%3E',
        category: 'Volleyball',
        icon: <SportsVolleyball />,
        bgColor: '#2ecc71',
        participants: 64,
        description: 'Experience beach volleyball at its finest with this exciting tournament featuring amateur and semi-professional teams.'
    },
];

// Upcoming events data
const upcomingEvents = [
    {
        id: 1,
        title: 'Youth Football Tournament',
        date: 'June 12, 2025',
        time: '9:00 AM',
        location: 'School #8 Field',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%233498db" width="800" height="400"/%3E%3Ccircle cx="400" cy="200" r="80" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EДетский футбол%3C/text%3E%3C/svg%3E',
        category: 'Football',
        participants: 80,
        rating: 4.8,
        description: 'A special tournament designed for young football talents to showcase their skills and passion for the game.'
    },
    {
        id: 2,
        title: 'Veterans Rugby Match',
        date: 'June 14, 2025',
        time: '4:30 PM',
        location: 'City Stadium',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%239b59b6" width="800" height="400"/%3E%3Cellipse cx="400" cy="200" rx="100" ry="60" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EРегби%3C/text%3E%3C/svg%3E',
        category: 'Rugby',
        participants: 30,
        rating: 4.7,
        description: 'Experience the passion and skill of veteran rugby players as they come together for this special exhibition match.'
    },
    {
        id: 3,
        title: 'Amateur Basketball Cup',
        date: 'June 20, 2025',
        time: '1:00 PM',
        location: '"Sport for All" Center',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%23d35400" width="800" height="400"/%3E%3Ccircle cx="400" cy="200" r="80" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EЛюбительский баскетбол%3C/text%3E%3C/svg%3E',
        category: 'Basketball',
        participants: 96,
        rating: 4.9,
        description: 'The largest amateur basketball tournament in the region, bringing together players of all skill levels for a friendly competition.'
    },
    {
        id: 4,
        title: 'City Marathon',
        date: 'June 25, 2025',
        time: '7:00 AM',
        location: 'City Center Streets',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%231abc9c" width="800" height="400"/%3E%3Cpath d="M150,300 C250,100 350,300 450,100 C550,300 650,100 750,300" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EМарафон%3C/text%3E%3C/svg%3E',
        category: 'Running',
        participants: 500,
        rating: 4.9,
        description: 'Challenge yourself in this annual city marathon that takes you through the most scenic parts of our beautiful city.'
    },
    {
        id: 5,
        title: 'Corporate Volleyball Tournament',
        date: 'June 30, 2025',
        time: '5:00 PM',
        location: '"Dynamo" Sports Arena',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%2327ae60" width="800" height="400"/%3E%3Cline x1="150" y1="200" x2="650" y2="200" stroke="%23ecf0f1" stroke-width="8"/%3E%3Ccircle cx="300" cy="150" r="50" stroke="%23ecf0f1" stroke-width="6" fill="none"/%3E%3Ccircle cx="500" cy="150" r="50" stroke="%23ecf0f1" stroke-width="6" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EКорпоративный волейбол%3C/text%3E%3C/svg%3E',
        category: 'Volleyball',
        participants: 48,
        rating: 4.6,
        description: 'Companies from across the city compete in this team-building volleyball tournament designed to foster corporate spirit.'
    },
    {
        id: 6,
        title: 'Indoor Soccer Tournament',
        date: 'July 2, 2025',
        time: '3:30 PM',
        location: '"Champion" Hall',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%23f1c40f" width="800" height="400"/%3E%3Crect x="150" y="100" width="500" height="200" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EМини-футбол%3C/text%3E%3C/svg%3E',
        category: 'Football',
        participants: 60,
        rating: 4.7,
        description: 'Fast-paced indoor soccer action featuring teams from all skill levels competing in this exciting tournament.'
    },
    {
        id: 7,
        title: 'City Marathon',
        date: 'June 25, 2025',
        time: '7:00 AM',
        location: 'City Center Streets',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%231abc9c" width="800" height="400"/%3E%3Cpath d="M150,300 C250,100 350,300 450,100 C550,300 650,100 750,300" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EМарафон%3C/text%3E%3C/svg%3E',
        category: 'Running',
        participants: 500,
        rating: 4.9,
        description: 'Challenge yourself in this annual city marathon that takes you through the most scenic parts of our beautiful city.'
    },
    {
        id: 8,
        title: 'Corporate Volleyball Tournament',
        date: 'June 30, 2025',
        time: '5:00 PM',
        location: '"Dynamo" Sports Arena',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%2327ae60" width="800" height="400"/%3E%3Cline x1="150" y1="200" x2="650" y2="200" stroke="%23ecf0f1" stroke-width="8"/%3E%3Ccircle cx="300" cy="150" r="50" stroke="%23ecf0f1" stroke-width="6" fill="none"/%3E%3Ccircle cx="500" cy="150" r="50" stroke="%23ecf0f1" stroke-width="6" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EКорпоративный волейбол%3C/text%3E%3C/svg%3E',
        category: 'Volleyball',
        participants: 48,
        rating: 4.6,
        description: 'Companies from across the city compete in this team-building volleyball tournament designed to foster corporate spirit.'
    },
    {
        id: 9,
        title: 'Indoor Soccer Tournament',
        date: 'July 2, 2025',
        time: '3:30 PM',
        location: '"Champion" Hall',
        image: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%23f1c40f" width="800" height="400"/%3E%3Crect x="150" y="100" width="500" height="200" stroke="%23ecf0f1" stroke-width="8" fill="none"/%3E%3Ctext fill="%23ecf0f1" font-family="Arial" font-size="28" x="50%%" y="50%%" text-anchor="middle"%3EМини-футбол%3C/text%3E%3C/svg%3E',
        category: 'Football',
        participants: 60,
        rating: 4.7,
        description: 'Fast-paced indoor soccer action featuring teams from all skill levels competing in this exciting tournament.'
    },
];

const statisticsData = [
    { name: 'January', tournaments: 12, participants: 350 },
    { name: 'February', tournaments: 15, participants: 420 },
    { name: 'March', tournaments: 20, participants: 580 },
    { name: 'April', tournaments: 22, participants: 620 },
    { name: 'May', tournaments: 25, participants: 750 },
];

const sportTypeData = [
    { name: 'Football', value: 40 },
    { name: 'Basketball', value: 25 },
    { name: 'Volleyball', value: 20 },
    { name: 'Rugby', value: 8 },
    { name: 'Other', value: 7 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const HomePage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:960px)');
    const navigate = useNavigate();

    const store = useApplicationStore();

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const loadEvents = async () => {
        try {
            const data = await store.singleEvent.fetchAll();
            setFeaturedEvents(data);
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadEvents();
            } catch (error) {
                showSnackbar(error.message, 'error');
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        console.log('FeaturedEvents updated:', featuredEvents);
        console.log(featuredEvents);
    }, [featuredEvents]);



    const [filteredCategory, setFilteredCategory] = useState("All");

    const filteredEvents = filteredCategory === "All"
        ? upcomingEvents
        : upcomingEvents.filter(event => event.category === filteredCategory);


    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#90caf9' : '#1976d2',
            },
            secondary: {
                main: darkMode ? '#f48fb1' : '#dc004e',
            },
            background: {
                default: darkMode ? '#121212' : '#f5f5f5',
                paper: darkMode ? '#1e1e1e' : '#ffffff',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
            },
            h2: {
                fontWeight: 600,
            },
            button: {
                fontWeight: 500,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '16px',
                    },
                },
            },
        },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEvent((prev) => (prev + 1) % featuredEvents.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredEvents]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const categories = ["All", "Football", "Basketball", "Volleyball", "Rugby"];
        setFilteredCategory(categories[newValue]);
    };

    const controls = useAnimation();
    const reelRef = useRef(null);
    const isInView = useInView(reelRef, { once: true });

    useEffect(() => {
        if (isInView) {
            controls.start("animate");
        }
    }, [isInView, controls]);

    const [showAll, setShowAll] = useState(false);


    const animationVariants = {
        animate: {
            x: ['0%', '-100%'],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 30,
                    ease: 'linear',
                },
            },
        },
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />

            <Box component="main">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentEvent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <HeroSection
                            // sx={{
                            //     backgroundImage: `url(${featuredEvents[currentEvent].image})`,
                            //     marginTop: '64px'
                            // }}
                        >
                            <HeroContent>
                                <GlassCard>
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.8 }}
                                    >
                                        {/* <Chip
                                            icon={featuredEvents[currentEvent].icon}
                                            label={featuredEvents[currentEvent].category}
                                            sx={{
                                                backgroundColor: featuredEvents[currentEvent].bgColor,
                                                color: 'white',
                                                mb: 2,
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                py: 2.5
                                            }}
                                        /> */}
                                        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            {featuredEvents[currentEvent]?.event.eventName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                                                <Event sx={{ mr: 1 }} />
                                                <Typography>{featuredEvents[currentEvent]?.event.eventDate}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationOn sx={{ mr: 1 }} />
                                                <Typography>{featuredEvents[currentEvent]?.event.eventLocation}</Typography>
                                            </Box>
                                        </Box>
                                        <CustomButton
                                            variant="contained"
                                            size="large"
                                            color="primary"
                                            endIcon={<ArrowForward />}
                                            onClick={() => navigate('/tournament')}
                                        >
                                            Participate
                                        </CustomButton>
                                    </motion.div>
                                </GlassCard>
                            </HeroContent>
                        </HeroSection>
                    </motion.div>
                </AnimatePresence>

                <Container sx={{ my: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <Typography variant="h1" gutterBottom>
                                MatchMaker - manage your entire team in one app!
                            </Typography>
                        </div>
                        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
                            Our statistics
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" paragraph>
                            We are proud of the results of our work and continue to develop the sports community.
                        </Typography>

                        <Grid container spacing={4} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={7}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        An increase in the number of tournaments and participants
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={statisticsData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="tournaments" fill="#8884d8" stackId="a" />
                                            <Bar dataKey="participants" fill="#82ca9d" stackId="b" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Distribution by sports
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={sportTypeData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {sportTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard elevation={6}>
                                    <Typography variant="h2" color="primary" fontWeight="bold">
                                        120+
                                    </Typography>
                                    <Typography variant="h6" align="center">
                                        Tournaments have been held
                                    </Typography>
                                </StatsCard>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard elevation={6}>
                                    <Typography variant="h2" color="secondary" fontWeight="bold">
                                        4500+
                                    </Typography>
                                    <Typography variant="h6" align="center">
                                        Participants
                                    </Typography>
                                </StatsCard>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard elevation={6}>
                                    <Typography variant="h2" color="primary" fontWeight="bold">
                                        15
                                    </Typography>
                                    <Typography variant="h6" align="center">
                                        Types of sports
                                    </Typography>
                                </StatsCard>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard elevation={6}>
                                    <Typography variant="h2" color="secondary" fontWeight="bold">
                                        8
                                    </Typography>
                                    <Typography variant="h6" align="center">
                                        Years of experience
                                    </Typography>
                                </StatsCard>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Container>

                <Container sx={{ my: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
                            All categories
                        </Typography>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4, mb: 2 }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant={isMobile ? "scrollable" : "standard"}
                                scrollButtons={isMobile ? "auto" : false}
                                centered={!isMobile}
                            >
                                <Tab label="All events" icon={<EmojiEvents />} iconPosition="start" />
                                <Tab label="Football" icon={<SportsSoccer />} iconPosition="start" />
                                <Tab label="Basketball" icon={<SportsBasketball />} iconPosition="start" />
                                <Tab label="Volleyball" icon={<SportsVolleyball />} iconPosition="start" />
                                <Tab label="Rugby" icon={<SportsRugby />} iconPosition="start" />
                            </Tabs>
                        </Box>
                    </motion.div>
                </Container>

                <Container sx={{ my: 4 }}>
                    <Grid container spacing={3}>
                        {(showAll ? filteredEvents : filteredEvents.slice(0, 6)).map((event, index) => (
                            <Grid item xs={12} sm={6} md={4} key={event.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <FeatureCard>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={event.image}
                                            alt={event.title}
                                        />
                                        <CardContent>
                                            <Chip
                                                label={event.category}
                                                size="small"
                                                color="primary"
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography gutterBottom variant="h6" component="div"
                                                        sx={{ fontWeight: 'bold' }}>
                                                {event.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Event fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {event.date}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        <Box sx={{ mt: 'auto', p: 2, display: 'flex', justifyContent: 'space-between' }}>
                                            <Button
                                                size="small"
                                                color="primary"
                                                sx={{ fontWeight: 'bold' }}
                                                onClick={() => navigate(`/tournament/${event.id}`)}
                                            >
                                                About
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                sx={{ fontWeight: 'bold' }}
                                                onClick={() => navigate('/tournament')}
                                            >
                                                Participate
                                            </Button>
                                        </Box>
                                    </FeatureCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CustomButton
                            variant="outlined"
                            color="primary"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => setShowAll(true)}
                        >
                            Show all events
                        </CustomButton>
                    </Box>
                </Container>

                <Container sx={{ my: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <CTASection>
                            <Container>
                                <Grid container spacing={4} alignItems="center">
                                    <Grid item xs={12} md={7}>
                                        <Typography variant="h3" gutterBottom fontWeight="bold">
                                            Become a tournament organizer with us!
                                        </Typography>
                                        <Typography variant="h6" paragraph>
                                            Are you planning to hold a sporting event? We will help with the
                                            organization from start to finish.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                mt: 2,
                                                bgcolor: 'white',
                                                color: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.8)'
                                                }
                                            }}
                                            endIcon={<ArrowForward />}
                                            onClick={() => navigate('/signup')}
                                        >
                                            Become an organizer
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                p: 1,
                                                borderRadius: '50%',
                                                width: 300,
                                                height: 300,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                                backdropFilter: 'blur(5px)',
                                            }}
                                        >
                                            <IconButton
                                                sx={{
                                                    p: 4,
                                                    bgcolor: 'white',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255, 255, 255, 0.8)'
                                                    }
                                                }}
                                            >
                                                <PlayArrow sx={{ fontSize: 80 }} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Container>
                        </CTASection>
                    </motion.div>
                </Container>

                {/* --- Раздел 1: Highlight Reel --- */}
                <HighlightReel />

                {/* --- Раздел 2: Ambassadors --- */}
                <Container sx={{ py: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                            Our Ambassadors
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" paragraph>
                            People who inspire and lead our community
                        </Typography>
                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            {ambassadors.map((amb, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2, duration: 0.6 }}
                                    >
                                        <Card
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                borderRadius: 4,
                                                boxShadow: 3,
                                                transition: 'transform 0.3s',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: 6,
                                                },
                                            }}
                                        >
                                            <Avatar
                                                src={amb.image}
                                                alt={amb.name}
                                                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                                            />
                                            <Typography variant="h6" fontWeight="bold">{amb.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{amb.role}</Typography>
                                            <Rating value={5} readOnly sx={{ mt: 1 }} />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                "{amb.quote}"
                                            </Typography>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>

                {/* --- Раздел 3: How It Works --- */}
                <Container sx={{ py: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                            How It Works
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" paragraph>
                            Organizing and joining tournaments is easier than ever
                        </Typography>
                        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                            {steps.map((label, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2, duration: 0.6 }}
                                    >
                                        <Box
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                bgcolor: 'background.paper',
                                                boxShadow: 3,
                                                textAlign: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    width: 56,
                                                    height: 56,
                                                    mb: 2,
                                                    mx: 'auto',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {index + 1}
                                            </Avatar>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {label}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                    </motion.div>
                </Container>

                <Box
                    component="footer"
                    sx={{
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.05)',
                        py: 6,
                        mt: 6
                    }}
                >
                    <Container>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    @MatchMaker
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    We create sports events that bring people together and inspire new achievements.
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <IconButton color="primary">
                                        <Facebook />
                                    </IconButton>
                                    <IconButton color="primary">
                                        <Twitter />
                                    </IconButton>
                                    <IconButton color="primary">
                                        <Instagram />
                                    </IconButton>
                                    <IconButton color="primary">
                                        <YouTube />
                                    </IconButton>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Contacts
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Minsk, st. Gikalo, 9
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    info@matchnaker.ru
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    +7 (495) 123-45-67
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Subscribe to the news
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Get information about new events first
                                </Typography>
                                <Box sx={{ display: 'flex', mt: 2 }}>
                                    <CustomButton variant="contained" color="primary" fullWidth>
                                        Subscribe
                                    </CustomButton>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 6, pt: 3, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                © 2025 MatchMaker. All rights reserved.
                            </Typography>
                        </Box>
                    </Container>
                </Box>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default HomePage;