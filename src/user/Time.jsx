import React from "react";

const Time = ({ isOpen, onClose, date, events }) => {
  return (
    <div
      className={`absolute top-0 right-0 w-40 h-full bg-white shadow-lg border-l transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-lg">Events on {date}</h2>
        <button onClick={onClose}>❌</button>
      </div>

      <div className="p-4 space-y-3">
        {events.length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="border p-2 rounded">
              <p className="font-semibold">{event.time}</p>
              <p>{event.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Time;
