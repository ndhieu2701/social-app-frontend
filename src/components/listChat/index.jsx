import { Message } from "@mui/icons-material";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListItem from "./chatListItem";
import axios from "axios";
import { setChats, fetchChat, addMessage, setChatUnread } from "../../features/chatSlice";
import ButtonCreateChat from "./buttonCreateChat";
import io from "socket.io-client";
import { addChatNoti } from "../../features/notificationSlice";
import { setSocket } from "../../features/socketSlice";

const ListChat = () => {
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const token = useSelector((state) => state.user.token);
  const { _id } = useSelector((state) => state.user.user);

  const count = useSelector((state) => state.noti.chats.count);
  const fetchChatType = useSelector((state) => state.chat.fetchChat);
  const loginUser = useSelector((state) => state.user.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const socket = useSelector((state) => state.socket.socket);

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const chats = useSelector((state) => state.chat.chats);

  const END_POINT = "http://192.168.1.5:3001";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getAllChats = async () => {
    const response = await axios(`http://localhost:3001/chats/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const chats = await response.data;
    dispatch(setChats(chats));
  };

  useEffect(() => {
    const socketIO = io(END_POINT);
    socketIO.emit("setup", loginUser);
    socketIO.on("connected", () => console.log("connect"));
    dispatch(setSocket(socketIO));
    return () => {
      socketIO.off("message recieved");
    };
  }, []);

  useEffect(() => {
    socket?.on("message recieved", (newMessageRecieved) => {
      dispatch(fetchChat(!fetchChatType));
      if (!selectedChat || selectedChat !== newMessageRecieved.chat._id) {
        //notification
        dispatch(addChatNoti(newMessageRecieved));
        dispatch(setChatUnread(newMessageRecieved.chat._id))
      } else {
        dispatch(addMessage(newMessageRecieved));
      }
    });

    return () => {
      socket?.off("message recieved");
    };
  });

  useEffect(() => {
    getAllChats();
  }, [fetchChatType]);

  return (
    <>
      <Badge badgeContent={count} color="error" overlap="circular">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "list-chat-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
        >
          <Message sx={{ fontSize: "25px", color: dark }} />
        </IconButton>
      </Badge>
      <Menu
        id="list-chat-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.4))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              // width: 32,
              // height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <Box
          sx={{
            minHeight: "200px",
            maxWidth: "300px",
            overflowY: "scroll",
            padding: "0 0.8rem",
          }}
        >
          {chats.map((chat) => {
            return (
              <Box key={chat._id}>
                <ChatListItem
                  latestMessage={chat.latestMessage}
                  users={chat.users}
                  chatID={chat._id}
                  closeMenu={handleClose}
                  isGroupChat={chat.isGroupChat}
                  chatName={chat.chatName}
                />
                <Divider />
              </Box>
            );
          })}
          {chats.length === 0 && (
            <Typography variant="body1">You have no message</Typography>
          )}
        </Box>
        <ButtonCreateChat />
      </Menu>
    </>
  );
};

export default ListChat;
