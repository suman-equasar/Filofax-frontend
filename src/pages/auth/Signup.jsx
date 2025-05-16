// Updated Signup.jsx - Fixed navigation after signup
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import validator from "validator";
import { initiateGoogleSignUp } from "../../services/auth/googleAuth";
import axios from "axios";
import { setAuthToken } from "../../utils/auth"; // Import the updated auth utility

// Constants
const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const NAME_REGEX = /^[a-zA-Z\s]+$/;
const signupUrl = import.meta.env.VITE_BASE_AUTH_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
    general: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    return validator.isEmail(email)
      ? ""
      : "Please enter a valid email address.";
  };

  const validateName = (name) => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) return "Please enter your name.";
    if (!NAME_REGEX.test(trimmedName))
      return "Name must contain only letters and spaces.";
    if (trimmedName.length < 2)
      return "Name must be at least 2 characters long.";

    return "";
  };

  const validatePassword = (password) => {
    return validator.isStrongPassword(password, PASSWORD_REQUIREMENTS)
      ? ""
      : "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.";
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      await initiateGoogleSignUp();
      // Navigation is handled by the redirect in the initiateGoogleSignUp function
      // and then by the useEffect in Dashboard that extracts token from URL
    } catch (error) {
      console.error("Error initiating Google sign-up:", error);
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.msg || error.message,
      }));
      setIsGoogleLoading(false);
    }
  };

  const handleMicrosoftSignUp = () => {
    console.log("Microsoft sign-in clicked");
    // Implement Microsoft sign-up logic
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {
      email: validateEmail(formData.email),
      name: validateName(formData.name),
      password: validatePassword(formData.password),
      general: "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${signupUrl}/local-signUp`, {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      console.log("Signup successful:", response.data);

      // Store the token from the response
      if (response.data?.token) {
        const success = setAuthToken(response.data.token);
        if (success) {
          navigate("/dashboard");
          return;
        }
      }

      // If we got here, something is wrong with the token
      throw new Error("Authentication failed: No valid token received");
    } catch (error) {
      console.error("Signup failed:", error);
      setErrors((prev) => ({
        ...prev,
        general:
          error.response?.data?.msg ||
          error.message ||
          "Something went wrong. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same
  // ...

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[#A4CC00] shadow-[4px_4px_0px_0px_rgba(164,204,0,0.51)]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 font-lexend">
            Filo<span className="text-[#A4CC00]">Fax</span>
          </h1>
          <p className="text-[#121212] mt-1 text-base font-light font-lexend">
            Create your Filofax account
          </p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        {/* Social Login Buttons */}
        <div>
          <button
            type="button"
            className="flex items-center justify-center w-full py-3 px-4 mb-6 border-[1.5px] border-[#121212e0] rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
          >
            <FcGoogle size={18} className="mr-2" />
            <span className="text-sm font-semibold text-[#121212]">
              {isGoogleLoading ? "Processing..." : "Sign Up with Google"}
            </span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-full py-3 px-4 mb-6 border-[1.5px] border-[#121212e0] rounded-lg bg-white hover:bg-gray-50"
            onClick={handleMicrosoftSignUp}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft logo"
              className="w-4 h-4 mr-2"
            />
            <span className="text-sm font-semibold text-[#121212]">
              Sign Up with Microsoft
            </span>
          </button>

          {/* Divider */}
          <div className="relative mt-6 mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#CDF529]"></div>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
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
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-light font-lexend text-[#121212] text-left mb-1"
              >
                Enter your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
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
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#CDF529] text-base text-[#121212] font-medium font-lexend rounded-md hover:bg-[#A4CC00] focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50"
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 font-lexend font-light">
            Already have an account?{" "}
            <Link to="/" className="text-[#A4CC00] hover:text-lime-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
