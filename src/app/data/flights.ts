import { airports } from "./airports";

interface Flight {
  id: string;
  flightType: string;
  from: { name: string; code: string };
  to: { name: string; code: string };
  departureDate: string;
  returnDate?: string;
  passengers: { adult: number; child: number; infant: number };
  flightClass: string;
  price: number;
  airline: string;
}

const airlines = [
  "Biman Bangladesh Airlines",
  "US-Bangla Airlines",
  "Novoair",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
];

const flights: Flight[] = [];

// Generate flights dynamically for the given airports and dates
let flightId = 1;
for (let day = 15; day <= 30; day++) {
  airports.forEach((fromAirport) => {
    airports.forEach((toAirport) => {
      if (fromAirport.code !== toAirport.code) {
        const flightType = flightId % 2 === 0 ? "roundWay" : "oneWay";
        const flightClass = flightId % 3 === 0 ? "Business" : "Economy";
        const price =
          flightClass === "Business"
            ? 20000 + flightId * 100
            : 10000 + flightId * 50;

        flights.push({
          id: `${flightId}`,
          flightType,
          from: { name: fromAirport.name, code: fromAirport.code },
          to: { name: toAirport.name, code: toAirport.code },
          departureDate: `2025-04-${day.toString().padStart(2, "0")}`,
          returnDate:
            flightType === "roundWay"
              ? `2025-04-${(day + 3).toString().padStart(2, "0")}`
              : undefined,
          passengers: {
            adult: Math.floor(Math.random() * 5) + 1,
            child: Math.floor(Math.random() * 4),
            infant: Math.floor(Math.random() * 4),
          },
          flightClass,
          price,
          airline: airlines[Math.floor(Math.random() * airlines.length)],
        });

        flightId++;
      }
    });
  });
}

export default flights;
