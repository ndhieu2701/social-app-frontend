import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};


const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPost = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPost;
    },
    setCommentCount: (state, action) => {
      const { id } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === id);
      if (postIndex !== -1) {
        state.posts[postIndex].commentCount = state.posts[postIndex].commentCount + 1;
      }
    },
    deletePost: (state, action) => {
      const updatedPost = state.posts.filter(
        (post) => post._id !== action.payload
      );
      state.posts = updatedPost;
    },
  },
});

//export action
export const {
  setPost,
  setPosts,
  deletePost,
  setCommentCount,
} = postSlice.actions;

export default postSlice.reducer;
