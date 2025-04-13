"use client";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import flights from "../data/flights";

const FlightSearchResultPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [filteredFlights, setFilteredFlights] = useState([]);

  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    // Convert to UTC date string (YYYY-MM-DD)
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Decrypt the data from local storage
      const encryptedData = localStorage.getItem("searchData");
      if (encryptedData) {
        const secretKey = "fly-far-tech"; // Use the same secret key used for encryption
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setSearchData(decryptedData);

        // Normalize dates in searchData
        const normalizedDepartureDate = normalizeDate(
          decryptedData.departureDate
        );
        const normalizedReturnDate = decryptedData.returnDate
          ? normalizeDate(decryptedData.returnDate)
          : null;

        // Filter flights based on search data
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
  console.log(flights);

  return (
    <div className="max-w-[1200px] mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Flight Search Results</h1>
      {searchData ? (
        <div className="bg-white shadow-md rounded-lg p-5 mb-6">
          <h2 className="text-lg font-bold mb-2">Search Details:</h2>
          <p>
            <strong>Flight Type:</strong> {searchData.selectedFlight}
          </p>
          <p>
            <strong>From:</strong> {searchData.fromAirport?.name} (
            {searchData.fromAirport?.code})
          </p>
          <p>
            <strong>To:</strong> {searchData.toAirport?.name} (
            {searchData.toAirport?.code})
          </p>
          <p>
            <strong>Departure Date:</strong>{" "}
            {searchData.departureDate
              ? new Date(searchData.departureDate).toLocaleDateString("en-US")
              : "N/A"}
          </p>
          {searchData.selectedFlight === "roundWay" && (
            <p>
              <strong>Return Date:</strong>{" "}
              {searchData.returnDate
                ? new Date(searchData.returnDate).toLocaleDateString("en-US")
                : "N/A"}
            </p>
          )}
          <p>
            <strong>Passengers:</strong> {searchData.passengers.adult} Adult(s),{" "}
            {searchData.passengers.child} Child(ren),{" "}
            {searchData.passengers.infant} Infant(s)
          </p>
          <p>
            <strong>Class:</strong> {searchData.flightClass}
          </p>
        </div>
      ) : (
        <p>Loading search data...</p>
      )}

      <h2 className="text-xl font-bold mb-4">Available Flights</h2>
      {filteredFlights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-lg font-bold mb-2">{flight.airline}</h3>
              <p>
                <strong>From:</strong> {flight.from.name} ({flight.from.code})
              </p>
              <p>
                <strong>To:</strong> {flight.to.name} ({flight.to.code})
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {new Date(flight.departureDate).toLocaleDateString("en-US")}
              </p>
              {flight.returnDate && (
                <p>
                  <strong>Return:</strong>{" "}
                  {new Date(flight.returnDate).toLocaleDateString("en-US")}
                </p>
              )}
              <p>
                <strong>Class:</strong> {flight.flightClass}
              </p>
              <p>
                <strong>Type:</strong> {flight.flightType}
              </p>
              <p>
                <strong>Price:</strong> ${flight.price}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No matching flights found.</p>
      )}
    </div>
  );
};

export default FlightSearchResultPage;
