import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null
};

export const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logOut: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    }
  }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
