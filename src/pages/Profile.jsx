import { Box, Container, Text, HStack, useToast, Stack } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { axiosInstance } from "../api";
import Post from "../components/Post";

const ProfilePage = () => {
  const authSelector = useSelector((state) => state.auth);
  const params = useParams();
  const [user, setUser] = useState({});
  const toast = useToast()
  const [posts, setPosts] = useState();

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          username: params.username,
        },
      });
      setUser(response.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          userId: user.id,
        },
      });
      setPosts(response.data)
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUserProfile();
    fetchPosts();
  }, [user.id]);
  
  useEffect(() => {
    if (user.id) {
      fetchPosts();
    }
  }, [user.id]);


  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`)
      fetchPosts()
      toast({ title: "Post deleted", status: "info" })
    } catch (err) {
      console.log(err)
    }
  }

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
      )
    })
  }

  if (params.username === authSelector.username) {
    return <Navigate replace to="/MyProfile" />;
  }

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
          <Avatar size="3xl" name="Segun Adebayo" src={user.avatarUrl} />
        </Box>
        <Box pl="100">
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            Username:
          </Text>
          <br />
          <Text fontSize={"sm"}>{user.username}</Text>
          <br />
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            Email:
          </Text>
          <br />
          <Text fontSize={"sm"}>{user.email}</Text>
          <br />
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            Role:
          </Text>
          <br />
          <Text fontSize={"sm"}>{user.role}</Text>
          <br />
        </Box>
      </HStack>
      <Stack>{renderPosts()}</Stack>
    </Container>
  );
};

export default ProfilePage;
