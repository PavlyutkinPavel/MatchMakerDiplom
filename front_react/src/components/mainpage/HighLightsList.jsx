import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // For API calls

// Material UI Components
import {
    Avatar, AvatarGroup, Box, Button, Card, CardContent, CardMedia,
    Chip, Container, CssBaseline, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, Fab, FormControl, FormHelperText, Grid,
    IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput,
    Select, Skeleton, Slide, Snackbar, Alert, Stack, Tab, Tabs,
    TextField, Tooltip, Typography, ImageListItem
} from '@mui/material';

// Material UI Icons
import {
    AccessTime, Add, Close, FileUpload, Image, PlayArrow,
    PhotoCamera, RssFeedRounded, Schedule, SearchRounded,
    ThumbUp, ThumbDown, ThumbUpOutlined, ThumbDownOutlined,
    Upload, YouTube
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";
import api from "../../api";
import useApplicationStore from "../../store/useApplicationStore";
import {Link} from "react-router-dom";
// Adjust path as needed

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.18)',
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.3,
});

// Search component
function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
            <OutlinedInput
                size="small"
                id="search"
                placeholder="Search highlights"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ flexGrow: 1 }}
                startAdornment={
                    <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                        <SearchRounded fontSize="small" />
                    </InputAdornment>
                }
                inputProps={{
                    'aria-label': 'search',
                }}
            />
        </FormControl>
    );
}

// Author component for cards
function Author({ authors, date }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                <AvatarGroup max={3}>
                    {authors.map((author, index) => (
                        <Avatar
                            key={index}
                            alt={author.name}
                            src={author.avatarUrl}
                            sx={{ width: 24, height: 24 }}
                        />
                    ))}
                </AvatarGroup>
                <Typography variant="caption">
                    {authors.map((author) => author.name).join(', ')}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                    {date}
                </Typography>
            </Box>
        </Box>
    );
}

Author.propTypes = {
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            avatarUrl: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    date: PropTypes.string.isRequired,
};

// Highlight Card Component
const HighlightCard = ({ highlight, onLike, onDislike }) => {
    const [liked, setLiked] = useState(highlight.userLiked || false);
    const [disliked, setDisliked] = useState(highlight.userDisliked || false);
    const [openVideoDialog, setOpenVideoDialog] = useState(false);

    const handleOpenDialog = () => setOpenVideoDialog(true);
    const handleCloseDialog = () => setOpenVideoDialog(false);

    const handleLike = () => {
        if (disliked) {
            setDisliked(false);
            onDislike(highlight.id, false);
        }

        const newLiked = !liked;
        setLiked(newLiked);
        onLike(highlight.id, newLiked);
    };

    const handleDislike = () => {
        if (liked) {
            setLiked(false);
            onLike(highlight.id, false);
        }

        const newDisliked = !disliked;
        setDisliked(newDisliked);
        onDislike(highlight.id, newDisliked);
    };

    const handleMediaClick = () => {
        if (highlight.type === 'VIDEO') {
            handleOpenDialog();
        }
    };

    return (
        <StyledCard
            variant="outlined"
            tabIndex={0}
        >
            {/* Единое отображение медиа */}
            <Box sx={{ position: 'relative' }}>
                {highlight.type === 'VIDEO' ? (
                    // Для видео показываем превью с кнопкой воспроизведения
                    <>
                        <CardMedia
                            component="img"
                            height="240"
                            image={highlight.thumbnailUrl}
                            alt={highlight.title}
                            sx={{
                                objectFit: 'cover',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    filter: 'brightness(0.9)'
                                }
                            }}
                            onClick={handleMediaClick}
                        />

                        {/* Оверлей с кнопкой воспроизведения */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%)',
                                    '& .play-button': {
                                        transform: 'scale(1.1)',
                                        backgroundColor: 'rgba(255,255,255,0.4)'
                                    }
                                }
                            }}
                            onClick={handleMediaClick}
                        >
                            <IconButton
                                className="play-button"
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(8px)',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.3)'
                                    }
                                }}
                            >
                                <PlayArrow sx={{ fontSize: 54, color: 'white' }} />
                            </IconButton>
                        </Box>

                        {/* Продолжительность видео */}
                        {highlight.duration && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 12,
                                    right: 12,
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: 12,
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <AccessTime sx={{ fontSize: 14 }} />
                                {highlight.duration}
                            </Box>
                        )}
                    </>
                ) : (
                    // Для изображений просто показываем картинку
                    <CardMedia
                        component="img"
                        height="240"
                        image={highlight.mediaUrl}
                        alt={highlight.title}
                        sx={{
                            objectFit: 'cover',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)'
                            }
                        }}
                    />
                )}

                {/* Чип с типом контента */}
                <Chip
                    icon={highlight.type === 'VIDEO' ? <YouTube fontSize="small" /> : <Image fontSize="small" />}
                    label={highlight.sport}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        '& .MuiChip-icon': {
                            color: 'white'
                        }
                    }}
                />
            </Box>

            {/* Информация о контенте */}
            <StyledCardContent>
                <Typography gutterBottom variant="caption" component="div" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {highlight.tournament}
                </Typography>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                    {highlight.title}
                </Typography>
                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                    {highlight.description}
                </StyledTypography>
            </StyledCardContent>

            {/* Полноэкранный диалог для видео */}
            <Dialog
                open={openVideoDialog}
                onClose={handleCloseDialog}
                fullScreen
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'black'
                    }
                }}
                TransitionComponent={Slide}
                TransitionProps={{
                    direction: 'up'
                }}
            >
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Кнопка закрытия */}
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            top: 24,
                            right: 24,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            zIndex: 1000,
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>

                    {/* Видео iframe */}
                    <Box
                        sx={{
                            width: '90%',
                            maxWidth: '1200px',
                            aspectRatio: '16/9',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
                        }}
                    >
                        <Box
                            component="iframe"
                            src={highlight.mediaUrl}
                            title={highlight.title}
                            allowFullScreen
                            sx={{
                                width: '100%',
                                height: '100%',
                                border: 0,
                            }}
                        />
                    </Box>
                </Box>
            </Dialog>

            <Divider sx={{ mx: 2 }} />

            {/* Действия и метаданные */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Нравится" arrow>
                        <IconButton
                            size="small"
                            onClick={handleLike}
                            color={liked ? 'primary' : 'default'}
                            sx={{
                                mr: 0.5,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            {liked ? <ThumbUp /> : <ThumbUpOutlined />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ mr: 2, fontWeight: 'medium' }}>
                        {highlight.likes}
                    </Typography>

                    <Tooltip title="Не нравится" arrow>
                        <IconButton
                            size="small"
                            onClick={handleDislike}
                            color={disliked ? 'error' : 'default'}
                            sx={{
                                mr: 0.5,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            {disliked ? <ThumbDown /> : <ThumbDownOutlined />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {highlight.dislikes}
                    </Typography>
                </Box>

                <Chip
                    label={highlight.category}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        fontWeight: 'medium',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white'
                        }
                    }}
                />
            </Box>

            <Author authors={highlight.authors} date={highlight.createdAt} />
        </StyledCard>
    );
};

// Skeleton for loading state
const HighlightSkeleton = () => {
    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <Skeleton variant="rectangular" height={240} animation="wave" />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1 }} />
                        <Skeleton variant="text" width={100} />
                    </Box>
                    <Skeleton variant="text" width={80} />
                </Box>
                <Skeleton variant="text" height={48} />
                <Box sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 1 }} />
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex' }}>
                    <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                    <Skeleton variant="text" width={30} sx={{ mr: 2 }} />
                    <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                    <Skeleton variant="text" width={30} />
                </Box>
            </CardContent>
        </Card>
    );
};

// Add Highlight Form Dialog
const AddHighlightForm = ({ open, onClose, onSubmit, categories, sports, tournaments }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        type: 'VIDEO',
        description: '',
        mediaFile: null,
        thumbnailFile: null,
        duration: '',
        tournament: '',
        sport: '',
        category: '',
    });
    const [errors, setErrors] = useState({});
    const [filePreview, setFilePreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setFormData(prev => ({
            ...prev,
            type: newValue === 0 ? 'VIDEO' : 'PHOTO'
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleMediaFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFilePreview(reader.result);
            setFormData(prev => ({
                ...prev,
                mediaFile: file
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setThumbnailPreview(reader.result);
            setFormData(prev => ({
                ...prev,
                thumbnailFile: file
            }));
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.mediaFile) newErrors.mediaFile = `${formData.type === 'VIDEO' ? 'Video' : 'Photo'} is required`;
        if (formData.type === 'VIDEO' && !formData.thumbnailFile) newErrors.thumbnailFile = 'Thumbnail is required';
        if (!formData.tournament) newErrors.tournament = 'Tournament is required';
        if (!formData.sport) newErrors.sport = 'Sport is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (formData.type === 'VIDEO' && !formData.duration.trim()) newErrors.duration = 'Duration is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Create form data for file upload
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('title', formData.title);
            formDataToSubmit.append('description', formData.description);
            formDataToSubmit.append('type', formData.type);
            formDataToSubmit.append('mediaFile', formData.mediaFile);
            if (formData.thumbnailFile) {
                formDataToSubmit.append('thumbnailFile', formData.thumbnailFile);
            }
            formDataToSubmit.append('tournament', formData.tournament);
            formDataToSubmit.append('sport', formData.sport);
            formDataToSubmit.append('category', formData.category);
            if (formData.duration) {
                formDataToSubmit.append('duration', formData.duration);
            }

            onSubmit(formDataToSubmit);

            // Reset form
            setFormData({
                title: '',
                type: 'VIDEO',
                description: '',
                mediaFile: null,
                thumbnailFile: null,
                duration: '',
                tournament: '',
                sport: '',
                category: '',
            });
            setFilePreview(null);
            setThumbnailPreview(null);
            setActiveTab(0);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                    Add New Highlight
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<YouTube />} label="Video" />
                    <Tab icon={<PhotoCamera />} label="Photo" />
                </Tabs>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name="title"
                            label="Title"
                            fullWidth
                            variant="outlined"
                            value={formData.title}
                            onChange={handleChange}
                            error={!!errors.title}
                            helperText={errors.title}
                            required
                        />

                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            variant="outlined"
                            value={formData.description}
                            onChange={handleChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            sx={{ mt: 2 }}
                            required
                        />

                        <Grid container spacing={2} sx={{ mt: 0 }}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" required sx={{ mt: 2 }}>
                                    <InputLabel>Sport</InputLabel>
                                    <Select
                                        name="sport"
                                        value={formData.sport}
                                        onChange={handleChange}
                                        label="Sport"
                                        error={!!errors.sport}
                                    >
                                        <MenuItem value="">Select a sport</MenuItem>
                                        {sports.map((sport) => (
                                            <MenuItem key={sport.id} value={sport.id}>{sport.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.sport && <FormHelperText error>{errors.sport}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" required sx={{ mt: 2 }}>
                                    <InputLabel>Tournament</InputLabel>
                                    <Select
                                        name="tournament"
                                        value={formData.tournament}
                                        onChange={handleChange}
                                        label="Tournament"
                                        error={!!errors.tournament}
                                    >
                                        <MenuItem value="">Select a tournament</MenuItem>
                                        {tournaments.map((tournament) => (
                                            <MenuItem key={tournament.id} value={tournament.id}>{tournament.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.tournament && <FormHelperText error>{errors.tournament}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" required sx={{ mt: 2 }}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        label="Category"
                                        error={!!errors.category}
                                    >
                                        <MenuItem value="">Select a category</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.category && <FormHelperText error>{errors.category}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {formData.type === 'VIDEO' && (
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="duration"
                                        label="Duration"
                                        fullWidth
                                        variant="outlined"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g. 2:45"
                                        error={!!errors.duration}
                                        helperText={errors.duration || "Format: minutes:seconds"}
                                        required
                                        sx={{ mt: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccessTime />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            {formData.type === 'VIDEO' ? 'Upload Video' : 'Upload Photo'}
                        </Typography>
                        <Box
                            sx={{
                                border: '2px dashed',
                                borderColor: filePreview ? 'primary.main' : 'divider',
                                borderRadius: 2,
                                p: 2,
                                textAlign: 'center',
                                backgroundColor: filePreview ? 'action.hover' : 'background.paper',
                                position: 'relative',
                                height: 200,
                                mb: 2
                            }}
                        >
                            {filePreview ? (
                                <>
                                    {formData.type === 'VIDEO' ? (
                                        <Box
                                            component="video"
                                            src={filePreview}
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                width: 'auto',
                                                height: '100%',
                                                margin: '0 auto',
                                                display: 'block'
                                            }}
                                            controls
                                        />
                                    ) : (
                                        <Box
                                            component="img"
                                            src={filePreview}
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                width: 'auto',
                                                height: '100%',
                                                margin: '0 auto',
                                                display: 'block',
                                                objectFit: 'contain'
                                            }}
                                            alt="Preview"
                                        />
                                    )}
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                        }}
                                        onClick={() => {
                                            setFilePreview(null);
                                            setFormData(prev => ({ ...prev, mediaFile: null }));
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%'
                                    }}
                                >
                                    <Upload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        Drag and drop your {formData.type === 'VIDEO' ? 'video' : 'photo'} here
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        or
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<FileUpload />}
                                    >
                                        Browse Files
                                        <input
                                            type="file"
                                            accept={formData.type === 'VIDEO' ? 'video/*' : 'image/*'}
                                            hidden
                                            onChange={handleMediaFileChange}
                                        />
                                    </Button>
                                </Box>
                            )}
                        </Box>
                        {errors.mediaFile && (
                            <FormHelperText error>{errors.mediaFile}</FormHelperText>
                        )}

                        {formData.type === 'VIDEO' && (
                            <>
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                    Upload Thumbnail
                                </Typography>
                                <Box
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: thumbnailPreview ? 'primary.main' : 'divider',
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: thumbnailPreview ? 'action.hover' : 'background.paper',
                                        position: 'relative',
                                        height: 150
                                    }}
                                >
                                    {thumbnailPreview ? (
                                        <>
                                            <Box
                                                component="img"
                                                src={thumbnailPreview}
                                                sx={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    width: 'auto',
                                                    height: '100%',
                                                    margin: '0 auto',
                                                    display: 'block',
                                                    objectFit: 'contain'
                                                }}
                                                alt="Thumbnail Preview"
                                            />
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                                }}
                                                onClick={() => {
                                                    setThumbnailPreview(null);
                                                    setFormData(prev => ({ ...prev, thumbnailFile: null }));
                                                }}
                                            >
                                                <Close />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%'
                                            }}
                                        >
                                            <Image sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Upload a thumbnail image for your video
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                startIcon={<FileUpload />}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            >
                                                Select Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={handleThumbnailFileChange}
                                                />
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                                {errors.thumbnailFile && (
                                    <FormHelperText error>{errors.thumbnailFile}</FormHelperText>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                >
                    Submit Highlight
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Highlights Component
const HighlightsBlog = () => {
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sportFilter, setSportFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [categories, setCategories] = useState([]);
    const [sports, setSports] = useState([]);
    const [tournaments, setTournaments] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const store = useApplicationStore();

    const isAuthenticated = useApplicationStore((state) => state.auth.isAuthenticated);


    // Fetch highlights data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // GET /highlights-api/highlights with query parameters for filtering
                const params = new URLSearchParams();
                if (sportFilter !== 'all') params.append('sport', sportFilter);
                if (categoryFilter !== 'all') params.append('category', categoryFilter);
                if (typeFilter !== 'all') params.append('type', typeFilter);
                if (searchTerm) params.append('search', searchTerm);

                const response = await api.get(`/highlights-api/highlights?${params.toString()}`);

                /*const baseMediaPath = '../../../../SportEventsTournaments'; // или '/SportEventsTournaments' — зависит от структуры проекта

                const updatedHighlights = response.data.map(item => {
                    const prependPath = (url) =>
                        url && !urlstartsWith(baseMediaPath) ? `${baseMediaPath}${url}` : url;

                    return {
                        ...item,
                        mediaUrl: prependPath(item.mediaUrl),
                        thumbnailUrl: prependPath(item.thumbnailUrl)
                    };
                });*/

                setHighlights(response.data);


                console.log(response.data);

            } catch (error) {
                console.error('Error fetching highlights:', error);
                setNotification({
                    open: true,
                    message: 'Failed to load highlights. Please try again later.',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sportFilter, categoryFilter, typeFilter, searchTerm]);

    // Fetch categories, sports, and tournaments for the form
    useEffect(() => {
        const fetchFormData = async () => {
            try {
                // Parallel requests for efficiency
                const [categoriesRes, sportsRes, tournamentsRes] = await Promise.all([
                    api.get('/highlights-api/categories'),
                    api.get('/highlights-api/sports'),
                    api.get('/highlights-api/tournaments')
                ]);

                setCategories(categoriesRes.data);
                setSports(sportsRes.data);
                setTournaments(tournamentsRes.data);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, []);

    const handleLike = async (id, liked) => {
        try {
            // POST /highlights-api/highlights/{id}/like with liked status
            await api.post(`/highlights-api/highlights/${id}/like`, { liked });

            // Update local state to reflect the change
            setHighlights(highlights.map(highlight =>
                highlight.id === id ? {
                    ...highlight,
                    likes: liked ? highlight.likes + 1 : highlight.likes - 1,
                    userLiked: liked
                } : highlight
            ));
        } catch (error) {
            console.error('Error liking highlight:', error);
            setNotification({
                open: true,
                message: 'Failed to register like. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleDislike = async (id, disliked) => {
        try {
            // POST /highlights-api/highlights/{id}/dislike with disliked status
            await api.post(`/highlights-api/highlights/${id}/dislike`, { disliked });

            // Update local state to reflect the change
            setHighlights(highlights.map(highlight =>
                highlight.id === id ? {
                    ...highlight,
                    dislikes: disliked ? highlight.dislikes + 1 : highlight.dislikes - 1,
                    userDisliked: disliked
                } : highlight
            ));
        } catch (error) {
            console.error('Error disliking highlight:', error);
            setNotification({
                open: true,
                message: 'Failed to register dislike. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleAddHighlight = async (formData) => {
        try {
            // POST /highlights-api/highlights with multipart form data
            const response = await api.post('/highlights-api/highlights', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Add the new highlight to the list
            setHighlights([response.data, ...highlights]);

            setNotification({
                open: true,
                message: 'Highlight successfully added!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding highlight:', error);
            setNotification({
                open: true,
                message: 'Failed to add highlight. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Container maxWidth="xl" sx={{ pt: 8, pb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            backgroundImage: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Tournament Highlights
                    </Typography>

                    {isAuthenticated
                        ? (<>
                            <Fab
                                color="primary"
                                aria-label="add highlight"
                                onClick={() => setDialogOpen(true)}
                                sx={{
                                    boxShadow: '0 8px 16px rgba(63, 81, 181, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(63, 81, 181, 0.4)',
                                    }
                                }}
                            >
                                <Add />
                            </Fab>
                        </>)
                        : (<>
                        </>)}

                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 2, md: 4 },
                        mb: 4,
                        justifyContent: 'space-between',
                        alignItems: { xs: 'start', md: 'center' },
                    }}
                >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                            label="All Categories"
                            onClick={() => setCategoryFilter('all')}
                            color={categoryFilter === 'all' ? 'primary' : 'default'}
                            variant={categoryFilter === 'all' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                        {categories.map(category => (
                            <Chip
                                key={category.id}
                                label={category.name}
                                onClick={() => setCategoryFilter(category.id)}
                                color={categoryFilter === category.id ? 'primary' : 'default'}
                                variant={categoryFilter === category.id ? 'filled' : 'outlined'}
                                sx={{ borderRadius: 2 }}
                            />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Search onSearch={handleSearch} />
                        <IconButton
                            size="small"
                            aria-label="RSS feed"
                            sx={{
                                backgroundColor: 'action.selected',
                                borderRadius: 1,
                                '&:hover': { backgroundColor: 'action.hover' }
                            }}
                        >
                            <RssFeedRounded />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    <Chip
                        label="All Sports"
                        onClick={() => setSportFilter('all')}
                        color={sportFilter === 'all' ? 'secondary' : 'default'}
                        variant={sportFilter === 'all' ? 'filled' : 'outlined'}
                        sx={{ borderRadius: 2 }}
                    />
                    {sports.map(sport => (
                        <Chip
                            key={sport.id}
                            label={sport.name}
                            onClick={() => setSportFilter(sport.id)}
                            color={sportFilter === sport.id ? 'secondary' : 'default'}
                            variant={sportFilter === sport.id ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                    ))}

                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        <Chip
                            icon={<YouTube fontSize="small" />}
                            label="Videos"
                            onClick={() => setTypeFilter(typeFilter === 'VIDEO' ? 'all' : 'VIDEO')}
                            color={typeFilter === 'VIDEO' ? 'info' : 'default'}
                            variant={typeFilter === 'VIDEO' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                        <Chip
                            icon={<Image fontSize="small" />}
                            label="Photos"
                            onClick={() => setTypeFilter(typeFilter === 'PHOTO' ? 'all' : 'PHOTO')}
                            color={typeFilter === 'PHOTO' ? 'info' : 'default'}
                            variant={typeFilter === 'PHOTO' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {loading ? (
                        // Show skeletons while loading
                        Array.from(new Array(6)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <HighlightSkeleton />
                            </Grid>
                        ))
                    ) : (
                        // Show highlights after loading
                        highlights.length > 0 ? (
                            highlights.map((highlight) => (
                                <Grid item xs={12} sm={6} md={4} key={highlight.id}>
                                    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                                        <Box>
                                            <HighlightCard
                                                highlight={highlight}
                                                onLike={handleLike}
                                                onDislike={handleDislike}
                                            />
                                        </Box>
                                    </Slide>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: 8,
                                        backgroundColor: 'background.paper',
                                        borderRadius: 3,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No highlights found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Try changing your filters or be the first to add a highlight
                                    </Typography>
                                    {isAuthenticated
                                        ? (<>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<Add />}
                                                onClick={() => setDialogOpen(true)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Add Highlight
                                            </Button>
                                        </>)
                                        : (<>
                                        </>)}

                                </Box>
                            </Grid>
                        )
                    )}
                </Grid>

                {/* Add Highlight Dialog */}

                {isAuthenticated
                    ? (<>
                        <AddHighlightForm
                            open={dialogOpen}
                            onClose={() => setDialogOpen(false)}
                            onSubmit={handleAddHighlight}
                            categories={categories}
                            sports={sports}
                            tournaments={tournaments}
                        />
                    </>)
                    : (<>
                    </>)}


                {/* Notification Snackbar */}
                <Snackbar
                    open={notification.open}
                    autoHideDuration={6000}
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseNotification}
                        severity={notification.severity}
                        variant="filled"
                        sx={{ width: '100%', borderRadius: 2 }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Container>
        </AppTheme>
    );
};

export default HighlightsBlog;