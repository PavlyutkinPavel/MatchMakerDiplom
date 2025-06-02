import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    AppBar,
    Toolbar,
    Avatar,
    Chip,
    Container,
    Stack,
    Fade,
    Zoom,
    InputAdornment,
    Button,
    Divider,
    Card,
    CardContent,
    Grow
} from "@mui/material";
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    ExitToApp as ExitIcon,
    Person as PersonIcon,
    Room as RoomIcon,
    Chat as ChatIcon,
    Add,
    Login
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import useChatContext from "context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "config/AxiosHelper";
import { getMessagess, createRoomApi, joinChatApi } from "services/RoomService";
import { timeAgo } from "config/helper";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "calc(100vh - 120px)",
    margin: theme.spacing(2),
    borderRadius: theme.spacing(3),
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
    height: "calc(100vh - 220px)",
    overflowY: "auto",
    padding: theme.spacing(2),
    background: "transparent",
    "&::-webkit-scrollbar": {
        width: 8,
    },
    "&::-webkit-scrollbar-track": {
        background: "rgba(255,255,255,0.1)",
        borderRadius: 10,
    },
    "&::-webkit-scrollbar-thumb": {
        background: "rgba(102,126,234,0.3)",
        borderRadius: 10,
        "&:hover": {
            background: "rgba(102,126,234,0.5)",
        },
    },
}));

const MessageBubble = styled(Box)(({ theme, isown }) => ({
    maxWidth: "85%", // Увеличил ширину с 70% до 85%
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(2.5),
    marginBottom: theme.spacing(1),
    wordBreak: "break-word",
    background: isown
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "rgba(255,255,255,0.9)",
    color: isown ? "white" : theme.palette.text.primary,
    alignSelf: isown ? "flex-end" : "flex-start",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    border: isown ? "none" : "1px solid rgba(102,126,234,0.1)",
    position: "relative",
    "&::before": isown ? {
        content: '""',
        position: "absolute",
        right: -8,
        top: 10,
        width: 0,
        height: 0,
        borderLeft: "8px solid transparent",
        borderTop: "8px solid #667eea",
    } : {
        content: '""',
        position: "absolute",
        left: -8,
        top: 10,
        width: 0,
        height: 0,
        borderRight: "8px solid rgba(255,255,255,0.9)",
        borderTop: "8px solid transparent",
        borderBottom: "8px solid transparent",
    },
}));

const InputContainer = styled(Paper)(({ theme }) => ({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(2),
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(102,126,234,0.1)",
    borderRadius: 0,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: theme.spacing(3),
        backgroundColor: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        "& fieldset": {
            borderColor: "rgba(102,126,234,0.3)",
        },
        "&:hover fieldset": {
            borderColor: "rgba(102,126,234,0.6)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#667eea",
            borderWidth: 2,
        },
    },
    "& .MuiInputLabel-root": {
        color: "#666",
        "&.Mui-focused": {
            color: "#667eea",
        },
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    margin: theme.spacing(0, 0.5),
    boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
    "&:hover": {
        background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 20px rgba(102,126,234,0.4)",
    },
    transition: "all 0.3s ease",
}));

const UserChip = styled(Chip)(({ theme }) => ({
    background: "rgba(255,255,255,0.2)",
    color: "white",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.3)",
    fontWeight: 600,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 450,
    margin: "0 auto",
    borderRadius: theme.spacing(3),
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: theme.spacing(2),
    margin: theme.spacing(1),
    padding: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    padding: theme.spacing(1.5, 4),
    fontWeight: 600,
    textTransform: "none",
    fontSize: "1rem",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
    },
}));

const JoinButton = styled(StyledButton)(({ theme }) => ({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    "&:hover": {
        background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    },
}));

const CreateButton = styled(StyledButton)(({ theme }) => ({
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    "&:hover": {
        background: "linear-gradient(135deg, #ec84f5 0%, #f04361 100%)",
    },
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 8px 25px rgba(102,126,234,0.3)",
    margin: "0 auto",
    marginBottom: theme.spacing(2),
}));

const WebChat = () => {
    const {
        roomId,
        currentUser,
        connected,
        setConnected,
        setRoomId,
        setCurrentUser,
    } = useChatContext();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [roomIdInput, setRoomIdInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

    // Получаем username из sessionStorage при загрузке компонента
    useEffect(() => {
        const userEmail = sessionStorage.getItem('logInEmail');
        if (userEmail) {
            setCurrentUser(userEmail);
        }
    }, [setCurrentUser]);

    useEffect(() => {
        async function loadMessages() {
            try {
                const messages = await getMessagess(roomId);
                setMessages(messages);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        }
        if (connected) {
            loadMessages();
        }
    }, [connected, roomId]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    // Fixed WebSocket connection effect with proper cleanup
    useEffect(() => {
        let client = null;

        const connectWebSocket = () => {
            const sock = new SockJS(`${baseURL}/chat`);
            client = Stomp.over(sock);

            client.connect({}, () => {
                setStompClient(client);
                toast.success("Connected to chat!");

                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    console.log(message);
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            }, (error) => {
                console.error("WebSocket connection error:", error);
                toast.error("Failed to connect to chat");
            });
        };

        if (connected && roomId) {
            connectWebSocket();
        }

        // Proper cleanup function
        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [roomId, connected]);

    const sendMessage = async () => {
        if (stompClient && connected && input.trim()) {
            console.log(input);

            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
            };

            stompClient.send(
                `/app/sendMessage/${roomId}`,
                {},
                JSON.stringify(message)
            );
            setInput("");
        }
    };

    function validateForm() {
        if (roomIdInput === "") {
            toast.error("Please enter Room ID!");
            return false;
        }
        if (!currentUser) {
            toast.error("User not found in session!");
            return false;
        }
        return true;
    }

    async function joinChat() {
        if (validateForm()) {
            try {
                const room = await joinChatApi(roomIdInput);
                toast.success("Joined successfully!");
                setRoomId(room.roomId);
                setConnected(true);
            } catch (error) {
                if (error.status == 400) {
                    toast.error(error.response.data);
                } else {
                    toast.error("Error in joining room");
                }
                console.log(error);
            }
        }
    }

    async function createRoom() {
        if (validateForm()) {
            console.log(roomIdInput);
            try {
                const response = await createRoomApi(roomIdInput);
                console.log(response);
                toast.success("Room Created Successfully!");
                setRoomId(response.roomId);
                setConnected(true);
            } catch (error) {
                console.log(error);
                if (error.status == 400) {
                    toast.error("Room already exists!");
                } else {
                    toast.error("Error in creating room");
                }
            }
        }
    }

    function handleLogout() {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect();
        }
        setStompClient(null);
        setConnected(false);
        setRoomId("");
        setMessages([]);
        setRoomIdInput("");
    }

    // Helper function to safely get first character
    const getFirstChar = (str) => {
        return str && typeof str === 'string' ? str.charAt(0).toUpperCase() : '?';
    };

    // Helper function to safely get sender name
    const getSenderName = (sender) => {
        return sender && typeof sender === 'string' ? sender : 'Unknown';
    };

    // Если не подключен к чату, показываем форму входа/создания комнаты
    if (!connected) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Fade in timeout={800}>
                        <StyledCard>
                            <StyledCardContent>
                                <Grow in timeout={1000}>
                                    <Box textAlign="center" mb={4}>
                                        <AnimatedAvatar>
                                            <ChatIcon sx={{ fontSize: 40 }} />
                                        </AnimatedAvatar>
                                        <Typography
                                            variant="h4"
                                            component="h1"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                mb: 1,
                                            }}
                                        >
                                            Join or Create Room
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ opacity: 0.8 }}
                                        >
                                            Connect with others in real-time chat
                                        </Typography>
                                        {currentUser && (
                                            <Typography
                                                variant="body2"
                                                color="primary"
                                                sx={{ mt: 1, fontWeight: 600 }}
                                            >
                                                Welcome, {currentUser}!
                                            </Typography>
                                        )}
                                    </Box>
                                </Grow>

                                <Stack spacing={3}>
                                    <Grow in timeout={1400}>
                                        <StyledTextField
                                            fullWidth
                                            label="Room ID"
                                            variant="outlined"
                                            value={roomIdInput}
                                            onChange={(e) => setRoomIdInput(e.target.value)}
                                            placeholder="Enter room ID or create new one"
                                            InputProps={{
                                                startAdornment: (
                                                    <ChatIcon sx={{ mr: 1, color: "#667eea" }} />
                                                ),
                                            }}
                                        />
                                    </Grow>

                                    <Grow in timeout={1600}>
                                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                            <JoinButton
                                                fullWidth
                                                variant="contained"
                                                onClick={joinChat}
                                                startIcon={<Login />}
                                            >
                                                Join Room
                                            </JoinButton>
                                            <CreateButton
                                                fullWidth
                                                variant="contained"
                                                onClick={createRoom}
                                                startIcon={<Add />}
                                            >
                                                Create Room
                                            </CreateButton>
                                        </Stack>
                                    </Grow>
                                </Stack>
                            </StyledCardContent>
                        </StyledCard>
                    </Fade>
                </Container>
            </Box>
        );
    }

    // Если подключен, показываем чат
    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <StyledAppBar position="static">
                <Toolbar>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                        <Avatar sx={{ mr: 2, bgcolor: "rgba(255,255,255,0.2)" }}>
                            <RoomIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Room: {roomId}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Connected users in chat
                            </Typography>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <UserChip
                            icon={<PersonIcon />}
                            label={currentUser || "Unknown User"}
                            variant="outlined"
                        />
                        <Button
                            onClick={handleLogout}
                            startIcon={<ExitIcon />}
                            sx={{
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.3)",
                                borderRadius: 3,
                                "&:hover": {
                                    background: "rgba(255,255,255,0.1)",
                                    borderColor: "rgba(255,255,255,0.5)",
                                },
                            }}
                        >
                            Leave Room
                        </Button>
                    </Stack>
                </Toolbar>
            </StyledAppBar>

            <Container maxWidth="lg" sx={{ position: "relative" }}>
                <ChatContainer>
                    <MessagesContainer ref={chatBoxRef}>
                        {messages.map((message, index) => {
                            // Skip rendering if message or sender is invalid
                            if (!message || !message.content) {
                                return null;
                            }

                            const senderName = getSenderName(message.sender);
                            const isOwnMessage = senderName === currentUser;

                            return (
                                <Fade key={index} in timeout={500}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                                            mb: 2,
                                        }}
                                    >
                                        <Box sx={{ maxWidth: "85%" }}>
                                            {!isOwnMessage && (
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, ml: 1 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            mr: 1,
                                                            bgcolor: "primary.main",
                                                            fontSize: "0.8rem",
                                                        }}
                                                    >
                                                        {getFirstChar(senderName)}
                                                    </Avatar>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                        {senderName}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <MessageBubble isown={isOwnMessage ? 1 : 0}>
                                                <Typography variant="body1" sx={{ mb: 0.5 }}>
                                                    {message.content}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        opacity: 0.7,
                                                        display: "block",
                                                        textAlign: isOwnMessage ? "right" : "left",
                                                    }}
                                                >
                                                    {message.timeStamp ? timeAgo(message.timeStamp) : "Just now"}
                                                </Typography>
                                            </MessageBubble>
                                        </Box>
                                    </Box>
                                </Fade>
                            );
                        })}
                    </MessagesContainer>

                    <InputContainer elevation={0}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <StyledTextField
                                fullWidth
                                multiline
                                maxRows={3}
                                variant="outlined"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                ref={inputRef}
                            />

                            <StyledIconButton size="large" onClick={sendMessage}>
                                <SendIcon />
                            </StyledIconButton>
                        </Stack>
                    </InputContainer>
                </ChatContainer>
            </Container>
        </Box>
    );
};

export default WebChat;