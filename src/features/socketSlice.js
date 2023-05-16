import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: undefined,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    removeSocket: () => initialState,
  },
});

export const { setSocket, removeSocket } = socketSlice.actions;
export default socketSlice.reducer;
