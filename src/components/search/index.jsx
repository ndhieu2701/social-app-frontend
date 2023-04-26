import React, { useEffect, useState } from "react";
import FlexBetween from "../flexBetween";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  Search,
} from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "../userImage";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../../features/userSlice";

const SearchComponent = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const { _id } = useSelector((state) => state.user.user);
  const neutralLight = theme.palette.neutral.light;
  const main = theme.palette.neutral.main;
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;
  const navigate = useNavigate();
  const friends = useSelector((state) => state.user.user.friends);

  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeInput = (e) => {
    setSearchValue(e.target.value);
  };

  const patchFriend = async (friendId) => {
    const payload = {
      id: _id,
      friendId: friendId,
    };
    const response = await axios.patch(
      `http://localhost:3001/users/friend`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.data;
    dispatch(setFriends({ friends: data }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios("http://localhost:3001/users", {
        params: { q: searchValue },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      setSearchData(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <Box sx={{ position: "relative" }}>
      <FlexBetween
        backgroundColor={neutralLight}
        borderRadius="1rem"
        gap="3rem"
        padding="0.1rem 1.5rem"
      >
        <InputBase
          placeholder="Search"
          value={searchValue}
          onChange={onChangeInput}
        />
        <IconButton>
          <Search />
        </IconButton>
      </FlexBetween>
      {searchValue && (
        <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="0.4rem"
          gap="3rem"
          padding="0.1rem 1.5rem"
          sx={{
            position: "absolute",
            mt: "0.5rem",
            width: "100%",
            padding: "1rem 0.8rem",
            zIndex: 300,
            boxShadow: "0 2px 4px 4px rgba(0, 0,0,0.15)",
          }}
        >
          <Box sx={{ width: "100%" }}>
            {searchData.map(({ _id, firstName, lastName, picturePath }) => {
              return (
                <Box
                  sx={{
                    width: "100%",
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  key={_id}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      navigate(`/profile/${_id}`), setSearchValue("");
                    }}
                  >
                    <UserImage image={picturePath} size="30px" />
                    <Typography
                      color={main}
                      variant="h5"
                      fontWeight="500"
                      sx={{
                        marginLeft: "1rem",
                        "&:hover": {
                          color: primaryLight,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {firstName} {lastName}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => patchFriend(_id)}
                    sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                  >
                    {friends.find((friend) => friend._id === _id) ? (
                      <PersonRemoveOutlined sx={{ color: primaryDark }} />
                    ) : (
                      <PersonAddOutlined sx={{ color: primaryDark }} />
                    )}
                  </IconButton>
                </Box>
              );
            })}
            {searchData.length === 0 && (
              <Typography>Sorry, user does not exist!</Typography>
            )}
            {errorMessage && (
              <Typography>Sorry, something went wrong!</Typography>
            )}
          </Box>
        </FlexBetween>
      )}
    </Box>
  );
};

export default SearchComponent;
