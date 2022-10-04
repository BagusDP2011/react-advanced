import {
  Box,
  Container,
  Text,
  HStack,
  WrapItem,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../api";
import * as Yup from "yup";
import axios from "axios";
import Post from "../components/Post";
import { login } from "../redux/features/authSlice.js"


const MyProfile = () => {
  const authSelector = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const toast = useToast();
  const dispatch = useDispatch()


  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      profile_picture: null,
      // avatarUrl: authSelector.avatarUrl,
      // username: authSelector.username,
      // email: authSelector.email,
      // avatarUrl: authSelector.avatarUrl,
    },
    // validationSchema: Yup.object({
    //   comment: Yup.string().required(),
    // }),
    onSubmit: async ({ username, email, profile_picture }) => {
      try {
        const userData = new FormData();

        if (username && username !== authSelector.username) {
          userData.append("username", username);
        }
        if (email && email !== authSelector.email) {
          userData.append("email", email);
        }
        if (profile_picture) {
          userData.append("profile_picture", profile_picture);
        }
        const userResponse = await axiosInstance.patch("auth/me", userData);

        dispatch(login(userResponse.data.data));
        console.log(userResponse.data.data)
        setEditMode(false);
        toast({ 
          title: "Profile edited", 
          status: "info",
        });

        // const emailResponse = await axiosInstance.get("/users", {
        //   params: {
        //     email: value.email,
        //   },
        // });

        // if (emailResponse.data.length && value.email !== authSelector.email) {
        //   toast({ title: "Email has already been used", status: "error" });
        //   return;
        // }

        // const usernameResponse = await axiosInstance.get("/users", {
        //   params: {
        //     username: value.username,
        //   },
        // });

        // if (
        //   usernameResponse.data.length &&
        //   value.username !== authSelector.username
        // ) {
        //   toast({ title: "Username has already been used", status: "error" });
        //   return;
        // }

        // let editUsers = {
        //   text: value.comment,
        //   email: value.email,
        //   avatarUrl: value.avatarUrl,
        // };
        // await axiosInstance.patch(`/users/${authSelector.id}`, editUsers);

        // const userResponse = await axiosInstance.get(
        //   `/users/${authSelector.id}`
        // );

        // dispatch(login(userResponse.data));
        // setEditMode(false);
        // toast({ title: "Profile edited" });
      } catch (err) {
        console.log(err);
        toast({
          title: "Failed edit",
          status: "error",
          description: err.response.data.message,
        });
      }
    },
  });

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get(
        "/post/MyProfile"
        // , {
        //   params: {
        //     userId: authSelector.id,
        //     // _expand: "user",
        //   },
        // }
      );
      setPosts(response.data.data);
    } catch (err) {
      console.log(err);
      toast({ 
        title: "Server Error: Failed to fetch", 
        status: "error",
      });
    }
  };

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`);

      fetchPosts();
      toast({ title: "Post deleted", status: "info" });
    } catch (err) {
      console.log(err);
      toast({ 
        title: "Failed to delete", 
        status: "error",
      });
    }
  };

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <Post
          key={val.id.toString()}
          username={val.User.username}
          body={val.body}
          imageUrl={val.image_url}
          userId={val.UserId}
          onDelete={() => deleteBtnHandler(val.id)}
          postId={val.id}
        />
      );
    });
  };

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;

    formik.setFieldValue(name, value);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container
      maxW="container.md"
      py="4"
      pb="10"
      mt="10"
      borderColor={"gray.500"}
      borderWidth="1px"
      p="6"
      borderRadius={"8px"}
    >
      <Text fontSize="4xl" fontWeight="bold" textAlign={"center"} pt="10">
        Profile Page
      </Text>
      <HStack pt="8">
        <Box>
          <Avatar
            size="3xl"
            name={authSelector.username}
            src={authSelector.profile_picture_url}
          />
        </Box>
        {!editMode ? (
          <Box pl="100">
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              Username:
            </Text>
            <br />
            <Text fontSize={"sm"}>{authSelector.username}</Text>
            <br />
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              Email:
            </Text>
            <br />
            <Text fontSize={"sm"}>{authSelector.email}</Text>
            <br />
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              Role:
            </Text>
            <br />
            <Text fontSize={"sm"}>{authSelector.role}</Text>
            <br />
          </Box>
        ) : (
          <Box>
            <HStack spacing="6">
              <Stack>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    defaultValue={authSelector.username}
                    onChange={formChangeHandler}
                    name="username"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    defaultValue={authSelector.email}
                    onChange={formChangeHandler}
                    name="email"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Profile Picture</FormLabel>
                  <Input
                    accept="image/*"
                    type="file"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "profile_picture",
                        event.target.files[0]
                      )
                    }
                    name="profile_picture"
                  />
                </FormControl>
              </Stack>
            </HStack>
          </Box>
        )}

        {editMode ? (
          <Box>
            <Button
              mt="8"
              width="100%"
              colorScheme="green"
              onClick={formik.handleSubmit}
            >
              Save
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              mt="8"
              width="100%"
              colorScheme="green"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          </Box>
        )}
      </HStack>
      <Stack>{renderPosts()}</Stack>
    </Container>
  );
};

export default MyProfile;
