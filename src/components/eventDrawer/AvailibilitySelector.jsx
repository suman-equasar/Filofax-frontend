import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, Pencil, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const defaultHours = {
  Sun: null,
  Mon: [{ start: "09:00am", end: "05:00pm" }],
  Tue: [{ start: "09:00am", end: "05:00pm" }],
  Wed: [{ start: "09:00am", end: "05:00pm" }],
  Thu: [{ start: "09:00am", end: "05:00pm" }],
  Fri: [{ start: "09:00am", end: "05:00pm" }],
  Sat: null,
};

const dayMap = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

const AvailabilitySelector = ({ setAvailability }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Dropdown is collapsed by default
  const [isEditing, setIsEditing] = useState(false);
  const [weeklyHours, setWeeklyHours] = useState({
    ...defaultHours,
    // M: [{ start: "09:00am", end: "05:00pm" }],
  });

  // const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate("/availability"); // Navigate to the Availability page
  };

  // const handleTimeChange = (day, index, type, value) => {
  //   const updated = { ...weeklyHours };
  //   if (updated[day]) {
  //     updated[day][index][type] = value;
  //     setWeeklyHours(updated);
  //   }
  // };

  const handleTimeChange = (day, index, type, value) => {
    setWeeklyHours((prev) => {
      const daySlots = prev[day] ? [...prev[day]] : [];
      daySlots[index] = { ...daySlots[index], [type]: value };
      return { ...prev, [day]: daySlots };
    });
  };

  // const handleAddSlot = (day) => {
  //   const updated = { ...weeklyHours };
  //   if (!updated[day]) {
  //     updated[day] = [];
  //   }
  //   updated[day].push({ start: "09:00am", end: "05:00pm" });
  //   setWeeklyHours(updated);
  // };

  const handleAddSlot = (day) => {
    setWeeklyHours((prev) => {
      const daySlots = prev[day] ? [...prev[day]] : [];
      daySlots.push({ start: "09:00am", end: "05:00pm" });
      return { ...prev, [day]: daySlots };
    });
  };

  // const handleRemoveSlot = (day, index) => {
  //   const updated = { ...weeklyHours };
  //   if (updated[day].length === 1) {
  //     updated[day] = null;
  //   } else {
  //     updated[day].splice(index, 1);
  //   }
  //   setWeeklyHours(updated);
  // };

  const handleRemoveSlot = (day, index) => {
    setWeeklyHours((prev) => {
      const daySlots = prev[day] ? [...prev[day]] : [];
      if (daySlots.length === 1) {
        return { ...prev, [day]: null };
      } else {
        daySlots.splice(index, 1);
        return { ...prev, [day]: daySlots };
      }
    });
  };

  useEffect(() => {
    setAvailability(weeklyHours);
  }, [weeklyHours, setAvailability]);

  // useEffect(() => {
  //   // Normalize keys: merge "M" into "Mon" if "M" exists
  //   if (availability_time) {
  //     const normalizedHours = { ...availability_time };
  //     if (normalizedHours.M && !normalizedHours.Mon) {
  //       normalizedHours.Mon = normalizedHours.M;
  //       delete normalizedHours.M;
  //     }
  //     setWeeklyHours(normalizedHours);
  //   }
  // }, [availability_time]);

  return (
    <div className="border-b border-gray-200 py-4">
      {/* Header */}
      <div
        className="flex justify-between items-center pt-6 cursor-pointer px-1"
        onClick={toggleExpand}
      >
        <span className="text-sm font-semibold">Availability</span>
        {/* {isExpanded ? <ChevronDown size={24} /> : <ChevronLeft size={24} />} */}
        {isExpanded ? <ChevronLeft size={24} /> : <ChevronDown size={24} />}
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
              onClick={() => {
                setIsEditing(!isEditing);
                handleEditClick();
              }}
              className="text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>

          {/* Weekly Hours */}
          <div className="space-y-4">
            {Object.entries(dayMap).map(([key, label]) => {
              // const displayKey = key === "T2" ? "T" : key === "S2" ? "S" : key;
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
                      {/* {displayKey} */}
                      {key.charAt(0)}
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
