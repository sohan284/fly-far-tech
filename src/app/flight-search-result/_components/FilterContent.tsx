"use client";

import React from "react";

interface FilterContentProps {
  sortBy: "cheapest" | "fastest";
  handleSortChange: (type: "cheapest" | "fastest") => void;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  filters: {
    refundable: boolean;
    nonRefundable: boolean;
    nonStop: boolean;
    oneStop: boolean;
    onePlusStops: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    refundable: boolean;
    nonRefundable: boolean;
    nonStop: boolean;
    oneStop: boolean;
    onePlusStops: boolean;
  }>>;
  handleReset: () => void;
}

const FilterContent: React.FC<FilterContentProps> = ({
  sortBy,
  handleSortChange,
  priceRange,
  setPriceRange,
  filters,
  setFilters,
  handleReset
}) => {
  return (
    <div className="min-h-[90vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">FILTER</h2>
        <button className="text-gray-500 text-sm" onClick={handleReset}>
          RESET
        </button>
      </div>

      {/* Sort buttons */}
      <div className="flex mb-6 gap-2">
        <button
          className={`px-4 py-2 text-sm rounded ${
            sortBy === "cheapest"
              ? "bg-[#32d095] text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSortChange("cheapest")}
        >
          CHEAPEST
        </button>
        <button
          className={`px-4 py-2 text-sm rounded ${
            sortBy === "fastest"
              ? "bg-[#32d095] text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSortChange("fastest")}
        >
          FASTEST
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6 text-[#32d095]">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold">Price Range</h3>
          <span className="cursor-pointer">▲</span>
        </div>
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="100000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm">৳ {priceRange[0]}</span>
            <span className="text-sm">৳ {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Fare Type */}
      <div className="mb-6 text-[#32d095]">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold">Fare Type</h3>
          <span className="cursor-pointer">▲</span>
        </div>
        <div className="mt-2">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={filters.refundable}
              onChange={() =>
                setFilters({
                  ...filters,
                  refundable: !filters.refundable,
                })
              }
              className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm">Refundable</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.nonRefundable}
              onChange={() =>
                setFilters({
                  ...filters,
                  nonRefundable: !filters.nonRefundable,
                })
              }
              className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm">Non Refundable</span>
          </label>
        </div>
      </div>

      {/* Stops */}
      <div className="mb-6 text-[#32d095]">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold">Stops</h3>
          <span className="cursor-pointer">▲</span>
        </div>
        <div className="mt-2">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={filters.nonStop}
              onChange={() =>
                setFilters({ ...filters, nonStop: !filters.nonStop })
              }
              className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm">Non Stop</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={filters.oneStop}
              onChange={() =>
                setFilters({ ...filters, oneStop: !filters.oneStop })
              }
              className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm">One Stop</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterContent;