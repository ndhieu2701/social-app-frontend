import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMessage } from "../../features/userSlice";

const Comment = ({
  postUserId,
  commentID,
  name,
  img,
  content,
  userId,
  subCommentCount,
  handleOpenSubComment,
  inParentList,
  isSubComment,
  comments,
  setComments,
  subComments,
  setSubComments,
  parentIDs,
  setParentIDs,
}) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const { _id } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [updateComment, setUpdateComment] = useState(false);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
  const [newComment, setNewComment] = useState(content);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUpdateComment = () => {
    setUpdateComment(true);
    handleMenuClose();
  };

  const handleOpenDeleteCommentDialog = () => {
    setOpenDeleteCommentDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteCommentDialog = () => {
    setOpenDeleteCommentDialog(false);
  };

  const handleUpdateComment = async () => {
    const formData = new FormData();
    formData.append("commentID", commentID);
    formData.append("content", newComment);
    try {
      const response = await axios.put(
        `http://localhost:3001/comments/${commentID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newComment = await response.data;
      if (!isSubComment) {
        const commentIndex = comments.findIndex(
          (comment) => comment._id === commentID
        );
        comments[commentIndex] = newComment;
        setComments(comments);
      } else {
        const commentIndex = subComments.findIndex(
          (comment) => comment._id === commentID
        );
        subComments[commentIndex] = newComment;
        setSubComments(subComments);
      }
      setUpdateComment(false);
      dispatch(setMessage({ type: "success", content: "Update success!" }));
    } catch (error) {
      dispatch(setMessage({ type: "error", content: error.message }));
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/comments/${commentID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.data;
      if (!isSubComment) {
        setComments(comments.filter((comment) => comment._id !== commentID));
        setParentIDs(parentIDs.filter((parentID) => parentID !== commentID));
      } else {
        setSubComments(
          subComments.filter((subComment) => subComment._id !== commentID)
        );
      }
      dispatch(setMessage({ type: "success", content: "Delete success!" }));
    } catch (error) {
      dispatch(setMessage({ type: "error", content: error.message }));
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <ListItem
          sx={{ padding: 0 }}
          disablePadding
          alignItems="flex-start"
          secondaryAction={
            <Box>
              {(postUserId === _id || userId === _id) && !updateComment && (
                <>
                  <IconButton
                    aria-label="comment actions"
                    aria-controls="comment-actions-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    id="comment-actions-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    {userId === _id && (
                      <MenuItem onClick={handleOpenUpdateComment}>
                        <Edit sx={{ mr: 1 }} />
                        Update comment
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleOpenDeleteCommentDialog}>
                      <Delete sx={{ mr: 1 }} />
                      Delete comment
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          }
        >
          <ListItemAvatar
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/profile/${userId}`)}
          >
            <Avatar alt={name} src={img} />
          </ListItemAvatar>
          <ListItemText
            primary={name}
            secondary={
              !updateComment ? (
                <Typography
                  color={main}
                  sx={{
                    wordWrap: "break-word",
                    display: "inline-block",
                    width: "80%",
                  }}
                >
                  {newComment}
                </Typography>
              ) : (
                <>
                  <InputBase
                    value={newComment}
                    autoFocus
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{
                      border: "1px solid #ccc",
                      width: "70%",
                      padding: "0.4rem 0.6rem",
                      borderRadius: 2,
                    }}
                    multiline
                  />
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textTransform: "uppercase" }}
                    onClick={handleUpdateComment}
                  >
                    Save
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textTransform: "uppercase" }}
                    onClick={() => setUpdateComment(false)}
                  >
                    Cancel
                  </Button>
                </>
              )
            }
          />
        </ListItem>
        {!inParentList && !isSubComment && (
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: "initial", ml: "3rem" }}
            onClick={() => handleOpenSubComment(commentID)}
          >
            {subCommentCount ? "See replies" : "Comment"}
          </Button>
        )}
      </Box>
      <Dialog
        open={openDeleteCommentDialog}
        onClose={handleCloseDeleteCommentDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{"Delete comment?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Are you sure to delete this comment? This action will delete all
            replies of this comment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDeleteCommentDialog}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteComment}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Comment;
