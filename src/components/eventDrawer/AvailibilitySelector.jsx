import React, { useState } from "react";
import { ChevronDown, ChevronLeft, Pencil, Plus, X } from "lucide-react";

const defaultHours = {
  S: null,
  M: [{ start: "09:00am", end: "05:00pm" }],
  T: [{ start: "09:00am", end: "05:00pm" }],
  W: [{ start: "09:00am", end: "05:00pm" }],
  T2: [{ start: "09:00am", end: "05:00pm" }],
  F: [{ start: "09:00am", end: "05:00pm" }],
  S2: null,
};

const dayMap = {
  S: "Sunday",
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  T2: "Thursday",
  F: "Friday",
  S2: "Saturday",
};

const AvailabilitySelector = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // Adding multiple time slots for Monday to demonstrate the feature
  const [weeklyHours, setWeeklyHours] = useState({
    ...defaultHours,
    M: [
      { start: "09:00am", end: "05:00pm" },
      { start: "06:00pm", end: "07:00pm" },
      { start: "08:00pm", end: "09:00pm" },
    ],
  });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleTimeChange = (day, index, type, value) => {
    const updated = { ...weeklyHours };
    if (updated[day]) {
      updated[day][index][type] = value;
      setWeeklyHours(updated);
    }
  };

  const handleAddSlot = (day) => {
    const updated = { ...weeklyHours };
    if (!updated[day]) {
      updated[day] = [];
    }
    updated[day].push({ start: "09:00am", end: "05:00pm" });
    setWeeklyHours(updated);
  };

  const handleRemoveSlot = (day, index) => {
    const updated = { ...weeklyHours };
    if (updated[day].length === 1) {
      updated[day] = null;
    } else {
      updated[day].splice(index, 1);
    }
    setWeeklyHours(updated);
  };

  return (
    <div className="border-b border-gray-200 py-4">
      {/* Header */}
      <div
        className="flex justify-between items-center pt-6 cursor-pointer px-1"
        onClick={toggleExpand}
      >
        <span className="text-sm font-semibold">Availability</span>
        {isExpanded ? <ChevronDown size={24} /> : <ChevronLeft size={24} />}
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="pt-4 pb-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600">
              This event type uses the weekly and custom hours saved on the
              schedule
            </p>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>

          {/* Weekly Hours */}
          <div className="space-y-4">
            {Object.entries(dayMap).map(([key, label]) => {
              const displayKey = key === "T2" ? "T" : key === "S2" ? "S" : key;
              const isUnavailable = weeklyHours[key] === null;
              const slots = weeklyHours[key] || [];

              return (
                <div key={key} className="flex">
                  {/* Day indicator */}
                  <div className="mr-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        key.startsWith("S")
                          ? "bg-blue-600 text-white"
                          : "bg-[#E1F395] text-black"
                      } flex items-center justify-center text-xs`}
                    >
                      {displayKey}
                    </div>
                  </div>

                  {/* Time slots container */}
                  <div className="flex-1">
                    {isUnavailable ? (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">
                          Unavailable
                        </span>
                        {isEditing && (
                          <button
                            onClick={() => handleAddSlot(key)}
                            className="ml-2 text-gray-500 hover:text-blue-600"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {slots.map((slot, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="text"
                              value={slot.start}
                              onChange={(e) =>
                                handleTimeChange(
                                  key,
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                              className="px-2 py-1 text-sm w-24 bg-gray-50 rounded"
                              disabled={!isEditing}
                            />
                            <span className="mx-2">-</span>
                            <input
                              type="text"
                              value={slot.end}
                              onChange={(e) =>
                                handleTimeChange(
                                  key,
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                              className="px-2 py-1 text-sm w-24 bg-gray-50 rounded"
                              disabled={!isEditing}
                            />
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveSlot(key, index)}
                                className="ml-2 text-gray-500 hover:text-red-600"
                              >
                                <X size={16} />
                              </button>
                            )}
                            {isEditing && index === slots.length - 1 && (
                              <button
                                onClick={() => handleAddSlot(key)}
                                className="ml-2 text-gray-500 hover:text-blue-600"
                              >
                                <Plus size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timezone */}
          <div className="mt-4 text-sm text-blue-600 cursor-pointer">
            India Standard Time ▼
          </div>

          {/* Date-specific hours */}
          <div className="mt-4">
            <p className="text-sm text-gray-700">Date-specific hours</p>
            <button className="mt-2 text-blue-600 rounded px-3 py-1 text-sm flex items-center gap-1">
              <Plus size={14} />
              Hours
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySelector;
