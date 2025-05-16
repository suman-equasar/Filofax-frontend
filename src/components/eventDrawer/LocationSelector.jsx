import React, { useState } from "react";
import meet from "../../assets/meet.svg";
import zoom from "../../assets/zoom.svg";
import { ChevronDown, ChevronLeft } from "lucide-react";

const LocationSelector = ({ onLocationChange, initialLocation = null }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);

  const locationOptions = [
    {
      id: "google_meet",
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

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_BASE_AUTH_URL}/google`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data?.alreadyLinked) {
        // User already linked Google Calendar
        return true;
      } else if (data?.authUrl) {
        // Begin OAuth flow
        const popup = window.open(
          data.authUrl,
          "_blank",
          "width=500,height=600"
        );

        if (popup) {
          const interval = setInterval(() => {
            if (popup.closed) {
              clearInterval(interval);
              window.location.reload(); // Reload or refetch status
            }
          }, 1000);
        }

        return false; // Don’t proceed with selecting location yet
      } else {
        console.error("Unexpected response:", data);
        return false;
      }
    } catch (err) {
      console.error("Error during Google auth:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (option) => {
    if (option.id === "google_meet") {
      const linked = await handleGoogleAuth();
      if (!linked) return;
    }

    setLocation(option);
    if (onLocationChange) onLocationChange(option);
    setShowOptions(false);
  };

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
