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
    CircularProgress
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

// Компонент для отображения электронных писем
const Emails = () => {
    // Состояния
    const [activeTab, setActiveTab] = useState('received');
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [composeOpen, setComposeOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Состояние формы для составления письма
    const [composeForm, setComposeForm] = useState({
        type: 'info',
        recipients: '',
        subject: '',
        message: ''
    });

    // Имитация загрузки данных с сервера
    useEffect(() => {
        // Имитация задержки загрузки
        setLoading(true);
        setTimeout(() => {
            setEmails(generateMockEmails());
            setLoading(false);
        }, 1000);
    }, [activeTab]);

    // Генерация тестовых данных для писем
    const generateMockEmails = () => {
        const mockEmails = [];

        if (activeTab === 'received') {
            // Team invitation emails
            mockEmails.push(
                {
                    id: 1,
                    type: 'team_invite',
                    sender: 'FC Barcelona',
                    senderAvatar: '/api/placeholder/40/40',
                    subject: 'Team Invitation',
                    message: 'We invite you to join our football team for the upcoming season. Our training sessions are held on Tuesdays and Thursdays.',
                    teamInfo: {
                        id: 101,
                        name: 'FC Barcelona',
                        sport: 'Football',
                        players: 22
                    },
                    date: '2025-05-10T14:30:00',
                    unread: true,
                },
                {
                    id: 2,
                    type: 'event_invite',
                    sender: 'City Sports Federation',
                    senderAvatar: '/api/placeholder/40/40',
                    subject: 'Tournament Invitation',
                    message: 'We invite your team to participate in the annual city basketball tournament. The prize pool is 50,000 rubles.',
                    eventInfo: {
                        id: 201,
                        name: 'City Basketball Tournament',
                        date: '2025-06-15T10:00:00',
                        location: 'Energy Sports Complex',
                        teams: 16
                    },
                    date: '2025-05-08T09:15:00',
                    unread: true,
                }
            );

            // Informational emails
            mockEmails.push(
                {
                    id: 3,
                    type: 'info',
                    sender: 'System',
                    senderAvatar: '/api/placeholder/40/40',
                    subject: 'Platform Update',
                    message: 'Dear users, we have updated our platform. You can now create your own tournaments and invite teams to participate. If you have any questions, please contact support.',
                    date: '2025-05-05T11:20:00',
                    unread: false,
                },
                {
                    id: 4,
                    type: 'info',
                    sender: 'Administration',
                    senderAvatar: '/api/placeholder/40/40',
                    subject: 'Scheduled Maintenance',
                    message: 'We inform you that technical maintenance will take place on May 20 from 02:00 to 05:00. During this time, the platform will be unavailable.',
                    date: '2025-05-03T16:45:00',
                    unread: false,
                }
            );
        } else if (activeTab === 'sent') {
            // Sent emails
            mockEmails.push(
                {
                    id: 101,
                    type: 'team_invite',
                    recipient: 'Mikhail Ivanov',
                    subject: 'Invitation to Team "Dynamo"',
                    message: 'I invite you to join our football team "Dynamo". Trainings are held on Mondays and Wednesdays at 18:00.',
                    teamInfo: {
                        id: 102,
                        name: 'Dynamo',
                        sport: 'Football',
                        players: 18
                    },
                    date: '2025-05-09T13:20:00',
                    status: 'pending'
                },
                {
                    id: 102,
                    type: 'event_invite',
                    recipient: 'Team "Spartak"',
                    subject: 'Friendly Match Invitation',
                    message: 'We invite your team to a friendly match this Sunday. Kickoff at 14:00.',
                    eventInfo: {
                        id: 202,
                        name: 'Friendly Match',
                        date: '2025-05-18T14:00:00',
                        location: 'Youth Stadium',
                        teams: 2
                    },
                    date: '2025-05-07T17:10:00',
                    status: 'accepted'
                },
                {
                    id: 103,
                    type: 'info',
                    recipient: 'All Participants',
                    subject: 'Tournament Date Change',
                    message: 'Please be informed that the tournament date has been changed from May 25 to June 1 due to weather conditions.',
                    date: '2025-05-02T10:05:00',
                    status: 'sent'
                }
            );
        }

        return mockEmails;
    };

    // Обработчики
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSelectedEmail(null);
    };

    const handleEmailSelect = (email) => {
        setSelectedEmail(email);

        // Если письмо было непрочитанным, помечаем его как прочитанное
        if (email.unread) {
            setEmails(emails.map(e =>
                e.id === email.id ? { ...e, unread: false } : e
            ));
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
        // Сбрасываем форму
        setComposeForm({
            type: 'info',
            recipients: '',
            subject: '',
            message: ''
        });
    };

    const handleComposeChange = (e) => {
        const { name, value } = e.target;
        setComposeForm({
            ...composeForm,
            [name]: value
        });
    };

    const handleComposeSend = () => {
        // Здесь был бы API-запрос для отправки письма

        // Добавляем письмо в список отправленных (только для демонстрации)
        const newEmail = {
            id: Date.now(),
            type: composeForm.type,
            recipient: composeForm.recipients,
            subject: composeForm.subject,
            message: composeForm.message,
            date: new Date().toISOString(),
            status: 'sent'
        };

        if (activeTab === 'sent') {
            setEmails([newEmail, ...emails]);
        }

        // Показываем уведомление
        setSnackbar({
            open: true,
            message: 'The email was sent successfully',
            severity: 'success'
        });

        handleComposeClose();
    };

    const handleApprove = (emailId) => {
        // Здесь был бы API-запрос для одобрения приглашения

        // Обновляем статус письма (только для демонстрации)
        setEmails(emails.map(email =>
            email.id === emailId
                ? { ...email, status: 'accepted' }
                : email
        ));

        setSnackbar({
            open: true,
            message: 'Invitation accepted',
            severity: 'success'
        });
    };

    const handleDecline = (emailId) => {
        // Здесь был бы API-запрос для отклонения приглашения

        // Обновляем статус письма (только для демонстрации)
        setEmails(emails.map(email =>
            email.id === emailId
                ? { ...email, status: 'declined' }
                : email
        ));

        setSnackbar({
            open: true,
            message: 'Invitation declined',
            severity: 'error'
        });
    };

    const handleDelete = (emailId) => {
        // Здесь был бы API-запрос для удаления письма

        // Удаляем письмо из списка (только для демонстрации)
        setEmails(emails.filter(email => email.id !== emailId));

        if (selectedEmail && selectedEmail.id === emailId) {
            setSelectedEmail(null);
        }

        setSnackbar({
            open: true,
            message: 'The mail was deleted',
            severity: 'info'
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    // Получение иконки для типа письма
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

    // Получение метки для типа письма
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


    // Получение индикатора для состояния письма
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

    // Рендеринг содержимого письма в зависимости от его типа
    const renderEmailContent = (email) => {
        if (!email) return null;
        switch (email.type) {
            case 'team_invite':
                return (
                    <>
                        <Typography variant="body1" paragraph>
                            {email.message}
                        </Typography>
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
                        {activeTab === 'received' && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => handleApprove(email.id)}
                                >
                                    Accept Invitation
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDecline(email.id)}
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
                        {activeTab === 'received' && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EventIcon />}
                                    onClick={() => handleApprove(email.id)}
                                >
                                    Participate
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDecline(email.id)}
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


    // Количество непрочитанных писем
    const unreadCount = emails.filter(email => email.unread).length;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Заголовок */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" fontWeight="bold">
                    MatchMaker Mails & Notifications
                </Typography>
            </Box>

            {/* Основной контент */}
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                {/* Левая панель - список писем */}
                <Box
                    sx={{
                        width: selectedEmail ? { xs: 0, md: 320 } : '100%',
                        display: selectedEmail ? { xs: 'none', md: 'flex' } : 'flex',
                        flexDirection: 'column',
                        borderRight: 1,
                        borderColor: 'divider'
                    }}
                >
                    {/* Вкладки и кнопки */}
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
                            <Tooltip title="Update">
                                <IconButton onClick={() => setEmails(generateMockEmails())}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Список писем */}
                    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : emails.length > 0 ? (
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
                                                    <Avatar
                                                        sx={{ width: 20, height: 20, bgcolor: 'background.paper' }}
                                                    >
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
                                                        {new Date(email.date).toLocaleDateString()}
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

                {/* Правая панель - содержимое письма */}
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
                            {/* Заголовок письма */}
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
                                                <strong>{activeTab === 'received' ? 'От: ' : 'Кому: '}</strong>
                                                {activeTab === 'received' ? selectedEmail.sender : selectedEmail.recipient}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(selectedEmail.date).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(selectedEmail.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Содержимое письма */}
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
                                                name="teamName"
                                                label="Team Name"
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="teamSport"
                                                label="Sport"
                                                fullWidth
                                                size="small"
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
                                                name="eventName"
                                                label="Event Name"
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                margin="dense"
                                                name="eventDate"
                                                label="Event Date"
                                                type="datetime-local"
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                margin="dense"
                                                name="eventLocation"
                                                label="Location"
                                                fullWidth
                                                size="small"
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
                        onClick={handleComposeSend}
                        disabled={!composeForm.recipients || !composeForm.subject || !composeForm.message}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar для уведомлений */}
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