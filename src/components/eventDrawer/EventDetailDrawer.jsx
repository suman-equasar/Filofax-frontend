import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import DurationSelector from "./DurationSelector";
import LocationSelector from "./LocationSelector";
import axios from "axios";
import { extractTokenFromCookie } from "../../utils/auth";
import { useSelector } from "react-redux";
import AvailabilitySelector from "./AvailabilitySelector";

const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariant = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

const EventDetailDrawer = ({ event, onClose }) => {
  const { token, access_token, refresh_token, zoom_access_token } =
    extractTokenFromCookie();

  const [title, setTitle] = useState("New Meeting");
  const [eventDuration, setEventDuration] = useState(15);
  const [location, setLocation] = useState(null);
  const [availability, setAvailability] = useState({});
  const [link, setLink] = useState(null);

  const { userDetails, googleData, microsoftData, authMethod } = useSelector(
    (state) => state.user
  );

  let hostName = "";
  let hostEmail = "";

  if (authMethod === "local" && userDetails) {
    hostName = userDetails.name || "";
    hostEmail = userDetails.email || "";
  } else if (authMethod === "google" && googleData) {
    hostName = googleData.name || "";
    hostEmail = googleData.email || "";
  } else if (authMethod === "microsoft" && microsoftData) {
    hostName = microsoftData.name || "";
    hostEmail = microsoftData.email || "";
  }

  useEffect(() => {
    if (event) {
      setTitle(event.title || "New Meeting");
      setEventDuration(event.duration || 15);
      setLocation(
        event.location
          ? {
              id:
                event.location.toLowerCase().includes("google") ||
                event.location.toLowerCase().includes("meet")
                  ? "google_meet"
                  : "zoom",
              name:
                event.location.toLowerCase().includes("google") ||
                event.location.toLowerCase().includes("meet")
                  ? "Google Meet"
                  : "Zoom",
            }
          : null
      );
      setAvailability(event.availability_time || {});
    }
  }, [event]);

  const handleLocationChange = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const handleDurationChange = (duration) => {
    setEventDuration(duration);
  };

  const handleSaveChanges = async () => {
    try {
      const eventUrl = import.meta.env.VITE_DASHBOARD_URL;

      if (!token && !access_token && !refresh_token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post(
        `${eventUrl}/create-dashboard-event`,
        {
          title,
          duration: eventDuration,
          location: location ? location.id : null,
          eventType: "One-on-One",
          availability_time: availability,
          hostName,
          hostEmail,
          access_token,
          refresh_token,
          zoom_access_token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event created successfully!");
      const data = response.data;
      const url = data.bookingUrl;
      setLink(url);

      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to save event details:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {event && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariant}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white z-50 flex flex-col"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariant}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex-1 overflow-y-auto p-6">
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute right-2 rounded-full border border-[#A4CC02] p-1 hover:bg-lime-100"
                >
                  <X className="h-4 w-4 text-[#A4CC02]" />
                </button>
              </div>

              <div className="flex mt-12 justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    EVENT TYPE
                  </p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold text-black mt-1 bg-transparent focus:outline-none border-b border-gray-300"
                  />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-[#611FEB] font-light mt-1">
                    One-on-One
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#0F575C2B]">
                <DurationSelector
                  initialDuration={eventDuration}
                  onDurationChange={handleDurationChange}
                />
                <LocationSelector
                  initialLocation={location}
                  onLocationChange={handleLocationChange}
                  hostEmail={hostEmail}
                />
                <AvailabilitySelector
                  setAvailability={setAvailability}
                  initialAvailability={event?.availability_time}
                />
                <div className="py-4">
                  <p className="text-sm font-medium text-black mb-2">Host</p>
                  <div className="border border-gray-200 rounded-md px-3 py-2">
                    <p className="text-sm font-semibold text-black">
                      {hostName}
                    </p>
                    <p className="text-sm text-gray-400">{hostEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleSaveChanges}
                className="w-full bg-[#E1F395] hover:bg-lime-400 text-black font-semibold py-3 rounded-lg transition"
              >
                Save changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

EventDetailDrawer.propTypes = {
  event: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventDetailDrawer;
