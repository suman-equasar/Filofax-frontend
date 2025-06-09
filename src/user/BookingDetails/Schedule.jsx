import React from "react";
import {
  FaCheckCircle,
  FaUser,
  FaCalendarAlt,
  FaGlobeAsia,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Schedule = () => {
  const { state } = useLocation();

  const event = state?.event;
  console.log("data coming after book event",event)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No event data AvailabilitySelector. Please schedule a meeting first
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16">
      <div className="border border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-10">
          <FaCheckCircle className="text-green-600 mr-2 text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">
            You are scheduled
          </h2>
        </div>
        <p className="text-center text-sm text-gray-600 mb-8">
          A calendar invitation has been sent to {event.attendeeEmail}.
        </p>
        <div className="text-center mb-10">
          <span className="text-6xl">🎉</span>
        </div>

        <div className="border border-gray-200 rounded-md p-6 bg-gray-50">
          <h3 className="text-base font-semibold mb-12 text-gray-800">
            Meeting with {event.hostName}
          </h3>

          <div className="flex items-center text-sm mb-3">
            <FaUser className="text-gray-500 mr-2" />
            <span className="font-medium">{event.attendeeName}</span>
          </div>

          <div className="flex items-center text-sm mb-3">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <span>
              {event.slot} • {formattedDate}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <FaGlobeAsia className="text-gray-500 mr-2" />
            <span>India Standard Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
