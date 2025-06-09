import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import EventCard from "../../components/EventCard";
import CreateEvent from "../../components/CreateEvent";
import EventDetailDrawer from "../../components/eventDrawer/EventDetailDrawer";
import { extractTokenFromCookie } from "../../utils/auth";
import axios from "axios";

// Sample event data - normally would come from API
// const initialEvents = [
//   {
//     id: 1,
//     title: "30 Min Meeting",
//     path: "/asif-khan-tm5thr/30min",
//     isActive: true,
//   },
// ];

const EventTypes = () => {
  const { toggleSidebar } = useOutletContext();
  // const [events, setEvents] = useState(initialEvents);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const dashboardBaseUrl = import.meta.env.VITE_DASHBOARD_URL;
  const [loading, setLoading] = useState(true);
  const { token, access_token, refresh_token } = extractTokenFromCookie(); // extract token details from cookies

  console.log(`Token in eventType page : ${token}`);
  console.log(`Access Token in eventType page : ${access_token}`);
  console.log(`Refresh Token in eventType page : ${refresh_token}`);
  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const closeDrawer = () => {
    setSelectedEvent(null);
  };

  const handleToggleActive = (eventId, isActive) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, isActive } : event
      )
    );
    console.log(
      `API call to update event ${eventId} to ${
        isActive ? "active" : "inactive"
      }`
    );
  };

  const handleCreateNewEvent = () => {
    const newId = events.length + 1;
    const newEvent = {
      id: newId,
      title: "One-on-One Meeting",
      path: `/new-event-${newId}`,
      isActive: false,
    };
    setEvents([...events, newEvent]);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${dashboardBaseUrl}/getAll-dashboard-event`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched events from api :", response.data.events);
        setEvents(response.data.events);
      } catch (error) {
        console.error("Failed to fetch the events from api ", error);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <>
      {/* Header with CreateEvent component */}
      <div className="lg:pr-28">
        <CreateEvent
          toggleSidebar={toggleSidebar}
          onCreateNewEvent={handleCreateNewEvent}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-8"></div>
          {loading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">No events found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onToggleActive={handleToggleActive}
                  onClick={() => handleCardClick(event)}
                  isSelected={selectedEvent?.id === event.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Event Detail Drawer */}
      {selectedEvent && (
        <EventDetailDrawer
          event={selectedEvent}
          onClose={closeDrawer}
          onToggleActive={handleToggleActive}
        />
      )}
    </>
  );
};

export default EventTypes;
