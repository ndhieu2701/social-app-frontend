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
    logout: () => initialState,
    changeMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
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
} = userSlice.actions;

export default userSlice.reducer;
