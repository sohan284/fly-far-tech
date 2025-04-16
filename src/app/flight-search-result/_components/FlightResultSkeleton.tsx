// _components/FlightResultSkeleton.tsx
"use client";

import React from "react";

const FlightResultSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-4 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between">
        {/* Airline logo skeleton */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Journey details skeleton */}
        <div className="flex-1 mx-2 flex flex-col md:flex-row items-start md:items-center justify-around md:justify-center">
          <div className="flex flex-col items-center mb-2 md:mb-0">
            <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Journey line */}
          <div className="hidden md:flex items-center justify-center w-24">
            <div className="h-0.5 bg-gray-200 w-full"></div>
          </div>

          <div className="flex flex-col items-center mb-2 md:mb-0">
            <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Price details skeleton */}
        <div className="flex flex-col items-center md:items-end">
          <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Details skeleton */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap justify-between">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        </div>
      </div>
    </div>
  );
};

export default FlightResultSkeleton;