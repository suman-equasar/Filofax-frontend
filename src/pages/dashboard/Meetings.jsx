import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Calendar, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Menu } from "lucide-react";
import { extractTokenFromCookie } from "../../utils/auth";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// helper function to decode the JWT and extract the userId from token
const getUserIdFromToken = () => {
  const { token } = extractTokenFromCookie(); // extract the token from cookies
  if (!token) return null;

  try {
    // const payload = JSON.parse(atob(token.split(".")[1]));
    // JWT uses base64url encoding, so we need to replace '-' with '+' and '_' with '/'
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    console.log("Decoded the token payload : ", payload);
    return payload.userId || payload.id || null; // adjust how backend assign the token
  } catch (error) {
    console.log("Invalid token error : ", error);
    return null;
  }
};

// helper function to format HH:MM:SS to 12hr format
const formatTime = (timeStr) => {
  const [h, m, s] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, s);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }); // it return the date into 12 hr format
};

export default function Meetings() {
  const [meeting, setMeeting] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toggleSidebar, isMobile } = useOutletContext();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [expandedEventIds, setExpandedEventIds] = useState([]);
  const [events, setEvents] = useState([]);
  const hostId = getUserIdFromToken(); // get userId and assign to hostId

  useEffect(() => {
    if (!hostId) return;

    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const meetingTabUrl = import.meta.env.VITE_BOOKING_URL;
        const response = await axios.get(
          `${meetingTabUrl}/meetings/?tab=${activeTab.toLowerCase()}&hostId=${hostId}`
        );
        setMeeting(response.data || []);
        setEvents(response.data);
      } catch (error) {
        console.error("Error while fetching the meetings : ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, [activeTab, hostId]);

  const toggleEventDetails = (eventId) => {
    setExpandedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Mock data for meetings
  // const events = [
  //   {
  //     id: "event1",
  //     date: "Friday, 16 May 2025",
  //     isToday: true,
  //     time: "3PM - 5:30PM",
  //     name: "Event Name",
  //     type: "One-on-One meeting",
  //     hosts: { host: 1, nonHosts: 0 },
  //     email: "webstock44@gmail.com",
  //     location: "This is a Google Meet web conference",
  //     joinNowLink: "#",
  //     timeZone: "PDT Standard Time",
  //     questions:
  //       "Please share anything that will help prepare for our meeting.",
  //     meetingHost: "Host will attend this meeting",
  //     hostInitial: "A",
  //     createdDate: "Created 16 May 2025",
  //   },
  //   {
  //     id: "event2",
  //     date: "Friday, 23 May 2025",
  //     isToday: false,
  //     time: "3PM - 5:30PM",
  //     name: "Event Name",
  //     type: "One-on-One meeting",
  //     hosts: { host: 1, nonHosts: 0 },
  //   },
  //   {
  //     id: "event3",
  //     date: "Friday, 23 May 2025",
  //     isToday: false,
  //     time: "3PM - 5:30PM",
  //     name: "Event Name",
  //     type: "One-on-One meeting",
  //     hosts: { host: 1, nonHosts: 0 },
  //   },
  // ];

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.bookingDate).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  if (!hostId) {
    return (
      <div className="p-4 text-red-500">
        You must be logged in to view your meetings.
      </div>
    );
  }

  const handleExportZip = async () => {
    if (meeting.length === 0) {
      alert("No meetings to export!");
      true;
    }
    const zip = new JSZip();

    const headers = [
      "#",
      "Event Title",
      "Host Name",
      "Host Email",
      "Attendee Name",
      "Attendee Email",
      "Meeting Link",
      "Booking Date",
      "Start Time",
      "End Time",
      "Status",
      "Attendee Notes",
    ];

    const rows = meeting.map((event, index) => {
      const title = event.EventType?.title || "";
      const hostName = event.EventType?.hostName || "";
      const hostEmail = event.EventType?.hostEmail || "";

      return [
        index + 1,
        `"${title}"`,
        `"${hostName}"`,
        `"${hostEmail}"`,
        `"${event.attendeeName}"`,
        `"${event.attendeeEmail}"`,
        `"${event.meetingLink}"`,
        event.bookingDate,
        event.startTime,
        event.endTime,
        event.status,
        `"${event.attendee_notes || ""}"`,
      ];
    });
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    zip.file("meetings.csv", csvContent);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "meetings.zip");
  };
  return (
    <div className=" max-w-7xl p-4 ">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-11 mb-12 ">
        <h1 className="text-2xl text-[#000000] font-normal">Meetings</h1>
        <span className="text-gray-500">
          Displaying {events.length} of {events.length} Events
        </span>
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
          <button
            onClick={handleExportZip}
            className="flex items-center px-4 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Meeting listings */}
      <div className="mt-8 border-2 border-[#0F575C1A] rounded-lg">
        {Object.entries(eventsByDate).map(([date, dateEvents]) => (
          <div key={date} className="mb-4">
            {/* <div
              className={`p-3 ${
                dateEvents[0].isToday ? "bg-[#0F575C2B]" : "bg-[#0F575C2B]"
              }`}
            > */}
            <div className={`p-3 bg-[#0F575C2B]`}>
              <div className="flex justify-between items-center">
                <span className="font-light">{date}</span>
                {/* {dateEvents[0].isToday && ( */}
                {new Date(date).toDateString() ===
                  new Date().toDateString() && (
                  <span className="font-medium">TODAY</span>
                )}
              </div>
            </div>

            {dateEvents.map((event) => (
              <div key={event.id} className="border-b">
                <div className="p-8 flex">
                  {/* Time column */}
                  <div className="w-1/6">
                    <div className="text-gray-700">
                      {formatTime(event.startTime)} -{" "}
                      {formatTime(event.endTime)}
                    </div>

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
                      <div className="text-sm text-black">
                        {event.EventType?.title || event.title}
                      </div>
                      <div className="text-gray-600 ">
                        Event Type: {event.EventType?.eventType || "One-on-One"}
                      </div>
                    </div>

                    {expandedEventIds.includes(event.id) && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className=" text-sm text-black">EMAIL</div>
                          <div className="text-blue-500">
                            {event.attendeeEmail}
                          </div>
                        </div>

                        <div>
                          <div className=" text-sm text-black">LOCATION</div>
                          <div className="text-gray-500 text-xs">
                            {event.location}{" "}
                            <a
                              href={event.meetingLink}
                              className="text-blue-500"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Join now
                            </a>
                          </div>
                        </div>

                        {/* <div>
                          <div className="text-sm text-black">
                            INVITE TIME ZONE
                          </div>
                          <div className="text-gray-500 text-xs">
                            {event.timeZone}
                          </div>
                        </div> */}

                        <div>
                          <div className="text-sm text-black">QUESTIONS</div>
                          <div className="text-gray-500 text-xs">
                            {event.attendee_notes}
                          </div>
                        </div>

                        <div>
                          <div className=" text-sm text-black">
                            MEETING HOST
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.User?.name}
                          </div>
                          <div className="mt-2 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-gray-200  text-gray-500 flex items-center justify-center">
                              {event.User?.name?.charAt(0)}
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
                          Created {new Date(event.createdAt).toDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Hosts info and details button */}
                  <div className="w-1/6 flex flex-col items-end ">
                    {/* <div className="text-sm text-gray-600">
                      {event.host}1 host | {event.hosts.nonHosts} 0
                      non-hosts
                    </div> */}
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
