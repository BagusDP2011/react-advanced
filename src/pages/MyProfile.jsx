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
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../api";
import * as Yup from "yup";

const MyProfile = () => {
  const authSelector = useSelector((state) => state.auth);
  const [openStatus, setOpenStatus] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      username: authSelector.username,
      email: authSelector.email,
      avatarUrl: authSelector.avatarUrl,
    },
    validationSchema: Yup.object({
      comment: Yup.string().required(),
    }),
    onSubmit: async (value) => {
      try {
        const emailResponse = await axiosInstance.get("/users", {
          params: {
            email: value.email,
          },
        });

        if (emailResponse.data.length && value.email !== authSelector.email) {
          toast({ title: "Email has already been used", status: "error" });
          return;
        }

        const usernameResponse = await axiosInstance.get("/users", {
          params: {
            username: value.username,
          },
        });

        if (
          usernameResponse.data.length &&
          value.username !== authSelector.username
        ) {
          toast({ title: "Username has already been used", status: "error" });
          return;
        }

        let editUsers = {
          text: value.comment,
          email: value.email,
          avatarUrl: value.avatarUrl,
        };
        await axiosInstance.patch(`/users/${authSelector.id}`, editUsers);

        const userResponse = await axiosInstance.get(
          `/users/${authSelector.id}`
        );

        dispatch(login(userResponse.data));
        setEditMode(false);
        toast({ title: "Profile edited" });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          userId: authSelector.id,
        },
      });
      setPosts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <Post
          key={val.id.toString()}
          username={val.user.username}
          body={val.body}
          imageUrl={val.image_url}
          userId={val.userId}
          onDelete={() => deleteBtnHandler(val.id)}
          postId={val.id}
        />
      );
    });
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
            src={authSelector.avatarUrl}
          />
        </Box>
        { !openStatus ? (
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
                    <Input defaultValue={authSelector.username} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input defaultValue={authSelector.email} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Profile Picture</FormLabel>
                    <Input defaultValue={authSelector.avatarUrl} />
                  </FormControl>
                </Stack>
              </HStack>
              <Button mt="8" width="100%" colorScheme="green">
                Save
              </Button>
              </Box>
          )}
          <Box>
          <Button
            mt="8"
            width="100%"
            colorScheme="green"
            onClick={() => openStatusBtnHandler}
          >
            Edit Profile
          </Button>
        </Box>
      </HStack>
      <Stack>{renderPosts}</Stack>
    </Container>
  );
};

export default MyProfile;
