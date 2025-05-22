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
import Booking from "./user/Booking";

function App() {
  return (
    //   <BrowserRouter>
    //     <Routes>
    //       {/* Public Routes */}
    //       <Route path="/" element={<Login />} />
    //       <Route path="/signup" element={<Signup />} />

    //       {/* Dashboard Routes with Layout */}
    //       <Route
    //         path="/dashboard"
    //         element={
    //           <ProtectedRoute>
    //             <DashboardLayout />
    //           </ProtectedRoute>
    //         }
    //       >
    //         {/* Default redirect */}
    //         <Route
    //           index
    //           element={<Navigate to="/dashboard/event-types" replace />}
    //         />

    //         {/* Child routes that will render in the outlet */}
    //         <Route path="user-profile" element={<UserProfile />} />
    //         <Route path="event-types" element={<EventTypes />} />
    //         <Route path="meetings" element={<Meetings />} />
    //         <Route path="availability" element={<Availability />} />
    //       </Route>

    //       {/* User Profile */}
    //       <Route
    //         path="/user-profile"
    //         element={
    //           <ProtectedRoute>
    //             <UserProfile />
    //           </ProtectedRoute>
    //         }
    //       />

    //       {/* Catch-all route for 404 */}
    //       <Route path="*" element={<Navigate to="/" replace />} />
    //     </Routes>
    //   </BrowserRouter>
    // );
    <Booking />
  );
}

export default App;
