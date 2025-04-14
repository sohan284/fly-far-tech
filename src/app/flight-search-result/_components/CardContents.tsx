"use client";
import Image from "next/image";
import React, { useState } from "react";
import bs from "@/app/assets/BS.png";
import bg from "@/app/assets/BG.png";
import ek from "@/app/assets/EK.png";
import ku from "@/app/assets/KU.png";
import qr from "@/app/assets/QR.png";
import { IoAirplaneOutline, IoAirplaneSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
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
const CardContents = ({ flight }: { flight: Flight }) => {
  const [isReturnFlight, setIsReturnFlight] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return formatter.format(date);
  };

  const handleFlightToggle = (value: boolean) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsReturnFlight(value);
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 100);
  };

  const zoomVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };
  return (
    <div className="grid grid-cols-10">
      <div className="col-span-2 flex justify-between flex-col h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`to-${isReturnFlight}`}
            initial="hidden"
            animate={isAnimating ? "hidden" : "visible"}
            exit="exit"
            variants={zoomVariants}
          >
            <div className="w-12 h-12 border-2 border-red-500 rounded-full">
              <Image
                width={50}
                height={50}
                src={
                  flight.airline === "US-Bangla Airlines"
                    ? bs
                    : flight.airline === "Emirates"
                    ? ek
                    : flight.airline === "Qatar Airways"
                    ? qr
                    : flight.airline === "Novoair"
                    ? ku
                    : bg
                }
                alt={flight.airline}
                className="max-w-full max-h-full"
              />
            </div>

            <div className="text-sm font-medium my-10 mt-2 text-[#32d095]">
              {flight.airline}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="text-xs text-center text-gray-600">
          <p className="mb-1">{flight?.duration}</p>
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 bg-gray-800 rounded-full"></div>
            <div className="h-px bg-gray-400 flex-1"></div>
            <div className="h-2 w-2 bg-gray-800 rounded-full"></div>
          </div>
          <p className="mt-1 uppercase">NON STOP</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          className="col-span-3"
          key={`from-${isReturnFlight}`}
          initial="hidden"
          animate={isAnimating ? "hidden" : "visible"}
          exit="exit"
          variants={zoomVariants}
        >
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
        </motion.div>
      </AnimatePresence>
      <div className="col-span-2 flex justify-center items-center">
        <div className="flex flex-col justify-between h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`to-${isReturnFlight}`}
              initial="hidden"
              animate={isAnimating ? "hidden" : "visible"}
              exit="exit"
              variants={zoomVariants}
            >
              {flight.flightType == "roundWay" ? (
                <div className="text-[#32d095] relative ">
                  {isReturnFlight ? (
                    <div>
                      <div
                        onClick={() => handleFlightToggle(false)}
                        className="absolute cursor-pointer"
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
                        onClick={() => handleFlightToggle(true)}
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
            </motion.div>
          </AnimatePresence>
          <h1 className="mt-16 text-sm text-gray-600">
            Class-{flight?.flightClass}
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          className="col-span-3"
          key={`to-${isReturnFlight}`}
          initial="hidden"
          animate={isAnimating ? "hidden" : "visible"}
          exit="exit"
          variants={zoomVariants}
        >
          {isReturnFlight ? (
            <div className="flex flex-col text-end text-gray-600">
              <div className="text-4xl font-medium text-[#32d095]">
                {flight.from?.code}
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CardContents;
