import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../features/userSlice";
import postReducer from "../features/postSlice";
import chatReducer from "../features/chatSlice"
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['token', 'user', 'mode']
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    post: postReducer,
    chat: chatReducer
  },
  middleware: [thunk],
});

export const persistor = persistStore(store);
