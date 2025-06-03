import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Copy,
  Link,
  MoreVertical,
  Edit,
  Globe,
  FileText,
  Lock,
  Copy as Clone,
  Trash2,
} from "lucide-react";
import { Switch } from "./ui/Switch";
import PropTypes from "prop-types";

const EventCard = ({ event, onToggleActive, onClick, isSelected }) => {
  const [isActive, setIsActive] = useState(event.isActive);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(event.path);
    alert("Link copied to clipboard!");
  };

  const handleOpenLink = (e) => {
    e.stopPropagation();
    window.open(event.path, "_blank");
  };

  const handleToggle = (newState) => {
    setIsActive(newState);
    onToggleActive?.(event.id, newState);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define border class based on selection state
  const borderClass = isSelected
    ? "border-2 border-[#A4CC02] ring-2 ring-[#A4CC02]/20"
    : "border border-gray-200";

  return (
    <div
      className={`${borderClass} rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer relative`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-[#A4CC02]" />
          <h3 className="font-medium text-gray-900">{event.title}</h3>

          {/* Booking URL (visible if present) */}
          {event.bookingUrl && (
            <p className="text-sm text-blue-600 break-all mt-2">
              <a
                href={event.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-800"
              >
                {event.bookingUrl}
              </a>
            </p>
          )}
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-[#A4CC02]"
          onClick={(e) => e.stopPropagation()} // prevent drawer open
        />
      </div>

      <div className="text-sm text-gray-500 mb-4 truncate">{event.path}</div>

      <div
        className="flex justify-end space-x-2"
        onClick={(e) => e.stopPropagation()} // prevent drawer open
      >
        {/* Copy Icon - Only shown when toggle is ON */}
        {isActive && (
          <button
            className="p-2 rounded-md hover:bg-[#E1F395] transition-colors"
            onClick={handleCopyLink}
            title="Copy link"
          >
            <Copy className="h-5 w-5 text-gray-500" />
          </button>
        )}

        {/* Chain/Link Icon - Always visible */}
        <button
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={handleOpenLink}
          title="Open link"
        >
          <Link className="h-5 w-5 text-gray-500" />
        </button>

        {/* Three-dot Menu Icon - Always visible with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={toggleDropdown}
            title="More options"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    // Add edit functionality
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>

                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    // Add language change functionality
                  }}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Change language
                  <div className="text-xs text-gray-500 ml-6">English</div>
                </button>

                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    // Add internal note functionality
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Add Internal Note
                </button>

                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    // Add make secret functionality
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Make secret
                </button>

                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    // Add clone functionality
                  }}
                >
                  <Clone className="h-4 w-4 mr-2" />
                  Clone
                </button>

                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    // Add delete functionality
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>

              {/* Toggle switch section at bottom */}
              <div className="border-t border-gray-200 px-4 py-2 flex justify-between items-center">
                <span className="text-sm text-gray-700">On/Off</span>
                <Switch
                  checked={isActive}
                  onCheckedChange={(newState) => {
                    handleToggle(newState);
                    setShowDropdown(false);
                  }}
                  className="data-[state=checked]:bg-[#A4CC02]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string,
    bookingUrl: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  onToggleActive: PropTypes.func,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

EventCard.defaultProps = {
  isSelected: false,
};

export default EventCard;
