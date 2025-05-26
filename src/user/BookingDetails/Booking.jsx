import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Required for layout, we'll override styles
import { Clock, Phone } from "lucide-react";
import logo from "../../assets/logo.svg";
import Time from "./Time";

const Booking = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateClick = (date) => {
    const formatted = date.toLocaleDateString("en-CA");
    setSelectedDate(formatted);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl">
        <div
          className={`bg-white rounded-lg shadow-lg overflow-hidden w-full flex flex-col md:flex-row  transition-transform duration-300 ${
            drawerOpen ? "md:-translate-x-40" : ""
          }`}
        >
          {/* Left Panel */}
          <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="flex items-center mb-4">
              <img src={logo} alt="logo" className="w-10 h-10" />
            </div>
            <span className="text-sm font-medium text-gray-600">ACME Inc.</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
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
            <p className="text-sm text-gray-500">
              This is an example of a meeting you would have with a potential
              customer to demonstrate your product.
            </p>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Select a Date & Time
            </h2>

            <div className="flex justify-center">
              <div className="bg-white rounded-lg w-full max-w-xs custom-calendar-wrapper">
                <Calendar
                  onClickDay={handleDateClick}
                  tileDisabled={({ date }) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const incoming = new Date(date);
                    incoming.setHours(0, 0, 0, 0);
                    return incoming < today;
                  }}
                  next2Label={null}
                  prev2Label={null}
                  className="react-calendar !border-none !shadow-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time zone
              </label>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                Central European Time (8:11pm)
              </div>
            </div>
          </div>
        </div>

        {drawerOpen && (
          <Time
            isOpen={true}
            onClose={() => setDrawerOpen(false)}
            date={selectedDate}
          />
        )}
      </div>
    </div>
  );
};

export default Booking;
