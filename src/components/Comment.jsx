import { HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";


const Comment = ({ username, text }) => {
  return (
    <HStack>
      <Text fontSize="sm" fontWeight={"bold"} alignSelf="start">
      <Link to={`/profile/${username}`}> {username || "Username"}</Link>
      </Text>
      <Text>
        {text ||
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore, a?"}
      </Text>
    </HStack>
  );
};

export default Comment;
