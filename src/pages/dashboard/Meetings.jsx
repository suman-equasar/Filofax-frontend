import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, X } from "lucide-react";

export default function Meetings() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [expandedEventIds, setExpandedEventIds] = useState("false");

  const toggleEventDetails = (eventId) => {
    setExpandedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Mock data for meetings
  const events = [
    {
      id: "event1",
      date: "Friday, 16 May 2025",
      isToday: true,
      time: "3PM - 5:30PM",
      name: "Event Name",
      type: "One-on-One meeting",
      hosts: { host: 1, nonHosts: 0 },
      email: "webstock44@gmail.com",
      location: "This is a Google Meet web conference",
      joinNowLink: "#",
      timeZone: "PDT Standard Time",
      questions:
        "Please share anything that will help prepare for our meeting.",
      meetingHost: "Host will attend this meeting",
      hostInitial: "A",
      createdDate: "Created 16 May 2025",
    },
    {
      id: "event2",
      date: "Friday, 23 May 2025",
      isToday: false,
      time: "3PM - 5:30PM",
      name: "Event Name",
      type: "One-on-One meeting",
      hosts: { host: 1, nonHosts: 0 },
    },
    {
      id: "event3",
      date: "Friday, 23 May 2025",
      isToday: false,
      time: "3PM - 5:30PM",
      name: "Event Name",
      type: "One-on-One meeting",
      hosts: { host: 1, nonHosts: 0 },
    },
  ];

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  return (
    <div className=" max-w-7xl p-4 ">
      <div className="flex justify-between items-center mt-11 mb-12 ">
        <h1 className="text-2xl text-[#000000] font-normal">Meetings</h1>
        <span className="text-gray-500">Displaying 3 of 3 Events</span>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-[#0F575C1A]">
        <div className="flex justify-between items-center">
          {/* Tabs */}
          <div className="flex">
            {["Upcoming", "Pending", "Past"].map((tab) => (
              <button
                key={tab}
                className={`px-8 py-3 font-normal text-sm ${
                  tab === activeTab
                    ? "border-b-2 border-[#A4CC02] text-[#000000]"
                    : "text-[#000000]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Export button */}
          <button className="flex items-center px-4 py-1 border border-gray-300 rounded text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Event listings */}
      <div className="mt-8 border-2 border-[#0F575C1A] rounded-lg">
        {Object.entries(eventsByDate).map(([date, dateEvents]) => (
          <div key={date} className="mb-4">
            <div
              className={`p-3 ${
                dateEvents[0].isToday ? "bg-[#0F575C2B]" : "bg-[#0F575C2B]"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-light">{date}</span>
                {dateEvents[0].isToday && (
                  <span className="font-medium">TODAY</span>
                )}
              </div>
            </div>

            {dateEvents.map((event) => (
              <div key={event.id} className="border-b">
                <div className="p-8 flex">
                  {/* Time column */}
                  <div className="w-1/6">
                    <div className="text-gray-700">{event.time}</div>

                    {expandedEventIds.includes(event.id) && (
                      <div className="mt-10 space-y-2">
                        <button className="flex items-center justify-center  px-6 py-2 border-2 border-gray-400 rounded-2xl text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          Reschedule
                        </button>
                        <button className="flex items-center justify-center  px-10 py-2 border-2 border-gray-400 rounded-2xl text-sm">
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Add gap between time and event details */}
                  <div className="w-1/12"></div> {/* Empty div for spacing */}
                  {/* Event details */}
                  <div className="w-4/6 ">
                    <div>
                      <div className="text-sm text-black">{event.name}</div>
                      <div className="text-gray-600 ">
                        Event Type: {event.type}
                      </div>
                    </div>

                    {expandedEventIds.includes(event.id) && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className=" text-sm text-black">EMAIL</div>
                          <div className="text-blue-500">{event.email}</div>
                        </div>

                        <div>
                          <div className=" text-sm text-black">LOCATION</div>
                          <div className="text-gray-500 text-xs">
                            {event.location}{" "}
                            <a
                              href={event.joinNowLink}
                              className="text-blue-500"
                            >
                              Join now
                            </a>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-black">
                            INVITE TIME ZONE
                          </div>
                          <div className="text-gray-500 text-xs">
                            {event.timeZone}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-black">QUESTIONS</div>
                          <div className="text-gray-500 text-xs">
                            {event.questions}
                          </div>
                        </div>

                        <div>
                          <div className=" text-sm text-black">
                            MEETING HOST
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.meetingHost}
                          </div>
                          <div className="mt-2 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-gray-200  text-gray-500 flex items-center justify-center">
                              {event.hostInitial}
                            </span>
                          </div>
                        </div>

                        <div>
                          <a href="#" className="text-blue-500 text-sm">
                            Add meeting notes
                          </a>
                          <div className="text-xs text-gray-500">
                            (Only the host will see these)
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          {event.createdDate}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Hosts info and details button */}
                  <div className="w-1/6 flex flex-col items-end ">
                    <div className="text-sm text-gray-600">
                      {event.hosts.host} host | {event.hosts.nonHosts} non-hosts
                    </div>
                    <button
                      className="mt-1 text-sm text-gray-600 flex items-center"
                      onClick={() => toggleEventDetails(event.id)}
                    >
                      Details
                      {expandedEventIds.includes(event.id) ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
