import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Container,
  Stack,
  Paper,
  Fade,
  Grow
} from "@mui/material";
import {
  Chat as ChatIcon,
  PersonAdd,
  Add,
  Login
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

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

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
      useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
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
      console.log(detail);
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !!");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room already exists !!");
        } else {
          toast("Error in creating room");
        }
      }
    }
  }

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
                  </Box>
                </Grow>

                <Stack spacing={3}>
                  <Grow in timeout={1200}>
                    <StyledTextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        name="userName"
                        value={detail.userName}
                        onChange={handleFormInputChange}
                        placeholder="Enter your name"
                        InputProps={{
                          startAdornment: (
                              <PersonAdd sx={{ mr: 1, color: "#667eea" }} />
                          ),
                        }}
                    />
                  </Grow>

                  <Grow in timeout={1400}>
                    <StyledTextField
                        fullWidth
                        label="Room ID"
                        variant="outlined"
                        name="roomId"
                        value={detail.roomId}
                        onChange={handleFormInputChange}
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
};

export default JoinCreateChat;