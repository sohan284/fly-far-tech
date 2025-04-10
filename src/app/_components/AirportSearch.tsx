import React, { useState, useRef, useEffect } from "react";
import { Airport, airports } from "../data/airports";
import { RiMapPin2Line } from "react-icons/ri";

interface AirportSearchProps {
  label: string;
  value: Airport | null;
  onChange: (airport: Airport) => void;
}

const AirportSearch: React.FC<AirportSearchProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredAirports = airports.filter(
    (airport) =>
      airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-gray-600 font-medium mb-1 text-center">
        {label}
      </label>
      <h1 className="text-center text-[40px] text-[#32d095] mt-1 mb-2">
        {value ? value.code : airports[0]?.code}
      </h1>
      <div
        className="bg-[#d7e7f4] rounded flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <>
          <span className="bg-[#32d095] font-bold p-2 rounded-l">
            {" "}
            <RiMapPin2Line size={20} />
          </span>
          {value ? (
            <span className=" text-gray-800 py-1 px-2 text-sm font-medium text-nowrap overflow-hidden text-ellipsis">
              {value.name} ({value.code})
            </span>
          ) : (
            <span className=" text-gray-800 py-1 pl-2 text-sm font-medium">
              {airports[0]?.name}
            </span>
          )}
        </>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#32d095] shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#32d095] bg-white placeholder-[#32d095] text-[#32d095] text-[14px]"
              placeholder="Search a airport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="py-1 bg-[#32d095]">
            {filteredAirports.map((airport) => (
              <div
                key={airport.code}
                className="px-4 py-2 hover:bg-[#525371] cursor-pointer"
                onClick={() => {
                  onChange(airport);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  {/* <span className="text-[#32d095] font-bold mr-2">
                    {airport.code}
                  </span> */}
                  <div>
                    <div className="text-sm font-medium text-zinc-200">
                      {airport.name}
                    </div>
                    <div className="text-xs text-white">
                      {airport.city}, {airport.country}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSearch;
