import { Avatar, Box, MenuItem, Typography, useTheme } from "@mui/material";
import React from "react";
import { getSender } from "../../../config/ChatLogics";
import { useDispatch, useSelector } from "react-redux";
import { setBoxChatOpen } from "../../../features/chatSlice";

const ChatListItem = ({ chatID, chatName, latestMessage, users, closeMenu, isGroupChat }) => {
  const theme = useTheme();
  const main = theme.palette.neutral.main;
  const loginUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleOpenBoxChat = () => {
    dispatch(setBoxChatOpen(chatID));
    closeMenu();
  };

  return (
    <MenuItem
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
      onClick={handleOpenBoxChat}
    >
      <Typography
        variant="subtitle1"
        sx={{
          width: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: " ellipsis",
        }}
      >
        {!isGroupChat ? getSender(loginUser, users) : chatName}
      </Typography>
      {!latestMessage && (
        <Typography
          variant="subtitle2"
          sx={{
            color: main,
            width: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: " ellipsis",
          }}
        >
          Message: You create a new chat
        </Typography>
      )}
      {latestMessage && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={latestMessage.sender.picturePath}
            sx={{ width: "20px", height: "20px" }}
          />

          <Typography variant="subtitle1">
            {latestMessage.sender.firstName} {latestMessage.sender.lastName}:
          </Typography>
          <Typography variant="subtitle1">
            {` ${latestMessage.content}`}
          </Typography>
        </Box>
      )}
    </MenuItem>
  );
};

export default ChatListItem;
