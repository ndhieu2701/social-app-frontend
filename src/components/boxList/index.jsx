import { Box } from "@mui/material";
import React from "react";
import BoxChat from "./BoxChat";

const BoxList = ({ chatOpen }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0",
        right: "20px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <BoxChat chat={chatOpen} />
    </Box>
  );
};

export default BoxList;
