import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const authSelector = useSelector((state) => state.auth)

  if (!authSelector.id) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute

