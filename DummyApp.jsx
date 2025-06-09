import { useState, useRef } from "react";
import { User, Mail, Phone, Calendar, Camera, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function UserProfilesss() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    dob: "",
    email: "user@example.com", // Pre-filled email (disabled)
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show success message
    setIsSaved(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);

    console.log("Profile data:", profile);
    console.log("Profile image:", profileImage);
  };

  const userDetails = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    if (userDetails) {
      setProfile({
        name: userDetails.name || "",
        phone: userDetails.phone || "",
        dob: userDetails.dob || "",
        email: userDetails.email || "user@example.com",
      });
    }
  }, [userDetails]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#A4CC00] p-6 text-white text-center">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-blue-100">Complete your profile information</p>
        </div>

        {/* Success notification */}
        {isSaved && (
          <div className="mx-6 mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
            <Check size={20} className="mr-2" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            <div
              onClick={triggerFileInput}
              className="relative cursor-pointer group w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-purple-200 overflow-hidden hover:border-purple-300 transition-all duration-300"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-gray-400" />
              )}

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                <Camera
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <p className="mt-2 text-sm text-purple-600 font-medium">
              Click to upload photo
            </p>
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* DOB Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                id="dob"
                name="dob"
                type="date"
                value={profile.dob}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Email Field (Disabled) */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                className="pl-10 w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Email address is provided by the system
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
