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
  Divider
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  ExitToApp as ExitIcon,
  Person as PersonIcon,
  Room as RoomIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

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
  maxWidth: "70%",
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

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat!");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
  }, [roomId]);

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

  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

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
                  label={currentUser}
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
              {messages.map((message, index) => (
                  <Fade key={index} in timeout={500}>
                    <Box
                        sx={{
                          display: "flex",
                          justifyContent: message.sender === currentUser ? "flex-end" : "flex-start",
                          mb: 2,
                        }}
                    >
                      <Box sx={{ maxWidth: "70%" }}>
                        {message.sender !== currentUser && (
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
                                {message.sender.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                {message.sender}
                              </Typography>
                            </Box>
                        )}
                        <MessageBubble isown={message.sender === currentUser ? 1 : 0}>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            {message.content}
                          </Typography>
                          <Typography
                              variant="caption"
                              sx={{
                                opacity: 0.7,
                                display: "block",
                                textAlign: message.sender === currentUser ? "right" : "left",
                              }}
                          >
                            {timeAgo(message.timeStamp)}
                          </Typography>
                        </MessageBubble>
                      </Box>
                    </Box>
                  </Fade>
              ))}
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

                <StyledIconButton size="large">
                  <AttachFileIcon />
                </StyledIconButton>

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

export default ChatPage;