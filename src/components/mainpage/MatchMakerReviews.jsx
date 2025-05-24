import * as React from 'react';
import { useState, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";

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

const ReviewButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 3),
    fontSize: '1rem',
    textTransform: 'none',
}));

// API URLs - заменить на реальные URL вашего API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const REVIEWS_ENDPOINT = `${API_BASE_URL}/reviews`;

export default function MatchMakerReviews() {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // Состояние для новой формы отзыва
    const [newReview, setNewReview] = useState({
        name: '',
        rating: 0,
        review: '',
        tournamentType: '',
        email: '', // для верификации
    });

    // Состояние ошибок формы
    const [formErrors, setFormErrors] = useState({
        name: false,
        rating: false,
        review: false,
        tournamentType: false,
        email: false,
    });

    // Загрузка отзывов при монтировании компонента
    useEffect(() => {
        fetchReviews();
    }, []);

    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
    });

    // Функция для загрузки отзывов с бэкенда
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(REVIEWS_ENDPOINT,{
                method: "GET",
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error(`API error with status ${response.status}`);
            }

            const data = await response.json();
            setReviews(data);
        } catch (err) {
            setError(err.message);
            setNotification({
                open: true,
                message: 'Failed to load reviews. Please try again later.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Обработчики для фильтров
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    // Обработчики для формы отзыва
    const handleReviewDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleReviewDialogClose = () => {
        setOpenDialog(false);
        resetForm();
    };

    const resetForm = () => {
        setNewReview({
            name: '',
            rating: 0,
            review: '',
            tournamentType: '',
            email: '',
        });
        setFormErrors({
            name: false,
            rating: false,
            review: false,
            tournamentType: false,
            email: false,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({
            ...prev,
            [name]: value
        }));
        // Сбросить ошибку при изменении
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    const handleRatingChange = (_, value) => {
        setNewReview(prev => ({
            ...prev,
            rating: value
        }));
        if (formErrors.rating) {
            setFormErrors(prev => ({
                ...prev,
                rating: false
            }));
        }
    };

    const validateForm = () => {
        const errors = {
            name: !newReview.name.trim(),
            rating: !newReview.rating,
            review: !newReview.review.trim() || newReview.review.length < 10,
            tournamentType: !newReview.tournamentType.trim(),
            email: !newReview.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newReview.email)
        };

        setFormErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);


            const reviewData = {
                name: newReview.name,
                rating: newReview.rating,
                review: newReview.review,
                tournamentType: newReview.tournamentType,
                email: newReview.email,
            };

            const response = await fetch(REVIEWS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error(`API error with status ${response.status}`);
            }

            // После успешной отправки закрываем диалог и обновляем список отзывов
            handleReviewDialogClose();
            await fetchReviews();

            setNotification({
                open: true,
                message: 'Your review has been submitted successfully!',
                severity: 'success'
            });

        } catch (err) {
            setNotification({
                open: true,
                message: 'Failed to submit your review. Please try again later.',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Фильтрация и сортировка отзывов
    const filteredReviews = reviews.filter(review => {
        if (filter === 'all') return true;
        if (filter === 'verified') return review.verified;
        if (filter === '5star') return review.rating === 5;
        if (filter === '4star') return review.rating === 4;
        if (filter === '3below') return review.rating <= 3;
        return true;
    });

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

    // Вычисление среднего рейтинга
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

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
                                    ({reviews.length} reviews)
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

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.dark', textAlign: 'center' }}>
                                <Typography>
                                    {error}
                                </Typography>
                            </Paper>
                        ) : (
                            <>
                                {sortedReviews.length === 0 ? (
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="body1">
                                            No reviews found matching your criteria.
                                        </Typography>
                                    </Paper>
                                ) : (
                                    sortedReviews.map((review) => (
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
                                                            {review.avatar || review.name.charAt(0)}
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
                                    ))
                                )}
                            </>
                        )}

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
                            <Typography variant="body1" sx={{ color: 'primary.dark', mb: 2 }}>
                                Submit a review to help us improve and help others make informed decisions
                            </Typography>
                            <ReviewButton
                                variant="contained"
                                color="primary"
                                onClick={handleReviewDialogOpen}
                            >
                                Write a Review
                            </ReviewButton>
                        </Paper>
                    </StyledCard>
                </Container>
            </ReviewContainer>

            {/* Диалог для добавления отзыва */}
            <Dialog
                open={openDialog}
                onClose={handleReviewDialogClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Share Your MatchMaker Experience</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        We appreciate your feedback! Please fill out the form below to submit your review.
                    </DialogContentText>
                    <Grid container spacing={2} component="form" onSubmit={handleSubmitReview}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                label="Your Name"
                                fullWidth
                                value={newReview.name}
                                onChange={handleInputChange}
                                required
                                error={formErrors.name}
                                helperText={formErrors.name ? "Name is required" : ""}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                label="Email Address"
                                fullWidth
                                value={newReview.email}
                                onChange={handleInputChange}
                                required
                                error={formErrors.email}
                                helperText={formErrors.email ? "Valid email is required" : "We'll use this for verification"}
                                margin="normal"
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mb: 1 }}>
                                <Typography component="legend">Your Rating</Typography>
                                <Rating
                                    name="rating"
                                    value={newReview.rating}
                                    onChange={handleRatingChange}
                                    size="large"
                                />
                                {formErrors.rating && (
                                    <FormHelperText error>Please select a rating</FormHelperText>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" error={formErrors.tournamentType}>
                                <InputLabel>Tournament Type</InputLabel>
                                <Select
                                    name="tournamentType"
                                    value={newReview.tournamentType}
                                    label="Tournament Type"
                                    onChange={handleInputChange}
                                    required
                                >
                                    <MenuItem value="basketball">Basketball</MenuItem>
                                    <MenuItem value="soccer">Soccer</MenuItem>
                                    <MenuItem value="tennis">Tennis</MenuItem>
                                    <MenuItem value="volleyball">Volleyball</MenuItem>
                                    <MenuItem value="cricket">Cricket</MenuItem>
                                    <MenuItem value="swimming">Swimming</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {formErrors.tournamentType && (
                                    <FormHelperText>Please select a tournament type</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="review"
                                label="Your Review"
                                fullWidth
                                value={newReview.review}
                                onChange={handleInputChange}
                                required
                                error={formErrors.review}
                                helperText={formErrors.review ? "Please provide a review (minimum 10 characters)" : ""}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReviewDialogClose} color="primary" disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        color="primary"
                        variant="contained"
                        disabled={submitting}
                        startIcon={submitting && <CircularProgress size={20} />}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Уведомления */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
}