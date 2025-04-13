"use client";

import banner from "@/app/assets/banner.webp";
import CarouselHome from "./_components/CarouselHome";
import HotDeals from "./_components/HotDeals";
import Footer from "./_components/Footer";
import FilterTabs from "./_components/FilterTabs";
import { useState } from "react";
import SearchSectionFlight from "./_components/SearchSectionFlight";
import SearchSectionHotel from "./_components/SearchSectionHotel";
import SearchSectionTour from "./_components/SearchSectionTour";
import SearchSectionVisa from "./_components/SearchSectionVisa";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      <div className="px-5 mt-10">
        {/* Banner Section */}
        <div
          className="max-w-[1620px] mx-auto rounded-lg relative p-8 z-10"
          style={{
            backgroundImage: `url(${banner.src})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          <div className="absolute inset-0 bg-black rounded-lg opacity-10"></div>

          <div className="relative">
            <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          {activeTab === 0 ? (
            <SearchSectionFlight />
          ) : activeTab === 1 ? (
            <SearchSectionHotel />
          ) : activeTab === 2 ? (
            <SearchSectionTour />
          ) : (
            <SearchSectionVisa />
          )}
        </div>
        <CarouselHome />
        <HotDeals />
      </div>
      <Footer />
    </div>
  );
}
