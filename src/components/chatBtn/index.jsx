import { Button, useTheme } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setChat } from "../../features/chatSlice";
import { setMessage } from "../../features/userSlice";

const ChatBtn = ({ userId, token }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const handleChat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/chats/chat",
        { userID: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const chat = await response.data;
      dispatch(setChat({ chat }));
    } catch (error) {
      dispatch(
        setMessage({
          type: "error",
          content: "Something went wrong, try again later",
        })
      );
    }
  };
  return (
    <Button
      variant="contained"
      onClick={handleChat}
      sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
    >
      Chat
    </Button>
  );
};

export default ChatBtn;
