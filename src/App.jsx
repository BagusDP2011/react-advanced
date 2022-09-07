import { Box, Button, HStack, List, ListItem, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route, Link } from "react-router-dom"
import { axiosInstance } from "./api"
import GuestRoute from "./components/GuestRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFoundPage from "./pages/404"
import Dashboard1 from "./pages/admin/Dashboard1"
import Dashboard2 from "./pages/admin/Dashboard2"
import HomePage from "./pages/Home"
import LoginPage from "./pages/Login"
import ProfilePage from "./pages/Profile"
import RegisterPage from "./pages/Register"
import { login, logout } from "./redux/features/authSlice"

const App = () => {
  const [authCheck, setAuthCheck] = useState(false)

  const authSelector = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const keepUserLoggedIn = async () => {
    try {
      const auth_id = localStorage.getItem("auth_data")

      if (!auth_id) {
        return
      }

      const response = await axiosInstance.get(`/users/${auth_id}`)

      dispatch(login(response.data))
    } catch (err) {
      console.log(err)
    }

    setAuthCheck(true)
  }

  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_data")
    dispatch(logout())
  }

  const renderAdminRoutes = () => {
    if (authSelector.role === "admin") {
      return (
        <>
          <Route path="/admin/dashboard1" element={<Dashboard1 />} />
          <Route path="/admin/dashboard2" element={<Dashboard2 />} />
        </>
      )
    }

    return null
  }

  useEffect(() => {
    keepUserLoggedIn()
  }, [])

  // if (!authCheck) {
  //   return <div>Loading...</div>
  // }

  return (
    <Box>
      <Box backgroundColor="teal" color="white" px="8" py="4">
        <HStack justifyContent="space-between">
          <Text fontSize="4xl" fontWeight="bold">
            Hello {authSelector.username}
          </Text>
          <List>
            <ListItem>
              <Link to="/">Home</Link>
            </ListItem>
            <ListItem>
              <Link to="/profile">Profile</Link>
            </ListItem>
            <ListItem>
              <Link to="/login">Login</Link>
            </ListItem>
            <ListItem>
              <Link to="/register">Register</Link>
            </ListItem>
          </List>
          <Box>
            <Button onClick={logoutBtnHandler} colorScheme="red">
              Logout
            </Button>
          </Box>
        </HStack>
      </Box>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        {renderAdminRoutes()}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  )
}

export default App

