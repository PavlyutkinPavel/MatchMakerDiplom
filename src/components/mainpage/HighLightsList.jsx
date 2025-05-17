import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    IconButton,
    Chip,
    Container,
    Divider,
    Avatar,
    Tooltip,
    useTheme,
    useMediaQuery,
    Skeleton,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Stack,
    InputAdornment,
    Tabs,
    Tab,
    Slide,
    Snackbar,
    Alert
} from '@mui/material';
import {
    ThumbUp,
    ThumbDown,
    ThumbUpOutlined,
    ThumbDownOutlined,
    Add,
    PlayArrow,
    Image,
    YouTube,
    FileUpload,
    Close,
    AccessTime,
    Schedule,
    PhotoCamera,
    Upload
} from '@mui/icons-material';
import CssBaseline from "@mui/material/CssBaseline";
import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";

// Mock highlights data
const mockHighlights = [
    {
        id: 1,
        title: 'Championship Finals Best Moments',
        type: 'video',
        media: 'https://example.com/video1.mp4', // Replace with real URL
        thumbnail: 'https://example.com/thumbnail1.jpg', // Replace with real URL
        duration: '2:45',
        tournament: 'City Cup 2025',
        sport: 'Football',
        date: 'May 10, 2025',
        likes: 245,
        dislikes: 12,
        author: {
            name: 'Sports Channel',
            avatar: 'https://example.com/avatar1.jpg' // Replace with real URL
        }
    },
    {
        id: 2,
        title: 'Tournament Best Goals Collection',
        type: 'video',
        media: 'https://example.com/video2.mp4', // Replace with real URL
        thumbnail: 'https://example.com/thumbnail2.jpg', // Replace with real URL
        duration: '3:20',
        tournament: 'Regional League 2025',
        sport: 'Football',
        date: 'May 5, 2025',
        likes: 189,
        dislikes: 7,
        author: {
            name: 'Sports Reviews',
            avatar: 'https://example.com/avatar2.jpg' // Replace with real URL
        }
    },
    {
        id: 3,
        title: 'Decisive Shots from Quarterfinals',
        type: 'photo',
        media: 'https://example.com/photo1.jpg', // Replace with real URL
        thumbnail: 'https://example.com/photo1.jpg', // Replace with real URL
        tournament: 'City Tournament 2025',
        sport: 'Basketball',
        date: 'May 2, 2025',
        likes: 320,
        dislikes: 18,
        author: {
            name: 'Basketball Portal',
            avatar: 'https://example.com/avatar3.jpg' // Replace with real URL
        }
    },
    {
        id: 4,
        title: 'Action Shot from the Final Match',
        type: 'photo',
        media: 'https://example.com/photo2.jpg', // Replace with real URL
        thumbnail: 'https://example.com/photo2.jpg', // Replace with real URL
        tournament: 'Volleyball League 2025',
        sport: 'Volleyball',
        date: 'May 7, 2025',
        likes: 127,
        dislikes: 3,
        author: {
            name: 'Sports Photography',
            avatar: 'https://example.com/avatar4.jpg' // Replace with real URL
        }
    },
    {
        id: 5,
        title: 'Action Shot from the Final Match',
        type: 'photo',
        media: 'https://example.com/photo2.jpg', // Replace with real URL
        thumbnail: 'https://example.com/photo2.jpg', // Replace with real URL
        tournament: 'Volleyball League 2025',
        sport: 'Volleyball',
        date: 'May 7, 2025',
        likes: 127,
        dislikes: 3,
        author: {
            name: 'Sports Photography',
            avatar: 'https://example.com/avatar4.jpg' // Replace with real URL
        }
    },
    {
        id: 6,
        title: 'Action Shot from the Final Match',
        type: 'photo',
        media: 'https://example.com/photo2.jpg', // Replace with real URL
        thumbnail: 'https://example.com/photo2.jpg', // Replace with real URL
        tournament: 'Volleyball League 2025',
        sport: 'Volleyball',
        date: 'May 7, 2025',
        likes: 127,
        dislikes: 3,
        author: {
            name: 'Sports Photography',
            avatar: 'https://example.com/avatar4.jpg' // Replace with real URL
        }
    },
    {
        id: 7,
        title: 'Action Shot from the Final Match',
        type: 'photo',
        media: 'https://example.com/photo2.jpg', // Replace with real URL
        thumbnail: 'https://example.com/photo2.jpg', // Replace with real URL
        tournament: 'Volleyball League 2025',
        sport: 'Volleyball',
        date: 'May 7, 2025',
        likes: 127,
        dislikes: 3,
        author: {
            name: 'Sports Photography',
            avatar: 'https://example.com/avatar4.jpg' // Replace with real URL
        }
    },
    {
        id: 8,
        title: 'Action Shot from the Final Match',
        type: 'photo',
        media: 'https://example.com/photo2.jpg', // Replace with real URL
        thumbnail: 'https://example.com/photo2.jpg', // Replace with real URL
        tournament: 'Volleyball League 2025',
        sport: 'Volleyball',
        date: 'May 7, 2025',
        likes: 127,
        dislikes: 3,
        author: {
            name: 'Sports Photography',
            avatar: 'https://example.com/avatar4.jpg' // Replace with real URL
        }
    },
    {
        id: 9,
        title: 'Action Shot from the Final Match',
        type: 'photo',
        media: 'https://example.com/photo2.jpg', // Replace with real URL
        thumbnail: 'https://example.com/photo2.jpg', // Replace with real URL
        tournament: 'Volleyball League 2025',
        sport: 'Volleyball',
        date: 'May 7, 2025',
        likes: 127,
        dislikes: 3,
        author: {
            name: 'Sports Photography',
            avatar: 'https://example.com/avatar4.jpg' // Replace with real URL
        }
    }
];

// Highlight Card Component
const HighlightCard = ({ highlight, onLike, onDislike }) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLike = () => {
        if (disliked) {
            setDisliked(false);
            onDislike(highlight.id, -1);
        }

        const newLiked = !liked;
        setLiked(newLiked);
        onLike(highlight.id, newLiked ? 1 : -1);
    };

    const handleDislike = () => {
        if (liked) {
            setLiked(false);
            onLike(highlight.id, -1);
        }

        const newDisliked = !disliked;
        setDisliked(newDisliked);
        onDislike(highlight.id, newDisliked ? 1 : -1);
    };

    const toggleMedia = () => {
        setShowMedia(!showMedia);
    };

    return (
        <Card
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                background: theme.palette.background.paper,
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.18)'
                },
                position: 'relative'
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="240"
                    image={highlight.thumbnail}
                    alt={highlight.title}
                    sx={{
                        objectFit: 'cover',
                        filter: showMedia ? 'brightness(0.7)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                />

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
                        transition: 'opacity 0.3s',
                        opacity: showMedia ? 0 : 1,
                        cursor: 'pointer'
                    }}
                    onClick={toggleMedia}
                >
                    {highlight.type === 'video' && (
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.3)'
                                }
                            }}
                        >
                            <PlayArrow sx={{ fontSize: 54, color: 'white' }} />
                        </IconButton>
                    )}
                </Box>

                {highlight.type === 'video' && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            color: 'white',
                            padding: '3px 10px',
                            borderRadius: 4,
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        <AccessTime sx={{ fontSize: 16 }} />
                        {highlight.duration}
                    </Box>
                )}

                <Chip
                    icon={highlight.type === 'video' ? <YouTube fontSize="small" /> : <Image fontSize="small" />}
                    label={highlight.sport}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(4px)',
                        '& .MuiChip-icon': {
                            color: 'white'
                        }
                    }}
                />
            </Box>

            {/* Expanded media view */}
            {showMedia && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '240px', zIndex: 10 }}>
                    {highlight.type === 'video' ? (
                        <Box
                            component="iframe"
                            src={highlight.media}
                            sx={{ width: '100%', height: '100%', border: 'none' }}
                            title={highlight.title}
                            allowFullScreen
                        />
                    ) : (
                        <Box
                            component="img"
                            src={highlight.media}
                            sx={{ width: '100%', height: '100%', objectFit: 'contain', background: 'black' }}
                            alt={highlight.title}
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
                        onClick={toggleMedia}
                    >
                        <Close />
                    </IconButton>
                </Box>
            )}

            <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                        src={highlight.author.avatar}
                        sx={{ width: 28, height: 28, mr: 1 }}
                        alt={highlight.author.name}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {highlight.author.name}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                            {highlight.date}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="subtitle1"
                    component="h3"
                    sx={{
                        fontWeight: '600',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        height: '2.6em'
                    }}
                >
                    {highlight.title}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip
                        label={highlight.tournament}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: 1,
                            fontSize: '0.75rem'
                        }}
                    />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Tooltip title="Like">
                        <IconButton
                            size="small"
                            onClick={handleLike}
                            color={liked ? 'primary' : 'default'}
                            sx={{ mr: 0.5 }}
                        >
                            {liked ? <ThumbUp /> : <ThumbUpOutlined />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {highlight.likes + (liked ? 1 : 0) - (disliked ? 0 : 0)}
                    </Typography>

                    <Tooltip title="Dislike">
                        <IconButton
                            size="small"
                            onClick={handleDislike}
                            color={disliked ? 'error' : 'default'}
                            sx={{ mr: 0.5 }}
                        >
                            {disliked ? <ThumbDown /> : <ThumbDownOutlined />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2">
                        {highlight.dislikes + (disliked ? 1 : 0) - (liked ? 0 : 0)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
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
const AddHighlightForm = ({ open, onClose, onSubmit }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        type: 'video',
        media: '',
        thumbnail: '',
        duration: '',
        tournament: '',
        sport: 'Football',
        date: new Date().toISOString().split('T')[0]
    });
    const [errors, setErrors] = useState({});
    const [filePreview, setFilePreview] = useState(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setFormData(prev => ({
            ...prev,
            type: newValue === 0 ? 'video' : 'photo'
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFilePreview(reader.result);
            setFormData(prev => ({
                ...prev,
                media: file,
                thumbnail: formData.type === 'photo' ? file : formData.thumbnail
            }));
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (formData.type === 'video' && !formData.media) newErrors.media = 'Video is required';
        if (formData.type === 'photo' && !formData.media) newErrors.media = 'Photo is required';
        if (!formData.tournament.trim()) newErrors.tournament = 'Tournament is required';
        if (formData.type === 'video' && !formData.duration.trim()) newErrors.duration = 'Duration is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit({
                ...formData,
                id: Date.now(),
                likes: 0,
                dislikes: 0,
                author: {
                    name: 'Current User',
                    avatar: 'https://example.com/default-avatar.jpg'
                },
                thumbnail: filePreview || 'https://example.com/default-thumbnail.jpg'
            });

            // Reset form
            setFormData({
                title: '',
                type: 'video',
                media: '',
                thumbnail: '',
                duration: '',
                tournament: '',
                sport: 'Football',
                date: new Date().toISOString().split('T')[0]
            });
            setFilePreview(null);
            setActiveTab(0);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
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

                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                    </Grid>

                    <Grid item xs={12}>
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
                                mb: 1
                            }}
                        >
                            {filePreview ? (
                                <>
                                    {formData.type === 'video' ? (
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
                                            setFormData(prev => ({ ...prev, media: '' }));
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
                                        Drag and drop your {formData.type === 'video' ? 'video' : 'photo'} here
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
                                            accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Box>
                            )}
                        </Box>
                        {errors.media && (
                            <FormHelperText error>{errors.media}</FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Sport</InputLabel>
                            <Select
                                name="sport"
                                value={formData.sport}
                                onChange={handleChange}
                                label="Sport"
                            >
                                <MenuItem value="Football">Football</MenuItem>
                                <MenuItem value="Basketball">Basketball</MenuItem>
                                <MenuItem value="Volleyball">Volleyball</MenuItem>
                                <MenuItem value="Tennis">Tennis</MenuItem>
                                <MenuItem value="Hockey">Hockey</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="tournament"
                            label="Tournament"
                            fullWidth
                            variant="outlined"
                            value={formData.tournament}
                            onChange={handleChange}
                            error={!!errors.tournament}
                            helperText={errors.tournament}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="date"
                            label="Date"
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {formData.type === 'video' && (
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
const HighlightsList = () => {
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [typeFilter, setTypeFilter] = useState('all');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        // Simulate data loading
        const fetchData = async () => {
            setLoading(true);
            // Simulate API request
            await new Promise(resolve => setTimeout(resolve, 1500));
            setHighlights(mockHighlights);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleLike = (id, change) => {
        setHighlights(highlights.map(highlight =>
            highlight.id === id ? { ...highlight, likes: highlight.likes + change } : highlight
        ));
    };

    const handleDislike = (id, change) => {
        setHighlights(highlights.map(highlight =>
            highlight.id === id ? { ...highlight, dislikes: highlight.dislikes + change } : highlight
        ));
    };

    const handleAddHighlight = (newHighlight) => {
        setHighlights([newHighlight, ...highlights]);
        setNotification({
            open: true,
            message: 'Highlight successfully added!',
            severity: 'success'
        });
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const filteredHighlights = highlights.filter(highlight => {
        const sportMatch = filter === 'all' || highlight.sport === filter;
        const typeMatch = typeFilter === 'all' || highlight.type === typeFilter;
        return sportMatch && typeMatch;
    });

    return (
        <AppTheme>
            <CssBaseline enableColorScheme/>
            <AppAppBar/>
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
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: { xs: 1, sm: 2 },
                        mb: 4,
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}
                >
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        <Chip
                            label="All Sports"
                            onClick={() => setFilter('all')}
                            color={filter === 'all' ? 'primary' : 'default'}
                            variant={filter === 'all' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                        <Chip
                            label="Football"
                            onClick={() => setFilter('Football')}
                            color={filter === 'Football' ? 'primary' : 'default'}
                            variant={filter === 'Football' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                        <Chip
                            label="Basketball"
                            onClick={() => setFilter('Basketball')}
                            color={filter === 'Basketball' ? 'primary' : 'default'}
                            variant={filter === 'Basketball' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                        <Chip
                            label="Volleyball"
                            onClick={() => setFilter('Volleyball')}
                            color={filter === 'Volleyball' ? 'primary' : 'default'}
                            variant={filter === 'Volleyball' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, md: 0 } }}>
                        <Chip
                            icon={<YouTube fontSize="small" />}
                            label="Videos"
                            onClick={() => setTypeFilter(typeFilter === 'video' ? 'all' : 'video')}
                            color={typeFilter === 'video' ? 'secondary' : 'default'}
                            variant={typeFilter === 'video' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                        <Chip
                            icon={<Image fontSize="small" />}
                            label="Photos"
                            onClick={() => setTypeFilter(typeFilter === 'photo' ? 'all' : 'photo')}
                            color={typeFilter === 'photo' ? 'secondary' : 'default'}
                            variant={typeFilter === 'photo' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 2 }}
                        />
                    </Stack>
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
                        filteredHighlights.map(highlight => (
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
                    )}

                    {!loading && filteredHighlights.length === 0 && (
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => setDialogOpen(true)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Highlight
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Add Highlight Dialog */}
                <AddHighlightForm
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSubmit={handleAddHighlight}
                />

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

export default HighlightsList;