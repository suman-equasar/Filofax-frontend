import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { updateUserProfile } from "../redux/userSlice"; // Adjust path to your userSlice file
import { extractTokenFromCookie } from "../utils/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import { clearUserDetails } from "../redux/userSlice";
import { persistor } from "../redux/store"; // <-- import this
import Cookies from "js-cookie";

export default function UserProfile() {
  const [currentTime, setCurrentTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    welcomeMessage: "Welcome to my profile",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "12h",
    timezone: "India",
    profileImage: null,
  });

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const { token, acesss_token, refresh_token } = extractTokenFromCookie();

  console.log("Token from cookie:", token);
  console.log("Access Token from cookie:", acesss_token);
  console.log("Refresh Token from cookie:", refresh_token);

  const [previewImage, setPreviewImage] = useState("/api/placeholder/80/80");
  const fileInputRef = useRef(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Date Format Function
  const formatDateByPattern = (date, pattern) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    if (pattern === "YYYY/MM/DD") {
      return `${year}/${month}/${day}`;
    }
  };

  // Get user details from Redux store
  const userDetails = useSelector((state) => state.user.userDetails) || {};
  // Initialize dispatch
  const dispatch = useDispatch();

  // Use the data from Redux to initialize the profile
  useEffect(() => {
    console.log(`User Details from redux :`, userDetails);
    console.log("User email :", userDetails?.email);

    if (userDetails) {
      setProfileData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        welcomeMessage: userDetails.welcomeMessage || "Welcome to my profile",
        dateFormat: userDetails.dateFormat || "YYYY/MM/DD",
        timeFormat: userDetails.timeFormat || "12h",
        timezone: userDetails.timezone || "India",
        profileImage: userDetails.profileImage || null,
      });

      // If there's a profile image from Redux, update the preview
      if (userDetails.profileImage) {
        setPreviewImage(userDetails.profileImage);
      }
    }
  }, [userDetails]);

  // Update time every minute
  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(() => {
      updateCurrentTime();
    }, 60000);

    return () => clearInterval(interval);
  }, [profileData.timezone, profileData.timeFormat]);

  const updateCurrentTime = () => {
    const now = new Date();

    if (profileData.timeFormat === "12h") {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes}${ampm}`);
    } else {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes}`);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profileImage: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData({ ...profileData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateProfile = import.meta.env.VITE_PROFILE_AUTH_URL;

      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });
      const formattedDate = formatDateByPattern(
        new Date(),
        profileData.dateFormat
      );
      formData.append("formattedDate", formattedDate);

      const response = await fetch(`${updateProfile}/update-profile`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Profile updated successfully!");

        // Create an object with the updated profile data to save in Redux
        const updatedData = {
          name: profileData.name,
          email: profileData.email,
          welcomeMessage: profileData.welcomeMessage,
          dateFormat: profileData.dateFormat,
          timeFormat: profileData.timeFormat,
          timezone: profileData.timezone,
        };

        // If there's a new profile image, include it
        if (previewImage && previewImage !== "/api/placeholder/80/80") {
          updatedData.profileImage = previewImage;
        }

        // Update Redux state with the new profile data
        dispatch(updateUserProfile(updatedData));
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const deleteProfileURL = import.meta.env.VITE_PROFILE_AUTH_URL;

      const response = await axios.delete(
        `${deleteProfileURL}/delete-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("delete button call");
      if (response.status === 200 || response.success) {
        alert("Account deleted successfully.");
        console.log("Alert Open");
        // ✅ Clear Redux state
        await dispatch(clearUserDetails());
        console.log("Redux state cleared");

        // ✅ Purge redux-persist store to prevent rehydration
        await persistor.purge();

        console.log("Persistor purged work");
        // ✅ Remove cookies and localStorage
        Cookies.remove("token");
        console.log("Cookie removed");
        localStorage.removeItem("token");
        console.log("Local storage token removed");

        console.log("before navigate");
        // ✅ Redirect
        navigate("/");

        console.log("after navigate");
      } else {
        throw new Error("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("There was a problem deleting the account.");
    }
  };

  return (
    <div className="max-w-2xl p-6 bg-white mt-12">
      <h1 className="text-xl font-medium mb-6">Account Details</h1>

      <div>
        <div className="mb-6 mt-8">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-4">
              <img
                src={previewImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-6 ">
              <p className="mb-2">Profile Image</p>
              <button
                type="button"
                className="flex items-center text-sm border-2 mt-3 border-[#a4cc028f] rounded-lg px-3 py-1"
                onClick={handleImageClick}
              >
                Update image
                <Pencil className="ml-1 w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={profileData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-[#a4cc028f] text-gray-400 font-light rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a4cc028f]"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={profileData.email}
            disabled
            className="w-full p-3 border border-[#a4cc028f] text-gray-400 font-light rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a4cc028f]"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2" htmlFor="welcomeMessage">
            Welcome Message
          </label>
          <textarea
            id="welcomeMessage"
            value={profileData.welcomeMessage}
            onChange={handleInputChange}
            className="w-full p-3 border border-[#a4cc028f] h-24 text-gray-400 font-light rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a4cc028f]"
          />
        </div>

        <div className="flex gap-6 mb-6">
          <div className="flex-1">
            <label className="block mb-2" htmlFor="dateFormat">
              Date Format
            </label>
            <input
              id="dateFormat"
              type="text"
              value={profileData.dateFormat}
              onChange={handleInputChange}
              disabled
              className="w-full p-3 border border-[#a4cc028f] text-gray-400 font-light rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a4cc028f]"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2" htmlFor="timeFormat">
              Time Format
            </label>
            <select
              id="timeFormat"
              value={profileData.timeFormat}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#a4cc028f] text-gray-400 font-light rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a4cc028f]"
            >
              <option value="12h">12h (am/pm)</option>
              <option value="24h">24h</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label htmlFor="timezone">Time Zone</label>
            <span className="text-sm text-gray-500">
              Current Time: {currentTime}
            </span>
          </div>
          <input
            id="timezone"
            value={profileData.timezone}
            onChange={handleInputChange}
            disabled
            className="w-full p-3 border border-[#a4cc028f] text-gray-400 font-light rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a4cc028f]"
          />
        </div>

        <div className="flex justify-around">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className=" px-4 py-2 bg-[#b03200] text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Delete Account
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-[#E1F395] text-black rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this account?
              </p>
              <div className="flex justify-end gap-4">
                <span
                  className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </span>
                <span
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={async () => {
                    setShowDeleteConfirm(false);
                    await handleDeleteAccount(); // Axios delete function
                  }}
                >
                  OK
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
