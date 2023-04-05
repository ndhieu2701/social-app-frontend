import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Delete, EditOutlined } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import { setMessage, updateUser } from "../../features/userSlice";
import axios from "axios";
import FlexBetween from "../../components/flexBetween";
import { postImg } from "../../config/firebase";

const settingSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
});

const SettingForm = () => {
  const { _id } = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const { firstName, lastName, email, location, occupation } = useSelector(
    (state) => state.user.user
  );
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { palette } = useTheme();

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }

      formData.delete("email");

      if (values.picture) {
        const picturePath = await postImg(values.picture);
        formData.append("picturePath", picturePath);
      }

      formData.delete("picture");

      //code duoi de show key value trong form data
      // for (const pair of formData.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }
      const response = await axios.put(
        `http://localhost:3001/users/${_id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newUser = await response.data;
      dispatch(setMessage({ type: "success", content: "update success!" }));
      dispatch(updateUser({ user: newUser }));
    } catch (error) {
      if (error.response.data) {
        dispatch(setMessage({ type: "error", content: error.response.data }));
      } else dispatch(setMessage({ type: "error", content: error.message }));
    }
  };

  return (
    <Box mt={2}>
      <Formik
        initialValues={{
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: "",
          location: location,
          occupation: occupation,
          picture: "",
        }}
        onSubmit={handleFormSubmit}
        validationSchema={settingSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={Boolean(touched.location) && Boolean(errors.location)}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Occupation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                helperText={touched.occupation && errors.occupation}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                disabled
                label="Email"
                // onBlur={handleBlur}
                // onChange={handleChange}
                value={values.email}
                name="email"
                // error={Boolean(touched.email) && Boolean(errors.email)}
                // helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="New password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <Box
                gridColumn="span 4"
                border={`1px solid ${palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) =>
                    setFieldValue("picture", acceptedFiles[0])
                  }
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      // border={`2px dashed ${palette.primary.main}`}
                      p="1rem"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!values.picture ? (
                        <p>Add Picture Here</p>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.picture.name}</Typography>
                          <Box>
                            <IconButton>
                              <EditOutlined />
                            </IconButton>
                            <IconButton
                              onClick={() => setFieldValue("picture", "")}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
            </Box>
            <Box w="100%" sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                Update settings
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SettingForm;
