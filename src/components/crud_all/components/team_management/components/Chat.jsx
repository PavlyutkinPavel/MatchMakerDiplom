import * as React from 'react';
import {
    Box,
    CircularProgress,
    Paper,
    TextField,
    Typography,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
} from '@mui/material';
import {
    Send as SendIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Mock API endpoints (you'll replace these with real endpoints)
const API_URL = "http://localhost:8080";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
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

// Chat component
export const Chat = () => {
    const [friends, setFriends] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedFriend, setSelectedFriend] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const messagesEndRef = React.useRef(null);

    React.useEffect(() => {
        fetchFriends();
    }, []);

    React.useEffect(() => {
        if (selectedFriend) {
            fetchMessages(selectedFriend.id);
        }
    }, [selectedFriend]);

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const fetchMessages = async (friendId) => {
        setLoading(true);
        try {
            // In a real implementation, fetch from API
            // const response = await fetch(`${API_URL}/chat/${friendId}`, {
            //   headers: getHeaders(),
            // });
            // const data = await response.json();
            // setMessages(data);

            // Mock data for testing
            setTimeout(() => {
                setMessages(mockMessages[friendId] || []);
                setLoading(false);
            }, 300);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]); // Clear on error
            setLoading(false);
        }
    };

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
    };

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedFriend) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'user',
                text: newMessage,
                timestamp: new Date().toISOString()
            };

            // In a real implementation, send to API
            // const sendMessage = async () => {
            //   await fetch(`${API_URL}/chat/send`, {
            //     method: 'POST',
            //     headers: getHeaders(),
            //     body: JSON.stringify({
            //       receiverId: selectedFriend.id,
            //       message: newMessage
            //     }),
            //   });
            // };
            // sendMessage();

            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Format timestamp to readable time
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Box sx={{ padding: 2, height: 'calc(100vh - 64px - 48px)' }}>
            <Paper sx={{ display: 'flex', height: '100%' }}>
                {/* Friends sidebar */}
                <Box sx={{
                    width: 280,
                    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        Chats
                    </Typography>

                    {loading && !selectedFriend ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                            {friends.map((friend) => (
                                <ListItem
                                    button
                                    key={friend.id}
                                    selected={selectedFriend?.id === friend.id}
                                    onClick={() => handleSelectFriend(friend)}
                                    divider
                                >
                                    <ListItemAvatar>
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
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={friend.name}
                                        secondary={friend.status === 'online' ? 'Online' : `Last seen ${friend.lastActive}`}
                                    />
                                </ListItem>
                            ))}
                            {friends.length === 0 && (
                                <Box p={2}>
                                    <Typography color="textSecondary">No friends yet. Add some from Players or Coaches section!</Typography>
                                </Box>
                            )}
                        </List>
                    )}
                </Box>

                {/* Chat area */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedFriend ? (
                        <>
                            {/* Chat header */}
                            <Box sx={{
                                p: 2,
                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {selectedFriend.status === 'online' ? (
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar src={selectedFriend.avatar} alt={selectedFriend.name} />
                                    </StyledBadge>
                                ) : (
                                    <Avatar src={selectedFriend.avatar} alt={selectedFriend.name} />
                                )}
                                <Box ml={2}>
                                    <Typography variant="subtitle1">{selectedFriend.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedFriend.position} at {selectedFriend.teamName}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Messages */}
                            <Box sx={{
                                flexGrow: 1,
                                p: 2,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {loading ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <CircularProgress />
                                    </Box>
                                ) : messages.length === 0 ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography color="textSecondary">No messages yet. Start a conversation!</Typography>
                                    </Box>
                                ) : (
                                    messages.map((message) => (
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
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Message input */}
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
                        </>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <Typography color="textSecondary">Select a friend to start chatting</Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default Chat;