import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import UserWidget from "../../components/widgets/userWidget";
import MyPostWidget from "../../components/widgets/myPostWidget";
import PostsWidget from "../../components/widgets/postsWidget";
// import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "../../components/widgets/friendListWidget";
import SnackBar from "../../components/snackbar";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user.user);
  const { type } = useSelector((state) => state.user.message);

  return (
    <Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} userId={_id}/>
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            {/* <AdvertWidget />
            <Box m="2rem 0" /> */}
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
      {type !== "" && <SnackBar />}
    </Box>
  );
};

export default HomePage;
