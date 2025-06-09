import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setGoogleUser, setUserDetails } from "../../redux/userSlice";
import { setAuthToken } from "../../utils/auth";
import Cookies from "js-cookie";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Parse tokens from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");

      // Store tokens (JWT and Google tokens)
      setAuthToken(token);

      // if (token) {
      //   Cookies.set("token", token, { expires: 7 });
      // }

      if (accessToken) {
        Cookies.set("access_token", accessToken, { expires: 1 });
      }
      if (refreshToken)
        Cookies.set("refresh_token", refreshToken, { expires: 7 });

      console.log(
        `Token stored: ${accessToken} and refresh token : ${refreshToken}`
      );
      // Optionally, fetch user profile if needed (skip if your token already has user info)

      // You may want to pass user data here, e.g., from token or API
      // dispatch(setUserDetails({})); // vikrant code

      try {
        const profileUrl = import.meta.env.VITE_PROFILE_AUTH_URL; // or your API endpoint
        const response = await axios.get(`${profileUrl}/get-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        // Format userData to match your setGoogleUser action payload
        // Example: { givenName, familyName, email, profileImage }

        console.log("the console value for the response : ", response);
        console.log("the value for the response data : ", userData);
        console.log("the value for the response data : ", userData.data.name);
        const formattedGoogleData = {
          name: userData.data.name,
          email: userData.data.email,
          profileImageLink:
            userData.data.profileImageLink || userData.data.picture,
          welcomemessage: "Welcome to my profile",
          dateFormat: "YYYY/MM/DD",
          timeFormat: "12h",
          timezone: "Asia/Kolkata",
          authType: "google",
        };

        dispatch(setGoogleUser(formattedGoogleData));

        navigate("/dashboard"); //navigate to dashboard
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Fallback: Dispatch with minimal data (not recommended for production)
        // dispatch(setGoogleUser({}));
      }

      // navigate("/dashboard");
    };

    handleGoogleCallback();
  }, [navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Processing...</h2>
        <p className="text-gray-600">
          Please wait while we complete your sign in.
        </p>
      </div>
    </div>
  );
}
