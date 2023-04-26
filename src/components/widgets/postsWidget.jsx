import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../features/postSlice";
import PostWidget from "./postWidget";
import { Typography, useTheme } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const token = useSelector((state) => state.user.token);

  const getPosts = async () => {
    const response = await axios.get("http://localhost:3001/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await axios.get(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [userId]);
  return (
    <>
      {Array.isArray(posts) && posts.length === 0 && (
        <Typography variant="h2">Nothing to see</Typography>
      )}
      {posts.map(
        ({
          _id,
          user,
          description,
          picturePath,
          filePath,
          fileName,
          likes,
          commentCount,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={user._id}
            name={`${user.firstName} ${user.lastName}`}
            description={description}
            location={user.location}
            picturePath={picturePath}
            filePath={filePath}
            fileName={fileName}
            userPicturePath={user.picturePath}
            likes={likes}
            commentCount={commentCount}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
