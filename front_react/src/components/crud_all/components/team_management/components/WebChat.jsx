import React, { useEffect, useRef, useState } from "react";

const WebChat = () => {
    const [currentUser, setCurrentUser] = useState("");
    const [roomId, setRoomId] = useState("");
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [roomInput, setRoomInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showJoinDialog, setShowJoinDialog] = useState(true);

    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        // Get username from sessionStorage
        const email = sessionStorage.getItem('email');
        if (email) {
            setCurrentUser(email);
        } else {
            // For demo purposes, set a default username
            setCurrentUser('Demo User');
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

    // Mock API functions - replace with your actual API calls
    const mockAPI = {
        async createRoom(roomId) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return { roomId, created: true };
        },

        async joinRoom(roomId) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return { roomId, joined: true };
        },

        async getMessages(roomId) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            return [
                {
                    id: 1,
                    sender: "System",
                    content: `Welcome to room ${roomId}!`,
                    timeStamp: new Date().toISOString()
                }
            ];
        }
    };

    // Mock WebSocket connection
    class MockWebSocket {
        constructor(onMessage) {
            this.onMessage = onMessage;
            this.connected = false;
        }

        connect() {
            this.connected = true;
            console.log("WebSocket connected");
        }

        disconnect() {
            this.connected = false;
            console.log("WebSocket disconnected");
        }

        sendMessage(message) {
            if (this.connected) {
                // Echo the message back immediately for demo
                setTimeout(() => {
                    this.onMessage({
                        ...message,
                        id: Date.now(),
                        timeStamp: new Date().toISOString()
                    });
                }, 100);
            }
        }
    }

    const timeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / 1000);

        if (diff < 60) return 'now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const handleJoinRoom = async () => {
        if (!roomInput.trim()) {
            alert("Please enter a room ID");
            return;
        }

        setLoading(true);
        try {
            // Try to join existing room first
            try {
                await mockAPI.joinRoom(roomInput);
                console.log("Joined existing room");
            } catch (error) {
                // If room doesn't exist, create it
                await mockAPI.createRoom(roomInput);
                console.log("Created new room");
            }

            setRoomId(roomInput);

            // Load initial messages
            const initialMessages = await mockAPI.getMessages(roomInput);
            setMessages(initialMessages);

            // Setup WebSocket connection
            wsRef.current = new MockWebSocket((message) => {
                setMessages(prev => [...prev, message]);
            });
            wsRef.current.connect();

            setConnected(true);
            setShowJoinDialog(false);
        } catch (error) {
            console.error("Error joining room:", error);
            alert("Error joining room. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (wsRef.current && connected && input.trim()) {
            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
            };

            wsRef.current.sendMessage(message);
            setInput("");
        }
    };

    const handleLogout = () => {
        if (wsRef.current) {
            wsRef.current.disconnect();
        }
        setConnected(false);
        setRoomId("");
        setMessages([]);
        setShowJoinDialog(true);
    };

    if (showJoinDialog) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                fontFamily: "system-ui, -apple-system, sans-serif"
            }}>
                <div style={{
                    maxWidth: "450px",
                    margin: "0 auto",
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                }}>
                    <div style={{
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "16px",
                        margin: "8px",
                        padding: "32px",
                    }}>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                boxShadow: "0 8px 25px rgba(102,126,234,0.3)",
                                margin: "0 auto 16px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "40px",
                                color: "white"
                            }}>
                                💬
                            </div>
                            <h1 style={{
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: "8px",
                                fontSize: "2rem",
                                margin: "0 0 8px 0"
                            }}>
                                Join Chat Room
                            </h1>
                            <p style={{
                                color: "#666",
                                opacity: 0.8,
                                marginBottom: "16px",
                                margin: "0 0 16px 0"
                            }}>
                                Welcome, {currentUser}!
                            </p>
                            <p style={{
                                color: "#888",
                                opacity: 0.6,
                                fontSize: "0.9rem",
                                margin: "0"
                            }}>
                                Enter a room ID to join or create a new chat room
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div style={{ position: "relative" }}>
                                <div style={{
                                    position: "absolute",
                                    left: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#667eea",
                                    fontSize: "20px"
                                }}>
                                    🏠
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter room ID"
                                    value={roomInput}
                                    onChange={(e) => setRoomInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleJoinRoom();
                                        }
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "16px 16px 16px 50px",
                                        borderRadius: "24px",
                                        backgroundColor: "rgba(255,255,255,0.8)",
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(102,126,234,0.3)",
                                        fontSize: "16px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        transition: "all 0.3s ease"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#667eea";
                                        e.target.style.borderWidth = "2px";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "rgba(102,126,234,0.3)";
                                        e.target.style.borderWidth = "1px";
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleJoinRoom}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    borderRadius: "24px",
                                    padding: "16px 32px",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                    transition: "all 0.3s ease",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px"
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.background = "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)";
                                        e.target.style.transform = "translateY(-2px)";
                                        e.target.style.boxShadow = "0 12px 35px rgba(0,0,0,0.2)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                                        e.target.style.transform = "translateY(0)";
                                        e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                                    }
                                }}
                            >
                                <span style={{ fontSize: "20px" }}>🚪</span>
                                {loading ? "Joining..." : "Join Room"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                backdropFilter: "blur(10px)",
                padding: "16px 24px",
                color: "white"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                            fontSize: "20px"
                        }}>
                            🏠
                        </div>
                        <div>
                            <h2 style={{ margin: "0", fontWeight: 600, fontSize: "1.25rem" }}>
                                Room: {roomId}
                            </h2>
                            <p style={{ margin: "0", opacity: 0.8, fontSize: "0.875rem" }}>
                                Connected to chat room
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                            background: "rgba(255,255,255,0.2)",
                            color: "white",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "20px",
                            padding: "8px 16px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "0.875rem"
                        }}>
                            <span>👤</span>
                            {currentUser}
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.3)",
                                borderRadius: "24px",
                                padding: "8px 16px",
                                background: "transparent",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "0.875rem"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = "rgba(255,255,255,0.1)";
                                e.target.style.borderColor = "rgba(255,255,255,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "transparent";
                                e.target.style.borderColor = "rgba(255,255,255,0.3)";
                            }}
                        >
                            <span>🚪</span>
                            Leave Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                position: "relative"
            }}>
                <div style={{
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    minHeight: "calc(100vh - 120px)",
                    margin: "16px",
                    borderRadius: "24px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}>
                    {/* Messages Container */}
                    <div
                        ref={chatBoxRef}
                        style={{
                            height: "calc(100vh - 220px)",
                            overflowY: "auto",
                            padding: "16px",
                            background: "transparent",
                        }}
                    >
                        {messages.map((message, index) => (
                            <div
                                key={message.id || index}
                                style={{
                                    display: "flex",
                                    justifyContent: message.sender === currentUser ? "flex-end" : "flex-start",
                                    marginBottom: "16px",
                                }}
                            >
                                <div style={{ maxWidth: "70%" }}>
                                    {message.sender !== currentUser && (
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: "4px",
                                            marginLeft: "8px"
                                        }}>
                                            <div style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "#667eea",
                                                color: "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "0.8rem",
                                                fontWeight: "bold",
                                                marginRight: "8px"
                                            }}>
                                                {(message.sender || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{
                                                fontSize: "0.75rem",
                                                color: "#666",
                                                fontWeight: 600
                                            }}>
                        {message.sender || 'Unknown'}
                      </span>
                                        </div>
                                    )}
                                    <div style={{
                                        maxWidth: "70%",
                                        padding: "12px 16px",
                                        borderRadius: "20px",
                                        marginBottom: "8px",
                                        wordBreak: "break-word",
                                        background: message.sender === currentUser
                                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                            : "rgba(255,255,255,0.9)",
                                        color: message.sender === currentUser ? "white" : "#333",
                                        alignSelf: message.sender === currentUser ? "flex-end" : "flex-start",
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                        backdropFilter: "blur(10px)",
                                        border: message.sender === currentUser ? "none" : "1px solid rgba(102,126,234,0.1)",
                                        position: "relative",
                                    }}>
                                        <div style={{ marginBottom: "4px" }}>
                                            {message.content}
                                        </div>
                                        <div style={{
                                            opacity: 0.7,
                                            fontSize: "0.75rem",
                                            textAlign: message.sender === currentUser ? "right" : "left",
                                        }}>
                                            {timeAgo(message.timeStamp)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Container */}
                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "16px",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                        borderTop: "1px solid rgba(102,126,234,0.1)",
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
              <textarea
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                      }
                  }}
                  style={{
                      flex: 1,
                      minHeight: "48px",
                      maxHeight: "120px",
                      padding: "12px 16px",
                      borderRadius: "24px",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(102,126,234,0.3)",
                      fontSize: "16px",
                      outline: "none",
                      resize: "none",
                      fontFamily: "inherit"
                  }}
                  onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.borderWidth = "2px";
                  }}
                  onBlur={(e) => {
                      e.target.style.borderColor = "rgba(102,126,234,0.3)";
                      e.target.style.borderWidth = "1px";
                  }}
              />

                            <button
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "20px"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)";
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(102,126,234,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 15px rgba(102,126,234,0.3)";
                                }}
                            >
                                📎
                            </button>

                            <button
                                onClick={sendMessage}
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "20px"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)";
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(102,126,234,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 15px rgba(102,126,234,0.3)";
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebChat;