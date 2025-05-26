import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Time = ({ isOpen, onClose, date }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  const handleNextClick = (slot) => {
    console.log("Selected slot:", slot); // Optional logging
    navigate("/user-detail"); // ⬅️ navigate to UserDetail page
  };

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 9;
    let minute = 0;

    while (hour < 17 || (hour === 17 && minute === 0)) {
      const formattedHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute} ${ampm}`);

      minute += 30;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    }

    return slots;
  };

  const formatDateWithDay = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  };

  const timeSlots = generateTimeSlots();

  return (
    <>
      {/* Overlay control*/}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      ></div>

      {/* Time Drawer */}
      <div
        className={`
          fixed md:absolute top-0 right-0 h-full bg-white shadow-lg
border-l z-50
          transition-transform duration-300
          w-full md:w-60
          transform ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 border-b
sticky top-0 bg-white z-10"
        >
          <h2 className="font-bold text-sm">{formatDateWithDay(date)}</h2>
          <button onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Time Slots */}
        <div
          className="p-4 space-y-2 overflow-y-auto
h-[calc(100%-80px)] max-h-[calc(100%-80px)]"
        >
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center space-x-2 min-w-0">
              <button
                onClick={() => setSelectedIndex(index)}
                className={`text-left border rounded p-2 text-sm
transition-all duration-200 flex-shrink-0 ${
                  selectedIndex === index
                    ? "bg-gray-800 text-white border-gray-800 w-28"
                    : "border-blue-500 text-blue-500 hover:bg-blue-100 flex-1"
                }`}
              >
                {slot}
              </button>

              {selectedIndex === index && (
                <button
                  onClick={() => handleNextClick(slot)}
                  className="bg-blue-600 text-white text-sm px-4 py-2
rounded font-medium hover:bg-blue-700 transition flex-shrink-0"
                >
                  Next
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Time;
