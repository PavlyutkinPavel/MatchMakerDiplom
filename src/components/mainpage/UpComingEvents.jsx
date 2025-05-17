import React, { useState, useEffect } from 'react';
import {
   Typography, Button, Container, Grid, Card, CardContent,
    CardMedia, Box, Chip, useMediaQuery,Tabs, Tab
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {

    SportsSoccer,
    SportsBasketball,
    SportsVolleyball,
    SportsRugby,
    Event,
    LocationOn,
    People,
    EmojiEvents,
    ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import AppTheme from "../shared-theme/AppTheme";
import AppAppBar from "../blog/components/AppAppBar";
import { useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

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

const featuredEvents = [
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

export default function (){
    const [darkMode, setDarkMode] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(max-width:960px)');
    const navigate = useNavigate();


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
    }, []);

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
    return(
        <AppTheme>
            <CssBaseline enableColorScheme/>
            <AppAppBar/>
            <Container sx={{my: 8}}>
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                >
                    <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
                        All categories
                    </Typography>
                    <Box sx={{borderBottom: 1, borderColor: 'divider', mt: 4, mb: 2}}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant={isMobile ? "scrollable" : "standard"}
                            scrollButtons={isMobile ? "auto" : false}
                            centered={!isMobile}
                        >
                            <Tab label="All events" icon={<EmojiEvents/>} iconPosition="start"/>
                            <Tab label="Football" icon={<SportsSoccer/>} iconPosition="start"/>
                            <Tab label="Basketball" icon={<SportsBasketball/>} iconPosition="start"/>
                            <Tab label="Volleyball" icon={<SportsVolleyball/>} iconPosition="start"/>
                            <Tab label="Rugby" icon={<SportsRugby/>} iconPosition="start"/>
                        </Tabs>
                    </Box>
                </motion.div>
            </Container>

            <Container sx={{my: 4}}>
                <Grid container spacing={3}>
                    {(showAll ? filteredEvents : filteredEvents.slice(0, 6)).map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <motion.div
                                initial={{opacity: 0, y: 50}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: index * 0.1}}
                                viewport={{once: true}}
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
                                            sx={{mb: 1}}
                                        />
                                        <Typography gutterBottom variant="h6" component="div"
                                                    sx={{fontWeight: 'bold'}}>
                                            {event.title}
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                            <Event fontSize="small" sx={{mr: 1, color: 'text.secondary'}}/>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.date}
                                            </Typography>
                                        </Box>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <LocationOn fontSize="small" sx={{mr: 1, color: 'text.secondary'}}/>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.location}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Box sx={{mt: 'auto', p: 2, display: 'flex', justifyContent: 'space-between'}}>
                                        <Button
                                            size="small"
                                            color="primary"
                                            sx={{fontWeight: 'bold'}}
                                            onClick={() => navigate(`/tournament/${event.id}`)}
                                        >
                                            About
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            sx={{fontWeight: 'bold'}}
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

                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
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
        </AppTheme>
    )
}