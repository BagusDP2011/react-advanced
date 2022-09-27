import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { login } from "../redux/features/authSlice"

const LoginPage = () => {
  const toast = useToast()

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post("/auth/login", {
          usernameOrEmail: values.usernameOrEmail,
          password: values.password
        })
        toast({
          title: "Registration Successfully",
          status: "success",
          description: response.data.message        
        })
        // const response = await axiosInstance.get("/users", {
        //   params: {
        //     username: values.username,
        //     password: values.password,
        //   },
        // })

        // if (!response.data.length) {
        //   toast({ title: "Credentials don't match", status: "error" })
        //   return
        // }

        localStorage.setItem("auth_token", response.data.token)
        dispatch(login({
          username: response.data.data.username,
          email: response.data.data.email,
          id: response.data.data.id 
        }))
      } catch (err) {
        console.log(err)
        toast({
          title: "Login Error",
          status: "error",
          description: err.response.data.message        
        })
      }
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string().required().min(3),
      password: Yup.string().required(),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  return (
    <Box>
      <Container>
        <Box p="8" borderRadius="6px" border="solid 1px lightgrey">
          <Text fontWeight="bold" fontSize="4xl" mb="8">
            Login User
          </Text>

          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.usernameOrEmail}>
                <FormLabel>Username or Email</FormLabel>
                <Input
                  value={formik.values.usernameOrEmail}
                  name="usernameOrEmail"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>{formik.errors.usernameOrEmail}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  value={formik.values.password}
                  name="password"
                  onChange={formChangeHandler}
                  type="password"
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="teal">
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage

