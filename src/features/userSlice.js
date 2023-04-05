import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  mode: "light",
  message: {
    type: "", //type: success || error
    content: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      (state.token = null), (state.user = null);
    },
    changeMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
    },
    setFriends: (state, action) => {
      state.user.friends = action.payload.friends;
    },
    setMessage: (state, action) => {
      state.message.type = action.payload.type;
      state.message.content = action.payload.content;
    },
    clearMessage: (state) => {
      state.message.type = "";
      state.message.content = "";
    },
  },
});

// export actions
export const {
  logout,
  changeMode,
  setLogin,
  setFriends,
  setMessage,
  clearMessage,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;
