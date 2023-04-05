import React, { useState } from "react";
import {
  Delete,
  Edit,
  MoreVert,
  HighlightOff,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  useTheme,
} from "@mui/material";
import Dropzone from "react-dropzone";
import FlexBetween from "../flexBetween";
import File from "../fileView";
import { postFile, postImg } from "../../config/firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../features/userSlice";
import { setPost, deletePost } from "../../features/postSlice";

export default function PostActions({
  id,
  description,
  picturePath,
  fileName,
  filePath,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const [newPicturePath, setNewPicturePath] = useState(picturePath);
  const [newFileName, setNewFileName] = useState(fileName);
  const [newFilePath, setNewFilePath] = useState(filePath);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const { palette } = useTheme();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: palette.background.alt,
    border: "1px solid #000",
    borderRadius: "0.75rem",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openEditModal = () => {
    setAnchorEl(null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = () => {
    setAnchorEl(null);
    setIsDeleteModalOpen(true);
  };
  //update post action here
  const handleEdit = async () => {
    // Do something with the post data to edit it
    try {
      const formData = new FormData();
      formData.append("description", newDescription);
      if (image) {
        const picturePathUpdate = await postImg(image);
        formData.append("picturePath", picturePathUpdate);
      }
      if (!image && picturePath && newPicturePath === "") {
        console.log("hehe");
        formData.append("picturePath", newPicturePath);
      }

      if (file) {
        const fileUpdate = await postFile(file);
        formData.append("filePath", fileUpdate.urlFile);
        formData.append("fileName", fileUpdate.fileName);
      }

      if (!file && filePath && newFilePath === "") {
        formData.append("fileName", newFileName);
        formData.append("filePath", newFilePath);
      }

      const response = await axios.put(
        `http://localhost:3001/posts/${id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedPost = await response.data;
      dispatch(setMessage({ type: "success", content: "Update success!" }));
      dispatch(setPost({ post: updatedPost }));

      setImage(null);
      setNewPicturePath(updatedPost.picturePath);
      setFile(null);
      setNewFileName(updatedPost.fileName);
      setNewFilePath(updatedPost.filePath);
    } catch (error) {
      dispatch(setMessage({ type: "error", content: error.message }));
    }
    setIsEditModalOpen(false);
  };

  //delete post action here
  const handleDelete = async () => {
    // Do something with the post data to delete it
    try {
      const response = await axios.delete(
        `http://localhost:3001/posts/${id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const deletedPost = await response.data;
      dispatch(deletePost(id));
      dispatch(setMessage({ type: "success", content: "Delete sucess!" }));
      setIsDeleteModalOpen(false);
    } catch (error) {
      dispatch(setMessage({ type: "error", content: error.message }));
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setNewDescription(description);
    if (picturePath) {
      setImage(null);
      setNewPicturePath(picturePath);
    }
    if (filePath) {
      setFile(null);
      setNewFileName(fileName);
      setNewFilePath(filePath);
    }
  };

  return (
    <Box>
      <IconButton
        aria-label="post actions"
        aria-controls="post-actions-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="post-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={openEditModal}>
          <Edit sx={{ mr: 1 }} />
          Update post
        </MenuItem>
        <MenuItem onClick={openDeleteModal}>
          <Delete sx={{ mr: 1 }} />
          Delete post
        </MenuItem>
      </Menu>

      {/* modal delete post */}
      <Modal open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
        <Box
          sx={[
            style,
            {
              width: 400,
              display: "flex",
              flexDirection: "column",
            },
          ]}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Are you sure you want to delete this post?
          </Typography>
          <Box
            w="100%"
            mt={2}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes, delete post
            </Button>
            <Button variant="contained" onClick={handleDeleteModalClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* modal edit post */}
      <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
        <Box sx={style}>
          <Typography variant="h5">Edit post</Typography>
          <TextField
            id="description"
            label="Status"
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
            fullWidth
            multiline
            variant="outlined"
            autoFocus
            sx={{ mt: 2 }}
          />
          {newPicturePath && (
            <Box mt={2} sx={{ position: "relative" }}>
              <img
                width="100%"
                height="300"
                alt="update post image"
                style={{
                  borderRadius: "0.75rem",
                  marginTop: "0.75rem",
                  objectFit: "cover",
                }}
                src={newPicturePath}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  color: palette.primary.main,
                  top: 14,
                  right: 2,
                  p: "2px",
                  cursor: "pointer",
                  // border: "1px solid #333"
                }}
                onClick={() => setNewPicturePath("")}
              >
                <HighlightOff />
              </IconButton>
            </Box>
          )}
          {!newPicturePath && !filePath && !file && (
            <Box
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              mt="1rem"
              p="1rem"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
              >
                {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                    <Box
                      {...getRootProps()}
                      // border={`2px dashed ${palette.primary.main}`}
                      // p="1rem"
                      width="100%"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!image ? (
                        <p>Add image here or not</p>
                      ) : (
                        <FlexBetween>
                          <Typography>{image.name}</Typography>
                          <EditOutlined />
                        </FlexBetween>
                      )}
                    </Box>
                    {image && (
                      <IconButton
                        onClick={() => setImage(null)}
                        sx={{ width: "15%" }}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    )}
                  </FlexBetween>
                )}
              </Dropzone>
            </Box>
          )}
          {newFilePath && (
            <Box
              mt={2}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                w: "100%",
              }}
            >
              <File fileName={newFileName} filePath={newFilePath} />
              <IconButton
                onClick={() => {
                  setNewFileName(""), setNewFilePath("");
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </Box>
          )}
          {!newFilePath && !picturePath && !image && (
            <Box
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              mt="1rem"
              p="1rem"
            >
              <Dropzone
                acceptedFiles="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/pdf, text/plain"
                multiple={false}
                onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
              >
                {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                    <Box
                      {...getRootProps()}
                      // border={`2px dashed ${palette.primary.main}`}
                      // p="1rem"
                      width="100%"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!file ? (
                        <p>Add file here or not</p>
                      ) : (
                        <FlexBetween>
                          <Typography>{file.name}</Typography>
                          <EditOutlined />
                        </FlexBetween>
                      )}
                    </Box>
                    {file && (
                      <IconButton
                        onClick={() => setFile(null)}
                        sx={{ width: "15%" }}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    )}
                  </FlexBetween>
                )}
              </Dropzone>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              w: "100%",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEdit()}
            >
              Save changes
            </Button>
            <Button variant="contained" onClick={() => handleEditModalClose()}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
