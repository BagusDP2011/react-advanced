import {
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Textarea,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { axiosInstance } from "../api"
import Post from "../components/Post"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const authSelector = useSelector((state) => state.auth)

  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      body: "",
      image_url: "",
    },
    onSubmit: async (values) => {
      try {
        let newPost = {
          body: values.body,
          image_url: values.image_url,
          userId: authSelector.id,
        }

        await axiosInstance.post("/posts", newPost)

        formik.setFieldValue("body", "")
        formik.setFieldValue("image_url", "")

        toast({
          position: "top-right",
          title: "Post uploaded",
          status: "success",
        })

        fetchPosts()
      } catch (err) {
        console.log(err)
      }
    },
  })

  const inputChangeHandler = ({ target }) => {
    const { name, value } = target

    formik.setFieldValue(name, value)
  }

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          _expand: "user",
          _sort: "id",
          _order: "desc",
          _limit: 2,
          _page: page,
        },
      })

      setTotalCount(response.headers["x-total-count"])

      if (page === 1) {
        setPosts(response.data)
      } else {
        setPosts([...posts, ...response.data])
      }
    } catch (err) {
      console.log(err)
    }
  }

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

  const seeMoreBtnHandler = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  return (
    <Container maxW="container.md" py="4" pb="10">
      <Heading>Home Page</Heading>
      {authSelector.id ? (
        <Stack mt="4">
          <Textarea
            placeholder="Insert your caption here"
            value={formik.values.body}
            onChange={inputChangeHandler}
            name="body"
          />
          <HStack>
            <Input
              value={formik.values.image_url}
              onChange={inputChangeHandler}
              name="image_url"
              placeholder="Insert image URL"
            />
            <Button
              onClick={formik.handleSubmit}
              isDisabled={formik.isSubmitting}
              colorScheme="twitter"
            >
              Post
            </Button>
          </HStack>
        </Stack>
      ) : null}
      <Stack mt="8" spacing="2">
        {renderPosts()}

        {!posts.length ? (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>No posts found</AlertTitle>
          </Alert>
        ) : null}
      </Stack>
      {posts.length >= totalCount ? null : (
        <Button
          onClick={seeMoreBtnHandler}
          mt="6"
          colorScheme="linkedin"
          width="100%"
        >
          See More
        </Button>
      )}
    </Container>
  )
}

export default HomePage

