import { Box, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendListWidget from "../../components/widgets/friendListWidget";
import MyPostWidget from "../../components/widgets/myPostWidget";
import PostsWidget from "../../components/widgets/postsWidget";
import UserWidget from "../../components/widgets/userWidget";
import SnackBar from "../../components/snackbar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.user.token);
  const { _id } = useSelector((state) => state.user.user);
  const { type } = useSelector((state) => state.user.message);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const getUser = async () => {
    const response = await axios(`http://localhost:3001/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.data;
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          // mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userId === _id && <MyPostWidget picturePath={user.picturePath} userId={userId} isProfile/>}
          {/* <Box m="2rem 0" /> */}
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
      {type !== "" && <SnackBar />}
    </Box>
  );
};

export default ProfilePage;
