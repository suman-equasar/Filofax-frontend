import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import UserProfile from "./ProfileSection/UserProfile";
import DashboardLayout from "./layouts/DashboardLayout";
import EventTypes from "./pages/dashboard/EventTypes";
import Meetings from "./pages/dashboard/Meetings";
import Availability from "./pages/dashboard/Availability";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleCallback from "./pages/auth/GoogleCallback";
import { Book } from "lucide-react";
import Booking from "./user/BookingDetails/Booking";
import Time from "./user/BookingDetails/Time";
import UserDetail from "./user/BookingDetails/UserDetail";
import Schedule from "./user/BookingDetails/Schedule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Google Callback route for the dashboard redirection */}

        <Route path="/google/callback" element={<GoogleCallback />} />

        {/* Dashboard Routes with Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route
            index
            element={<Navigate to="/dashboard/event-types" replace />}
          />

          {/* Child routes that will render in the outlet */}
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="event-types" element={<EventTypes />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="availability" element={<Availability />} />
        </Route>

        {/* User Profile */}
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>

    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Booking />} />
    //     <Route path="/user-detail" element={<UserDetail />} />
    //     <Route path="/user-schedule" element={<Schedule />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
