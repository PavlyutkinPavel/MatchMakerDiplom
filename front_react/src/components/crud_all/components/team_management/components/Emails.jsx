import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    IconButton,
    Paper,
    Badge,
    Chip,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Snackbar,
    Alert,
    Tooltip,
    CircularProgress,
    Pagination
} from '@mui/material';
import {
    Inbox as InboxIcon,
    Send as SendIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Email as EmailIcon,
    PersonAdd as PersonAddIcon,
    EmojiEvents as EventIcon,
    Info as InfoIcon,
    ArrowBack as ArrowBackIcon,
    Close as CloseIcon
} from '@mui/icons-material';

// API base URL - update with your actual API URL
const API_BASE_URL = 'http://localhost:8080/emails';

// Utility for API requests
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get authentication token from localStorage or your auth service
    const token = localStorage.getItem('authToken');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if there's content to parse
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return null; // For requests without response body (e.g., DELETE)
        }
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

const Emails = () => {
    // Main states
    const [activeTab, setActiveTab] = useState('received');
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [composeOpen, setComposeOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 20;

    // Filters
    const [filters, setFilters] = useState({
        type: '',
        unread: null,
        status: ''
    });

    // Notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Compose form
    const [composeForm, setComposeForm] = useState({
        type: 'info',
        recipients: '',
        subject: '',
        message: '',
        teamInfo: {
            name: '',
            sport: '',
            players: 0
        },
        eventInfo: {
            name: '',
            date: '',
            location: '',
            teams: 0
        }
    });

    // Fetch emails from server
    const fetchEmails = async (page = 0, resetEmails = true) => {
        setLoading(true);
        try {
            let endpoint = '';
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString()
            });

            // Add filters
            if (filters.type) params.append('type', filters.type);

            if (activeTab === 'received') {
                if (filters.unread !== null) params.append('unread', filters.unread.toString());
                endpoint = `/received?${params.toString()}`;
            } else {
                if (filters.status) params.append('status', filters.status);
                endpoint = `/sent?${params.toString()}`;
            }

            const response = await apiRequest(endpoint);

            if (resetEmails) {
                setEmails(response.content || []);
            } else {
                setEmails(prev => [...prev, ...(response.content || [])]);
            }

            setTotalPages(response.totalPages || 0);
            setCurrentPage(response.number || 0);
        } catch (error) {
            showSnackbar('Error loading emails', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const response = await apiRequest('/unread-count');
            setUnreadCount(response.count || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Fetch specific email by ID
    const fetchEmailById = async (emailId) => {
        try {
            const email = await apiRequest(`/${emailId}`);
            setSelectedEmail(email);

            // Update email status in list if it was unread
            setEmails(prev => prev.map(e =>
                e.id === emailId ? { ...e, unread: false } : e
            ));

            // Update unread count
            fetchUnreadCount();
        } catch (error) {
            showSnackbar('Error loading email details', 'error');
        }
    };

    // Send email
    const sendEmail = async () => {
        try {
            // Parse recipients from comma-separated string to array
            const recipientsList = composeForm.recipients.split(',').map(r => r.trim());

            // Prepare email data based on type
            const emailData = {
                type: composeForm.type,
                recipients: recipientsList,
                subject: composeForm.subject,
                message: composeForm.message
            };

            // Add additional info based on email type
            if (composeForm.type === 'team_invite') {
                emailData.teamInfo = composeForm.teamInfo;
            } else if (composeForm.type === 'event_invite') {
                emailData.eventInfo = composeForm.eventInfo;
            }

            await apiRequest('/send', {
                method: 'POST',
                body: JSON.stringify(emailData)
            });

            showSnackbar('Email sent successfully', 'success');
            handleComposeClose();

            // Refresh email list if we're on the "Sent" tab
            if (activeTab === 'sent') {
                fetchEmails(0);
            }
        } catch (error) {
            showSnackbar('Error sending email', 'error');
        }
    };

    // Accept invitation
    const acceptInvitation = async (emailId) => {
        try {
            const response = await apiRequest(`/${emailId}/accept`, { method: 'POST' });
            showSnackbar('Invitation accepted', 'success');

            // Update email in list
            setEmails(prev => prev.map(email =>
                email.id === emailId ? { ...email, status: 'accepted' } : email
            ));

            if (selectedEmail && selectedEmail.id === emailId) {
                setSelectedEmail(prev => ({ ...prev, status: 'accepted' }));
            }
        } catch (error) {
            showSnackbar('Error accepting invitation', 'error');
        }
    };

    // Decline invitation
    const declineInvitation = async (emailId) => {
        try {
            const response = await apiRequest(`/${emailId}/decline`, { method: 'POST' });
            showSnackbar('Invitation declined', 'error');

            // Update email in list
            setEmails(prev => prev.map(email =>
                email.id === emailId ? { ...email, status: 'declined' } : email
            ));

            if (selectedEmail && selectedEmail.id === emailId) {
                setSelectedEmail(prev => ({ ...prev, status: 'declined' }));
            }
        } catch (error) {
            showSnackbar('Error declining invitation', 'error');
        }
    };

    // Delete email
    const deleteEmail = async (emailId) => {
        try {
            await apiRequest(`/${emailId}`, { method: 'DELETE' });
            showSnackbar('Email deleted', 'info');

            // Remove email from list
            setEmails(prev => prev.filter(email => email.id !== emailId));

            // Clear selection if deleted email was selected
            if (selectedEmail && selectedEmail.id === emailId) {
                setSelectedEmail(null);
            }

            // Update unread count
            fetchUnreadCount();
        } catch (error) {
            showSnackbar('Error deleting email', 'error');
        }
    };

    // Mark email as read
    const markAsRead = async (emailId) => {
        try {
            await apiRequest(`/${emailId}/mark-read`, { method: 'PATCH' });

            // Update email in list
            setEmails(prev => prev.map(email =>
                email.id === emailId ? { ...email, unread: false } : email
            ));

            // Update unread count
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking email as read:', error);
        }
    };

    // Show notification
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // Effects
    useEffect(() => {
        fetchEmails(0);
        fetchUnreadCount();
    }, [activeTab, filters]);

    // Event handlers
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSelectedEmail(null);
        setCurrentPage(0);
        // Reset filters on tab change
        setFilters({
            type: '',
            unread: null,
            status: ''
        });
    };

    const handleEmailSelect = async (email) => {
        await fetchEmailById(email.id);

        // Mark as read if this is an unread received email
        if (activeTab === 'received' && email.unread) {
            await markAsRead(email.id);
        }
    };

    const handleBackToList = () => {
        setSelectedEmail(null);
    };

    const handleComposeOpen = () => {
        setComposeOpen(true);
    };

    const handleComposeClose = () => {
        setComposeOpen(false);
        // Reset form
        setComposeForm({
            type: 'info',
            recipients: '',
            subject: '',
            message: '',
            teamInfo: { name: '', sport: '', players: 0 },
            eventInfo: { name: '', date: '', location: '', teams: 0 }
        });
    };

    const handleComposeChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('team.')) {
            const field = name.split('.')[1];
            setComposeForm(prev => ({
                ...prev,
                teamInfo: { ...prev.teamInfo, [field]: value }
            }));
        } else if (name.startsWith('event.')) {
            const field = name.split('.')[1];
            setComposeForm(prev => ({
                ...prev,
                eventInfo: { ...prev.eventInfo, [field]: value }
            }));
        } else {
            setComposeForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage - 1);
        fetchEmails(newPage - 1);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setCurrentPage(0);
    };

    const handleRefresh = () => {
        fetchEmails(0);
        fetchUnreadCount();
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Display utilities
    const getEmailTypeIcon = (type) => {
        switch (type) {
            case 'team_invite':
                return <PersonAddIcon color="primary" />;
            case 'event_invite':
                return <EventIcon color="secondary" />;
            case 'info':
            default:
                return <InfoIcon color="action" />;
        }
    };

    const getEmailTypeLabel = (type) => {
        switch (type) {
            case 'team_invite':
                return 'Team Invitation';
            case 'event_invite':
                return 'Event Invitation';
            case 'info':
            default:
                return 'Information';
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'accepted':
                return <Chip size="small" label="Accepted" color="success" />;
            case 'declined':
                return <Chip size="small" label="Declined" color="error" />;
            case 'pending':
                return <Chip size="small" label="Pending" color="warning" />;
            case 'sent':
            default:
                return <Chip size="small" label="Sent" color="info" />;
        }
    };

    const renderEmailContent = (email) => {
        if (!email) return null;

        switch (email.type) {
            case 'team_invite':
                return (
                    <>
                        <Typography variant="body1" paragraph>
                            {email.message}
                        </Typography>
                        {email.teamInfo && (
                            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Team Information:
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Name:</strong> {email.teamInfo.name}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Sport:</strong> {email.teamInfo.sport}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Number of Players:</strong> {email.teamInfo.players}
                                </Typography>
                            </Paper>
                        )}
                        {activeTab === 'received' && email.status !== 'accepted' && email.status !== 'declined' && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => acceptInvitation(email.id)}
                                >
                                    Accept Invitation
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => declineInvitation(email.id)}
                                >
                                    Decline
                                </Button>
                            </Box>
                        )}
                    </>
                );
            case 'event_invite':
                return (
                    <>
                        <Typography variant="body1" paragraph>
                            {email.message}
                        </Typography>
                        {email.eventInfo && (
                            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Event Information:
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Name:</strong> {email.eventInfo.name}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Date:</strong> {new Date(email.eventInfo.date).toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Location:</strong> {email.eventInfo.location}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Number of Teams:</strong> {email.eventInfo.teams}
                                </Typography>
                            </Paper>
                        )}
                        {activeTab === 'received' && email.status !== 'accepted' && email.status !== 'declined' && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EventIcon />}
                                    onClick={() => acceptInvitation(email.id)}
                                >
                                    Participate
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => declineInvitation(email.id)}
                                >
                                    Decline
                                </Button>
                            </Box>
                        )}
                    </>
                );
            case 'info':
            default:
                return (
                    <Typography variant="body1" paragraph>
                        {email.message}
                    </Typography>
                );
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" fontWeight="bold">
                    MatchMaker Mails & Notifications
                </Typography>
            </Box>

            {/* Main content */}
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                {/* Left panel - email list */}
                <Box
                    sx={{
                        width: selectedEmail ? { xs: 0, md: 320 } : '100%',
                        display: selectedEmail ? { xs: 'none', md: 'flex' } : 'flex',
                        flexDirection: 'column',
                        borderRight: 1,
                        borderColor: 'divider'
                    }}
                >
                    {/* Tabs and buttons */}
                    <Box sx={{ p: 1, bgcolor: 'background.paper', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tabs value={activeTab} onChange={handleTabChange} aria-label="email tabs">
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <InboxIcon sx={{ mr: 1 }} />
                                        <Typography>
                                            Received
                                            {unreadCount > 0 && activeTab === 'received' && (
                                                <Badge
                                                    badgeContent={unreadCount}
                                                    color="error"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </Typography>
                                    </Box>
                                }
                                value="received"
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SendIcon sx={{ mr: 1 }} />
                                        <Typography>Sent</Typography>
                                    </Box>
                                }
                                value="sent"
                            />
                        </Tabs>
                        <Box>
                            <Tooltip title="Write mail">
                                <IconButton color="primary" onClick={handleComposeOpen}>
                                    <EmailIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Refresh">
                                <IconButton onClick={handleRefresh}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Filters */}
                    <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={filters.type}
                                label="Type"
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="info">Info</MenuItem>
                                <MenuItem value="team_invite">Team</MenuItem>
                                <MenuItem value="event_invite">Event</MenuItem>
                            </Select>
                        </FormControl>

                        {activeTab === 'received' ? (
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.unread === null ? '' : filters.unread.toString()}
                                    label="Status"
                                    onChange={(e) => handleFilterChange('unread', e.target.value === '' ? null : e.target.value === 'true')}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="true">Unread</MenuItem>
                                    <MenuItem value="false">Read</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Status"
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="sent">Sent</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="accepted">Accepted</MenuItem>
                                    <MenuItem value="declined">Declined</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    <Divider />

                    {/* Email list */}
                    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : emails.length > 0 ? (
                            <>
                                <List sx={{ p: 0 }}>
                                    {emails.map((email) => (
                                        <ListItem
                                            key={email.id}
                                            alignItems="flex-start"
                                            button
                                            divider
                                            onClick={() => handleEmailSelect(email)}
                                            sx={{
                                                bgcolor: email.unread ? 'action.hover' : 'inherit',
                                                '&:hover': { bgcolor: 'action.selected' }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Badge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    badgeContent={
                                                        <Avatar sx={{ width: 20, height: 20, bgcolor: 'background.paper' }}>
                                                            {getEmailTypeIcon(email.type)}
                                                        </Avatar>
                                                    }
                                                >
                                                    <Avatar
                                                        src={email.senderAvatar || '/api/placeholder/40/40'}
                                                        alt={activeTab === 'received' ? email.sender : email.recipient}
                                                    />
                                                </Badge>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{ fontWeight: email.unread ? 'bold' : 'normal' }}
                                                        >
                                                            {activeTab === 'received' ? email.sender : email.recipient}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(email.date || email.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                display: 'inline',
                                                                fontWeight: email.unread ? 'bold' : 'normal'
                                                            }}
                                                            color="text.primary"
                                                        >
                                                            {email.subject}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 1,
                                                                    WebkitBoxOrient: 'vertical',
                                                                }}
                                                            >
                                                                {email.message}
                                                            </Typography>
                                                            {email.status && getStatusChip(email.status)}
                                                        </Box>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage + 1}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="small"
                                        />
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Typography variant="body1" color="text.secondary">
                                    {activeTab === 'received'
                                        ? 'You don\'t have any emails received'
                                        : 'You don\'t have any sent emails'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Right panel - email content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: selectedEmail ? 'flex' : { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        overflow: 'auto',
                        p: 0
                    }}
                >
                    {selectedEmail ? (
                        <>
                            {/* Email header */}
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <IconButton onClick={handleBackToList} sx={{ display: { md: 'none' }, mr: 1 }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Typography variant="h6">{selectedEmail.subject}</Typography>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Chip
                                        icon={getEmailTypeIcon(selectedEmail.type)}
                                        label={getEmailTypeLabel(selectedEmail.type)}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            src={selectedEmail.senderAvatar || '/api/placeholder/32/32'}
                                            alt={activeTab === 'received' ? selectedEmail.sender : selectedEmail.recipient}
                                            sx={{ width: 32, height: 32, mr: 1 }}
                                        />
                                        <Box>
                                            <Typography variant="body2">
                                                <strong>{activeTab === 'received' ? 'From: ' : 'To: '}</strong>
                                                {activeTab === 'received' ? selectedEmail.sender : selectedEmail.recipient}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(selectedEmail.date || selectedEmail.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => deleteEmail(selectedEmail.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Email content */}
                            <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                                {renderEmailContent(selectedEmail)}
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography variant="body1" color="text.secondary">
                                Select an email to view
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Compose Email Dialog */}
            <Dialog
                open={composeOpen}
                onClose={handleComposeClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Compose Email
                    <IconButton
                        aria-label="close"
                        onClick={handleComposeClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="email-type-label">Email Type</InputLabel>
                                <Select
                                    labelId="email-type-label"
                                    name="type"
                                    value={composeForm.type}
                                    onChange={handleComposeChange}
                                    label="Email Type"
                                >
                                    <MenuItem value="info">Informational</MenuItem>
                                    <MenuItem value="team_invite">Team Invitation</MenuItem>
                                    <MenuItem value="event_invite">Event Invitation</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField
                                margin="normal"
                                name="recipients"
                                label="Recipients"
                                fullWidth
                                value={composeForm.recipients}
                                onChange={handleComposeChange}
                                helperText="Enter names or email addresses, separated by commas"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                name="subject"
                                label="Subject"
                                fullWidth
                                value={composeForm.subject}
                                onChange={handleComposeChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                name="message"
                                label="Message"
                                multiline
                                rows={8}
                                fullWidth
                                value={composeForm.message}
                                onChange={handleComposeChange}
                            />
                        </Grid>

                        {composeForm.type === 'team_invite' && (
                            <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Additional Team Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="team.name"
                                                label="Team Name"
                                                fullWidth
                                                size="small"
                                                value={composeForm.teamInfo.name}
                                                onChange={handleComposeChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="team.sport"
                                                label="Sport"
                                                fullWidth
                                                size="small"
                                                value={composeForm.teamInfo.sport}
                                                onChange={handleComposeChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="team.players"
                                                label="Number of Players"
                                                type="number"
                                                fullWidth
                                                size="small"
                                                value={composeForm.teamInfo.players}
                                                onChange={handleComposeChange}
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}

                        {composeForm.type === 'event_invite' && (
                            <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Additional Event Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="event.name"
                                                label="Event Name"
                                                fullWidth
                                                size="small"
                                                value={composeForm.eventInfo.name}
                                                onChange={handleComposeChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="event.date"
                                                label="Event Date"
                                                type="datetime-local"
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                value={composeForm.eventInfo.date}
                                                onChange={handleComposeChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="event.location"
                                                label="Location"
                                                fullWidth
                                                size="small"
                                                value={composeForm.eventInfo.location}
                                                onChange={handleComposeChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="event.teams"
                                                label="Number of Teams"
                                                type="number"
                                                fullWidth
                                                size="small"
                                                value={composeForm.eventInfo.teams}
                                                onChange={handleComposeChange}
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleComposeClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendEmail}
                        disabled={!composeForm.recipients || !composeForm.subject || !composeForm.message}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
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
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Emails;