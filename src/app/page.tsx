"use client";

import banner from "@/app/assets/banner.webp";
import React, { useState } from "react";
import { MdFlight } from "react-icons/md";
import { RiHotelLine } from "react-icons/ri";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "FLIGHT", icon: <MdFlight size={20} /> },
    { id: 1, label: "HOTEL", icon: <RiHotelLine size={20} /> },
    {
      id: 2,
      label: "TOUR",
      icon: <TravelExploreIcon sx={{ fontSize: 20 }} />,
    },
    {
      id: 3,
      label: "VISA",
      icon: <AirplaneTicketIcon sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <div className="px-5 mt-10">
      <div
        className="max-w-[1400px] mx-auto rounded-xl h-72 lg:h-96 relative overflow-hidden"
        style={{
          backgroundImage: `url(${banner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative pt-6">
          <div className="bg-white rounded-full max-w-[600px] mx-auto p-2 flex justify-between">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer px-6 py-2 rounded-full flex items-center gap-3 font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#32d095] text-white"
                    : "bg-transparent text-[#32d095]"
                }`}
              >
                <span
                  className={`text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-[#32d095] text-white"
                      : "bg-transparent text-[#525371]"
                  }`}
                >
                  {tab.icon}
                </span>{" "}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
