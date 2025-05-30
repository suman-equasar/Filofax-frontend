// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: null, // for normal login
    googleData: null, // for google login
    authMethod: "none", // Track login method
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      state.authMethod = "local";
    },
    setGoogleUser: (state, action) => {
      state.googleData = action.payload;
      state.authMethod = "google";
    },

    clearUserDetails: (state) => {
      state.userDetails = null;
    },
    updateUserProfile: (state, action) => {
      if (state.authMethod === "normal") {
        state.userDetails = {
          ...state.userDetails,
          ...action.payload,
        };
      } else if (state.authMethod === "google") {
        state.googleData = {};
      }
    },
  },
});

export const { setUserDetails, clearUserDetails, updateUserProfile } =
  userSlice.actions;
export default userSlice.reducer;
