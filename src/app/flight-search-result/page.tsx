"use client";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import flights from "../data/flights";
import Image from "next/image";
import { PiAirplaneTiltFill } from "react-icons/pi";
const FlightSearchResultPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [sortBy, setSortBy] = useState("cheapest");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [filters, setFilters] = useState({
    refundable: false,
    nonRefundable: false,
    nonStop: false,
    oneStop: false,
    onePlusStops: false,
  });

  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const encryptedData = localStorage.getItem("searchData");
      if (encryptedData) {
        const secretKey = "fly-far-tech";
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setSearchData(decryptedData);

        const normalizedDepartureDate = normalizeDate(
          decryptedData.departureDate
        );
        const normalizedReturnDate = decryptedData.returnDate
          ? normalizeDate(decryptedData.returnDate)
          : null;

        const matchingFlights = flights.filter((flight) => {
          const isType = flight.flightType === decryptedData.selectedFlight;
          const isFromMatch =
            flight.from.code === decryptedData.fromAirport?.code;
          const isToMatch = flight.to.code === decryptedData.toAirport?.code;
          const isDepartureDateMatch =
            normalizeDate(flight.departureDate) === normalizedDepartureDate;
          const isReturnDateMatch =
            decryptedData.selectedFlight === "roundWay"
              ? normalizeDate(flight.returnDate) === normalizedReturnDate
              : true;
          const isClassMatch = flight.flightClass === decryptedData.flightClass;
          const isPassengerMatch =
            flight.passengers.adult >= decryptedData.passengers.adult &&
            flight.passengers.child >= decryptedData.passengers.child &&
            flight.passengers.infant >= decryptedData.passengers.infant;

          return (
            isType &&
            isFromMatch &&
            isToMatch &&
            isDepartureDateMatch &&
            isReturnDateMatch &&
            isClassMatch &&
            isPassengerMatch
          );
        });

        setFilteredFlights(matchingFlights);
      }
    }
  }, []);

  const handleSortChange = (type) => {
    setSortBy(type);

    // Sort flights by price or duration
    const sortedFlights = [...filteredFlights].sort((a, b) => {
      if (type === "cheapest") {
        return a.price - b.price;
      } else {
        // For fastest, we would need a duration field
        // This is a placeholder; you might need to adjust
        return (a.duration || 0) - (b.duration || 0);
      }
    });

    setFilteredFlights(sortedFlights);
  };

  const handleReset = () => {
    setFilters({
      refundable: false,
      nonRefundable: false,
      nonStop: false,
      oneStop: false,
      onePlusStops: false,
    });
    // Reset price range
    setPriceRange([0, 20000]);

    // Reset filtered flights to original search results
    // This would need to re-run the original filter logic
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
    })} ${date.getDate()} ${date.toLocaleDateString("en-US", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        {/* Header with search details */}
        <div className="bg-[#32d095] text-white p-4 rounded-md flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gray-600 text-[#d7e7f4] rounded-full p-2 mr-4">
              <PiAirplaneTiltFill size={28} />
            </div>
            <div>
              <h1 className="text-sm font-medium">
                {searchData?.fromAirport?.code} - {searchData?.toAirport?.code}{" "}
                | Total {filteredFlights.length} Flights
              </h1>
              <p className="text-sm">
                {searchData?.departureDate &&
                  formatDate(searchData.departureDate)}{" "}
                {searchData?.returnDate
                  ? `- ${formatDate(searchData.returnDate)}`
                  : ""}{" "}
                | {searchData?.passengers?.adult || 1} Travelers
              </p>
            </div>
          </div>
          <button className="bg-gray-600 text-sm cursor-pointer text-white px-4 py-2 rounded">
            MODIFY SEARCH
          </button>
        </div>

        <div className="mt-4 flex gap-4">
          {/* Sidebar Filters */}
          <div className="w-64 bg-white rounded-md shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">FILTER</h2>
              <button className="text-gray-500 text-sm" onClick={handleReset}>
                RESET
              </button>
            </div>

            {/* Sort buttons */}
            <div className="flex mb-6 gap-2">
              <button
                className={`px-4 py-2 text-sm rounded ${
                  sortBy === "cheapest"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleSortChange("cheapest")}
              >
                CHEAPEST
              </button>
              <button
                className={`px-4 py-2 text-sm rounded ${
                  sortBy === "fastest"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleSortChange("fastest")}
              >
                FASTEST
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">Price Range</h3>
                <span className="cursor-pointer">▲</span>
              </div>
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm">৳ {priceRange[0]}</span>
                  <span className="text-sm">৳ {priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Fare Type */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">Fare Type</h3>
                <span className="cursor-pointer">▲</span>
              </div>
              <div className="mt-2">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.refundable}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        refundable: !filters.refundable,
                      })
                    }
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">Refundable</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.nonRefundable}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        nonRefundable: !filters.nonRefundable,
                      })
                    }
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">Non Refundable</span>
                </label>
              </div>
            </div>

            {/* Stops */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">Stops</h3>
                <span className="cursor-pointer">▲</span>
              </div>
              <div className="mt-2">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.nonStop}
                    onChange={() =>
                      setFilters({ ...filters, nonStop: !filters.nonStop })
                    }
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">Non Stop</span>
                </label>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.oneStop}
                    onChange={() =>
                      setFilters({ ...filters, oneStop: !filters.oneStop })
                    }
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">One Stop</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.onePlusStops}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        onePlusStops: !filters.onePlusStops,
                      })
                    }
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">One Plus Stops</span>
                </label>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div className="flex-1">
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight, index) => (
                <div
                  key={flight.id || index}
                  className="bg-white p-4 rounded-md shadow mb-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="flex items-center">
                      <div className="w-12 h-12 mr-2 flex items-center justify-center">
                        <Image
                          width={50}
                          height={50}
                          src={
                            flight.airlineLogo ||
                            "/airline-logo-placeholder.png"
                          }
                          alt={flight.airline}
                          className="max-w-full max-h-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold">{flight.airline}</div>
                        <div className="text-xs text-gray-500">BS-151</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-green-500 font-bold">
                        BDT {flight.price}
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        BDT {Math.round(flight.price * 1.12)}
                      </div>
                    </div>
                  </div>

                  {/* Flight details */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-bold">
                        {flight.from?.code || "DAC"}
                      </div>
                      <div className="text-sm">
                        Hazrat Shahjalal Intl Airport
                      </div>
                      <div className="text-base">
                        {formatTime(flight.departureDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(flight.departureDate)}
                      </div>
                    </div>

                    <div className="flex-1 px-4 flex flex-col items-center">
                      <div className="w-full flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <div className="flex-1 h-px bg-gray-300 mx-1 relative">
                          <div className="absolute -top-6 w-full text-center text-xs">
                            1H 5Min
                          </div>
                          <div className="absolute -bottom-6 w-full text-center text-xs uppercase">
                            NON STOP
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-lg font-bold">
                        {flight.to?.code || "CXB"}
                      </div>
                      <div className="text-sm">COXs Bazar Airport</div>
                      <div className="text-base">
                        {formatTime(
                          new Date(
                            new Date(flight.departureDate).getTime() +
                              65 * 60000
                          )
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(flight.departureDate)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom section with info and buttons */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">Refundable</div>
                      <div className="text-sm">Class- Economy</div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5.586l.707-.707A1 1 0 0110 3h4a1 1 0 011 1v5.586l.707.707a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">20 Kg</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex items-center text-sm text-gray-600 mr-2">
                        FLIGHT DETAILS
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <button className="bg-blue-900 text-white px-4 py-2 rounded text-sm">
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-md shadow text-center">
                <p className="text-lg">No matching flights found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchResultPage;
