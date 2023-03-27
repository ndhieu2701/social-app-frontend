import {
  Box,
  Card,
  CardMedia,
  Slider,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

const AudioView = ({ audioPath, audioName }) => {
  const { palette } = useTheme();
  const main = palette.primary.main;

  return (
    <Box mt="12px" w="100%">
      <audio controls style={{width: "100%"}}>
        <source src={audioPath}/>
      </audio>
    </Box>
  );
};

export default AudioView;
