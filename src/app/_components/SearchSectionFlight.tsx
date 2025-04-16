import React, { useState, useEffect } from "react";
import { IoAirplaneOutline, IoAirplaneSharp } from "react-icons/io5";
import SharedRadioGroup from "./SharedRadioGroup";
import AirportSearch from "./AirportSearch";
import DateCalender from "./DateCalender";
import SharedSelect from "./SharedSelect";
import { Airport, airports } from "../data/airports";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";

const SearchSectionFlight = ({ isModify = false }) => {
  const router = useRouter();
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [infant, setInfant] = useState(0);
  const [flightClass, setFlightClass] = useState("Economy");
  const [selectedFlight, setSelectedFlight] = useState("roundWay");
  const [fromAirport, setFromAirport] = useState<Airport | null>(
    airports.find((airport) => airport.code === "DAC") || null
  );
  const [toAirport, setToAirport] = useState<Airport | null>(
    airports.find((airport) => airport.code === "CXB") || null
  );
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(true);

  useEffect(() => {
    const encryptedData = sessionStorage.getItem("searchData");
    if (encryptedData) {
      try {
        const secretKey = "fly-far-tech"; // Replace with your secret key
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // Set the state with the decrypted data
        setSelectedFlight(decryptedData.selectedFlight || "roundWay");
        setFromAirport(decryptedData.fromAirport || null);
        setToAirport(decryptedData.toAirport || null);
        setDepartureDate(
          decryptedData.departureDate
            ? new Date(decryptedData.departureDate)
            : null
        );
        setReturnDate(
          decryptedData.returnDate ? new Date(decryptedData.returnDate) : null
        );
        setAdult(decryptedData.passengers?.adult || 1);
        setChild(decryptedData.passengers?.child || 0);
        setInfant(decryptedData.passengers?.infant || 0);
        setFlightClass(decryptedData.flightClass || "Economy");
      } catch (error) {
        console.error("Error decrypting search data:", error);
      }
    }
  }, []);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsZoomedIn(false);
    setTimeout(() => {
      setSelectedFlight(event.target.value);
      setTimeout(() => {
        setIsZoomedIn(true);
      }, 50);
    }, 300);
  };

  const handleSearchFlight = () => {
    const searchData = {
      selectedFlight,
      fromAirport,
      toAirport,
      departureDate,
      returnDate: selectedFlight === "roundWay" ? returnDate : null,
      passengers: {
        adult,
        child,
        infant,
      },
      flightClass,
    };

    // Encrypt the data
    const secretKey = "fly-far-tech"; // Replace with your secret key
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(searchData),
      secretKey
    ).toString();

    // Save the encrypted data to local storage
    sessionStorage.setItem("searchData", encryptedData);
    if (isModify) {
      window.location.reload();
    } else {
      router.push("/flight-search-result");
    }
  };

  const radioOptions = [
    { value: "roundWay", label: "ROUND-WAY" },
    { value: "oneWay", label: "ONE-WAY" },
    { value: "multiCity", label: "MULTI-CITY" },
  ];

  return (
    <div>
      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-3">
        {/* Left Section */}
        <div className="lg:col-span-2 gap-4 bg-white rounded-xl p-5 border-dotted border-gray-300 border-b-2 lg:border-b-0 lg:border-r-2">
          <SharedRadioGroup
            value={selectedFlight}
            onChange={handleRadioChange}
            options={radioOptions}
          />

          <div className="mt-4">
            {selectedFlight === "roundWay" && (
              <div
                className={`grid grid-cols-7 gap-4 transition-all duration-300 ease-in-out ${
                  isZoomedIn
                    ? "transform scale-100 opacity-100"
                    : "transform scale-90 opacity-0"
                }`}
              >
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
                <div className="text-[#32d095] relative hidden lg:block col-span-1">
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
                      minDate={departureDate}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedFlight === "oneWay" && (
              <div
                className={`grid grid-cols-7 gap-4 transition-all duration-300 ease-in-out ${
                  isZoomedIn
                    ? "transform scale-100 opacity-100"
                    : "transform scale-90 opacity-0"
                }`}
              >
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
                <div className="text-[#32d095] relative hidden lg:block col-span-1">
                  <div>
                    <IoAirplaneSharp size={70} />
                  </div>
                </div>
                <div className="lg:col-span-3 col-span-7">
                  <AirportSearch
                    label="TO"
                    value={toAirport}
                    onChange={setToAirport}
                  />
                </div>
              </div>
            )}

            {selectedFlight === "multiCity" && (
              <div
                className={`grid grid-cols-7 gap-4 transition-all duration-300 ease-in-out ${
                  isZoomedIn
                    ? "transform scale-100 opacity-100"
                    : "transform scale-90 opacity-0"
                }`}
              >
                <div className="col-span-7">
                  <p className="text-gray-500">
                    Multi-city booking options is not implemented yet.
                  </p>
                </div>
              </div>
            )}
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
          <button
            onClick={handleSearchFlight}
            className="w-full bg-[#32d095] text-white font-bold py-2 text-sm rounded-sm cursor-pointer"
          >
            SEARCH FOR FLIGHT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSectionFlight;
