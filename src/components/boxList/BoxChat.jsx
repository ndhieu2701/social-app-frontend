import { Box, IconButton, Input, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSender } from "../../config/ChatLogics";
import { Minimize, Add, Close } from "@mui/icons-material";
import {
  addMessage,
  removeOpenChat,
  setMessages,
} from "../../features/chatSlice";
import { fetchChat } from "../../features/chatSlice";
import axios from "axios";
import ScrollChat from "./ScrollChat";

const BoxChat = ({ chat }) => {
  const theme = useTheme();
  const main = theme.palette.background.alt;
  const loginUser = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const fetchChatType = useSelector((state) => state.chat.fetchChat);
  const socket = useSelector(state => state.socket.socket)
  const dispatch = useDispatch();
  const [isMini, setIsMini] = useState(false);

  const [newMessage, setNewMessage] = useState("");

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
      dispatch(setMessages(data));
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
        dispatch(addMessage(messageRes));
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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
          display: "flex",
          alignItems: "center",
          border: isMini ? "1px solid #ccc" : "none",
          borderBottom: "1px solid #ccc",
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
          {chat.isGroupChat ? chat.chatName : getSender(loginUser, chat.users)}
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
          <ScrollChat />
          {/* message input */}
          <Box
            sx={{ width: "100%", borderTop: "1px solid #ccc" }}
            onKeyDown={(event) => handleSendMessage(event)}
          >
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
