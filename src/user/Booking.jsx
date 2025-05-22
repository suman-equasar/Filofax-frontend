import React from "react";
import logo from "../assets/logo.svg";
import { GoClock } from "react-icons/go";

const Booking = () => {
  return (
    <div className="container mx-auto px-8 py-8 flex flex-col items-center justify-center">
      <img src={logo} alt="logo" className="w-12 h-12 mb-2" />
      <span className="text-md font-bold text-center text-gray-400 mb-2">
        ACMC Inc.
      </span>
      <h1 className="text-2xl font-bold text-center mb-4"> Product Demo </h1>
      <div>
        <GoClock />
        <span className="text-sm font-bold text-gray-400 ml-2">30 minutes</span>
      </div>
    </div>
  );
};

export default Booking;
