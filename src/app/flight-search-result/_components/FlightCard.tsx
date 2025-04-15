import React from "react";
import FlightDetails from "./FlightDetails";
import CardContents from "./CardContents";

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
  passengers: {
    adult: number | null;
    child: number | null;
    infant: number | null;
  };
}

interface FlightCardProps {
  flight: Flight;
  totalPassengers: number;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, totalPassengers }) => {
  return (
    <div className=" mt-4 max-w-[1200px] mx-auto grid lg:grid-cols-5">
      <div className="lg:col-span-4 gap-4 bg-white rounded-xl p-3 border-dotted border-gray-300 border-b-2 lg:border-b-0 lg:border-r-2 h-[220px] ">
        <CardContents flight={flight} />
      </div>
      <div className="flex flex-row lg:flex-col justify-between gap-4 bg-white rounded-xl p-6 col-span-1">
        <div className="text-right text-[#32d095]">
          <h2 className="text-3xl  font-medium">৳ {flight?.price}</h2>
          <h2 className="line-through text-sm ">৳ {flight?.price * 1.2}</h2>
        </div>
        <div className="text-right text-sm">
          <button className=" bg-gray-600 text-zinc-200 px-3 py-1 rounded-full">
            BOOK NOW
          </button>
          <p className=" mt-3 text-gray-600 text-xs cursor-pointer flex justify-end ">
            <FlightDetails flight={flight} totalPassengers={totalPassengers} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
