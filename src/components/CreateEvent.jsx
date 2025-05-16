import React, { useState, useRef, useEffect } from "react";
import { Menu, Settings } from "lucide-react";

const CreateEvent = ({ toggleSidebar, onCreateNewEvent }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  // Close popup if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const handleCreateEvent = () => {
    onCreateNewEvent();
    setShowPopup(false);
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
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>

        {/* Event Creation Popup */}
        {showPopup && (
          <div
            ref={popupRef}
            className="absolute right-0 top-full mt-2 z-50 bg-white border border-[#E1F395] shadow-[4px_4px_0px_0px_rgba(164,204,0,0.51)] rounded-xl p-4 w-80"
          >
            <h3 className="font-medium mb-2">Create New Event</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="One-on-One Meeting"
              />
            </div>
            <button
              onClick={handleCreateEvent}
              className="w-full bg-[#A4CC02] text-white py-2 rounded-md hover:bg-[#93b502]"
            >
              Create Event
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CreateEvent;
