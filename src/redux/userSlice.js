// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: null,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
    updateUserProfile: (state, action) => {
      state.userDetails = {
        ...state.userDetails,
        ...action.payload,
      };
    },
  },
});

export const { setUserDetails, clearUserDetails, updateUserProfile } =
  userSlice.actions;
export default userSlice.reducer;
