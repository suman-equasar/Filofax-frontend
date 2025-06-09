import Cookies from "js-cookie";

export const isAuthenticated = () => {
  // Check both localStorage and Cookies for compatibility
  const cookieToken = Cookies.get("token");
  const localToken = localStorage.getItem("token");

  // For debugging
  console.log("Auth check - Cookie token exists:", !!cookieToken);
  console.log("Auth check - Local Storage token exists:", !!localToken);

  // We need BOTH to be present or BOTH to be absent for consistent behavior
  // Return true only if at least one token source exists
  return !!(cookieToken || localToken);
};

export const setAuthToken = (token) => {
  console.log("Setting auth token...");
  if (token) {
    // Store token in both places to ensure compatibility
    Cookies.set("token", token, { path: "/" });
    localStorage.setItem("token", token);
    console.log("Token stored in both cookie and localStorage");
    return true;
  }
  return false;
};

export const clearAuthToken = () => {
  console.log("Clearing auth tokens from both cookie and localStorage");
  /* from here to */
  Cookies.remove("token", { path: "/" });
  localStorage.removeItem("token");

  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("refresh_token", { path: "/" });

  localStorage.clear(); // clear all localStorage
  /*till here */
};

export const extractTokenFromCookie = () => {
  const token = Cookies.get("token");
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");
  const zoom_access_token = Cookies.get("zoom_access_token");

  return {
    token: token || null,
    access_token: accessToken || null,
    refresh_token: refreshToken || null,
    zoom_access_token: zoom_access_token || null,
  };
};
