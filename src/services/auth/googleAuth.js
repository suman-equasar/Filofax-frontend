// Updated googleAuth.js - Fixed Google authentication flow
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_AUTH_URL;

export const initiateGoogleSignUp = () => {
  console.log("Initiating Google sign-up...");

  // Redirect the browser to your backend Google OAuth route
  window.location.href = `${baseURL}/google`;

  // This function doesn't return anything directly as it redirects the browser
  // The token handling happens when Google redirects back to your app
};

export default {
  initiateGoogleSignUp,
};
