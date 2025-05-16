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
  Cookies.remove("token");
  localStorage.removeItem("token");
};
