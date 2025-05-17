import * as React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
    Card,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Drawer,
    Badge,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Message as MessageIcon,
    Close as CloseIcon,
    PersonRemove as PersonRemoveIcon,
    Send as SendIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const MessageBubble = styled(Box)(({ theme, sender }) => ({
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    maxWidth: '70%',
    marginBottom: theme.spacing(1),
    wordBreak: 'break-word',
    backgroundColor: sender === 'user' ? theme.palette.primary.main : theme.palette.grey[200],
    color: sender === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
}));

// Mock API endpoints (you'll replace these with real endpoints)
const API_URL = "http://localhost:8080";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});



const mockFriends = [
    { id: 2, name: 'LeBron James', position: 'Forward', teamName: 'LA Lakers', avatar: '/api/placeholder/50/50', lastActive: '2 hours ago', status: 'online' },
    { id: 4, name: 'Cristiano Ronaldo', position: 'Forward', teamName: 'FC Barcelona', avatar: '/api/placeholder/50/50', lastActive: '1 day ago', status: 'offline' },
    { id: 102, name: 'Frank Vogel', position: 'Head Coach', teamName: 'LA Lakers', avatar: '/api/placeholder/50/50', lastActive: '5 hours ago', status: 'online' }
];

const mockMessages = {
    2: [
        { id: 1, sender: 'user', text: 'Hey LeBron, how\'s the season going?', timestamp: '2023-10-15T14:23:00' },
        { id: 2, sender: 'friend', text: 'Going great! Working hard for the playoffs.', timestamp: '2023-10-15T14:25:00' },
        { id: 3, sender: 'user', text: 'Good luck with the next game!', timestamp: '2023-10-15T14:26:00' }
    ],
    4: [
        { id: 1, sender: 'user', text: 'Cristiano, amazing goal last week!', timestamp: '2023-10-14T10:11:00' },
        { id: 2, sender: 'friend', text: 'Thanks! I\'ve been practicing that shot.', timestamp: '2023-10-14T10:15:00' }
    ],
    102: [
        { id: 1, sender: 'user', text: 'Coach, what\'s the strategy for tomorrow?', timestamp: '2023-10-16T09:05:00' },
        { id: 2, sender: 'friend', text: 'Let\'s discuss in person at practice.', timestamp: '2023-10-16T09:10:00' }
    ]
};


export const FriendsList = () => {
    const [friends, setFriends] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [chatOpen, setChatOpen] = React.useState(false);
    const [currentChat, setCurrentChat] = React.useState(null);
    const [chatMessages, setChatMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const messagesEndRef = React.useRef(null);

    React.useEffect(() => {
        fetchFriends();
    }, []);

    React.useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const fetchFriends = async () => {
        setLoading(true);
        try {
            // In a real implementation, fetch from API
            // const response = await fetch(`${API_URL}/friends`, {
            //   headers: getHeaders(),
            // });
            // const data = await response.json();
            // setFriends(data);

            // Mock data for testing
            setTimeout(() => {
                setFriends(mockFriends);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setFriends([]); // Clear on error
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleOpenChat = (friend) => {
        setCurrentChat(friend);
        // In a real implementation, fetch chat history from API
        // const fetchChatHistory = async () => {
        //   const response = await fetch(`${API_URL}/chat/${friend.id}`, {
        //     headers: getHeaders(),
        //   });
        //   const data = await response.json();
        //   setChatMessages(data);
        // };
        // fetchChatHistory();

        // Use mock data for testing
        setChatMessages(mockMessages[friend.id] || []);
        setChatOpen(true);
    };

    const handleCloseChat = () => {
        setChatOpen(false);
        setCurrentChat(null);
        setChatMessages([]);
    };

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: chatMessages.length + 1,
                sender: 'user',
                text: newMessage,
                timestamp: new Date().toISOString()
            };

            // In a real implementation, send message to API
            // const sendMessage = async () => {
            //   await fetch(`${API_URL}/chat/send`, {
            //     method: 'POST',
            //     headers: getHeaders(),
            //     body: JSON.stringify({
            //       receiverId: currentChat.id,
            //       message: newMessage
            //     }),
            //   });
            // };
            // sendMessage();

            setChatMessages([...chatMessages, newMsg]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            // In a real implementation, call API
            // await fetch(`${API_URL}/friends/remove`, {
            //   method: 'DELETE',
            //   headers: getHeaders(),
            //   body: JSON.stringify({ friendId }),
            // });

            // Update local state
            setFriends(friends.filter(friend => friend.id !== friendId));

            // Close chat if the removed friend was the current chat
            if (currentChat && currentChat.id === friendId) {
                handleCloseChat();
            }

            setSnackbar({
                open: true,
                message: 'Friend removed successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error removing friend:', error);
            setSnackbar({
                open: true,
                message: 'Failed to remove friend. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Filter friends based on search query
    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format timestamp to readable time
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Friends List
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Friends"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ marginBottom: 2 }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    placeholder="Search by name, team, or position..."
                />

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : filteredFriends.length === 0 ? (
                    <Alert severity="info">No friends found</Alert>
                ) : (
                    <Grid container spacing={2}>
                        {filteredFriends.map((friend) => (
                            <Grid item xs={12} sm={6} md={4} key={friend.id}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            {friend.status === 'online' ? (
                                                <StyledBadge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    variant="dot"
                                                >
                                                    <Avatar src={friend.avatar} alt={friend.name} />
                                                </StyledBadge>
                                            ) : (
                                                <Avatar src={friend.avatar} alt={friend.name} />
                                            )}
                                            <Box ml={2}>
                                                <Typography variant="h6">{friend.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {friend.position} at {friend.teamName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Last active: {friend.lastActive}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            startIcon={<MessageIcon />}
                                            onClick={() => handleOpenChat(friend)}
                                        >
                                            Message
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<PersonRemoveIcon />}
                                            onClick={() => handleRemoveFriend(friend.id)}
                                        >
                                            Remove
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            {/* Chat Drawer */}
            <Drawer
                anchor="right"
                open={chatOpen}
                onClose={handleCloseChat}
                sx={{
                    '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 } },
                }}
            >
                {currentChat && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Chat Header */}
                        <Box sx={{
                            p: 2,
                            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box display="flex" alignItems="center">
                                {currentChat.status === 'online' ? (
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar src={currentChat.avatar} alt={currentChat.name} />
                                    </StyledBadge>
                                ) : (
                                    <Avatar src={currentChat.avatar} alt={currentChat.name} />
                                )}
                                <Box ml={2}>
                                    <Typography variant="subtitle1">{currentChat.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {currentChat.status === 'online' ? 'Online' : `Last seen ${currentChat.lastActive}`}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={handleCloseChat}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Chat Messages */}
                        <Box sx={{
                            flexGrow: 1,
                            p: 2,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {chatMessages.map((message) => (
                                <MessageBubble key={message.id} sender={message.sender}>
                                    <Typography variant="body2">{message.text}</Typography>
                                    <Typography variant="caption" sx={{
                                        display: 'block',
                                        textAlign: message.sender === 'user' ? 'right' : 'left',
                                        opacity: 0.7,
                                        mt: 0.5
                                    }}>
                                        {formatTime(message.timestamp)}
                                    </Typography>
                                </MessageBubble>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Message Input */}
                        <Box sx={{
                            p: 2,
                            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                variant="outlined"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={handleMessageChange}
                                onKeyPress={handleKeyPress}
                                sx={{ mr: 1 }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Drawer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FriendsList;