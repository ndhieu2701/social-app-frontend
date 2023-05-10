import { Box, IconButton, Input, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSender } from "../../config/ChatLogics";
import { Minimize, Add, Close } from "@mui/icons-material";
import { removeOpenChat } from "../../features/chatSlice";
import { fetchChat } from "../../features/chatSlice";
import axios from "axios";
import ScrollChat from "./ScrollChat";
import io from "socket.io-client";

var socket;

const BoxChat = ({ chat }) => {
  const theme = useTheme();
  const main = theme.palette.background.alt;
  const loginUser = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const fetchChatType = useSelector((state) => state.chat.fetchChat);
  const dispatch = useDispatch();
  const [isMini, setIsMini] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const END_POINT = "http://localhost:3001";

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", loginUser);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChat || // if chat is not selected or doesn't match current chat
        selectedChat !== newMessageRecieved.chat._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        dispatch(fetchChat(!fetchChatType));
        // }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:3001/message/${selectedChat}`,
        config
      );
      setMessages(data);
      socket.emit("join chat", selectedChat);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMiniChat = () => {
    setIsMini(!isMini);
  };

  const handleClose = () => {
    dispatch(removeOpenChat(chat._id));
  };

  const handleSendMessage = async (event) => {
    socket.emit("stop typing", chat._id);
    if (event.key === "Enter" && newMessage) {
      try {
        const res = await axios.post(
          "http://localhost:3001/message/",
          {
            content: newMessage,
            chatID: chat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const messageRes = await res.data;
        setNewMessage("");
        socket.emit("new message", messageRes);
        dispatch(fetchChat(!fetchChatType));
        setMessages([...messages, messageRes]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    var lastTyping = new Date().getTime();
    var timerLenght = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTyping;

      if (timeDiff >= timerLenght && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLenght);
  };
  return (
    <Box
      sx={{
        width: "250px",
        height: !isMini ? "360px" : "auto",
        background: main,
        margin: "0 16px",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        boxShadow: "0px 0px 0px rgba(255, 255, 255, 0.15)",
        border: !isMini ? "1px solid #ccc" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
      }}
    >
      {/* controll box */}
      <Box
        sx={{
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          border: isMini ? "1px solid #ccc" : "none",
          justifyContent: "space-between",
          padding: "2px 6px",
          height: "2rem",
          position: "absolute",
          top: !isMini ? 0 : "-2.2rem",
          left: 0,
          right: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            width: "60%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: " ellipsis",
          }}
        >
          {getSender(loginUser, chat.users)}
        </Typography>
        <Box>
          <IconButton onClick={handleMiniChat}>
            {!isMini ? <Minimize /> : <Add />}
          </IconButton>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>
      {!isMini && (
        <>
          {/* message show */}
          <ScrollChat messages={messages} />
          {/* message input */}
          <Box
            sx={{ width: "100%", borderTop: "1px solid #ccc" }}
            onKeyDown={(event) => handleSendMessage(event)}
          >
            {isTyping && <Box sx={{ width: "100%" }}> ... </Box>}
            <Input
              fullWidth
              sx={{ padding: "2px 8px" }}
              placeholder="Enter new message"
              value={newMessage}
              onChange={(e) => typingHandler(e)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default BoxChat;
