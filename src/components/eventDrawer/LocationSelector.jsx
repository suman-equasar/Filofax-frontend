import React, { useState } from "react";
import meet from "../../assets/meet.svg";
import zoom from "../../assets/zoom.svg";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { extractTokenFromCookie } from "../../utils/auth";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "js-cookie";

const LocationSelector = ({ onLocationChange, initialLocation = null }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  const spinnerStyle = {
    display: "block",
    margin: "0 auto",
  };

  const { token, access_token, refresh_token, zoom_access_token } =
    extractTokenFromCookie();

  const locationOptions = [
    {
      id: "google-meet",
      name: "Google Meet",
      icon: <img src={meet} alt="Google Meet" className="w-6 h-6" />,
    },
    {
      id: "zoom",
      name: "Zoom",
      icon: <img src={zoom} alt="Zoom" className="w-6 h-6" />,
    },
  ];

  const toggleOptions = () => setShowOptions(!showOptions);

  const openPopup = (url) => {
    const popup = window.open(url, "_blank", "width=500,height=600");
    if (!popup) return;

    toast.info("Waiting for Google authentication to complete...");
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        toast.success("Google connected successfully!");
        window.location.reload(); // reloads to get token from cookie
      }
    }, 1000);
  };

  const handleGoogleAuth = async () => {
    if (access_token) return true;
    toast.info("Please connect your Google account first");
    try {
      setLoading(true);

      // Directly open the backend OAuth URL in popup
      const googleAuthUrl = `${import.meta.env.VITE_BASE_AUTH_URL}/google`;
      openPopup(googleAuthUrl);

      //  wait for popup to close and tokens to be set in cookies
      return false;
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("Something went wrong during Google connection");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleZoomAuth = async () => {
    if (zoom_access_token) return true;

    try {
      setLoading(true);

      const url = `${import.meta.env.VITE_ZOOM_BASE_URL}/connect`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.get(url, {
        withCredentials: true,
        headers,
      });
      const data = await res.data;
      const zoom_access_token = data.zoom_access_token;
      console.log("Zoom cookies", zoom_access_token);

      Cookies.set("zoom_access_token", zoom_access_token);
      if (data.success) {
        toast.success("Zoom connected successfully!");
        // alert("Zoom connected successfully!");
        return true;
      } else {
        toast.error("Zoom connection failed");
        return false;
      }
    } catch (err) {
      console.error("Zoom auth error:", err);
      toast.error("Zoom connextion failed. Please try again to connect");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (option) => {
    let isConnected = false;
    if (option.id === "google-meet") {
      isConnected = await handleGoogleAuth();
      if (!isConnected) return;
    } else if (option.id === "zoom") {
      isConnected = await handleZoomAuth();
      if (!isConnected) return;
    }

    setLocation(option);
    setShowOptions(false);
    if (onLocationChange) onLocationChange(option);
  };

  // 🔥 SPINNER UI — SHOW THIS IF LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <ClipLoader
          color="#10B981"
          loading={loading}
          cssOverride={spinnerStyle}
          size={35}
        />
        <p className="ml-3 text-sm text-gray-600">Connecting to Zoom...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Selector */}
      <div
        className="flex justify-between items-center py-8 cursor-pointer"
        onClick={toggleOptions}
      >
        <div>
          <p className="text-sm font-semibold text-black">Location</p>
          <p className="text-xs text-gray-500 mt-1">
            {location ? location.name : "Select a location"}
          </p>
        </div>
        <span className="text-black font-light text-2xl">
          {showOptions ? <ChevronDown size={24} /> : <ChevronLeft size={24} />}
        </span>
      </div>

      {/* Options */}
      {showOptions && (
        <div className="py-4 bg-white">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-3">
              {locationOptions.map((option) => (
                <button
                  key={option.id}
                  className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
                    location?.id === option.id
                      ? "border-lime-500 bg-lime-50"
                      : "border-lime-200 hover:bg-lime-50"
                  }`}
                  onClick={() => handleOptionClick(option)}
                  disabled={loading}
                >
                  {option.icon}
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Border */}
      <div className="border-b border-[#0F575C2B]"></div>
    </div>
  );
};

export default LocationSelector;
