import { useState } from "react";
import {
  ChevronDown,
  Info,
  ArrowDown,
  Filter,
  ChevronRight,
} from "lucide-react";

export default function Meetings() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [showBuffers, setShowBuffers] = useState(false);
  const [calendarSelected, setCalendarSelected] = useState("My Calendly");

  const meetings = [
    {
      id: 1,
      date: "Friday, 16 May 2025",
      time: "10:30 am – 11 am",
      name: "Subhash",
      eventType: "New Meeting",
      hostCount: 1,
      nonHostCount: 0,
    },
    {
      id: 2,
      date: "Friday, 23 May 2025",
      time: "1:30 pm – 2:30 pm",
      name: "Subhash",
      eventType: "New Meeting",
      hostCount: 1,
      nonHostCount: 0,
    },
  ];

  // Group meetings by date
  const meetingsByDate = meetings.reduce((acc, meeting) => {
    if (!acc[meeting.date]) {
      acc[meeting.date] = [];
    }
    acc[meeting.date].push(meeting);
    return acc;
  }, {});

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
        <Info className="ml-2 text-gray-500 w-5 h-5" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <button
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white"
            onClick={() =>
              setCalendarSelected((prev) =>
                prev === "My Calendly" ? "Other Calendar" : "My Calendly"
              )
            }
          >
            <span className="mr-2">{calendarSelected}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Show buffers</span>
          <Info className="mr-2 text-gray-500 w-4 h-4" />
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showBuffers}
              onChange={() => setShowBuffers(!showBuffers)}
            />
            <div
              className={`w-11 h-6 rounded-full peer ${
                showBuffers ? "bg-blue-600" : "bg-gray-200"
              } 
              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
              peer-checked:after:translate-x-full peer-checked:after:border-white 
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
              after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-5 after:w-5 after:transition-all`}
            ></div>
          </label>
          <span className="ml-4 text-gray-700">Displaying 2 of 2 Events</span>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex">
            {["Upcoming", "Pending", "Past"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
            <button className="px-4 py-2 text-gray-500 flex items-center">
              Date Range
              <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          </div>
          <div className="flex">
            <button className="mr-2 px-4 py-2 border border-gray-300 rounded-md bg-white flex items-center">
              <ArrowDown className="mr-1 w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white flex items-center">
              <Filter className="mr-1 w-4 h-4" />
              Filter
              <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          {Object.keys(meetingsByDate).map((date) => (
            <div key={date}>
              <div className="px-6 py-4 bg-gray-50 border-b text-gray-700">
                {date}
              </div>

              {meetingsByDate[date].map((meeting) => (
                <div
                  key={meeting.id}
                  className="px-6 py-4 border-b flex items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600 mr-6 flex-shrink-0"></div>
                  <div className="text-gray-700 w-40">{meeting.time}</div>
                  <div className="flex-1">
                    <div className="font-medium">{meeting.name}</div>
                    <div className="text-sm text-gray-500">
                      Event type{" "}
                      <span className="font-medium">{meeting.eventType}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mr-6">
                    {meeting.hostCount} host | {meeting.nonHostCount} non-hosts
                  </div>
                  <button className="flex items-center text-gray-500">
                    Details
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ))}

          <div className="px-6 py-4 text-center text-gray-500">
            You've reached the end of the list
          </div>
        </div>
      </div>
    </div>
  );
}
