import { Box, Link, Typography, useTheme } from "@mui/material";
import React from "react";

const File = ({ filePath, fileName }) => {
  const { palette } = useTheme();
  const main = palette.primary.main;
  return (
    <Box>
      <Typography color={main} variant="h5" fontWeight="500">
        <Link href={filePath} color="inherit" download underline="none">
          {fileName}
        </Link>
      </Typography>
    </Box>
  );
};

export default File;
