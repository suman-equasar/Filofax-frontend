// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: null, // for normal login
    googleData: null, // for google login

    //optional
    microsoftData: null, // for microsoft login

    authMethod: "none", // Track login method
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      state.authMethod = "local";
    },
    setGoogleUser: (state, action) => {
      console.log("Setting Google user data :", action.payload);
      state.googleData = action.payload;
      state.authMethod = "google";
    },

    // Optional
    setMicrosoftUser: (state, action) => {
      state.microsoftData = action.payload;
      state.authMethod = "microsoft";
    },

    clearUserDetails: (state) => {
      state.userDetails = null;
      state.googleData = null;
      state.microsoftData = null; //optional
      state.authMethod = "none";
    },
    updateUserProfile: (state, action) => {
      if (state.authMethod === "local") {
        state.userDetails = {
          ...state.userDetails,
          ...action.payload,
        };
      } else if (state.authMethod === "google") {
        state.googleData = {
          ...state.googleData,
          ...action.payload,
        };
      }
      //optional
      else if (state.authMethod === "microsoft") {
        state.microsoftData = {
          ...state.microsoftData,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setUserDetails,
  setGoogleUser,
  setMicrosoftUser, // optional
  clearUserDetails,
  updateUserProfile,
} = userSlice.actions;
export default userSlice.reducer;
