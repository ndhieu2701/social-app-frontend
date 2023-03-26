import { Box,CardMedia, Typography, useTheme } from "@mui/material";
import React from "react";

const Audio = ({ audioPath, audioName }) => {
  const { palette } = useTheme();
  const main = palette.primary.main;
  return (
    <Box>
      <Typography color={main} variant="h5" fontWeight="500">
        {audioName}
      </Typography>
      <CardMedia
        component="audio"
        src={audioPath}
        controls
        alt="audio record"
      />
    </Box>
  );
};

export default Audio;
