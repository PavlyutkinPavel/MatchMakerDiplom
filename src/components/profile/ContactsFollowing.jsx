import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import PoolIcon from '@mui/icons-material/Pool';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";

// ������������� ����������
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

const ContactsContainer = styled(Box)(({ theme }) => ({
    backgroundImage: theme.palette.mode === 'dark'
        ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
        : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    padding: theme.spacing(2),
    minHeight: '100vh',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const SearchSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const ContactCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'hsla(220, 30%, 5%, 0.03) 0px 3px 8px 0px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: 'hsla(220, 30%, 5%, 0.08) 0px 5px 15px 0px',
    },
    ...theme.applyStyles?.('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.2) 0px 3px 8px 0px',
        '&:hover': {
            boxShadow: 'hsla(220, 30%, 5%, 0.3) 0px 8px 20px 0px',
        },
    }),
}));

const FilterPanel = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
}));

const SportsChip = styled(Chip)(({ theme, selected }) => ({
    margin: theme.spacing(0.5),
    fontWeight: selected ? 600 : 400,
    border: selected ? `1px solid ${theme.palette.primary.main}` : 'none',
    boxShadow: selected ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
}));

// ��������������� �������
const getSportIcon = (sport) => {
    const icons = {
        'Basketball': <SportsBasketballIcon fontSize="small" />,
        'Tennis': <SportsTennisIcon fontSize="small" />,
        'Soccer': <SportsSoccerIcon fontSize="small" />,
        'Cricket': <SportsCricketIcon fontSize="small" />,
        'Volleyball': <SportsVolleyballIcon fontSize="small" />,
        'Swimming': <PoolIcon fontSize="small" />,
        'Weight Training': <FitnessCenterIcon fontSize="small" />
    };
    return icons[sport] || <SportsSoccerIcon fontSize="small" />;
};

const getExperienceLevel = (years) => {
    if (years < 2) return 'Beginner';
    if (years < 5) return 'Intermediate';
    if (years < 10) return 'Advanced';
    return 'Expert';
};

// ��������� TabPanel ��� ������������ ����� ���������
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`contacts-tabpanel-${index}`}
            aria-labelledby={`contacts-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// ������� ���������
export default function ContactsFollowing() {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSports, setSelectedSports] = useState([]);
    const [experienceFilter, setExperienceFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    // ����������� ������ ���������
    const contactsData = [
        {
            id: 1,
            name: 'Michael Jordan',
            username: 'airjordan',
            avatar: 'MJ',
            location: 'Chicago, IL',
            bio: 'Basketball legend and sports enthusiast.',
            following: true,
            mainSport: 'Basketball',
            sports: ['Basketball', 'Tennis', 'Golf'],
            experience: 20,
            teams: 3,
            achievements: 4
        },
        {
            id: 2,
            name: 'Serena Williams',
            username: 'serena',
            avatar: 'SW',
            location: 'Palm Beach, FL',
            bio: 'Tennis professional looking for friendly matches.',
            following: true,
            mainSport: 'Tennis',
            sports: ['Tennis', 'Volleyball'],
            experience: 15,
            teams: 2,
            achievements: 3
        },
        {
            id: 3,
            name: 'Cristiano Ronaldo',
            username: 'cr7',
            avatar: 'CR',
            location: 'Lisbon, Portugal',
            bio: 'Soccer player with a passion for fitness and competition.',
            following: false,
            mainSport: 'Soccer',
            sports: ['Soccer', 'Weight Training'],
            experience: 18,
            teams: 1,
            achievements: 5
        },
        {
            id: 4,
            name: 'Emma Wilson',
            username: 'emmaw',
            avatar: 'EW',
            location: 'Seattle, WA',
            bio: 'Amateur volleyball player searching for local leagues.',
            following: false,
            mainSport: 'Volleyball',
            sports: ['Volleyball', 'Swimming'],
            experience: 4,
            teams: 2,
            achievements: 1
        },
        {
            id: 5,
            name: 'James Brown',
            username: 'jamesb',
            avatar: 'JB',
            location: 'London, UK',
            bio: 'Cricket enthusiast and weekend warrior.',
            following: true,
            mainSport: 'Cricket',
            sports: ['Cricket', 'Soccer'],
            experience: 7,
            teams: 1,
            achievements: 2
        },
        {
            id: 6,
            name: 'Sophia Lee',
            username: 'sophial',
            avatar: 'SL',
            location: 'Miami, FL',
            bio: 'Swimming coach and former competitive swimmer.',
            following: false,
            mainSport: 'Swimming',
            sports: ['Swimming', 'Weight Training'],
            experience: 10,
            teams: 2,
            achievements: 3
        }
    ];

    // ��� ���������� ���� ������ �� ������
    const allSports = [...new Set(contactsData.flatMap(contact => contact.sports))].sort();

    // �������� �������� ������
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const toggleSportFilter = (sport) => {
        if (selectedSports.includes(sport)) {
            setSelectedSports(selectedSports.filter(s => s !== sport));
        } else {
            setSelectedSports([...selectedSports, sport]);
        }
    };

    const handleExperienceFilterChange = (event) => {
        setExperienceFilter(event.target.value);
    };

    const handleResetFilters = () => {
        setSelectedSports([]);
        setExperienceFilter('all');
        setSearchQuery('');
    };

    const navigateToProfile = (username) => {
        // ���������� ������������ ������ ������� ����� ���������
        setTimeout(() => {
            navigate(`/profile?username=${username}`);
        }, 300);
    };

    // ���������� ���������
    const filterContacts = (contacts) => {
        return contacts.filter(contact => {
            // ������ �� ���������� �������
            const matchesSearch = searchQuery === '' ||
                contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.location.toLowerCase().includes(searchQuery.toLowerCase());

            // ������ �� ����� ������
            const matchesSports = selectedSports.length === 0 ||
                selectedSports.some(sport => contact.sports.includes(sport));

            // ������ �� �����
            let matchesExperience = true;
            if (experienceFilter === 'beginner') {
                matchesExperience = contact.experience < 2;
            } else if (experienceFilter === 'intermediate') {
                matchesExperience = contact.experience >= 2 && contact.experience < 5;
            } else if (experienceFilter === 'advanced') {
                matchesExperience = contact.experience >= 5 && contact.experience < 10;
            } else if (experienceFilter === 'expert') {
                matchesExperience = contact.experience >= 10;
            }

            return matchesSearch && matchesSports && matchesExperience;
        });
    };

    // �������� ��������������� ������ ���������
    const followingContacts = filterContacts(contactsData.filter(contact => contact.following));
    const suggestedContacts = filterContacts(contactsData.filter(contact => !contact.following));

    // ��������� ��� �������� ��������
    const ContactCardItem = ({ contact }) => (
        <ContactCard onClick={() => navigateToProfile(contact.username)}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'primary.main',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {contact.avatar}
                    </Avatar>
                </Grid>
                <Grid item xs>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                                {contact.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                @{contact.username} � {contact.location}
                            </Typography>
                        </Box>
                        {contact.following ? (
                            <Chip
                                icon={<CheckIcon />}
                                label="Following"
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 500 }}
                            />
                        ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<PersonAddIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // ����� ����� ������ ��������
                                }}
                            >
                                Follow
                            </Button>
                        )}
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                        {contact.bio}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {contact.sports.map((sport, idx) => (
                            <Chip
                                key={idx}
                                icon={getSportIcon(sport)}
                                label={sport}
                                size="small"
                                variant="outlined"
                                sx={{
                                    mr: 0.5,
                                    bgcolor: sport === contact.mainSport ? 'primary.light' : 'transparent',
                                    fontWeight: sport === contact.mainSport ? 600 : 400
                                }}
                            />
                        ))}
                        <Chip
                            label={`${getExperienceLevel(contact.experience)}`}
                            size="small"
                            sx={{
                                ml: 0.5,
                                bgcolor: 'background.default',
                                color: 'text.secondary',
                                fontWeight: 500
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </ContactCard>
    );

    // ��������� ��� ��������� ��������
    const LoadingSkeleton = () => (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Skeleton variant="circular" width={60} height={60} />
                </Grid>
                <Grid item xs>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%' }} />
                    <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '40%', mb: 1 }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '90%' }} />
                    <Box sx={{ display: 'flex', mt: 1 }}>
                        <Skeleton variant="rounded" width={80} height={24} sx={{ mr: 1 }} />
                        <Skeleton variant="rounded" width={80} height={24} sx={{ mr: 1 }} />
                        <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );

    return (
        <AppTheme>
            <AppAppBar />
            <ContactsContainer>
                <CssBaseline enableColorScheme />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <StyledCard variant="outlined">
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.75rem, 5vw, 2.15rem)',
                                    fontWeight: 600,
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                Your Network
                            </Typography>
                            <Divider sx={{ width: '80px', height: '3px', mx: 'auto', mb: 2, bgcolor: 'black' }} />
                            <Typography variant="subtitle1" color="text.secondary">
                                Connect with athletes and find teammates for your next event
                            </Typography>
                        </Box>

                        <SearchSection>
                            <TextField
                                fullWidth
                                placeholder="Search by name, username or location..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                variant="text"
                                                startIcon={<FilterListIcon />}
                                                onClick={() => setShowFilters(!showFilters)}
                                            >
                                                Filters
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />

                            {showFilters && (
                                <FilterPanel>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            Filters
                                        </Typography>
                                        <IconButton size="small" onClick={() => setShowFilters(false)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Sports</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {allSports.map((sport) => (
                                                <SportsChip
                                                    key={sport}
                                                    label={sport}
                                                    icon={getSportIcon(sport)}
                                                    onClick={() => toggleSportFilter(sport)}
                                                    selected={selectedSports.includes(sport)}
                                                    color={selectedSports.includes(sport) ? "primary" : "default"}
                                                    variant={selectedSports.includes(sport) ? "filled" : "outlined"}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Experience Level</Typography>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={experienceFilter}
                                                onChange={handleExperienceFilterChange}
                                            >
                                                <MenuItem value="all">All Levels</MenuItem>
                                                <MenuItem value="beginner">Beginner (0-2 years)</MenuItem>
                                                <MenuItem value="intermediate">Intermediate (2-5 years)</MenuItem>
                                                <MenuItem value="advanced">Advanced (5-10 years)</MenuItem>
                                                <MenuItem value="expert">Expert (10+ years)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="text"
                                            onClick={handleResetFilters}
                                            sx={{ mr: 1 }}
                                        >
                                            Reset All
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => setShowFilters(false)}
                                        >
                                            Apply Filters
                                        </Button>
                                    </Box>
                                </FilterPanel>
                            )}
                        </SearchSection>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="contacts tabs"
                                variant="fullWidth"
                            >
                                <Tab label={`Following (${followingContacts.length})`} />
                                <Tab label="Suggested Athletes" />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            {isLoading ? (
                                Array(3).fill().map((_, idx) => <LoadingSkeleton key={idx} />)
                            ) : followingContacts.length > 0 ? (
                                followingContacts.map(contact => (
                                    <ContactCardItem key={contact.id} contact={contact} />
                                ))
                            ) : (
                                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                        No matching results
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your search or filters to find more connections
                                    </Typography>
                                </Paper>
                            )}
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            {isLoading ? (
                                Array(3).fill().map((_, idx) => <LoadingSkeleton key={idx} />)
                            ) : suggestedContacts.length > 0 ? (
                                suggestedContacts.map(contact => (
                                    <ContactCardItem key={contact.id} contact={contact} />
                                ))
                            ) : (
                                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                        No suggested athletes match your criteria
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your search or filters to find people to follow
                                    </Typography>
                                </Paper>
                            )}
                        </TabPanel>
                    </StyledCard>
                </Container>
            </ContactsContainer>
        </AppTheme>
    );
}