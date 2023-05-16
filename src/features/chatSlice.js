import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetchChat: false,
  selectedChat: "",
  chats: [],
  chatOpen: [],
  messages: [],
  chatUnread: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    clearChats: () => initialState,
    setBoxChatOpen: (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat._id === action.payload
      );
      state.chatOpen = state.chats[chatIndex];
      state.selectedChat = action.payload;
    },
    setChat: (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat._id === action.payload.chat._id
      );
      const chatOpenIndex = state.chatOpen.findIndex(
        (chat) => chat._id === action.payload.chat._id
      );
      // chua co chat bao gio
      if (chatIndex === -1) {
        state.chats.unshift(action.payload.chat);
        state.chatOpen = action.payload.chat;
        state.selectedChat = action.payload.chat._id;
      }
      // co hat nhung chua mo box chat
      else if (chatIndex !== -1 && chatOpenIndex === -1) {
        state.chatOpen = action.payload.chat;
        state.selectedChat = action.payload.chat._id;
      }
      // co ca mo box chat roi nhung chua biet chon vao box chat do
      else if (chatIndex !== -1 && chatOpenIndex !== -1) {
        state.selectedChat = action.payload.chat._id;
      }
    },
    removeOpenChat: (state, action) => {
      state.selectedChat = "";
      state.chatOpen = [];
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    fetchChat: (state, action) => {
      state.fetchChat = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    setChatUnread: (state, action) => {
      const isExist = state.chatUnread.findIndex(
        (chat) => chat === action.payload
      );
      if (isExist === -1) state.chatUnread.push(action.payload);
    },
    removeChatUnread: (state, action) => {
      const newChatUnread = state.chatUnread.filter(
        (chat) => chat !== action.payload
      );
      state.chatUnread = newChatUnread;
    },
  },
});

//export action
export const {
  setChat,
  setChats,
  setBoxChatOpen,
  setSelectedChat,
  clearChats,
  removeOpenChat,
  fetchChat,
  setMessages,
  addMessage,
  setChatUnread,
  removeChatUnread,
} = chatSlice.actions;

export default chatSlice.reducer;
