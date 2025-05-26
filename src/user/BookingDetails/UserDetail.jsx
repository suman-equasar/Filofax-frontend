import React, { useState } from "react";
import { Clock, Video, ArrowLeft, Calendar, Earth } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]{2,}$/;
    return regex.test(name);
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      setErrors((prev) => ({
        ...prev,
        name: validateName(value) ? "" : "Please enter a valid name.",
      }));
    }

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Please enter a valid email.",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isNameValid = validateName(formData.name);
    const isEmailValid = validateEmail(formData.email);

    if (!isNameValid || !isEmailValid) {
      setErrors({
        name: isNameValid ? "" : "Please enter a valid name.",
        email: isEmailValid ? "" : "Please enter a valid email.",
      });
      return;
    }

    // If valid, navigate
    navigate("/user-schedule");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="flex items-center mb-4">
            <ArrowLeft />
          </div>
          <span className="text-sm font-medium text-gray-600">ACME Inc.</span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Ok
          </h1>
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <Clock size={18} className="mr-3" />
              <span className="text-sm">15 min</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Video size={18} className="mr-3" />
              <span className="text-sm">
                Web conferencing details provided upon confirmation.
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-3" />
              <span className="text-sm">
                9:30 AM - 9:45 AM, Friday, May 26, 2025.
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Earth size={18} className="mr-3" />
              <span className="text-sm">India Standard Time</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Enter Details
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.name ? "focus:ring-red-400" : "focus:ring-blue-500"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-400" : "focus:ring-blue-500"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Add Guests */}
            <div>
              <button
                type="button"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition"
              >
                Add Guests
              </button>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Please share anything that will help prepare for our meeting.
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional details"
              ></textarea>
            </div>

            {/* Agreement */}
            <p className="text-sm text-gray-600">
              By proceeding, you confirm that you have read and agree to{" "}
              <a
                href="#"
                className="text-blue-600 font-semibold hover:underline"
              >
                Calendly’s Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 font-semibold hover:underline"
              >
                Privacy Notice.
              </a>
            </p>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Schedule Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
