import React, { useState } from "react";
import { Calendar, List, Plus, Copy, X } from "lucide-react";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const defaultHours = [{ start: "9:00am", end: "5:00pm" }];

export default function Availability() {
  const [availability, setAvailability] = useState(
    daysOfWeek.map((day, index) => ({
      day,
      hours:
        index === 0 || index === 6
          ? [] // Sunday and Saturday unavailable
          : index === 1
          ? [
              { start: "9:00am", end: "5:00pm" },
              { start: "6:00pm", end: "7:00pm" },
              { start: "8:00pm", end: "9:00pm" },
            ]
          : defaultHours,
    }))
  );

  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"

  const handleAddHour = (dayIndex) => {
    const updated = [...availability];
    updated[dayIndex].hours.push({ start: "", end: "" });
    setAvailability(updated);
  };

  const handleRemoveHour = (dayIndex, hourIndex) => {
    const updated = [...availability];
    updated[dayIndex].hours.splice(hourIndex, 1);
    setAvailability(updated);
  };

  const handleChange = (dayIndex, hourIndex, field, value) => {
    const updated = [...availability];
    updated[dayIndex].hours[hourIndex][field] = value;
    setAvailability(updated);
  };

  const addAvailability = (dayIndex) => {
    const updated = [...availability];
    if (updated[dayIndex].hours.length === 0) {
      updated[dayIndex].hours.push({ start: "9:00am", end: "5:00pm" });
    } else {
      handleAddHour(dayIndex);
    }
    setAvailability(updated);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-16 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-sm text-gray-500">Schedule</h2>
        <div className="flex justify-between items-center">
          <div className="text-[#A4CC00] font-semibold text-lg">
            Working hours
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm ${
                viewMode === "list" ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} /> List
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm ${
                viewMode === "calendar" ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => setViewMode("calendar")}
            >
              <Calendar size={16} /> Calendar
            </button>
          </div>
        </div>
        <p className="text-sm text-black mt-1 cursor-pointer">
          Active on:
          <span className="text-[#A4CC00] font-normal"> 2 event types</span>
        </p>
      </div>

      <div className="flex justify-between border-t pt-4">
        <div>
          <h3 className="text-base font-semibold">Weekly hours</h3>
          <p className="text-sm font-light text-gray-500">
            Set when you are typically available for meetings
          </p>
        </div>
        {/* <div className="text-right">
          <h3 className="text-base font-semibold flex items-center justify-end gap-2">
            <Calendar size={16} /> Date-specific hours
          </h3>
          <p className="text-sm text-gray-500">
            Adjust hours for specific days
          </p>
        </div> */}
      </div>

      {viewMode === "list" && (
        <div className="mt-6">
          {availability.map((dayItem, dayIndex) => (
            <div key={dayIndex} className="flex items-start gap-4 mb-4">
              <div
                className={`w-8 h-8 rounded-full ${
                  dayItem.hours.length === 0 ? "bg-gray-200" : "bg-[#A4CC00]"
                } text-white flex items-center justify-center`}
              >
                {dayItem.day}
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                {dayItem.hours.length === 0 ? (
                  <div className="text-gray-500 flex items-center gap-2">
                    Unavailable
                    <button
                      onClick={() => addAvailability(dayIndex)}
                      className="text-blue-600 ml-2 flex items-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  dayItem.hours.map((hour, hourIndex) => (
                    <div key={hourIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="bg-gray-100 rounded px-2 py-1 w-24"
                        value={hour.start}
                        onChange={(e) =>
                          handleChange(
                            dayIndex,
                            hourIndex,
                            "start",
                            e.target.value
                          )
                        }
                      />
                      <span>-</span>
                      <input
                        type="text"
                        className="bg-gray-100 rounded px-2 py-1 w-24"
                        value={hour.end}
                        onChange={(e) =>
                          handleChange(
                            dayIndex,
                            hourIndex,
                            "end",
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() => handleRemoveHour(dayIndex, hourIndex)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X size={16} />
                      </button>
                      {hourIndex === dayItem.hours.length - 1 && (
                        <>
                          <button
                            onClick={() => handleAddHour(dayIndex)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Add another time slot"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            title="Copy time slot"
                          >
                            <Copy size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <p className="text-center text-gray-500">
            Calendar view would be displayed here
          </p>
        </div>
      )}

      <div className="mt-6 text-sm text-blue-700">India Standard Time</div>
    </div>
  );
}
