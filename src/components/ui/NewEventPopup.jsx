import React from "react";

const NewEventPopup = ({ onCreateNewEvent }) => {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-4 shadow-lg w-80">
      <div
        onClick={onCreateNewEvent}
        className="border border-[#A4CC02] rounded-xl p-4 bg-[#F7FEE7] shadow cursor-pointer hover:shadow-md transition"
      >
        <h3 className="font-bold text-black">One-on-One</h3>
        <p className="text-sm text-black">1 host - 1 invitee</p>
        <p className="text-sm text-black">
          Good for coffee chats, 1:1 interviews, etc.
        </p>
      </div>
    </div>
  );
};


export default NewEventPopup;
