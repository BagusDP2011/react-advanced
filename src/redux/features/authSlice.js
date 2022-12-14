import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0,
  username: "",
  email: "",
  // role: "",
  // avatarUrl: "",
  profile_picture_url: "",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id
      state.username = action.payload.username
      state.email = action.payload.email
      state.profile_picture_url = action.payload.profile_picture_url
      // state.role = action.payload.role
      // state.avatarUrl = action.payload.avatarUrl


    },
    logout: (state) => {
      state.id = 0
      state.username = ""
      state.role = ""
      state.email = ""
      // state.avatarUrl = ""
      state.profile_picture_url = ""


      // return initialState
    }
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer