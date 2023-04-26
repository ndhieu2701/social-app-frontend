import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  List,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "../flexBetween";
import Friend from "../friend";
import WidgetWrapper from "../widgets/widgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setCommentCount } from "../../features/postSlice";
import axios from "axios";
import File from "../fileView";
import PostActions from "../controlPost";
import Comment from "../comment";
import Loading from "../loading";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  filePath,
  fileName,
  userPicturePath,
  likes,
  commentCount,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const you = useSelector((state) => state.user.user);
  const { _id } = useSelector((state) => state.user.user);
  const loggedInUserId = useSelector((state) => state.user.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [loading, setLoading] = useState(false);

  const [isComments, setIsComments] = useState(false);
  const [parentIDs, setParentIDs] = useState([]);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [subComment, setSubComment] = useState("");
  const [subComments, setSubComments] = useState([]);
  const [focusedCommentId, setFocusedCommentId] = useState(null);

  const patchLike = async () => {
    const response = await axios.patch(
      `http://localhost:3001/posts/${postId}/like`,
      { userId: loggedInUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const updatedPost = await response.data;
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async (value, parent) => {
    //call api create comment
    const formData = new FormData();
    formData.append("user", _id);
    formData.append("content", value);
    if (parent) formData.append("parent", parent);
    formData.append("post", postId);

    const response = await axios.post(
      "http://localhost:3001/comments",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newComment = await response.data;
    if (!parent) {
      setComments([...comments, newComment]);
      setComment("");
    }
    if (parent) {
      setSubComments([...subComments, newComment]);
      setSubComment("");
    }
    dispatch(setCommentCount({ id: postId }));
  };

  const handleOpenComment = async () => {
    setIsComments(true);
    setLoading(true);
    // call api get comment cua post
    try {
      const response = await axios(
        `http://localhost:3001/comments/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const commentsData = await response.data;
      const comments = commentsData.filter(
        (comment) => comment.parent === null
      );
      setComments(comments);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleOpenSubComment = async (parentCommentID) => {
    setParentIDs([...parentIDs, parentCommentID]);
    try {
      const response = await axios(
        `http://localhost:3001/comments/parent/${parentCommentID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const subCommmentsData = await response.data;
      setSubComments(subComments.concat(subCommmentsData));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WidgetWrapper mb="2rem">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        {/* menu include update post and delete post */}
        {loggedInUserId === postUserId && (
          <PostActions
            id={postId}
            description={description}
            picturePath={picturePath}
            fileName={fileName}
            filePath={filePath}
          />
        )}
      </Box>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post image"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      {filePath && <File filePath={filePath} fileName={fileName} />}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={!isComments ? handleOpenComment : () => {}}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{commentCount}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
      <Divider />
      {isComments && (
        <Box mt="0.5rem">
          <Box
            sx={{ margin: "0.5rem 0", display: "flex", alignItems: "center" }}
          >
            <Avatar
              alt={`${you.firstName} ${you.lastName}`}
              src={you.picturePath}
            />
            <InputBase
              placeholder="Add a comment"
              fullWidth
              color={main}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              inputProps={{ "aria-label": "Add a comment" }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => handleComment(comment)}>
                    <SendOutlined />
                  </IconButton>
                </InputAdornment>
              }
              multiline
              sx={{ pl: "0.8rem" }}
            />
          </Box>
          <Divider />
          {!loading ? (
            <List sx={{ maxHeight: 280, overflowY: "auto" }}>
              {comments.map(({ _id, user, content, subCommentCount }) => {
                return (
                  <Box key={_id}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", w: "100%" }}
                    >
                      <Comment
                        postUserId={postUserId}
                        commentID={_id}
                        name={`${user.firstName} ${user.lastName}`}
                        img={user.picturePath}
                        userId={user._id}
                        content={content}
                        subCommentCount={subCommentCount}
                        handleOpenSubComment={handleOpenSubComment}
                        inParentList={parentIDs.includes(_id) ? true : false}
                        comments={comments}
                        setComments={setComments}
                        parentIDs={parentIDs}
                        setParentIDs={setParentIDs}
                      />
                    </Box>
                    {parentIDs.includes(_id) && (
                      <List mt="0.5rem">
                        {subComments
                          .filter((subComment) => subComment.parent === _id)
                          .map(({ _id, user, content }) => {
                            return (
                              <Box
                                sx={{
                                  pl: "1rem",
                                }}
                                key={_id}
                              >
                                <Comment
                                  postUserId={postUserId}
                                  commentID={_id}
                                  name={`${user.firstName} ${user.lastName}`}
                                  img={user.picturePath}
                                  userId={user._id}
                                  content={content}
                                  isSubComment={true}
                                  subComments={subComments}
                                  setSubComments={setSubComments}
                                />
                              </Box>
                            );
                          })}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: "1rem",
                          }}
                        >
                          <Avatar
                            alt={`${you.firstName} ${you.lastName}`}
                            src={you.picturePath}
                          />
                          <InputBase
                            placeholder="Add a comment"
                            value={focusedCommentId === _id ? subComment : ""}
                            fullWidth
                            onChange={(e) => setSubComment(e.target.value)}
                            onFocus={() => setFocusedCommentId(_id)}
                            onBlur={() => setFocusedCommentId(null)}
                            inputProps={{ "aria-label": "Add a comment" }}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleComment(subComment, _id)}
                                >
                                  <SendOutlined />
                                </IconButton>
                              </InputAdornment>
                            }
                            multiline
                            sx={{ pl: "0.4rem" }}
                          />
                        </Box>
                      </List>
                    )}
                  </Box>
                );
              })}
            </List>
          ) : (
            <Loading />
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
