import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: {
    count: 0,
    messages: [],
  },
  notifies: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addChatNoti: (state, action) => {
      const isExist = state.chats.messages.find(
        (message) => message.chat._id === action.payload.chat._id
      );
      if (!isExist) state.chats.count = state.chats.count + 1;
      state.chats.messages.push(action.payload);
    },
    changeChatCount: (state, action) => {
      const newMessages = state.chats.messages.filter(
        (message) => message.chat._id !== action.payload
      );
      state.chats.messages = newMessages;
      state.chats.count = state.chats.count - 1;
    },
  },
});

export const {addChatNoti, changeChatCount} = notificationSlice.actions
 export default notificationSlice.reducer