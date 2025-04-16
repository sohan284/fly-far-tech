import React from "react";
import { MdFlight } from "react-icons/md";
import { RiHotelLine } from "react-icons/ri";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";

interface FilterTabsProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}
const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 0, label: "FLIGHT", icon: <MdFlight size={20} /> },
    { id: 1, label: "HOTEL", icon: <RiHotelLine size={20} /> },
    { id: 2, label: "TOUR", icon: <TravelExploreIcon sx={{ fontSize: 20 }} /> },
    {
      id: 3,
      label: "VISA",
      icon: <AirplaneTicketIcon sx={{ fontSize: 20 }} />,
    },
  ];
  return (
    <div className="bg-white p-2 mb-6 rounded-full max-w-[600px] mx-auto grid grid-cols-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`cursor-pointer text-[10px] lg:text-[16px] px-6 py-2 rounded-full flex flex-wrap justify-center items-center gap-3 font-bold transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-[#32d095] text-white"
              : "bg-transparent text-[#32d095]"
          }`}
        >
          <span
            className={`${
              activeTab === tab.id
                ? "bg-[#32d095] text-white"
                : "bg-transparent text-[#525371]"
            }`}
          >
            {tab.icon}
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
