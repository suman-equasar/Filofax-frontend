// Updated Dashboard.jsx - Fixed token handling
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import CreateEvent from "../../components/CreateEvent";
import EventCard from "../../components/EventCard";
import EventDetailDrawer from "../../components/eventDrawer/EventDetailDrawer";
import Meetings from "./Meetings";
import Availability from "./Availability";
import { setAuthToken, isAuthenticated } from "../../utils/auth";

// Sample event data - normally would come from API
const initialEvents = [
  {
    id: 1,
    title: "30 Min Meeting",
    path: "/asif-khan-tm5thr/30min",
    isActive: true,
  },
];

const Dashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(initialEvents);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from query string and store it properly
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      setAuthToken(token); // Use the unified auth method
      navigate("/dashboard", { replace: true }); // Clean URL
    }
  }, [location, navigate]);

  // Page check
  const isEventTypePage =
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard/event-type";

  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const closeDrawer = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const EventTypeContent = () => (
    <>
      <div className="mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleActive={handleToggleActive}
            onClick={() => handleCardClick(event)}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "lg:ml-[230px]" : ""
        }`}
      >
        {isEventTypePage && (
          <div className="lg:pr-28">
            <CreateEvent
              toggleSidebar={toggleSidebar}
              onCreateNewEvent={handleCreateNewEvent}
            />
          </div>
        )}

        <main className="flex-1 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/dashboard/event-type" replace />}
              />
              <Route path="/event-type" element={<EventTypeContent />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/availability" element={<Availability />} />
            </Routes>
          </div>
        </main>
      </div>

      {selectedEvent && (
        <EventDetailDrawer
          event={selectedEvent}
          onClose={closeDrawer}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
};

export default Dashboard;
