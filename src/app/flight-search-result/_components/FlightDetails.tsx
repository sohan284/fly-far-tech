import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { FaCaretRight } from "react-icons/fa";
import CardContents from "./CardContents";
import Image from "next/image";
import bs from "@/app/assets/BS.png";
import bg from "@/app/assets/BG.png";
import ek from "@/app/assets/EK.png";
import ku from "@/app/assets/KU.png";
import qr from "@/app/assets/QR.png";
type Anchor = "right";
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

interface FlightDetailsProps {
  flight: Flight;
  totalPassengers: number;
}

export default function FlightDetails({
  flight,
  totalPassengers,
}: FlightDetailsProps) {
  const [state, setState] = React.useState({
    right: false,
  });
  console.log(totalPassengers);
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = () => (
    <Box
      sx={{
        width: "50vw", // Set the drawer width to 50% of the viewport width
        height: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
      role="presentation"
    >
      {/* Flight Details Header */}
      <div className="mt-6 px-4">
        <CardContents flight={flight} />
      </div>
      <h1 className="bg-[#d7e7f4] px-2 p-1 font-semibold text-sm  mx-4 m-6 text-[#32d095]">
        FLIGHT DETAILS
      </h1>
      <div className="m-4 grid grid-cols-4">
        <div>
          <div className="w-12 h-12 border-2 border-red-500 rounded-full">
            <Image
              width={50}
              height={50}
              src={
                flight.airline === "US-Bangla Airlines"
                  ? bs
                  : flight.airline === "Emirates"
                  ? ek
                  : flight.airline === "Qatar Airways"
                  ? qr
                  : flight.airline === "Novoair"
                  ? ku
                  : bg
              }
              alt={flight.airline}
              className="max-w-full max-h-full"
            />
          </div>

          <div className="text-sm font-medium my-10 mt-2 text-[#32d095]">
            {flight.airline}
          </div>
        </div>
      </div>
      <h1 className="bg-[#d7e7f4] px-2 p-1 font-semibold text-sm  mx-4 m-6 text-[#32d095]">
        FARE SUMMARY GBDGB
      </h1>
      {/* Fare Summary */}
      <div>
        <div className="grid grid-cols-5 pl-4 bg-[#464a63] p-2 text-zinc-200 text-sm mx-4">
          <p>Pax Type</p>
          <p>Base Fare (BDT)</p>
          <p>Tax Fees (BDT)</p>
          <p>Per Passenger</p>
          <p>Total Cost (BDT)</p>
        </div>
        <div className="grid grid-cols-5 pl-4 p-2 text-gray-800 text-sm mx-4 border-b pb-10">
          <p>Adult</p>
          <p>{flight.price} ৳</p>
          <p>{flight.price * 0.1} ৳</p>
          <p>
            {" "}
            {flight.price + flight.price * 0.1} * {totalPassengers}৳
          </p>
          <p>{(flight.price + flight.price * 0.01) * totalPassengers} ৳</p>
        </div>
        <div className="flex justify-between mx-4 px-4 text-[#32d095] text-sm font-medium mt-2 pr-10">
          <div>
            <p>Total</p>
            <p className="my-1">Discount</p>
            <p>Grand Total</p>
          </div>
          <div className="text-end">
            <p>{(flight.price + flight.price * 0.01) * totalPassengers} ৳</p>
            <p className="my-1">
              {" "}
              -{" "}
              {(
                (flight.price + flight.price * 0.01) *
                totalPassengers *
                0.05
              ).toFixed(2)}{" "}
              ৳
            </p>
            <p>
              {" "}
              {(
                (flight.price + flight.price * 0.01) *
                totalPassengers *
                0.95
              ).toFixed(2)}
              ৳{" "}
            </p>
          </div>
        </div>
      </div>
      {/* Fare Policy */}
      <div className="bg-white p-4 rounded-md shadow-md mt-4 mb-20">
        <h1 className="bg-[#d7e7f4] px-2 p-1 font-semibold text-sm text-[#32d095]">
          FARE POLICY
        </h1>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
          <div>
            <h4 className=" bg-[#d7e7f4] max-w-[150px] text-center py-1 mb-2 mt-4">
              Cancellation
            </h4>
            <p>Refund Amount = Paid Amount - Airline Cancellation Fee</p>
          </div>
          <div>
            <h4 className=" bg-[#d7e7f4] max-w-[150px] text-center py-1 mb-2 mt-4">
              Re-Issue
            </h4>
            <p>Re-issue Fee = {"Airline's"} Fee + Fare Difference</p>
          </div>
          <div>
            <h4 className=" bg-[#d7e7f4] max-w-[150px] text-center py-1 mb-2">
              Refund
            </h4>
            <p>Refund Fee = {"Airline's"} Fee + Fare Difference</p>
          </div>
          <div>
            <h4 className=" bg-[#d7e7f4] max-w-[150px] text-center py-1 mb-2 ">
              Void
            </h4>
            <p>Void Fee = {"Airline's"} Fee + Fare Difference</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#32d095] text-white p-4 fixed bottom-0 right-0 w-[50vw] shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Total (include VAT)</p>
            <h3 className="text-lg font-medium">
              Fare :{" "}
              {(
                (flight.price + flight.price * 0.01) *
                totalPassengers *
                0.95
              ).toFixed(2)}
              ৳
            </h3>
          </div>
          <button className="bg-[#525371] px-8 py-1 rounded-full">
            Book & Hold
          </button>
        </div>
      </div>
    </Box>
  );

  return (
    <div>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <button
            className="text-[11px] hidden lg:flex text-right cursor-pointer uppercase"
            onClick={toggleDrawer(anchor, true)}
          >
            Flight Details <FaCaretRight size={15} />
          </button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list()}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
