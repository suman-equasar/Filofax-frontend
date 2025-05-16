import React, { useState } from "react";
import { ChevronDown, ChevronLeft, X } from "lucide-react";


const DurationSelector = ({ onDurationChange, initialDuration = 15 }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleOptionClick = (value) => {
    setDuration(value);
    if (onDurationChange) onDurationChange(value);
    setShowOptions(false);
    setShowCustomInput(false);
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
    setShowOptions(false);
  };

  const handleCustomSubmit = () => {
    const value = parseInt(customValue);
    if (!isNaN(value) && value >= 1 && value <= 30) {
      setDuration(value);
      if (onDurationChange) onDurationChange(value);
      setShowCustomInput(false);
    } else {
      alert("Please enter a valid duration between 1 and 30 minutes");
    }
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input
    if (value === "" || /^\d+$/.test(value)) {
      // Limit to max 30
      const numValue = parseInt(value);
      if (value === "" || (numValue >= 0 && numValue <= 30)) {
        setCustomValue(value);
      }
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    if (showCustomInput) setShowCustomInput(false);
  };

  return (
    <div className="w-full">
      {/* Duration selector */}
      <div
        className="flex justify-between items-center py-8 cursor-pointer"
        onClick={toggleOptions}
      >
        <div>
          <p className="text-sm font-semibold text-black">Duration</p>
          <p className="text-xs text-gray-500 mt-1">{duration} min</p>
        </div>
        <span className="text-black font-light text-lg">
          {showOptions ? <ChevronDown size={24} /> : <ChevronLeft size={24} />}
        </span>
      </div>

      {/* Duration options */}
      {showOptions && (
        <div className="py-4 pt-2 bg-white">
          <div className="flex  flex-wrap gap-2">
            {[10,15, 20, 30].map((value) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-xl border ${
                  duration === value
                    ? "border-lime-500 bg-lime-50"
                    : "border-[#A4CC02]"
                }`}
                onClick={() => handleOptionClick(value)}
              >
                {value} min
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-xl border border-[#A4CC02]"
              onClick={handleCustomClick}
            >
              Custom
            </button>
          </div>
        </div>
      )}

      {/* Border line after options */}
      <div className="border-b pb-2 border-[#0F575C2B]"></div>

      {/* Custom duration input */}
      {showCustomInput && (
        <div className="py-4 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="30"
              className="border border-gray-200 rounded-md px-3 py-2 w-24"
              placeholder="1-30"
              value={customValue}
              onChange={handleCustomInputChange}
            />
            <span className="text-gray-500">min</span>
            <button
              className="ml-2 bg-lime-200 hover:bg-lime-300 px-4 py-2 rounded-md"
              onClick={handleCustomSubmit}
            >
              Apply
            </button>
            <button
              className="ml-auto"
              onClick={() => setShowCustomInput(false)}
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Duration must be between 1 and 30 minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default DurationSelector;
