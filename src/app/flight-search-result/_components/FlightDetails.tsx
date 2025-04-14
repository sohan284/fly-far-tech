import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { FaCaretRight } from "react-icons/fa";
import CardContents from "./CardContents";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
  passengers: Passengers;
}

export default function FlightDetails({ flight }: { flight: Flight }) {
  const [state, setState] = React.useState({
    right: false,
  });

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
      <h1 className="bg-[#d7e7f4] px-2 p-1 font-semibold text-sm  mx-4 m-6 text-[#32d095]">
        FARE SUMMARY GBDGB
      </h1>
      {/* Fare Summary */}
      <div className="mx-4">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#464a63", // Set background color
                }}
              >
                <TableCell sx={{ color: "white", fontWeight: "semibold" }}>
                  Pax Type
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "semibold" }}>
                  Base Fare (BDT)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "semibold" }}>
                  Tax Fees (BDT)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "semibold" }}>
                  Per Passenger
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "semibold" }}>
                  Total Cost (BDT)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Adult</TableCell>
                <TableCell>{flight.price}</TableCell>
                <TableCell>{flight.price * 0.1} ৳</TableCell>
                <TableCell>
                  {flight.price + flight.price * 0.1} *{" "}
                  {console.log(
                    flight.passengers.adult,
                    flight.passengers.child,
                    flight.passengers.infant
                  )}
                  {parseInt(
                    flight.passengers.adult +
                      flight.passengers.child +
                      flight.passengers.infant
                  )}
                  ৳
                </TableCell>
                <TableCell>{flight.price + flight.price * 0.01} ৳</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-right border-t border-gray-300 font-medium"
                >
                  Total
                </TableCell>
                <TableCell className="border-t border-gray-300 text-[#32d095] font-medium">
                  6199 ৳
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Discount
                </TableCell>
                <TableCell className="text-[#32d095] font-medium">
                  660 ৳
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Grand Total
                </TableCell>
                <TableCell className="text-[#32d095] font-medium">
                  5539 ৳
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Baggage Information */}
      <div className="bg-white p-4 rounded-md shadow-md mt-4">
        <h3 className="text-lg font-bold text-gray-800">Baggage</h3>
        <table className="w-full mt-2 text-sm text-gray-600">
          <thead>
            <tr>
              <th className="text-left">Pax Type</th>
              <th className="text-right">Check-In</th>
              <th className="text-right">Cabin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adult</td>
              <td className="text-right">20 Kg</td>
              <td className="text-right">7 Kg</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Fare Policy */}
      <div className="bg-white p-4 rounded-md shadow-md mt-4">
        <h3 className="text-lg font-bold text-gray-800">Fare Policy</h3>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
          <div>
            <h4 className="font-bold">Cancellation</h4>
            <p>Refund Amount = Paid Amount - Airline Cancellation Fee</p>
          </div>
          <div>
            <h4 className="font-bold">Re-Issue</h4>
            <p>Re-issue Fee = {"Airline's"} Fee + Fare Difference</p>
          </div>
          <div>
            <h4 className="font-bold">Refund</h4>
            <p>Refund Fee = {"Airline's"} Fee + Fare Difference</p>
          </div>
          <div>
            <h4 className="font-bold">Void</h4>
            <p>Void Fee = {"Airline's"} Fee + Fare Difference</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#32d095] text-white p-4 fixed bottom-0 right-0 w-[50vw] shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">
            Total (include VAT): {flight.price}৳
          </h3>
          <button className="bg-gray-800 px-4 py-2 rounded">Book & Hold</button>
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
