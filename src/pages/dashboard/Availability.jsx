import { useState } from "react";
import { Clock, Calendar, X, Copy, Info, Plus } from "lucide-react";

export default function Availability() {
  const days = [
    { id: 1, short: "S", full: "Sunday" },
    { id: 2, short: "M", full: "Monday" },
    { id: 3, short: "T", full: "Tuesday" },
    { id: 4, short: "W", full: "Wednesday" },
    { id: 5, short: "T", full: "Thursday" },
    { id: 6, short: "F", full: "Friday" },
    { id: 7, short: "S", full: "Saturday" },
  ];

  const timeOptions = [
    "9:00am",
    "10:00am",
    "11:00am",
    "12:00pm",
    "1:00pm",
    "2:00pm",
    "3:00pm",
    "4:00pm",
    "5:00pm",
    "6:00pm",
    "7:00pm",
    "8:00pm",
    "9:00pm",
  ];

  const [activeTab, setActiveTab] = useState("weekly");
  const [weeklyHours, setWeeklyHours] = useState(
    days.map((day) => ({
      dayId: day.id,
      available: day.id !== 7, // Sunday is unavailable by default
      timeSlots: [{ id: 1, startTime: "9:00am", endTime: "5:00pm" }],
    }))
  );

  const toggleAvailability = (dayId) => {
    setWeeklyHours(
      weeklyHours.map((day) => {
        if (day.dayId === dayId) {
          return {
            ...day,
            available: !day.available,
            timeSlots: day.available
              ? []
              : [{ id: 1, startTime: "9:00am", endTime: "5:00pm" }],
          };
        }
        return day;
      })
    );
  };

  const updateTime = (dayId, slotId, field, value) => {
    setWeeklyHours(
      weeklyHours.map((day) => {
        if (day.dayId === dayId) {
          return {
            ...day,
            timeSlots: day.timeSlots.map((slot) =>
              slot.id === slotId ? { ...slot, [field]: value } : slot
            ),
          };
        }
        return day;
      })
    );
  };

  const addTimeSlot = (dayId) => {
    setWeeklyHours(
      weeklyHours.map((day) => {
        if (day.dayId === dayId) {
          const lastSlot = day.timeSlots[day.timeSlots.length - 1];
          const newSlotId =
            day.timeSlots.length > 0
              ? Math.max(...day.timeSlots.map((slot) => slot.id)) + 1
              : 1;

          return {
            ...day,
            timeSlots: [
              ...day.timeSlots,
              {
                id: newSlotId,
                startTime: lastSlot ? lastSlot.endTime : "6:00pm",
                endTime: getNextTimeOption(
                  lastSlot ? lastSlot.endTime : "6:00pm"
                ),
              },
            ],
          };
        }
        return day;
      })
    );
  };

  const getNextTimeOption = (time) => {
    const index = timeOptions.indexOf(time);
    if (index !== -1 && index < timeOptions.length - 1) {
      return timeOptions[index + 1];
    }
    return timeOptions[timeOptions.length - 1];
  };

  const removeTimeSlot = (dayId, slotId) => {
    setWeeklyHours(
      weeklyHours.map((day) => {
        if (day.dayId === dayId) {
          // If this is the last time slot, make the day unavailable
          if (day.timeSlots.length === 1) {
            return { ...day, available: false, timeSlots: [] };
          }

          return {
            ...day,
            timeSlots: day.timeSlots.filter((slot) => slot.id !== slotId),
          };
        }
        return day;
      })
    );
  };

  return (
    <div className="max-w-3xl p-6">
      <h1 className="text-2xl font-medium mb-6">Availability</h1>

      <div className="rounded-lg p-8 border-2 border-gray-200 bg-white shadow-sm">
        <div className=" pb-4 border-b border-gray-200">
          <h2 className="text-md font-medium text-gray-600">Schedule</h2>
        </div>

        <div className="flex  items-center justify-between pb-4 ">
          {/* Tabs */}
          <div className="flex space-x-6">
            <button
              className={`flex items-center py-4 px-1  ${
                activeTab === "weekly"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              <Clock size={18} className="mr-2" />
              <span className="text-sm font-medium">Weekly hours</span>
            </button>
          </div>

          <button
            className={`flex items-center py-4 px-1  ${
              activeTab === "date-specific"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("date-specific")}
          >
            <Calendar size={18} className="mr-2" />
            <span className="text-sm font-medium">Date-specific hours</span>
          </button>

          {/* + Hours Button */}
          <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-2xl">
            <span className="mr-1">+</span> Hours
          </button>
        </div>

        <div className="pt-4">
          {activeTab === "weekly" && (
            <div>
              <p className="text-xs text-gray-500 mb-4">
                Set when you are typically available for meetings
              </p>

              {weeklyHours.map((day) => (
                <div key={day.dayId} className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
                      {days.find((d) => d.id === day.dayId).short}
                    </div>

                    {day.available ? (
                      <>
                        {day.timeSlots.map((slot, index) => (
                          <div key={slot.id} className="flex items-center mb-2">
                            {index > 0 && <div className="w-8 mr-4"></div>}
                            <div
                              className={
                                index > 0
                                  ? "flex items-center ml-12"
                                  : "flex items-center"
                              }
                            >
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
                                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mr-3"
                              >
                                {timeOptions.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>

                              <span className="text-gray-500 mx-2">-</span>

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
                                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mr-3"
                              >
                                {timeOptions.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() =>
                                  removeTimeSlot(day.dayId, slot.id)
                                }
                                className="p-2 text-gray-400 hover:text-gray-600"
                              >
                                <X size={18} />
                              </button>

                              {index === day.timeSlots.length - 1 && (
                                <>
                                  <button
                                    onClick={() => addTimeSlot(day.dayId)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                  >
                                    <Plus size={18} />
                                  </button>

                                  <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Copy size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-4">Unavailable</span>
                        <button
                          onClick={() => toggleAvailability(day.dayId)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Info size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <div className="flex items-center text-sm text-blue-600">
                  <span className="font-medium cursor-pointer">
                    India Standard Time
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
            </div>
          )}

          {activeTab === "date-specific" && (
            <div>
              <p className="text-xs text-gray-500 mb-4">
                Adjust hours for specific days
              </p>
              <p className="text-gray-500 text-sm">
                Configure date-specific availability settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
