import { airports } from "./airports";

interface Flight {
  id: string;
  flightType: string;
  from: { name: string; code: string };
  to: { name: string; code: string };
  departureDate: string;
  departureTime: string; // Departure time in HH:mm format
  arrivalTime: string; // Arrival time in HH:mm format
  duration: string; // Duration in "Xh Ym" format
  returnDate?: string; // Return date for roundWay flights
  returnDepartureTime?: string; // Return departure time for roundWay flights
  returnArrivalTime?: string; // Return arrival time for roundWay flights
  returnDuration?: string; // Return flight duration in "Xh Ym" format
  passengers: { adult: number; child: number; infant: number };
  flightClass: string;
  price: number;
  airline: string;
  fareType: string; // Added fareType field
  stops: string; // Added stops field
  baggageAllowance: {
    // Added baggage allowance field
    checkedBags: string;
    cabinBag: string;
  };
}

const airlines = [
  "Biman Bangladesh Airlines",
  "US-Bangla Airlines",
  "Novoair",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
];

const flightClasses = [
  { class: "Economy", weight: 50 },
  { class: "Business", weight: 25 },
  { class: "Premium Economy", weight: 10 },
  { class: "Premium Business", weight: 5 },
  { class: "First Class", weight: 5 },
  { class: "Premium First Class", weight: 5 },
];

const fareTypes = ["Refundable", "Non Refundable"];
const stopsOptions = ["NON STOP", "One Stop"];

// Baggage allowance by flight class
const getBaggageAllowance = (flightClass: string) => {
  switch (flightClass) {
    case "Economy":
      return {
        checkedBags: "20kg",
        cabinBag: "7kg",
      };
    case "Premium Economy":
      return {
        checkedBags: "25kg",
        cabinBag: "10kg",
      };
    case "Business":
      return {
        checkedBags: "30kg",
        cabinBag: "12kg",
      };
    case "Premium Business":
      return {
        checkedBags: "35kg",
        cabinBag: "15kg",
      };
    case "First Class":
      return {
        checkedBags: "40kg",
        cabinBag: "18kg",
      };
    case "Premium First Class":
      return {
        checkedBags: "50kg",
        cabinBag: "20kg",
      };
    default:
      return {
        checkedBags: "20kg",
        cabinBag: "7kg",
      };
  }
};

// Function to select a flight class based on weights
const getRandomFlightClass = (): string => {
  const totalWeight = flightClasses.reduce((sum, fc) => sum + fc.weight, 0);
  const random = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const fc of flightClasses) {
    cumulativeWeight += fc.weight;
    if (random <= cumulativeWeight) {
      return fc.class;
    }
  }

  return "Economy"; // Fallback (shouldn't happen)
};

// Function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Get today's date
const today = new Date();

const flights: Flight[] = [];

// Generate flights dynamically for 5 days starting from today
let flightId = 1;
for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
  // Calculate the date for this iteration
  const currentDate = new Date(today);
  currentDate.setDate(today.getDate() + dayOffset);
  const departureDate = formatDate(currentDate);

  airports.forEach((fromAirport) => {
    airports.forEach((toAirport) => {
      if (fromAirport.code !== toAirport.code) {
        const flightType = flightId % 2 === 0 ? "roundWay" : "oneWay";
        const flightClass = getRandomFlightClass(); // Use weighted random selection
        const price =
          flightClass === "Business"
            ? 20000 + flightId * 100
            : flightClass === "Economy"
            ? 10000 + flightId * 50
            : 15000 + flightId * 75; // Adjust price for other classes
        const fareType =
          fareTypes[Math.floor(Math.random() * fareTypes.length)]; // Random fare type
        const stops =
          stopsOptions[Math.floor(Math.random() * stopsOptions.length)]; // Random stops option
        const baggageAllowance = getBaggageAllowance(flightClass); // Get baggage allowance based on flight class

        // Generate multiple flights per day with different times
        for (let flightIndex = 0; flightIndex < 3; flightIndex++) {
          const departureHour = 6 + flightIndex * 4; // Flights at 6 AM, 10 AM, 2 PM
          const departureMinute = Math.floor(Math.random() * 60); // Random minutes
          const durationMinutes = Math.floor(Math.random() * 120) + 60; // Random duration between 1-3 hours
          const durationHours = Math.floor(durationMinutes / 60); // Hours part of duration
          const durationRemainingMinutes = durationMinutes % 60; // Minutes part of duration

          const arrivalHour = departureHour + durationHours;
          const arrivalMinute =
            (departureMinute + durationRemainingMinutes) % 60;

          // For roundWay flights, calculate return times and dates
          let returnDate = undefined;
          let returnDepartureTime = undefined;
          let returnArrivalTime = undefined;
          let returnDuration = undefined;

          if (flightType === "roundWay") {
            // Calculate return date (random 1-5 days after departure)
            const returnDaysAfter = Math.floor(Math.random() * 5) + 1; // Random number between 1-5
            const returnDateObj = new Date(currentDate);
            returnDateObj.setDate(currentDate.getDate() + returnDaysAfter);
            returnDate = formatDate(returnDateObj);

            const returnDepartureHour = 14 + flightIndex * 2; // Return flights at 2 PM, 4 PM, 6 PM
            const returnDepartureMinute = Math.floor(Math.random() * 60); // Random minutes
            const returnDurationMinutes = Math.floor(Math.random() * 120) + 60; // Random duration between 1-3 hours
            const returnDurationHours = Math.floor(returnDurationMinutes / 60); // Hours part of return duration
            const returnDurationRemainingMinutes = returnDurationMinutes % 60; // Minutes part of return duration

            const returnArrivalHour = returnDepartureHour + returnDurationHours;
            const returnArrivalMinute =
              (returnDepartureMinute + returnDurationRemainingMinutes) % 60;

            returnDepartureTime = `${returnDepartureHour
              .toString()
              .padStart(2, "0")}:${returnDepartureMinute
              .toString()
              .padStart(2, "0")}`; // Format HH:mm
            returnArrivalTime = `${returnArrivalHour
              .toString()
              .padStart(2, "0")}:${returnArrivalMinute
              .toString()
              .padStart(2, "0")}`; // Format HH:mm
            returnDuration = `${returnDurationHours}h ${returnDurationRemainingMinutes}m`; // Duration in "Xh Ym" format
          }

          flights.push({
            id: `${flightId}-${flightIndex + 1}`, // Unique ID for each flight
            flightType,
            from: { name: fromAirport.name, code: fromAirport.code },
            to: { name: toAirport.name, code: toAirport.code },
            departureDate,
            departureTime: `${departureHour
              .toString()
              .padStart(2, "0")}:${departureMinute
              .toString()
              .padStart(2, "0")}`, // Format HH:mm
            arrivalTime: `${arrivalHour
              .toString()
              .padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`, // Format HH:mm
            duration: `${durationHours}h ${durationRemainingMinutes}m`, // Duration in "Xh Ym" format
            returnDate,
            returnDepartureTime,
            returnArrivalTime,
            returnDuration,
            passengers: {
              adult: Math.floor(Math.random() * 5) + 1,
              child: Math.floor(Math.random() * 4),
              infant: Math.floor(Math.random() * 4),
            },
            flightClass,
            price,
            airline: airlines[Math.floor(Math.random() * airlines.length)],
            fareType,
            stops,
            baggageAllowance, // Added baggage allowance field
          });

          flightId++;
        }
      }
    });
  });
}

export default flights;
