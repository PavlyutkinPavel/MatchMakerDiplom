import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
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
        maxWidth: '800px',
    },
    ...theme.applyStyles?.('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const ReviewContainer = styled(Box)(({ theme }) => ({
    backgroundImage: theme.palette.mode === 'dark'
        ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
        : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    padding: theme.spacing(2),
    minHeight: '100%',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2.5),
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

const FilterBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(3),
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));

// ��������� Reviews ��� MatchMaker
export default function MatchMakerReviews() {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    // ������ �������
    const reviewData = [
        {
            id: 1,
            name: 'Alex Johnson',
            date: '12 Apr 2025',
            rating: 5,
            review: 'MatchMaker made organizing our local basketball tournament a breeze! The interface is intuitive, and the support team helped us set up our custom brackets within minutes. Definitely recommend for any sports event organizer.',
            avatar: 'A',
            tournamentType: 'basketball',
            verified: true
        },
        {
            id: 2,
            name: 'Maria Garcia',
            date: '8 Apr 2025',
            rating: 4,
            review: 'We used MatchMaker for our school soccer championships. The platform handled multiple teams and complex schedules perfectly. The only minor issue was with real-time score updates being occasionally delayed.',
            avatar: 'M',
            tournamentType: 'soccer',
            verified: true
        },
        {
            id: 3,
            name: 'David Chen',
            date: '27 Mar 2025',
            rating: 5,
            review: 'As a tennis club manager, I\'ve tried many tournament platforms, but MatchMaker stands out for its flexibility and ease of use. The automated notifications kept all participants informed, and the real-time leaderboard generated a lot of excitement.',
            avatar: 'D',
            tournamentType: 'tennis',
            verified: true
        },
        {
            id: 4,
            name: 'Emma Wilson',
            date: '15 Mar 2025',
            rating: 3,
            review: 'The platform works well for most features, but we had some issues with the payment system when collecting tournament fees. Customer service was responsive, though it took a couple of days to resolve the problem.',
            avatar: 'E',
            tournamentType: 'volleyball',
            verified: false
        },
        {
            id: 5,
            name: 'James Brown',
            date: '3 Mar 2025',
            rating: 5,
            review: 'Used MatchMaker for our charity cricket tournament with 16 teams. The customizable rules and scoring system were perfect for our unique format. The spectator view was also a hit with fans who couldn\'t attend in person.',
            avatar: 'J',
            tournamentType: 'cricket',
            verified: true
        },
        {
            id: 6,
            name: 'Sophia Lee',
            date: '20 Feb 2025',
            rating: 4,
            review: 'Great platform for our swimming competition. The ability to track individual times and automatically calculate team scores saved us hours of manual work. Would appreciate more swimming-specific features in future updates.',
            avatar: 'S',
            tournamentType: 'swimming',
            verified: true
        },
    ];

    // ���������� �������
    const filteredReviews = reviewData.filter(review => {
        if (filter === 'all') return true;
        if (filter === 'verified') return review.verified;
        if (filter === '5star') return review.rating === 5;
        if (filter === '4star') return review.rating === 4;
        if (filter === '3below') return review.rating <= 3;
        return true;
    });

    // ���������� �������
    const sortedReviews = [...filteredReviews].sort((a, b) => {
        if (sortBy === 'recent') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'highest') {
            return b.rating - a.rating;
        } else if (sortBy === 'lowest') {
            return a.rating - b.rating;
        }
        return 0;
    });

    // ��������� �������� ��������
    const averageRating = reviewData.reduce((acc, review) => acc + review.rating, 0) / reviewData.length;

    return (
        <AppTheme>
            <AppAppBar />
            <ReviewContainer sx={{ margin: 5 }}>
                <CssBaseline enableColorScheme />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <StyledCard variant="outlined">
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                                Client Reviews
                            </Typography>
                            <Divider sx={{ width: '80px', height: '3px', mx: 'auto', mb: 2, bgcolor: 'black' }} />
                            <Typography variant="subtitle1" color="text.secondary">
                                See what organizers and participants are saying about MatchMaker
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                                <Rating value={averageRating} precision={0.5} readOnly size="large" />
                                <Typography variant="h6" sx={{ ml: 1 }}>
                                    {averageRating.toFixed(1)} / 5
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    ({reviewData.length} reviews)
                                </Typography>
                            </Box>
                        </Box>

                        <FilterBox>
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel id="filter-label">Filter</InputLabel>
                                <Select
                                    labelId="filter-label"
                                    id="filter-select"
                                    value={filter}
                                    label="Filter"
                                    onChange={handleFilterChange}
                                    size="small"
                                >
                                    <MenuItem value="all">All Reviews</MenuItem>
                                    <MenuItem value="verified">Verified Users</MenuItem>
                                    <MenuItem value="5star">5 Star</MenuItem>
                                    <MenuItem value="4star">4 Star</MenuItem>
                                    <MenuItem value="3below">3 Star & Below</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel id="sort-label">Sort By</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    id="sort-select"
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={handleSortChange}
                                    size="small"
                                >
                                    <MenuItem value="recent">Most Recent</MenuItem>
                                    <MenuItem value="highest">Highest Rating</MenuItem>
                                    <MenuItem value="lowest">Lowest Rating</MenuItem>
                                </Select>
                            </FormControl>
                        </FilterBox>

                        {sortedReviews.map((review) => (
                            <ReviewCard key={review.id}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={2}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    bgcolor: 'primary.main',
                                                    mb: 1
                                                }}
                                            >
                                                {review.avatar}
                                            </Avatar>
                                            {review.verified && (
                                                <Chip
                                                    label="Verified"
                                                    size="small"
                                                    color="success"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={10}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                {review.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {review.date}
                                            </Typography>
                                        </Box>
                                        <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {review.review}
                                        </Typography>
                                        <Chip
                                            label={review.tournamentType}
                                            size="small"
                                            sx={{
                                                bgcolor: 'primary.light',
                                                color: 'primary.dark',
                                                fontWeight: 500
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ReviewCard>
                        ))}

                        <Paper
                            elevation={0}
                            sx={{
                                mt: 4,
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                textAlign: 'center',
                                opacity: 0.9,
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 1, color: 'primary.dark' }}>
                                Share your experience with MatchMaker
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                                Submit a review to help us improve and help others make informed decisions
                            </Typography>
                        </Paper>
                    </StyledCard>
                </Container>
            </ReviewContainer>
        </AppTheme>
    );
}