import { Avatar, Box, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";

const ScrollChat = () => {
  const scrollRef = useRef();
  const user = useSelector((state) => state.user.user);
  const messages = useSelector((state) => state.chat.messages);
  const theme = useTheme();
  const main = theme.palette.primary.main;
  const second = theme.palette.secondary.main;
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "scroll",
        marginTop: "2rem",
        paddingBottom: "10px",
      }}
    >
      {messages &&
        messages.map((m, i) => {
          return (
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
              key={m._id}
              ref={scrollRef}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Avatar
                  sx={{ width: "30px", height: "30px", m: "0.8rem 4px 0" }}
                  cursor="pointer"
                  src={m.sender.picturePath}
                />
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? main : second
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  wordWrap: "break-word",
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </Box>
  );
};

export default ScrollChat;
