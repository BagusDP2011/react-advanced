import { Box, Container, Text, HStack, WrapItem } from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../api";


const MyProfile = () => {
  const authSelector = useSelector((state) => state.auth);
  const params = useParams()
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUserProfile()
  }, [])

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
          <Avatar size="3xl" name="Segun Adebayo" src={authSelector.avatarUrl} />
        </Box>
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
      </HStack>
    </Container>
  );
};

export default MyProfile;
