export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const airports: Airport[] = [
  {
    code: "DAC",
    name: "Hazrat Shahjalal International Airport",
    city: "Dhaka",
    country: "Bangladesh"
  },
  {
    code: "CXB",
    name: "Cox's Bazar Airport",
    city: "Cox's Bazar",
    country: "Bangladesh"
  },
  {
    code: "CGP",
    name: "Shah Amanat International Airport",
    city: "Chittagong",
    country: "Bangladesh"
  },
  {
    code: "SPD",
    name: "Saidpur Airport",
    city: "Saidpur",
    country: "Bangladesh"
  },
  {
    code: "ZYL",
    name: "Osmani International Airport",
    city: "Sylhet",
    country: "Bangladesh"
  },
]; 