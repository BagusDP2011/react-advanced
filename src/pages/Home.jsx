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
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { axiosInstance } from "../api"
import Post from "../components/Post"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const authSelector = useSelector((state) => state.auth)

  const toast = useToast()

  const inputFileRef = useRef(null)

  const formik = useFormik({
    initialValues: {
      body: "",
      post_image: null,
    },
    onSubmit: async (values) => {
      try {
        // localStorage.getItem("auth_token")
        
        let newPost = new FormData()

        newPost.append("body", values.body)
        newPost.append("post_image", values.post_image)

        await axiosInstance.post("/post", newPost)

        formik.setFieldValue("body", "")
        formik.setFieldValue("post_image", null)

        toast({
          position: "top-right",
          title: "Post uploaded",
          status: "success",
        })
        
        fetchPosts()
      } catch (err) {
        console.log(err)
        toast({
          position: "top-right",
          title: "Post failed",
          status: "error",
        })

      }
    },
  })

  const inputChangeHandler = ({ target }) => {
    const { name, value } = target

    formik.setFieldValue(name, value)
  }

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/post"
      , {
        params: {
          _limit: 2,
          _page: page,
          _sortDir: "DESC",
        },
      }
      )

      setTotalCount(response.data.dataCount)
      // console.log(response.data)
        if (page === 1) {
          setPosts(response.data.data)
        } else {
          setPosts([...posts, ...response.data.data])
        }
        // console.log(setPosts(response.data.data))
        // console.log(posts)
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
          username={val.User.username}
          body={val.body}
          imageUrl={val.image_url}
          userId={val.UserId}
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
              // value={formik.values.post_image}
              ref={inputFileRef}
              display="none"
              name="post_image"
              type="file"
              accept="image/*"
              onChange={(event) => {
                formik.setFieldValue("post_image", event.target.files[0])
              }}
            />
            <Button width="100%"
            onClick={() => {
              inputFileRef.current.click()
            }}
            >{formik?.values?.post_image?.name || "Upload Image"}</Button>
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

