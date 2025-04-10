"use client";

import banner from "@/app/assets/banner.webp";
import React, { useState } from "react";
import SharedSelect from "./_components/SharedSelect";
import SharedRadioGroup from "./_components/SharedRadioGroup";
import FilterTabs from "./_components/FilterTabs";
import AirportSearch from "./_components/AirportSearch";
import { Airport } from "./data/airports";
import { IoAirplaneOutline, IoAirplaneSharp } from "react-icons/io5";
import DateCalender from "./_components/DateCalender";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [infant, setInfant] = useState(0);
  const [flightClass, setFlightClass] = useState("Economy");
  const [selectedFlight, setSelectedFlight] = useState("roundWay");
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFlight(event.target.value);
  };

  const radioOptions = [
    { value: "roundWay", label: "ROUND-WAY" },
    { value: "oneWay", label: "ONE-WAY" },
    { value: "multiCity", label: "MULTI-CITY" },
  ];

  return (
    <div className="px-5 mt-10">
      {/* Banner Section */}
      <div
        className="max-w-[1620px] mx-auto rounded-lg relative p-8"
        style={{
          backgroundImage: `url(${banner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black rounded-lg opacity-10"></div>

        {/* Tabs Section */}
        <div className="relative">
          <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Search Section */}
        <div className="relative mt-6 max-w-[1200px] mx-auto grid lg:grid-cols-3">
          {/* Left Section */}
          <div className="lg:col-span-2 gap-4 bg-white rounded-xl p-5 border-dotted border-gray-300 border-b-2 lg:border-b-0 lg:border-r-2">
            <SharedRadioGroup
              value={selectedFlight}
              onChange={handleRadioChange}
              options={radioOptions}
            />
            <div className="grid grid-cols-7 gap-4 mt-4">
              <div className="lg:col-span-3 col-span-7">
                <AirportSearch
                  label="FROM"
                  value={fromAirport}
                  onChange={setFromAirport}
                />
                <div className="mt-3">
                  <DateCalender
                    selectedDate={departureDate}
                    setSelectedDate={setDepartureDate}
                  />
                </div>
              </div>
              <div className=" text-[#32d095] relative hidden lg:block col-span-1">
                <div>
                  <IoAirplaneSharp size={70} />
                </div>
                <div className="rotate-180 absolute top-10 left-2">
                  <IoAirplaneOutline size={70} />
                </div>
              </div>
              <div className="lg:col-span-3 col-span-7">
                <AirportSearch
                  label="TO"
                  value={toAirport}
                  onChange={setToAirport}
                />
                <div className="mt-3">
                  <DateCalender
                    selectedDate={returnDate}
                    setSelectedDate={setReturnDate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-between gap-4 bg-white rounded-xl p-6 col-span-1">
            {/* Passengers */}
            <div>
              <div className="grid grid-cols-3 gap-4">
                <SharedSelect
                  label="ADULT"
                  options={[1, 2, 3, 4, 5]}
                  value={adult}
                  onChange={setAdult}
                />
                <SharedSelect
                  label="CHILD"
                  options={[0, 1, 2, 3, 4]}
                  value={child}
                  onChange={setChild}
                />
                <SharedSelect
                  label="INFANT"
                  options={[0, 1, 2]}
                  value={infant}
                  onChange={setInfant}
                />
              </div>
              <div className="mt-4">
                <select
                  value={flightClass}
                  onChange={(e) => setFlightClass(e.target.value)}
                  className="bg-[#d7e7f4] text-sm rounded-sm p-2 w-full text-gray-500"
                >
                  {[
                    "Economy",
                    "Premium Economy",
                    "Business",
                    "Premium Business",
                    "First Class",
                    "Premium First Class",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button className="w-full bg-[#32d095] text-white font-bold py-2 text-sm rounded-sm cursor-pointer">
              SEARCH FOR FLIGHT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
