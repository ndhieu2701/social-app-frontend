import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Form from "./form";
import { useSelector } from "react-redux";
import SnackBar from "../../components/snackbar";
import WidgetWrapper from "../../components/widgets/widgetWrapper";

const SettingPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { type } = useSelector((state) => state.user.message);

  return (
    <Box
      width="100%"
      padding="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="2rem"
      justifyContent="center"
    >
      <WidgetWrapper>
        <Form />
      </WidgetWrapper>
      {type !== "" && <SnackBar />}
    </Box>
  );
};

export default SettingPage;
