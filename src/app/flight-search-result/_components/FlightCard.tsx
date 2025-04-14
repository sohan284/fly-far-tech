"use client";
import Image from "next/image";
import React, { useState } from "react";
import bs from "@/app/assets/BS.png";
import { IoAirplaneOutline, IoAirplaneSharp } from "react-icons/io5";

interface Flight {
  airline: string;
  airlineLogo: string;
  price: number;
  from: { code: string; name: string };
  to: { code: string; name: string };
  departureDate: string;
  flightType: string;
  flightClass: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  returnDate: string;
  returnArrivalTime: string;
  returnDepartureTime: string;
}

const FlightCard = ({ flight }: { flight: Flight }) => {
  console.log(flight);
  const [isReturnFlight, setIsReturnFlight] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
    })} ${date.getDate()} ${date.toLocaleDateString("en-US", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  return (
    <div className="relative mt-6 max-w-[1200px] mx-auto grid lg:grid-cols-5">
      <div className="lg:col-span-4 gap-4 bg-white rounded-xl p-3 border-dotted border-gray-300 border-b-2 lg:border-b-0 lg:border-r-2 h-[220px] grid grid-cols-10">
        <div className="col-span-2">
          <div className="w-12 h-12 border-2 border-red-500 rounded-full">
            <Image
              width={50}
              height={50}
              src={bs}
              alt={flight.airline}
              className="max-w-full max-h-full"
            />
          </div>

          <div className="text-sm font-medium my-10 mt-2 text-[#32d095]">
            {flight.airline}
          </div>
          <div className="mt-12">
            <div className="w-full flex items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="flex-1 h-px bg-gray-300 mx-1 relative">
                <div className="absolute -top-6 w-full text-center text-xs">
                  {flight?.duration}
                </div>
                <div className="absolute -bottom-6 w-full text-center text-xs uppercase">
                  NON STOP
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          {isReturnFlight ? (
            <div className="flex flex-col text-start text-gray-600">
              <div className="text-4xl font-medium text-[#32d095]">
                {flight.to?.code}
              </div>
              <div className="text-sm">{flight?.to?.name}</div>
              <div className="text-xs my-1 ">{flight?.returnDepartureTime}</div>
              <div className="text-xs text-[#32d095]">
                {formatDate(flight?.returnDate)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col text-start text-gray-600">
              <div className="text-4xl font-medium text-[#32d095]">
                {flight.from?.code}
              </div>
              <div className="text-sm">{flight?.from?.name}</div>
              <div className="text-xs my-1 ">{flight?.departureTime}</div>
              <div className="text-xs text-[#32d095]">
                {formatDate(flight?.departureDate)}
              </div>
            </div>
          )}
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <div className="flex flex-col justify-between h-full">
            <div>
              {flight.flightType == "roundWay" ? (
                <div className="text-[#32d095] relative ">
                  {isReturnFlight ? (
                    <div>
                      <div
                        onClick={() => setIsReturnFlight(false)}
                        className=" absolute  cursor-pointer"
                      >
                        <IoAirplaneOutline size={70} />
                      </div>
                      <div
                        className={`rotate-180 absolute top-10 left-2 cursor-pointer`}
                      >
                        <IoAirplaneSharp size={70} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className={`cursor-pointer`}>
                        <IoAirplaneSharp size={70} />
                      </div>
                      <div
                        onClick={() => setIsReturnFlight(true)}
                        className="rotate-180 absolute top-10 left-2 cursor-pointer"
                      >
                        <IoAirplaneOutline size={70} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[#32d095]">
                  <IoAirplaneSharp size={70} />
                </div>
              )}
            </div>
            <h1 className="mt-16 text-sm">Class-{flight?.flightClass}</h1>
          </div>
        </div>
        <div className="col-span-3">
          {isReturnFlight ? (
            <div className="flex flex-col text-end text-gray-600">
              <div className="text-4xl font-medium text-[#32d095]">
                {flight.to?.code}
              </div>
              <div className="text-sm">{flight?.from?.name}</div>
              <div className="text-xs my-1">{flight?.returnArrivalTime}</div>
              <div className="text-xs text-[#32d095]">
                {formatDate(flight?.returnDate)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col text-end text-gray-600">
              <div className="text-4xl font-medium text-[#32d095]">
                {flight.to?.code}
              </div>
              <div className="text-sm">{flight?.to?.name}</div>
              <div className="text-xs my-1">{flight?.arrivalTime}</div>
              <div className="text-xs text-[#32d095]">
                {formatDate(flight?.departureDate)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4 bg-white rounded-xl p-6 col-span-1"></div>
    </div>
  );
};

export default FlightCard;
