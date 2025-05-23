import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import validator from "validator";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/userSlice";
import { setAuthToken } from "../../utils/auth"; // Import the auth utility
import { initiateGoogleSignUp } from "../../services/auth/googleAuth";

// Constants
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};
const loginUrl = import.meta.env.VITE_BASE_AUTH_URL;

export default function Login() {
  // Form state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Validation functions
  const validateEmail = (email) => {
    return validator.isEmail(email)
      ? ""
      : "Please enter a valid email address.";
  };

  const validatePassword = (password) => {
    return validator.isStrongPassword(password, PASSWORD_REQUIREMENTS)
      ? ""
      : "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        const response = await axios.post(`${loginUrl}/local-login`, {
          email,
          password,
        });

        console.log("Login successful:", response.data.userDetails);

        // Get tokens from response
        const { token, refreshToken } = response.data;

        // Use the centralized auth utility to set the token
        const tokenSet = setAuthToken(token);
        console.log("Auth token set successfully:", tokenSet);

        // Still store refresh token with Cookies directly
        Cookies.set("refreshToken", refreshToken, { expires: 7 }); // optional

        // ✅ Save user details to Redux store
        dispatch(setUserDetails(response.data.userDetails));

        // Navigate to dashboard
        navigate("/dashboard");
      } catch (error) {
        if (error.response) {
          console.error("Login failed with response:", error.response);
          const status = error.response.status;
          const message =
            error.response.data?.message ||
            error.response.data?.error ||
            "Unknown error from server";
          alert(`Login failed [${status}]: ${message}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
          alert("Login failed: No response from server.");
        } else {
          console.error("Error in request setup:", error.message);
          alert("Login failed: " + error.message);
        }
      }
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = () => {
    initiateGoogleSignUp(); //this will redirect to the Google auth page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[#A4CC00] shadow-[4px_4px_0px_0px_rgba(164,204,0,0.51)]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 font-lexend">
            Filo<span className="text-[#A4CC00]">Fax</span>
          </h1>
          <p className="text-[#121212] mt-1 text-base font-light font-lexend">
            Login into your Filofax account
          </p>
        </div>

        {/* Google and Microsoft Login Buttons */}
        <div>
          <button
            type="button"
            className="flex items-center justify-center w-full py-3 px-4 mb-6 border-[1.5px] border-[#121212e0] rounded-lg bg-white hover:bg-gray-50"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size={18} className="mr-2" />
            <span className="text-sm font-semibold text-[#121212]">
              Sign in with Google
            </span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-full py-3 px-4 mb-6 border-[1.5px] border-[#121212e0] rounded-lg bg-white hover:bg-gray-50"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft logo"
              className="w-4 h-4 mr-2"
            />
            <FcGoogle size={18} className="mr-2" />
            <span className="text-sm font-semibold text-[#121212]">
              Sign in with Microsoft
            </span>
          </button>

          {/* Divider */}
          <div className="relative mt-6 mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#CDF529]"></div>
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-light font-lexend text-[#121212] text-left mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-light font-lexend text-[#121212] text-left mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#CDF529] text-base text-[#121212] font-medium font-lexend rounded-md hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            Sign in
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 font-lexend font-light">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#A4CC00] hover:text-lime-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
