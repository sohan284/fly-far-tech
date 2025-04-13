import React, { useState } from "react";
import Image from "next/image";
import flightImg1 from "@/app/assets/hotdealflightimg1.webp";
import flightImg2 from "@/app/assets/hotdealflightimg2.webp";
import flightImg3 from "@/app/assets/hotdealflightimg3.webp";
import groupImg1 from "@/app/assets/hotdealgroupfareimg1.webp";
import groupImg2 from "@/app/assets/hotdealgroupfareimg2.webp";
import groupImg3 from "@/app/assets/hotdealgroupfareimg3.webp";
import tourImg1 from "@/app/assets/hotdealtourimg1.webp";
import tourImg2 from "@/app/assets/hotdealtourimg2.webp";
import tourImg3 from "@/app/assets/hotdealtourimg3.webp";
import visaImg1 from "@/app/assets/hotdealvisaimg1.webp";
import visaImg2 from "@/app/assets/hotdealvisaimg2.webp";
import visaImg3 from "@/app/assets/hotdealvisaimg3.webp";

const HotDeals = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      label: "FLIGHT",
      images: [
        { src: flightImg1, title: "Flight Deal 1" },
        { src: flightImg2, title: "Flight Deal 2" },
        { src: flightImg3, title: "Flight Deal 3" },
      ],
    },
    {
      id: 1,
      label: "GROUP FARE",
      images: [
        { src: groupImg1, title: "Group Fare 1" },
        { src: groupImg2, title: "Group Fare 2" },
        { src: groupImg3, title: "Group Fare 3" },
      ],
    },
    {
      id: 2,
      label: "TOUR",
      images: [
        { src: tourImg1, title: "Tour Deal 1" },
        { src: tourImg2, title: "Tour Deal 2" },
        { src: tourImg3, title: "Tour Deal 3" },
      ],
    },
    {
      id: 3,
      label: "VISA",
      images: [
        { src: visaImg1, title: "Visa Deal 1" },
        { src: visaImg2, title: "Visa Deal 2" },
        { src: visaImg3, title: "Visa Deal 3" },
      ],
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Tabs Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-800 font-bold">Hot Deals</h1>
        <div className="bg-[#32d095] p-2 rounded-full flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer text-[12px] px-6 py-2 rounded-full flex flex-wrap justify-center items-center gap-3 font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[#525371] text-white"
                  : "bg-transparent text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {activeTabData?.images.map((image, index) => (
          <div key={index} className="bg-white overflow-hidden">
            <div className="relative w-full h-[210px]">
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotDeals;
