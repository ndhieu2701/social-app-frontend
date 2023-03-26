import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import SnackBar from "../../components/snackbar";
import Form from "./form";

const LoginPage = () => {
  const theme = useTheme();
  const { type } = useSelector((state) => state.user.message);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  
  return (
    <Box pt="5rem">
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="0 auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Face Lite, the Social Media for Everyone!
        </Typography>
        <Form />
      </Box>
      {type !== "" && <SnackBar />}
    </Box>
  );
};

export default LoginPage;
