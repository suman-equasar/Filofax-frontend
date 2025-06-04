import { useState } from "react";
import { Clock, Calendar, X, Copy, Info, Plus, Menu } from "lucide-react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

// ⏰ Generates time slots from 12:00 AM to 11:45 PM in 15-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const ampm = hour < 12 ? "am" : "pm";
      const h = hour % 12 === 0 ? 12 : hour % 12;
      const m = minutes === 0 ? "00" : minutes.toString().padStart(2, "0");
      times.push(`${h}:${m}${ampm}`);
    }
  }
  return times;
};

export default function Availability() {
  const { toggleSidebar, isMobile } = useOutletContext();
  const days = [
    { id: 1, short: "S", full: "Sunday" },
    { id: 2, short: "M", full: "Monday" },
    { id: 3, short: "T", full: "Tuesday" },
    { id: 4, short: "W", full: "Wednesday" },
    { id: 5, short: "T", full: "Thursday" },
    { id: 6, short: "F", full: "Friday" },
    { id: 7, short: "S", full: "Saturday" },
  ];

  const timeOptions = generateTimeOptions();

  const [activeTab, setActiveTab] = useState("weekly");
  const [weeklyHours, setWeeklyHours] = useState(
    days.map((day) => ({
      dayId: day.id,
      available: day.id !== 1,
      timeSlots:
        day.id !== 1 ? [{ id: 1, startTime: "9:00am", endTime: "5:00pm" }] : [],
    }))
  );
  const isOverlapping = (slot) => {
    const sorted = [...slot].sort(
      (a, b) =>
        timeOptions.indexOf(a.startTime) - timeOptions.indexOf(b.startTime)
    );
    for (let i = 1; i < sorted.length; i++) {
      if (
        timeOptions.indexOf(sorted[i].startTime) <
        timeOptions.indexOf(sorted[i - 1].endTime)
      ) {
        return true;
      }
    }
    return false;
  };
  const saveAvailability = async () => {
    // Validate time slots for overlaps
    for (const day of weeklyHours) {
      if (day.available && isOverlapping(day.timeSlots)) {
        alert(
          `Time slots for ${days.find((d) => d.id === day.dayId).full} overlap.`
        );
        return;
      }
    }
    // Prepare form data for submission
    const formData = new FormData();

    weeklyHours.forEach((day, index) => {
      formData.append(`availability[${index}][dayId]`, day.dayId.toString());
      formData.append(
        `availability[${index}][available]`,
        day.available.toString()
      );

      day.timeSlots.forEach((slot, slotIndex) => {
        formData.append(
          `availability[${index}][timeSlots][${slotIndex}][startTime]`,
          slot.startTime
        );
        formData.append(
          `availability[${index}][timeSlots][${slotIndex}][endTime]`,
          slot.endTime
        );
      });
    });

    try {
      const response = await axios.post(
        "https://your-backend-api.com/availability", // replace with your API
        formData
      );
      console.log("Saved:", response.data);
      alert("Availability saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save availability.");
    }
  };

  const toggleAvailability = (dayId) => {
    setWeeklyHours(
      weeklyHours.map((day) =>
        day.dayId === dayId
          ? {
              ...day,
              available: !day.available,
              timeSlots: !day.available
                ? [{ id: 1, startTime: "9:00am", endTime: "5:00pm" }]
                : [],
            }
          : day
      )
    );
  };

  const updateTime = (dayId, slotId, field, value) => {
    setWeeklyHours(
      weeklyHours.map((day) =>
        day.dayId === dayId
          ? {
              ...day,
              timeSlots: day.timeSlots.map((slot) =>
                slot.id === slotId ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      )
    );
  };

  const getNextTimeOption = (time) => {
    const index = timeOptions.indexOf(time);
    return index !== -1 && index < timeOptions.length - 1
      ? timeOptions[index + 1]
      : timeOptions[timeOptions.length - 1];
  };

  const addTimeSlot = (dayId) => {
    setWeeklyHours(
      weeklyHours.map((day) => {
        if (day.dayId === dayId) {
          const lastSlot = day.timeSlots[day.timeSlots.length - 1];
          const newSlotId = Math.max(...day.timeSlots.map((s) => s.id)) + 1;

          return {
            ...day,
            timeSlots: [
              ...day.timeSlots,
              {
                id: newSlotId,
                startTime: lastSlot.endTime,
                endTime: getNextTimeOption(lastSlot.endTime),
              },
            ],
          };
        }
        return day;
      })
    );
  };

  const removeTimeSlot = (dayId, slotId) => {
    setWeeklyHours(
      weeklyHours.map((day) => {
        if (day.dayId === dayId) {
          const updatedSlots = day.timeSlots.filter(
            (slot) => slot.id !== slotId
          );
          return {
            ...day,
            timeSlots: updatedSlots,
            available: updatedSlots.length > 0,
          };
        }
        return day;
      })
    );
  };

  return (
    <div className="max-w-3xl p-6">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          {" "}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {" "}
            <Menu className="h-5 w-5" />{" "}
          </button>{" "}
        </div>
      )}
      <h1 className="text-2xl font-medium mb-6">Availability</h1>

      <div className="rounded-lg p-8 border-2 border-gray-200 bg-white shadow-sm">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-md font-medium text-gray-600">Schedule</h2>
        </div>

        <div className="flex items-center justify-between pb-4">
          <div className="flex space-x-6">
            <button
              className={`flex items-center py-4 px-1 ${
                activeTab === "weekly"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              <Clock size={18} className="mr-2" />
              Weekly hours
            </button>

            <button
              className={`flex items-center py-4 px-1 ${
                activeTab === "date-specific"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("date-specific")}
            >
              <Calendar size={18} className="mr-2" />
              Date-specific hours
            </button>
          </div>

          <button className="text-sm font-medium text-blue-600 border border-blue-600 px-3 py-1 rounded-2xl">
            + Hours
          </button>
        </div>

        {activeTab === "weekly" && (
          <div>
            <p className="text-xs text-gray-500 mb-4">
              Set when you are typically available for meetings
            </p>

            {weeklyHours.map((day) => (
              <div key={day.dayId} className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
                    {days.find((d) => d.id === day.dayId).short}
                  </div>

                  {day.available ? (
                    <div className="flex flex-col gap-2">
                      {day.timeSlots.map((slot, index) => (
                        <div key={slot.id} className="flex items-center gap-2">
                          <select
                            value={slot.startTime}
                            onChange={(e) =>
                              updateTime(
                                day.dayId,
                                slot.id,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="bg-gray-100 px-3 py-1 rounded-md"
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>

                          <span>-</span>

                          <select
                            value={slot.endTime}
                            onChange={(e) =>
                              updateTime(
                                day.dayId,
                                slot.id,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="bg-gray-100 px-3 py-1 rounded-md"
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => removeTimeSlot(day.dayId, slot.id)}
                          >
                            <X
                              size={18}
                              className="text-gray-400 hover:text-red-500"
                            />
                          </button>

                          {index === day.timeSlots.length - 1 && (
                            <>
                              <button onClick={() => addTimeSlot(day.dayId)}>
                                <Plus
                                  size={18}
                                  className="text-gray-400 hover:text-green-500"
                                />
                              </button>
                              <button>
                                <Copy size={18} className="text-gray-400" />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      Unavailable
                      <button onClick={() => toggleAvailability(day.dayId)}>
                        <Info size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 text-sm text-blue-600 cursor-pointer flex items-center">
              India Standard Time
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        )}

        {activeTab === "date-specific" && (
          <div className="text-sm text-gray-500 mt-4">
            <p>Configure date-specific availability settings</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveAvailability}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
