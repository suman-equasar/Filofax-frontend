import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Clock, Search, LogOut, User } from "lucide-react";
import { FaLink } from "react-icons/fa";
import { useSelector } from "react-redux";

const Sidebar = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const location = useLocation();

  // Select authMethod and user data from Redux
  const authMethod = useSelector((state) => state.user.authMethod);
  const userDetails = useSelector((state) => state.user.userDetails);
  const googleData = useSelector((state) => state.user.googleData);
  const microsoftData = useSelector((state) => state.user.microsoftData);

  // Check which route is active
  const isEventTypesActive = location.pathname === "/dashboard/event-types";
  const isMeetingsActive = location.pathname === "/dashboard/meetings";
  const isAvailabilityActive = location.pathname === "/dashboard/availability";
  const isUserProfileActive = location.pathname === "/dashboard/user-profile";

  const extractProfileData = () => {
    if (authMethod === "local" && userDetails) {
      return {
        name: userDetails.name || "User",
        profileImageLink: userDetails.profileImageLink || null,
      };
    } else if (authMethod === "google" && googleData) {
      return {
        name: googleData.name || "Google User",
        profileImageLink:
          googleData.profileImageLink || googleData.picture || null,
      };
    } else if (authMethod === "microsoft" && microsoftData) {
      return {
        name: microsoftData.name || "Microsoft User",
        profileImageLink: microsoftData.profileImageLink || null,
      };
    }
    return {
      name: "Guest User",
      profileImageLink: null,
    };
  };
  const { name, profileImageLink } = extractProfileData();

  // 🔥 HIGHLIGHTED: Enhanced image rendering with proper fallback
  const renderProfileImage = () => {
    if (profileImageLink) {
      return (
        <img
          src={profileImageLink}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    } else {
      // Show icon when no image link is available
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-500" />
        </div>
      );
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[230px] transform transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 bg-white border-r-2 border-[#A4CC02]`}
      >
        {/* Profile Section */}
        <div className="flex items-center p-4">
          <Link
            to="/dashboard/user-profile"
            className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer ${
              isUserProfileActive
                ? "bg-gray-100 text-[#A4CC02]"
                : "text-[#000000]"
            }`}
          >
            {/* 🔥 HIGHLIGHTED: Updated image section */}
            <div className="relative">
              {renderProfileImage()}
              {/* Hidden fallback div that shows when image fails */}
              <div
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center absolute top-0 left-0"
                style={{ display: "none" }}
              >
                <User className="h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="ml-3">
              <h3 className="font-normal font-lexend text-sm">{name}</h3>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4">
          <div className="space-y-4">
            <Link
              to="/dashboard/event-types"
              className={`flex items-center px-2 py-2 text-sm font-normal rounded-md hover:bg-gray-100 cursor-pointer ${
                isEventTypesActive
                  ? "bg-gray-100 text-[#A4CC02]"
                  : "text-[#000000]"
              }`}
            >
              <div className="mr-3 w-6">
                <FaLink
                  className={`h-5 w-5 ${
                    isEventTypesActive ? "text-[#A4CC02]" : "text-gray-400"
                  }`}
                />
              </div>
              Event Types
            </Link>

            <Link
              to="/dashboard/meetings"
              className={`flex items-center px-2 py-2 text-sm font-normal rounded-md hover:bg-gray-100 cursor-pointer ${
                isMeetingsActive
                  ? "bg-gray-100 text-[#A4CC02]"
                  : "text-[#000000]"
              }`}
            >
              <div className="mr-3 w-6">
                <Calendar
                  className={`h-5 w-5 ${
                    isMeetingsActive ? "text-[#A4CC02]" : "text-gray-400"
                  }`}
                />
              </div>
              Meetings
            </Link>

            <Link
              to="/dashboard/availability"
              className={`flex items-center px-2 py-2 text-sm font-normal rounded-md hover:bg-gray-100 cursor-pointer ${
                isAvailabilityActive
                  ? "bg-gray-100 text-[#A4CC02]"
                  : "text-[#000000]"
              }`}
            >
              <div className="mr-3 w-6">
                <Clock
                  className={`h-5 w-5 ${
                    isAvailabilityActive ? "text-[#A4CC02]" : "text-gray-400"
                  }`}
                />
              </div>
              Availability
            </Link>

            {/* Logout button at bottom */}
            <div className="absolute bottom-6 w-full px-4">
              <Link
                to="/"
                className="flex items-center px-2 py-2 text-xl font-light rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <div className="mr-3 w-6">
                  <LogOut className="h-5 w-5 text-gray-400" />
                </div>
                Logout
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
