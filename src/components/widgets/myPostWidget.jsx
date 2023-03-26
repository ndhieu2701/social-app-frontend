import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  ImageOutlined,
  MicOutlined,
  Stop,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import FlexBetween from "../flexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../userImage";
import WidgetWrapper from "./widgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../features/postSlice";
import axios from "axios";
import {
  nameByDate,
  postAudio,
  postFile,
  postImg,
} from "../../config/firebase";
import { setMessage } from "../../features/userSlice";
import Audio from "../audioView";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  // image dropzone
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  //file dropzone
  const [isFile, setIsFile] = useState(false);
  const [file, setFile] = useState(null);
  //audio

  //post
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  //audio
  const recorderControls = useAudioRecorder();
  //post action
  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);

    if (image) {
      const picturePath = await postImg(image);
      formData.append("picturePath", picturePath);
    }

    if (file) {
      const { urlFile, fileName } = await postFile(file);
      formData.append("filePath", urlFile);
      formData.append("fileName", fileName);
    }

    // if (audio) {
    //   const { urlAudio, audioName } = await postAudio(audio);
    //   formData.append("audioPath", urlAudio);
    //   formData.append("audioName", audioName);
    // }

    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
    try {
      const response = await axios.post(
        `http://localhost:3001/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const posts = await response.data;
      dispatch(setMessage({ type: "success", content: "Upload success!" }));
      dispatch(setPosts({ posts }));
      setImage(null);
      setFile(null);
      setRecorder(null);
      setPost("");
    } catch (error) {
      dispatch(setMessage({ type: "error", content: "Upload false!" }));
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          spellCheck={false}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
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
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
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
      {isFile && (
        <Box
          border={`1px solid ${medium}`}
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
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!file ? (
                    <p>Add File Here</p>
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
      {recorderControls.recordingBlob && (
        <Audio audioPath={URL.createObjectURL(recorderControls.recordingBlob)} audioName={"hahah"}/>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween
          sx={{ cursor: "pointer" }}
          gap="0.25rem"
          p="0.4rem"
          onClick={() => {
            setIsImage(!isImage);
            setIsFile(false);
            setRecorder(null);
            setFile(null);
          }}
        >
          <ImageOutlined sx={{ color: mediumMain }} />
        </FlexBetween>

        <FlexBetween
          sx={{ cursor: "pointer" }}
          gap="0.25rem"
          p="0.4rem"
          onClick={() => {
            setIsFile(!isFile);
            setIsImage(false);
            setImage(null);
            setRecorder(null);
          }}
        >
          <AttachFileOutlined sx={{ color: mediumMain }} />
        </FlexBetween>

        {!recorderControls.isRecording && (
          <FlexBetween
            sx={{ cursor: "pointer" }}
            gap="0.25rem"
            p="0.4rem"
            onClick={() => {
              setIsImage(false);
              setIsFile(false);
              setImage(null);
              setFile(null);
              recorderControls.startRecording();
            }}
          >
            <MicOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        {recorderControls.isRecording && (
          <FlexBetween
            sx={{ cursor: "pointer" }}
            gap="0.25rem"
            p="0.4rem"
            onClick={() => {
              setIsImage(false);
              setIsFile(false);
              setImage(null);
              setFile(null);
              recorderControls.stopRecording();
            }}
          >
            <Stop sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
