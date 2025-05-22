import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Clock, Phone } from "lucide-react";
import logo from "../assets/logo.svg";
import Time from "./Time"; // 👈 Make sure path is correct

const eventsData = {
  "2025-05-22": [{ time: "10:00 AM", title: "Team Meeting" }],
  "2025-05-23": [{ time: "2:00 PM", title: "Client Call" }],
};

const Booking = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState(eventsData);

  const handleDateClick = (date) => {
    const formatted = date.toISOString().split("T")[0]; // e.g. "2025-05-22"
    setSelectedDate(formatted);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex">
        {/* Left Panel */}
        <div className="w-1/2 p-8 bg-white border-r border-gray-200">
          <div className="flex items-center mb-6">
            <img src={logo} alt="logo" className="w-10 h-10" />
          </div>
          <span className="text-sm font-medium text-gray-600">ACME Inc.</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Product Demo
          </h1>
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <Clock size={18} className="mr-3" />
              <span className="text-sm">30 min</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone size={18} className="mr-3" />
              <span className="text-sm">Phone call</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            This is an example of a meeting you would have with a potential
            customer to demonstrate your product.
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-8 bg-white relative overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Select a Date & Time
          </h2>

          <div className="bg-white rounded-lg p-4 mb-6">
            <Calendar onClickDay={handleDateClick} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time zone
            </label>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              Central European Time (8:11pm)
            </div>
          </div>

          {/* ⬇️ Drawer inside right panel */}
          <Time
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            date={selectedDate}
            events={events[selectedDate] || []}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
