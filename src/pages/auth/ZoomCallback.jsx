import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ZoomCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleZoomCallback = async () => {
      try {
        // Get the authorization code from URL params
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          throw new Error(`Zoom authorization failed: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received from Zoom");
        }

        // Parse the state parameter to get the return URL and event ID
        let returnPath = "/dashboard/event-types";
        let eventId = null;

        if (state) {
          try {
            const stateData = JSON.parse(decodeURIComponent(state));
            returnPath = stateData.returnPath || returnPath;
            eventId = stateData.eventId || null;
          } catch (e) {
            console.warn("Could not parse state parameter:", e);
          }
        }

        // Send the authorization code to your backend
        const zoombaseUrl = import.meta.env.VITE_ZOOM_BASE_URL;
        const response = await axios.post(
          "/api/zoom/callback",
          {
            code,
            state,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth implementation
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to process Zoom authorization");
        }

        const result = await response.json();

        // Show success message or handle the result
        console.log("Zoom integration successful:", result);

        // Navigate back to the event detail drawer or specified return path
        if (eventId) {
          navigate(`/dashboard/event/${eventId}`, {
            state: {
              message: "Zoom integration successful!",
              type: "success",
            },
          });
        } else {
          navigate(returnPath, {
            state: {
              message: "Zoom integration successful!",
              type: "success",
            },
          });
        }
      } catch (err) {
        console.error("Zoom callback error:", err);
        setError(err.message);

        // Navigate back to dashboard with error message after 3 seconds
        setTimeout(() => {
          navigate("/dashboard/event-types", {
            state: {
              message: `Zoom integration failed: ${err.message}`,
              type: "error",
            },
          });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleZoomCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing Zoom integration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold text-lg mb-2">Integration Failed</h2>
            <p>{error}</p>
          </div>
          <p className="text-gray-600">Redirecting back to dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ZoomCallback;
