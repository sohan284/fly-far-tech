"use client";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import flights from "../data/flights";
import { PiAirplaneTiltFill } from "react-icons/pi";
import FlightCard from "./_components/FlightCard";

// Define types for your data structures
interface Airport {
  code: string;
  name: string;
}

interface Passengers {
  adult: number;
  child: number;
  infant: number;
}

interface Flight {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightType: string;
  from: { code: string };
  to: { code: string };
  departureDate: string;
  returnDate?: string;
  flightClass: string;
  passengers: Passengers;
  price: number;
  duration?: number;
}

interface SearchData {
  fromAirport?: Airport;
  toAirport?: Airport;
  departureDate?: string;
  returnDate?: string;
  selectedFlight?: string;
  flightClass?: string;
  passengers?: Passengers;
}

interface FilterState {
  refundable: boolean;
  nonRefundable: boolean;
  nonStop: boolean;
  oneStop: boolean;
  onePlusStops: boolean;
}

const FlightSearchResultPage = () => {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [sortBy, setSortBy] = useState<"cheapest" | "fastest">("cheapest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [filters, setFilters] = useState<FilterState>({
    refundable: false,
    nonRefundable: false,
    nonStop: false,
    oneStop: false,
    onePlusStops: false,
  });

  const normalizeDate = (dateString: string | undefined): string | null => {
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
        try {
          const secretKey = "fly-far-tech";
          const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
          const decryptedData = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          ) as SearchData;
          setSearchData(decryptedData);

          const normalizedDepartureDate = decryptedData.departureDate
            ? normalizeDate(decryptedData.departureDate)
            : null;
          const normalizedReturnDate = decryptedData.returnDate
            ? normalizeDate(decryptedData.returnDate)
            : null;

          const matchingFlights = flights.filter((flight) => {
            console.log(decryptedData);
            const isFlightTypeMatch =
              decryptedData.selectedFlight === flight.flightType;
            const isFromMatch =
              decryptedData.fromAirport?.code === flight.from.code;
            const isToMatch = decryptedData.toAirport?.code === flight.to.code;
            return isFlightTypeMatch && isFromMatch && isToMatch;
          });

          // If no filters are applied, show all flights
          setFilteredFlights(matchingFlights);
        } catch (error) {
          console.error("Error decrypting search data:", error);
        }
      } else {
        // If no search data is found, show all flights
        setFilteredFlights(flights as Flight[]);
      }
    }
  }, []);

  const handleSortChange = (type: "cheapest" | "fastest"): void => {
    setSortBy(type);

    // Sort flights by price or duration
    const sortedFlights = [...filteredFlights].sort((a, b) => {
      if (type === "cheapest") {
        return a.price - b.price;
      } else {
        // For fastest, we would need a duration field
        return (a.duration || 0) - (b.duration || 0);
      }
    });

    setFilteredFlights(sortedFlights);
  };

  const handleReset = (): void => {
    setFilters({
      refundable: false,
      nonRefundable: false,
      nonStop: false,
      oneStop: false,
      onePlusStops: false,
    });
    // Reset price range
    setPriceRange([0, 20000]);

    // Here you would re-run the original filter logic
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
    })} ${date.getDate()} ${date.toLocaleDateString("en-US", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-3 lg:p-0">
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
          <div className="w-64 bg-white rounded-md shadow p-4 lg:block hidden">
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
                <FlightCard
                  flight={{ ...flight, airlineLogo: flight.airlineLogo || "" }}
                  key={index}
                />
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
