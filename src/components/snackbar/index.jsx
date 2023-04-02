import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../features/userSlice";
import { useTheme } from "@mui/material";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const SnackBar = () => {
  const [open, setOpen] = useState(false);
  const { type, content } = useSelector((state) => state.user.message);
  const dispatch = useDispatch();
  const theme = useTheme()
  const mainColor = theme.palette.primary.main

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearMessage());
    setOpen(false);
  };

  useEffect(() => {
    if (type !== "") setOpen(true);
  }, [type]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          sx={{
            width: "100%",
            backgroundColor: type === "success" ? mainColor : "rgba(255, 0, 0, 0.8)",
            fontSize: "1rem"
          }}
        >
          {content}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackBar;
