import React, { useState, useEffect, useRef } from 'react';
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
    Stack,
    InputAdornment,
    Fade,
    Slide,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    alpha,
    Chip,
    Divider,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    Send as SendIcon,
    Search as SearchIcon,
    Add as AddIcon,
    EmojiEmotions as EmojiIcon,
    AttachFile as AttachFileIcon,
    Person as PersonIcon,
    Room as RoomIcon,
    ExitToApp as ExitIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import useApplicationStore from 'store/useApplicationStore';

// Styled components
const ChatContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    height: 'calc(100vh - 64px)',
    borderRadius: 0,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    boxShadow: 'none',
}));

const Sidebar = styled(Box)(({ theme }) => ({
    width: 350,
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: 1,
        height: '100%',
        background: 'rgba(255,255,255,0.1)',
    }
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3, 2),
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
}));

const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(3),
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(255,255,255,0.5)',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.7)',
        '&.Mui-focused': {
            color: 'white',
        },
    },
    '& .MuiSvgIcon-root': {
        color: 'rgba(255,255,255,0.7)',
    },
}));

const ChatListItem = styled(ListItem)(({ theme, selected }) => ({
    margin: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(2),
    backgroundColor: selected ? 'rgba(255,255,255,0.2)' : 'transparent',
    backdropFilter: selected ? 'blur(10px)' : 'none',
    border: selected ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
    color: 'white',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
        transform: 'translateX(4px)',
    },
}));

const ChatArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
}));

const MessagesArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    background: 'transparent',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.03"%3E%3Ccircle cx="20" cy="20" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        pointerEvents: 'none',
        zIndex: 0,
    },
    '&::-webkit-scrollbar': {
        width: 6,
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(102,126,234,0.3)',
        borderRadius: 10,
        '&:hover': {
            background: 'rgba(102,126,234,0.5)',
        },
    },
}));

const MessageBubble = styled(Box)(({ theme, sender }) => ({
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(2.5),
    maxWidth: '70%',
    marginBottom: theme.spacing(1),
    wordBreak: 'break-word',
    position: 'relative',
    zIndex: 1,
    backgroundColor: sender === 'user'
        ? '#667eea'
        : 'rgba(255,255,255,0.9)',
    color: sender === 'user' ? 'white' : theme.palette.text.primary,
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    boxShadow: sender === 'user'
        ? '0 4px 15px rgba(102,126,234,0.3)'
        : '0 2px 10px rgba(0,0,0,0.1)',
    border: sender === 'user' ? 'none' : '1px solid rgba(102,126,234,0.1)',
    backdropFilter: 'blur(10px)',
    '&::before': sender === 'user' ? {
        content: '""',
        position: 'absolute',
        right: -8,
        top: 12,
        width: 0,
        height: 0,
        borderLeft: '8px solid #667eea',
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
    } : {
        content: '""',
        position: 'absolute',
        left: -8,
        top: 12,
        width: 0,
        height: 0,
        borderRight: '8px solid rgba(255,255,255,0.9)',
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
    },
}));

const InputArea = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(102,126,234,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(3),
        backgroundColor: 'rgba(102,126,234,0.05)',
        backdropFilter: 'blur(10px)',
        '& fieldset': {
            borderColor: 'rgba(102,126,234,0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(102,126,234,0.4)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#667eea',
            borderWidth: 2,
        },
    },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102,126,234,0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
    },
    transition: 'all 0.3s ease',
}));

const CreateButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    borderRadius: theme.spacing(3),
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    '&:hover': {
        background: 'rgba(255,255,255,0.3)',
        borderColor: 'rgba(255,255,255,0.5)',
    },
}));

const EmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.palette.text.secondary,
    background: 'transparent',
}));

const UserChip = styled(Chip)(({ theme }) => ({
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    fontWeight: 600,
}));

// Main UnifiedChat component
export const Chat = () => {
    // States
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newChatId, setNewChatId] = useState('');
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const theme = useTheme();

    // Mock current user - replace with real zustand store
    const currentUser = useApplicationStore((state) => state.auth.userName);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.roomId);
            connectToWebSocket(selectedChat.roomId);
        }
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/chat', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setChats(data);
            } else {
                // Fallback to mock data for demo
                setChats([
                    { roomId: 'room1', name: 'General Chat', lastMessage: 'Hello everyone!', timestamp: new Date() },
                    { roomId: 'room2', name: 'Project Team', lastMessage: 'Meeting at 3 PM', timestamp: new Date() },
                    { roomId: 'room3', name: 'Random', lastMessage: 'Anyone there?', timestamp: new Date() }
                ]);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
            // Fallback to mock data for demo
            setChats([
                { roomId: 'room1', name: 'General Chat', lastMessage: 'Hello everyone!', timestamp: new Date() },
                { roomId: 'room2', name: 'Project Team', lastMessage: 'Meeting at 3 PM', timestamp: new Date() },
                { roomId: 'room3', name: 'Random', lastMessage: 'Anyone there?', timestamp: new Date() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (roomId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/rooms/${roomId}/messages?size=50&page=0`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                // Mock messages for demo
                setMessages([
                    { sender: 'Alice', content: 'Hello everyone!', timeStamp: new Date().toISOString() },
                    { sender: currentUser, content: 'Hi there!', timeStamp: new Date().toISOString() },
                    { sender: 'Bob', content: 'How is everyone doing?', timeStamp: new Date().toISOString() }
                ]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Mock messages for demo
            setMessages([
                { sender: 'Alice', content: 'Hello everyone!', timeStamp: new Date().toISOString() },
                { sender: currentUser, content: 'Hi there!', timeStamp: new Date().toISOString() },
                { sender: 'Bob', content: 'How is everyone doing?', timeStamp: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const connectToWebSocket = (roomId) => {
        if (stompClient) {
            stompClient.disconnect();
        }

        try {
            const sock = new SockJS('http://localhost:8080/chat');
            const client = Stomp.over(sock);

            client.connect({}, () => {
                setStompClient(client);
                setConnected(true);

                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, newMessage]);
                });
            }, (error) => {
                console.error('WebSocket connection error:', error);
                setConnected(false);
            });
        } catch (error) {
            console.error('WebSocket setup error:', error);
            setConnected(false);
        }
    };

    const handleSelectChat = async (chat) => {
        try {
            // Join chat room first
            const response = await fetch(`http://localhost:8080/rooms/${chat.roomId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                }
            });

            if (response.ok) {
                setSelectedChat(chat);
            }
        } catch (error) {
            console.error('Error joining chat:', error);
            // For demo, still allow selection
            setSelectedChat(chat);
        }
    };

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedChat) {
            const message = {
                sender: currentUser,
                content: newMessage,
                roomId: selectedChat.roomId,
                timeStamp: new Date().toISOString()
            };

            if (stompClient && connected) {
                stompClient.send(
                    `/app/sendMessage/${selectedChat.roomId}`,
                    {},
                    JSON.stringify(message)
                );
            } else {
                // For demo, add message locally
                setMessages(prev => [...prev, message]);
            }
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

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleCreateChat = async () => {
        if (newChatId.trim()) {
            try {
                const response = await fetch('http://localhost:8080/rooms', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "text/plain",
                        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                    },
                    body: newChatId
                });

                if (response.ok) {
                    const data = await response.json();
                    const newChat = {
                        roomId: data.roomId || newChatId,
                        name: newChatId,
                        lastMessage: '',
                        timestamp: new Date()
                    };
                    setChats(prev => [...prev, newChat]);
                } else {
                    // For demo, still add the chat
                    const newChat = {
                        roomId: newChatId,
                        name: newChatId,
                        lastMessage: '',
                        timestamp: new Date()
                    };
                    setChats(prev => [...prev, newChat]);
                }

                setOpenCreateDialog(false);
                setNewChatId('');
            } catch (error) {
                console.error('Error creating chat:', error);
                // For demo, still add the chat
                const newChat = {
                    roomId: newChatId,
                    name: newChatId,
                    lastMessage: '',
                    timestamp: new Date()
                };
                setChats(prev => [...prev, newChat]);
                setOpenCreateDialog(false);
                setNewChatId('');
            }
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
            <ChatContainer elevation={0}>
                {/* Chats sidebar */}
                <Sidebar>
                    <SidebarHeader>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                            Chats
                        </Typography>
                        <SearchField
                            fullWidth
                            size="small"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </SidebarHeader>

                    <CreateButton
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                    >
                        Create New Chat
                    </CreateButton>

                    {loading && !selectedChat ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress sx={{ color: 'white' }} />
                        </Box>
                    ) : (
                        <List sx={{ overflow: 'auto', flexGrow: 1, p: 1 }}>
                            {filteredChats.map((chat) => (
                                <Fade key={chat.roomId} in timeout={500}>
                                    <ChatListItem
                                        selected={selectedChat?.roomId === chat.roomId}
                                        onClick={() => handleSelectChat(chat)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                                                {chat.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                                                    {chat.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    {chat.lastMessage || 'No messages yet'}
                                                </Typography>
                                            }
                                        />
                                    </ChatListItem>
                                </Fade>
                            ))}
                            {filteredChats.length === 0 && !loading && (
                                <Box p={2}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                                        {searchTerm ? 'No chats found' : 'No chats yet. Create your first chat!'}
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    )}
                </Sidebar>

                {/* Chat area */}
                <ChatArea>
                    {selectedChat ? (
                        <>
                            {/* Chat header */}
                            <ChatHeader>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
                                        <RoomIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {selectedChat.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            Room ID: {selectedChat.roomId}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <UserChip
                                        icon={<PersonIcon />}
                                        label={currentUser}
                                        variant="outlined"
                                    />
                                    <Box sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: connected ? '#44b700' : '#f44336',
                                        boxShadow: connected ? '0 0 0 2px rgba(68, 183, 0, 0.3)' : '0 0 0 2px rgba(244, 67, 54, 0.3)'
                                    }} />
                                </Stack>
                            </ChatHeader>

                            {/* Messages */}
                            <MessagesArea>
                                {loading ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <CircularProgress />
                                    </Box>
                                ) : messages.length === 0 ? (
                                    <EmptyState>
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mb: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            <EmojiIcon sx={{ fontSize: 40 }} />
                                        </Avatar>
                                        <Typography variant="h6" gutterBottom>
                                            No messages yet
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Start a conversation in {selectedChat.name}!
                                        </Typography>
                                    </EmptyState>
                                ) : (
                                    <Stack spacing={1}>
                                        {messages.map((message, index) => (
                                            <Slide key={index} direction="up" in timeout={300}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: message.sender === currentUser ? 'flex-end' : 'flex-start'
                                                }}>
                                                    {message.sender !== currentUser && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 1 }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    mr: 1,
                                                                    bgcolor: 'primary.main',
                                                                    fontSize: '0.8rem',
                                                                }}
                                                            >
                                                                {message.sender.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                                {message.sender}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    <MessageBubble sender={message.sender === currentUser ? 'user' : 'other'}>
                                                        <Typography variant="body1" sx={{ mb: 0.5 }}>
                                                            {message.content}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                            {formatTime(message.timeStamp || message.timestamp || new Date())}
                                                        </Typography>
                                                    </MessageBubble>
                                                </Box>
                                            </Slide>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </Stack>
                                )}
                            </MessagesArea>

                            {/* Message input */}
                            <InputArea>
                                <StyledTextField
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    variant="outlined"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={handleMessageChange}
                                    onKeyPress={handleKeyPress}
                                />
                                <ActionButton size="small">
                                    <AttachFileIcon />
                                </ActionButton>
                                <ActionButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                    <SendIcon />
                                </ActionButton>
                            </InputArea>
                        </>
                    ) : (
                        <EmptyState>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                <EmojiIcon sx={{ fontSize: 50 }} />
                            </Avatar>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                Welcome to Chat
                            </Typography>
                            <Typography color="textSecondary" sx={{ textAlign: 'center', maxWidth: 300 }}>
                                Select a chat from the sidebar to start messaging or create a new chat room!
                            </Typography>
                        </EmptyState>
                    )}
                </ChatArea>
            </ChatContainer>

            {/* Create Chat Dialog */}
            <Dialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Create New Chat</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Chat Room ID"
                        fullWidth
                        variant="outlined"
                        value={newChatId}
                        onChange={(e) => setNewChatId(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                    <ActionButton onClick={handleCreateChat} disabled={!newChatId.trim()}>
                        Create
                    </ActionButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Chat;