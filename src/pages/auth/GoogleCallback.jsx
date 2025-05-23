import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "../../redux/userSlice";
import { setAuthToken } from "../../utils/auth";
import Cookies from "js-cookie";

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

      if (token) Cookies.set("token", token, { expires: 7 });
      if (accessToken) Cookies.set("access_token", accessToken, { expires: 1 });
      if (refreshToken)
        Cookies.set("refresh_token", refreshToken, { expires: 7 });

      console.log(
        `Token stored: ${accessToken} and refresh token : ${refreshToken}`
      );
      // Optionally, fetch user profile if needed (skip if your token already has user info)

      // You may want to pass user data here, e.g., from token or API
      dispatch(setUserDetails({}));

      navigate("/dashboard");
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
