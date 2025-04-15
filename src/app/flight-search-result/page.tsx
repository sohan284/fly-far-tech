"use client";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import flights from "../data/flights";
import { PiAirplaneTiltFill } from "react-icons/pi";
import FlightCard from "./_components/FlightCard";
import SearchSectionFlight from "../_components/SearchSectionFlight";
import { FaPlaneCircleExclamation } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Pagination from "./_components/CustomPagination";

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
  stops: string;
  fareType: string;
  baggageAllowance: { checkedBags: string; cabinBag: string };
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
  const router = useRouter();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [sortBy, setSortBy] = useState<"cheapest" | "fastest">("cheapest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80000]);
  const [filters, setFilters] = useState<FilterState>({
    refundable: false,
    nonRefundable: false,
    nonStop: false,
    oneStop: false,
    onePlusStops: false,
  });
  // Add these state variables to the component
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [flightsPerPage] = useState<number>(10);

  // Add a function to get current flights for pagination
  const getCurrentFlights = (): Flight[] => {
    const indexOfLastFlight = currentPage * flightsPerPage;
    const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
    return filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  };

  // Add a function to handle page changes
  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // State to control the visibility of SearchSectionFlight
  const [showSearchSection, setShowSearchSection] = useState(false);

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

  const applyFilters = () => {
    if (!searchData) return;

    // Start with the original search results
    const normalizeDepartureDate = searchData.departureDate
      ? normalizeDate(searchData.departureDate)
      : null;
    const normalizeReturnDate = searchData.returnDate
      ? normalizeDate(searchData.returnDate)
      : null;

    // First filter based on search criteria
    const matchingFlights = flights.filter((flight) => {
      const isFlightTypeMatch = searchData.selectedFlight === flight.flightType;
      const isFromMatch = searchData.fromAirport?.code === flight.from.code;
      const isToMatch = searchData.toAirport?.code === flight.to.code;
      const isClassMatch = searchData.flightClass === flight.flightClass;
      const departureDateMatch = searchData.departureDate
        ? normalizeDepartureDate === flight.departureDate
        : true;
      const returnDateMatch = searchData.returnDate
        ? normalizeReturnDate === flight.returnDate
        : true;
      return (
        isFlightTypeMatch &&
        isFromMatch &&
        isToMatch &&
        isClassMatch &&
        departureDateMatch &&
        returnDateMatch
      );
    }) as unknown as Flight[];

    // Then apply the filter conditions
    const filtered = matchingFlights.filter((flight) => {
      // Filter by price
      const isPriceInRange =
        flight.price >= priceRange[0] && flight.price <= priceRange[1];

      const isFareTypeMatch =
        (!filters.refundable && !filters.nonRefundable) ||
        (filters.refundable && flight.fareType === "Refundable") ||
        (filters.nonRefundable && flight.fareType === "Non Refundable");

      // Filter by stops
      const isStopsMatch =
        (!filters.nonStop && !filters.oneStop && !filters.onePlusStops) ||
        (filters.nonStop && flight.stops === "NON STOP") ||
        (filters.oneStop && flight.stops === "One Stop") ||
        (filters.onePlusStops &&
          (flight.stops === "2 Stops" ||
            flight.stops === "3 Stops" ||
            parseInt(flight.stops.split(" ")[0]) > 1));

      return isPriceInRange && isFareTypeMatch && isStopsMatch;
    });

    setFilteredFlights(filtered);
  };

  // Modify the useEffect to call the filter function after initial loading
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

          // Initial filtering is handled by applyFilters now
        } catch (error) {
          console.error("Error decrypting search data:", error);
        }
      } else {
        // If no search data is found, show all flights
        setFilteredFlights(flights as unknown as Flight[]);
      }
    }
  }, []);

  // Call applyFilters whenever searchData is updated or filters change
  useEffect(() => {
    if (searchData) {
      applyFilters();
    }
  }, [searchData, filters, priceRange, sortBy]);

  // Enable the sort functionality - uncomment and update the sort function
  const handleSortChange = (type: "cheapest" | "fastest"): void => {
    setSortBy(type);

    // Sort flights by price or duration
    const sortedFlights = [...filteredFlights].sort((a, b) => {
      if (type === "cheapest") {
        return a.price - b.price;
      } else {
        // For fastest, we need to convert duration string to minutes for comparison
        const durationToMinutes = (duration: string) => {
          const parts = duration.split(" ");
          let totalMinutes = 0;
          for (let i = 0; i < parts.length; i += 2) {
            const value = parseInt(parts[i]);
            const unit = parts[i + 1].toLowerCase();
            if (unit.includes("h")) totalMinutes += value * 60;
            if (unit.includes("m")) totalMinutes += value;
          }
          return totalMinutes;
        };

        return durationToMinutes(a.duration) - durationToMinutes(b.duration);
      }
    });

    setFilteredFlights(sortedFlights);
  };

  // Update handleReset to call applyFilters after resetting
  const handleReset = (): void => {
    setFilters({
      refundable: false,
      nonRefundable: false,
      nonStop: false,
      oneStop: false,
      onePlusStops: false,
    });
    // Reset price range
    setPriceRange([0, 80000]);

    // Re-run the filter logic
    applyFilters();
  };

  const totalPassengers = parseInt(
    String(
      (searchData?.passengers?.adult || 0) +
        (searchData?.passengers?.child || 0) +
        (searchData?.passengers?.infant || 0)
    )
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
    })} ${date.getDate()} ${date.toLocaleDateString("en-US", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  return (
    <div className="bg-[#edf2f6] min-h-screen p-3 lg:p-0">
      <div className="max-w-screen-xl mx-auto pt-6">
        {/* Header with search details */}
        <div className="bg-[#32d095] text-white p-4  rounded-md flex justify-between items-center">
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
                | {totalPassengers}
                Travelers
              </p>
            </div>
          </div>
          <button
            className="bg-gray-600 text-sm cursor-pointer text-white px-4 py-2 rounded"
            onClick={() => setShowSearchSection(!showSearchSection)} // Toggle visibility
          >
            MODIFY SEARCH
          </button>
        </div>

        <div className="mt-4 flex gap-4">
          {/* Sidebar Filters */}
          <div className="w-64 h-screen bg-white rounded-md shadow p-4 lg:block hidden">
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
                  max="100000"
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
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div className="flex-1">
            <div
              className={`transition-all duration-500 ease-in-out ${
                showSearchSection
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              } `}
            >
              <SearchSectionFlight isModify={true} />
            </div>

            {filteredFlights.length > 0 ? (
              <>
                {/* Show only current page flights */}
                {getCurrentFlights().map((flight, index) => (
                  <FlightCard
                    flight={{
                      ...flight,
                      airlineLogo: flight.airlineLogo || "",
                    }}
                    totalPassengers={totalPassengers}
                    key={index}
                  />
                ))}
                {filteredFlights.length > 0 && (
                  <div className="bg-white p-4 rounded-md shadow my-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Showing{" "}
                        {Math.min(
                          (currentPage - 1) * flightsPerPage + 1,
                          filteredFlights.length
                        )}{" "}
                        -{" "}
                        {Math.min(
                          currentPage * flightsPerPage,
                          filteredFlights.length
                        )}{" "}
                        of {filteredFlights.length} flights
                      </p>
                      <Pagination
                        currentPage={currentPage}
                        totalItems={filteredFlights.length}
                        itemsPerPage={flightsPerPage}
                        paginate={paginate}
                      />
                      <p className="text-sm text-gray-600">
                        Page {currentPage} of{" "}
                        {Math.ceil(filteredFlights.length / flightsPerPage)}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 rounded-md text-center flex justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center w-full flex flex-col items-center justify-center space-y-6">
                  <div className="">
                    <FaPlaneCircleExclamation className="text-[#32d095] h-16 w-16" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                      No Matching Flights Found
                    </h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      We {"couldn't"} find any flights matching your search
                      criteria. Try adjusting your dates or destination.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <button
                      onClick={() => router.push("/")}
                      className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back To Home
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchResultPage;
