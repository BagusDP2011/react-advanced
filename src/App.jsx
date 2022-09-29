import { Box, Button, HStack, List, ListItem, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route, Link, useParams } from "react-router-dom"
import { axiosInstance } from "./api"
import GuestRoute from "./components/GuestRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFoundPage from "./pages/404"
import Dashboard1 from "./pages/admin/Dashboard1"
import Dashboard2 from "./pages/admin/Dashboard2"
import HomePage from "./pages/Home"
import LoginPage from "./pages/Login"
import ProfilePage from "./pages/Profile"
import MyProfile from "./pages/MyProfile"
import RegisterPage from "./pages/Register"
import { login, logout } from "./redux/features/authSlice"

const App = () => {
  const [authCheck, setAuthCheck] = useState(false)
  const authSelector = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const keepUserLoggedIn = async () => {
    try {
      const auth_id = localStorage.getItem("auth_token")
      
      if (!auth_id) {
        setAuthCheck(true)
        return
      }
      
      const response = await axiosInstance.get(`/auth/refresh-token`)

      dispatch(login(response.data.data))
      localStorage.setItem("auth_token", response.data.token)
      setAuthCheck(true)

    } catch (err) {
      setAuthCheck(true)
      console.log(err)
    }
    
  }


  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token")
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

  if (!authCheck) {
    return <div>Loading...</div>
  }

  return (
    <Box>
      <Box backgroundColor="teal" color="white" px="8" py="4">
        <HStack justifyContent="space-between">
          <Text fontSize="4xl" fontWeight="bold">
            Hello {authSelector.username}
          </Text>
          <HStack spacing={"100"}>
          <Box>
              <Link to="/">Home</Link>
            </Box>
            <Box>
              <Link to="/profile">Profile</Link>
            </Box>
            <Box>
              <Link to="/login">Login</Link>
            </Box>
            <Box>
              <Link to="/register">Register</Link>
            </Box>
          
          </HStack>
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
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MyProfile"
          element={
            <ProtectedRoute>
              <MyProfile />
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

