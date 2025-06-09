import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, clearAuthToken } from "../utils/auth";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for inconsistent state (has one storage method but not the other)
    const cookieToken = Cookies.get("token");
    const localToken = localStorage.getItem("token");

    // Log the current state for debugging
    console.log("Protected Route Check:", {
      path: location.pathname,
      cookieExists: !!cookieToken,
      localStorageExists: !!localToken,
    });

    // If one exists but not the other, clear both to be safe
    // This ensures consistency when user manually clears cookies
    if ((cookieToken && !localToken) || (!cookieToken && localToken)) {
      console.log("Inconsistent token state detected, clearing both storages");
      clearAuthToken();
      setIsAuth(false);
    } else {
      // Normal check
      setIsAuth(isAuthenticated());
    }

    setLoading(false);
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    console.log(
      "User not authenticated. Redirecting to login from:",
      location.pathname
    );
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  console.log("User is authenticated. Rendering protected content.");
  return children;
};

export default ProtectedRoute;
