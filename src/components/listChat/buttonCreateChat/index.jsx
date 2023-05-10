import {
  Box,
  Button,
  Chip,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../../../features/chatSlice";
import { setMessage } from "../../../features/userSlice";

const ButtonCreateChat = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState();
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    try {
      const response = await axios("http://localhost:3001/users", {
        params: { q: search },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      setSearchData(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = (id) => {
    const update = users.filter((user) => user._id !== id);
    setUsers(update);
  };

  const createGroupChat = async () => {
    try {
      const userIds = users.map((u) => u._id); // get an array of the user ids
      const stringifiedUserIds = userIds.map((id) => id.toString()); // convert the ids to strings
      const res = await axios.post(
        "http://localhost:3001/chats/group",
        {
          name: groupName,
          users: stringifiedUserIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.data;
      setSearch("");
      setUsers([]);
      setSearchData();
      handleClose();
      dispatch(setChat({ chat: data }));
    } catch (error) {
      dispatch(setMessage({ type: "error", content: error.message }));
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <>
      <Button fullWidth onClick={handleOpen}>
        Create group chat
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            bgcolor: theme.palette.background.alt,
            border: "1px solid #000",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            label="Group name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ margin: "1rem 0" }}
          />
          <Box>
            <TextField
              label="Search user"
              fullWidth
              value={search}
              sx={{ margin: "1rem 0" }}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchData && (
              <Box>
                {searchData.map((data) => {
                  return (
                    <Chip
                      key={data._id}
                      label={`${data.firstName} ${data.lastName}`}
                      sx={{ margin: "0 4px" }}
                      onClick={() => setUsers(([...users]) => [...users, data])}
                    />
                  );
                })}
              </Box>
            )}
            <Box marginTop="8px">
              <Typography>Member will add</Typography>
              {users.length > 0 &&
                users.map((user) => {
                  return (
                    <Chip
                      key={user._id}
                      label={`${user.firstName} ${user.lastName}`}
                      sx={{ margin: "0 4px" }}
                      onDelete={() => handleDelete(user._id)}
                    />
                  );
                })}
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: "12px" }}
              onClick={createGroupChat}
            >
              Create chat
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ButtonCreateChat;
