import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  Stack,
  Text,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import * as Yup from "yup";
import formik, { useFormik } from "formik";
import axios from "axios";
import { axiosInstance } from "../api";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

const Post = ({ username, body, imageUrl, userId, onDelete, postId }) => {
  const authSelector = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const confirmDeleteBtnHandler = () => {
    onClose();
    onDelete();
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get("/comments", {
        params: {
          postId,
          _expand: "user",
        },
      });
      setComments(response.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderComments = () => {
    return comments.map((val) => {
      return <Comment username={val.user.username} text={val.text} />;
    });
  };

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string().required(),
    }),
    onSubmit: async (value) => {
      try {
        let newComment = {
          text: value.comment,
          userId: authSelector.id,
          postId: postId,
        };
        await axiosInstance.post("/comments", newComment);
        formik.setFieldValue("comment", "");
        fetchComments();
      } catch (err) {
        console.log(err);
      }
    },
  });
  return (
    <>
      <Box
        borderColor={"gray.300"}
        borderWidth="1px"
        p="6"
        borderRadius={"8px"}
      >
        <HStack justifyContent={"space-between"}>
          <Text fontSize={"sm"} fontWeight={"extrabold"}>
            <Link to={`/profile/${username}`}>
            {username || "Username"}
            </Link>
          </Text>
          <Menu>
            <MenuButton>
              <Icon as={BsThreeDots} boxSize="20px" />
            </MenuButton>
            <MenuList>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
        <Text>
          {body ||
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.`}
        </Text>
        <Image
          borderRadius="4px"
          height="400px"
          width="100%"
          objectFit="cover"
          mt="4"
          src={
            imageUrl ||
            "https://images.unsplash.com/photo-1662436267764-13f43cfe0a12?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
          }
        />
        <Text fontSize="sm" fontWeight={"bold"} mt="4">
          Comments
        </Text>
        <Stack mt="2" spacing={"0.5"}>
          {renderComments()}
        </Stack>
        <form onSubmit={formik.handleSubmit}>
          <HStack mt="3">
            <Input
              size="sm"
              type="text"
              name="comment"
              placeholder="Komentar koe"
              value={formik.values.comment}
              onChange={({ target }) =>
                formik.setFieldValue(target.name, target.value)
              }
            />
            <Button colorScheme={"facebook"} type="submit" size="sm">
              Post Comment
            </Button>
          </HStack>
        </form>
      </Box>
      <AlertDialog isCentered isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={confirmDeleteBtnHandler}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Post;
