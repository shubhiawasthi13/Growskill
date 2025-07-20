import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: null,
  isAuthenticated: false, // ✅ correct spelling
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true; // ✅ fix here too
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false; // ✅ fix here too
    },
  },
});


export const {userLoggedIn, userLoggedOut} = authSlice.actions
export default authSlice.reducer