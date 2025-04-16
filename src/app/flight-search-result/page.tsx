"use client";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import flights from "../data/flights";
import { PiAirplaneTiltFill } from "react-icons/pi";
import { FaPlaneCircleExclamation } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import FlightCard from "./_components/FlightCard";
import SearchSectionFlight from "../_components/SearchSectionFlight";
import { useRouter } from "next/navigation";
import Pagination from "./_components/CustomPagination";
import FilterContent from "./_components/FilterContent";
import FlightResultSkeleton from "./_components/FlightResultSkeleton";
// Import Material UI components
import { Drawer } from "@mui/material";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [flightsPerPage] = useState<number>(10);
  const [showSearchSection, setShowSearchSection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mobile filter drawer state
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileFilter]);

  const getCurrentFlights = (): Flight[] => {
    const indexOfLastFlight = currentPage * flightsPerPage;
    const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
    return filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  };

  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    setIsLoading(true);
    
    // Delay to show loading state even on fast operations
    setTimeout(() => {
      if (!searchData) {
        setIsLoading(false);
        return;
      }

      const normalizeDepartureDate = searchData.departureDate
        ? normalizeDate(searchData.departureDate)
        : null;
      const normalizeReturnDate = searchData.returnDate
        ? normalizeDate(searchData.returnDate)
        : null;

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

      const filtered = matchingFlights.filter((flight) => {
        const isPriceInRange =
          flight.price >= priceRange[0] && flight.price <= priceRange[1];

        const isFareTypeMatch =
          (!filters.refundable && !filters.nonRefundable) ||
          (filters.refundable && flight.fareType === "Refundable") ||
          (filters.nonRefundable && flight.fareType === "Non Refundable");

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
      setIsLoading(false);
    }, 800); // Add a delay to show loading effect (simulate network request)
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      const encryptedData = sessionStorage.getItem("searchData");
      if (encryptedData) {
        try {
          const secretKey = "fly-far-tech";
          const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
          const decryptedData = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          ) as SearchData;
          setSearchData(decryptedData);
        } catch (error) {
          console.error("Error decrypting search data:", error);
          setIsLoading(false);
        }
      } else {
        setFilteredFlights(flights as unknown as Flight[]);
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (searchData) {
      applyFilters();
    }
  }, [searchData, filters, priceRange, sortBy]);

  const handleSortChange = (type: "cheapest" | "fastest"): void => {
    setSortBy(type);
    setIsLoading(true);

    setTimeout(() => {
      const sortedFlights = [...filteredFlights].sort((a, b) => {
        if (type === "cheapest") {
          return a.price - b.price;
        } else {
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
      setIsLoading(false);
    }, 500);
  };

  const handleReset = (): void => {
    setFilters({
      refundable: false,
      nonRefundable: false,
      nonStop: false,
      oneStop: false,
      onePlusStops: false,
    });
    setPriceRange([0, 80000]);
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

  // Generate skeleton array based on flights per page
  const renderSkeletons = () => {
    return Array(flightsPerPage)
      .fill(0)
      .map((_, index) => <FlightResultSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <div className="bg-[#edf2f6] min-h-screen p-3 lg:p-0">
      {/* Material UI Drawer for Mobile - from right side */}
      <Drawer
        anchor="right"
        open={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { 
            width: '80%', 
            maxWidth: '300px',
            boxSizing: 'border-box',
            padding: '20px'
          },
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => setShowMobileFilter(false)}
          >
            <IoClose size={24} />
          </button>
        </div>
        <FilterContent
          sortBy={sortBy}
          handleSortChange={handleSortChange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          filters={filters}
          setFilters={setFilters}
          handleReset={handleReset}
        />
      </Drawer>

      <div className="max-w-screen-xl mx-auto pt-6">
        <div className="mt-4 flex flex-col lg:flex-row gap-4">
          {/* Desktop Sidebar - Fixed position */}
          <div className="w-64 bg-white rounded-md shadow p-4 hidden lg:block h-fit sticky top-6">
            <FilterContent 
              sortBy={sortBy}
              handleSortChange={handleSortChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              filters={filters}
              setFilters={setFilters}
              handleReset={handleReset}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with search details */}
            <div className="bg-[#32d095] text-white p-4 rounded-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className="bg-gray-600 text-[#d7e7f4] rounded-full p-2 mr-4">
                    <PiAirplaneTiltFill size={28} />
                  </div>
                  <div>
                    <h1 className="text-sm font-medium">
                      {searchData?.fromAirport?.code} - {searchData?.toAirport?.code}{" "}
                      | {isLoading ? "Searching..." : `Total ${filteredFlights.length} Flights`}
                    </h1>
                    <p className="text-sm">
                      {searchData?.departureDate &&
                        formatDate(searchData.departureDate)}{" "}
                      {searchData?.returnDate
                        ? `- ${formatDate(searchData.returnDate)}`
                        : ""}{" "}
                      | {totalPassengers} Travelers
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {/* Filter button - visible only on mobile */}
                  <button
                    onClick={() => setShowMobileFilter(true)}
                    className="bg-gray-600 hover:bg-[#32d095] text-sm cursor-pointer text-white px-4 py-2 rounded flex items-center gap-2 lg:hidden"
                  >
                    <span>FILTER</span>
                  </button>
                  {/* Modify search button */}
                  <button
                    className="bg-gray-600 hover:bg-[#32d095] text-sm cursor-pointer text-white px-4 py-2 rounded flex-1 sm:flex-none"
                    onClick={() => setShowSearchSection(!showSearchSection)}
                  >
                    MODIFY SEARCH
                  </button>
                </div>
              </div>
            </div>

            {/* Search Section (expandable) */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                showSearchSection
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <SearchSectionFlight isModify={true} />
            </div>

            {/* Loading State */}
            {isLoading ? (
              renderSkeletons()
            ) : filteredFlights.length > 0 ? (
              <>
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
                {filteredFlights.length > flightsPerPage && (
                  <div className="my-4">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredFlights.length}
                      itemsPerPage={flightsPerPage}
                      paginate={paginate}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 mt-4 rounded-md text-center flex justify-center">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center w-full flex flex-col items-center justify-center space-y-6">
                  <div>
                    <FaPlaneCircleExclamation className="text-[#32d095] h-12 w-12 sm:h-16 sm:w-16" />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      No Matching Flights Found
                    </h2>
                    <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
                      We {"couldn't"} find any flights matching your search
                      criteria. Try adjusting your dates or destination.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <button
                      onClick={() => router.push("/")}
                      className="cursor-pointer flex items-center justify-center gap-2 px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
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