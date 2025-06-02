import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";

// Стилизованные компоненты
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

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `4px solid ${theme.palette.background.paper}`,
    margin: theme.spacing(0, 'auto', 2),
}));

const SportCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'hsla(220, 30%, 5%, 0.03) 0px 2px 5px 0px',
}));

const PageHeading = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
}));

// Получаем иконку для спорта
const getSportIcon = (sportName) => {
    switch (sportName.toLowerCase()) {
        case 'basketball':
            return <SportsBasketballIcon color="primary" />;
        case 'tennis':
            return <SportsTennisIcon color="primary" />;
        case 'soccer':
            return <SportsSoccerIcon color="primary" />;
        case 'weight training':
        case 'fitness':
            return <FitnessCenterIcon color="primary" />;
        default:
            return <SportsSoccerIcon color="primary" />;
    }
};

// Функция для определения уровня опыта спорта (для Select)
const experienceLevels = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' },
];

// Интерфейс для UserProfileDTO
class UserProfileDTO {
    constructor(userData) {
        this.name = userData.name;
        this.username = userData.username;
        this.bio = userData.bio;
        this.location = userData.location;
        this.email = userData.email;
        // Fix: Handle undefined sports array
        this.sports = (userData.sports || []).map(sport => ({
            name: sport.name,
            level: sport.level,
            experience: sport.experience
        }));
    }
}

export default function EditProfile() {
    const navigate = useNavigate();
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    // Fix: Initialize with default empty arrays
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        bio: '',
        location: '',
        email: '',
        sports: [], // Ensure this is always an array
        hobbies: [],
        contacts: [],
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/user/profile', {
                    withCredentials: true,
                    headers:{
                        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                    }
                });

                // Fix: Ensure sports is always an array
                const profileData = {
                    ...response.data,
                    sports: response.data.sports || [],
                    hobbies: response.data.hobbies || [],
                    contacts: response.data.contacts || []
                };

                setUserData(profileData);

                try {
                    const avatarResponse = await axios.get('http://localhost:8080/user/avatar', {
                        withCredentials: true,
                        responseType: 'blob',
                        headers:{
                            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                        }
                    });
                    const avatarUrl = URL.createObjectURL(avatarResponse.data);
                    setAvatarPreview(avatarUrl);

                    // Fix: Clean up the avatar URL when component unmounts
                    return () => {
                        if (avatarUrl) {
                            URL.revokeObjectURL(avatarUrl);
                        }
                    };
                } catch (avatarError) {
                    console.error('Error loading avatar:', avatarError);
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const cleanup = fetchUserProfile();

        // Return cleanup function
        return () => {
            if (cleanup && typeof cleanup === 'function') {
                cleanup();
            }
        };
    }, []);

    // Обновление данных профиля
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSportChange = (index, field, value) => {
        const updatedSports = [...userData.sports];
        updatedSports[index] = { ...updatedSports[index], [field]: value };
        setUserData(prev => ({
            ...prev,
            sports: updatedSports
        }));
    };

    const handleAddSport = () => {
        setUserData(prev => ({
            ...prev,
            sports: [...prev.sports, { name: '', level: 'Beginner', experience: 1 }]
        }));
    };

    const handleRemoveSport = (index) => {
        const updatedSports = [...userData.sports];
        updatedSports.splice(index, 1);
        setUserData(prev => ({
            ...prev,
            sports: updatedSports
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Обновляем профиль - исправленный URL
            const profileDto = new UserProfileDTO(userData);
            await axios.put('http://localhost:8080/user/profile', profileDto, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                }
            });

            // Загружаем аватар - исправленный URL
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);

                await axios.post('http://localhost:8080/user/avatar', formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                    }
                });
            }

            setShowSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    // Don't render the form until userData is loaded
    if (loading && !userData.name) {
        return (
            <AppTheme>
                <AppAppBar />
                <ProfileContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress size={60} />
                    </Box>
                </ProfileContainer>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleCancel}
                            >
                                Back to Profile
                            </Button>
                            <PageHeading variant="h4" component="h1">
                                Edit Profile
                            </PageHeading>
                            <Box sx={{ width: 100 }} /> {/* для центрирования заголовка */}
                        </Box>

                        {showSuccess && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Profile updated successfully! Redirecting...
                            </Alert>
                        )}

                        {/* Сообщение об ошибке */}
                        <Snackbar
                            open={!!error}
                            autoHideDuration={6000}
                            onClose={handleCloseError}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                        </Snackbar>

                        {/* Индикатор загрузки */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                                <LargeAvatar
                                    alt={userData.name}
                                    src={avatarPreview || "/path-to-avatar.jpg"}
                                >
                                    {!avatarPreview && userData.name && userData.name.charAt(0)}
                                </LargeAvatar>
                                <Box sx={{ mt: 1 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="avatar-upload"
                                        type="file"
                                        onChange={handleAvatarChange}
                                    />
                                    <label htmlFor="avatar-upload">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<PhotoCamera />}
                                            size="small"
                                        >
                                            Change Photo
                                        </Button>
                                    </label>
                                </Box>
                            </Box>

                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                Basic Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Full Name"
                                        name="name"
                                        value={userData.name || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Username"
                                        name="username"
                                        value={userData.username || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Bio"
                                        name="bio"
                                        value={userData.bio || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        inputProps={{ maxLength: 500 }}
                                        helperText={`${(userData.bio || '').length}/500 characters`}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={userData.email || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Location"
                                        name="location"
                                        value={userData.location || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                                Sports & Skills
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {userData.sports.map((sport, index) => (
                                <SportCard key={index}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                label="Sport Name"
                                                value={sport.name || ''}
                                                onChange={(e) => handleSportChange(index, 'name', e.target.value)}
                                                fullWidth
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            {getSportIcon(sport.name || '')}
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Level</InputLabel>
                                                <Select
                                                    value={sport.level || 'Beginner'}
                                                    onChange={(e) => handleSportChange(index, 'level', e.target.value)}
                                                    input={<OutlinedInput label="Level" />}
                                                >
                                                    {experienceLevels.map((level) => (
                                                        <MenuItem key={level.value} value={level.value}>
                                                            {level.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={10} md={4}>
                                            <TextField
                                                label="Years of Experience"
                                                type="number"
                                                value={sport.experience || 1}
                                                onChange={(e) => handleSportChange(index, 'experience', parseInt(e.target.value) || 0)}
                                                fullWidth
                                                InputProps={{
                                                    inputProps: { min: 0 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveSport(index)}
                                                disabled={userData.sports.length <= 1}
                                            >
                                                <RemoveCircleIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </SportCard>
                            ))}

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircleIcon />}
                                    onClick={handleAddSport}
                                >
                                    Add Sport
                                </Button>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                    size="large"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </form>
                    </StyledCard>
                </Container>
            </ProfileContainer>
        </AppTheme>
    );
}