import React, { useState, useRef, useEffect } from "react";
import { Menu, Settings } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { extractTokenFromCookie } from "../utils/auth";

const CreateEvent = ({
  toggleSidebar,
  onCreateNewEvent,
  onNavigateToProfile,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const settingsPopupRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const { token, access_token, refresh_token, zoom_access_token } =
    extractTokenFromCookie();

  // Close popup if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close New Event popup
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }

      // Close Settings popup
      if (
        settingsPopupRef.current &&
        !settingsPopupRef.current.contains(event.target) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setShowSettingsPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
    // Close settings popup if open
    setShowSettingsPopup(false);
  };

  const toggleSettingsPopup = () => {
    setShowSettingsPopup((prev) => !prev);
    // Close new event popup if open
    setShowPopup(false);
  };

  const handleCreateEvent = () => {
    onCreateNewEvent();
    setShowPopup(false);
  };

  const handleCopyBookingLink = async () => {
    try {
      const eventUrl = import.meta.env.VITE_DASHBOARD_URL;
      const response = await axios.get(`${eventUrl}/getAll-dashboard-event`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || response.data.length === 0) {
        alert("No events available to copy.");
        return;
      }

      const events = response.data.events; // ✅ fixed here

      if (!events || events.length === 0) {
        alert("No events available to copy.");
        return;
      }

      const sortedEvents = events.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const latestEvent = sortedEvents[0];
      const bookingLink = latestEvent.bookingUrl;

      if (!bookingLink) {
        alert("No booking URL found for the latest event.");
        return;
      }

      await navigator.clipboard.writeText(bookingLink);
      alert("Latest booking link copied to clipboard!");
      setShowSettingsPopup(false);
    } catch (error) {
      console.error("Error copying booking link:", error);
      alert("Failed to copy booking link. Please try again.");
    }
  };

  const handleProfileSettings = () => {
    navigate("/dashboard/user-profile");
    // window.location.href = "/user-profile";
    setShowSettingsPopup(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-8 px-6 flex items-center justify-between relative">
      {/* Left Side: Sidebar toggle + Titles */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium mb-1">Event Types</h1>
          <p className="text-[#000000] font-light">
            Create events to share for people to book on your calendar.
          </p>
        </div>
      </div>

      {/* Right Side: Buttons */}
      <div className="flex items-center space-x-4 relative">
        {/* New Event Button */}
        <button
          ref={buttonRef}
          onClick={togglePopup}
          className="bg-[#e5fc7f] hover:bg-[#CDF529] text-black px-4 py-2 rounded-lg flex items-center"
        >
          New Event <span className="ml-2">+</span>
        </button>

        {/* Settings Button */}
        <button
          ref={settingsButtonRef}
          onClick={toggleSettingsPopup}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </button>

        {/* Event Creation Popup */}
        {showPopup && (
          <div
            ref={popupRef}
            className="absolute right-0 top-full mt-2 z-50 bg-white border border-[#E1F395] shadow-[4px_4px_0px_0px_rgba(164,204,0,0.51)] rounded-xl p-4 w-80"
          >
            <h3 className="font-medium mb-2">Create New Event</h3>
            <button
              onClick={handleCreateEvent}
              className="w-full bg-[#A4CC02] text-white py-2 rounded-md hover:bg-[#93b502]"
            >
              Create Event
            </button>
          </div>
        )}

        {/* Settings Popup */}
        {showSettingsPopup && (
          <div
            ref={settingsPopupRef}
            className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 shadow-lg rounded-lg py-1 w-44"
          >
            <button
              onClick={handleCopyBookingLink}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center text-sm text-gray-700"
            >
              <span className="mr-3">🔗</span>
              <span>Copy Link</span>
            </button>
            <button
              onClick={handleProfileSettings}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center text-sm text-gray-700"
            >
              <span className="mr-3">👤</span>
              <span>Profile Settings</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CreateEvent;
