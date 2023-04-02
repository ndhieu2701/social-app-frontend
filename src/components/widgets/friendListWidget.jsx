import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../friend";
import WidgetWrapper from "./widgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../features/userSlice";
import axios from "axios";

const FriendListWidget = ({ userId }) => {
  const [userFriends, setUserFriends] = useState([])
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.user.token);
  const { _id } = useSelector(state => state.user.user)
  const friends = useSelector((state) => state.user.user.friends);

  const getFriends = async () => {
    const response = await axios(
      `http://localhost:3001/users/${userId}/friends`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.data;
    if(userId === _id){
      dispatch(setFriends({ friends: data }));
    }
    else {
      setUserFriends(data)
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {userId === _id && friends.map((friend, index) => (
          <Friend
            key={index}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
        {userId !== _id && userFriends.map((friend, index) => (
          <Friend
            key={index}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
