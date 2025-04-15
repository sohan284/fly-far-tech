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
  "Economy",
  "Premium Economy",
  "Business",
  "Premium Business",
  "First Class",
  "Premium First Class",
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

// Function to calculate flight price based on class and other factors
const calculatePrice = (flightClass: string, basePrice: number): number => {
  const classMultipliers = {
    Economy: 1,
    "Premium Economy": 1.5,
    Business: 2.5,
    "Premium Business": 3,
    "First Class": 4,
    "Premium First Class": 5,
  };

  // Apply multiplier based on flight class
  return (
    Math.floor(
      basePrice * classMultipliers[flightClass as keyof typeof classMultipliers]
    ) + Math.floor(Math.random() * 1000)
  ); // Add some random variance
};

// Function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Get today's date
const today = new Date();

const flights: Flight[] = [];

// Generate flights for 30 days starting from today
const DAYS_TO_GENERATE = 30;
let flightId = 1;

for (let dayOffset = 0; dayOffset < DAYS_TO_GENERATE; dayOffset++) {
  // Calculate the date for this iteration
  const currentDate = new Date(today);
  currentDate.setDate(today.getDate() + dayOffset);
  const departureDate = formatDate(currentDate);

  // Loop through all origin airports
  airports.forEach((fromAirport) => {
    // Loop through all destination airports
    airports.forEach((toAirport) => {
      // Skip if origin and destination are the same
      if (fromAirport.code === toAirport.code) return;

      // Base price calculation based on airports
      const basePrice = 8000 + Math.floor(Math.random() * 4000);

      // For each airport pair, create flights with all possible combinations
      flightClasses.forEach((flightClass) => {
        stopsOptions.forEach((stops) => {
          fareTypes.forEach((fareType) => {
            // Generate both one-way and round-trip options
            const flightTypes = ["oneWay", "roundWay"];

            flightTypes.forEach((flightType) => {
              // Generate multiple departure times throughout the day
              const departureHours = [6, 10, 14, 18, 22]; // Flights at 6AM, 10AM, 2PM, 6PM, 10PM

              departureHours.forEach((departureHour) => {
                const departureMinute = Math.floor(Math.random() * 60);

                // Calculate duration based on stops
                const durationMinutes =
                  stops === "NON STOP"
                    ? Math.floor(Math.random() * 60) + 90 // 1.5-2.5 hours for non-stop
                    : Math.floor(Math.random() * 120) + 180; // 3-5 hours for one-stop

                const durationHours = Math.floor(durationMinutes / 60);
                const durationRemainingMinutes = durationMinutes % 60;

                // Calculate arrival time
                const arrivalHour = (departureHour + durationHours) % 24;
                const arrivalMinute =
                  (departureMinute + durationRemainingMinutes) % 60;

                // Price calculation
                const price = calculatePrice(flightClass, basePrice);

                // Baggage allowance
                const baggageAllowance = getBaggageAllowance(flightClass);

                // Return flight parameters (for round-trip flights)
                let returnDate = undefined;
                let returnDepartureTime = undefined;
                let returnArrivalTime = undefined;
                let returnDuration = undefined;

                if (flightType === "roundWay") {
                  // Return date is between 1-7 days after departure
                  const returnDaysAfter = Math.floor(Math.random() * 7) + 1;
                  const returnDateObj = new Date(currentDate);
                  returnDateObj.setDate(
                    currentDate.getDate() + returnDaysAfter
                  );
                  returnDate = formatDate(returnDateObj);

                  // Return flight departure time
                  const returnDepartureHour = (departureHour + 2) % 24;
                  const returnDepartureMinute = Math.floor(Math.random() * 60);

                  // Return flight duration (similar to outbound)
                  const returnDurationMinutes =
                    durationMinutes + Math.floor(Math.random() * 30) - 15;
                  const returnDurationHours = Math.floor(
                    returnDurationMinutes / 60
                  );
                  const returnDurationRemainingMinutes =
                    returnDurationMinutes % 60;

                  // Return flight arrival time
                  const returnArrivalHour =
                    (returnDepartureHour + returnDurationHours) % 24;
                  const returnArrivalMinute =
                    (returnDepartureMinute + returnDurationRemainingMinutes) %
                    60;

                  // Format return times and duration
                  returnDepartureTime = `${returnDepartureHour
                    .toString()
                    .padStart(2, "0")}:${returnDepartureMinute
                    .toString()
                    .padStart(2, "0")}`;
                  returnArrivalTime = `${returnArrivalHour
                    .toString()
                    .padStart(2, "0")}:${returnArrivalMinute
                    .toString()
                    .padStart(2, "0")}`;
                  returnDuration = `${returnDurationHours}h ${returnDurationRemainingMinutes}m`;
                }

                // Create the flight object
                flights.push({
                  id: `${flightId}`, // Unique ID for each flight
                  flightType,
                  from: { name: fromAirport.name, code: fromAirport.code },
                  to: { name: toAirport.name, code: toAirport.code },
                  departureDate,
                  departureTime: `${departureHour
                    .toString()
                    .padStart(2, "0")}:${departureMinute
                    .toString()
                    .padStart(2, "0")}`,
                  arrivalTime: `${arrivalHour
                    .toString()
                    .padStart(2, "0")}:${arrivalMinute
                    .toString()
                    .padStart(2, "0")}`,
                  duration: `${durationHours}h ${durationRemainingMinutes}m`,
                  returnDate,
                  returnDepartureTime,
                  returnArrivalTime,
                  returnDuration,
                  passengers: {
                    adult: 1, // Default to 1 adult
                    child: 0,
                    infant: 0,
                  },
                  flightClass,
                  price,
                  airline:
                    airlines[Math.floor(Math.random() * airlines.length)],
                  fareType,
                  stops,
                  baggageAllowance,
                });

                flightId++;
              });
            });
          });
        });
      });
    });
  });
}

export default flights;
