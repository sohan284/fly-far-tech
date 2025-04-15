import React, { useRef } from "react";
import Slider from "react-slick";
import slider1 from "@/app/assets/sliderimg1.webp";
import slider2 from "@/app/assets/sliderimg2.webp";
import slider3 from "@/app/assets/sliderimg3.webp";
import slider4 from "@/app/assets/sliderimg4.webp";
import slider5 from "@/app/assets/sliderimg5.webp";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function CarouselHome() {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots: string) => (
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          justifyContent: "right",
          width: "100%",
        }}
      >
        <ul style={{ margin: "0", padding: "0" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "#d3ebfd",
          borderRadius: "50%",
          cursor: "pointer",
        }}
      ></div>
    ),
  };

  const sliderImages = [slider1, slider2, slider3, slider4, slider5];

  return (
    <div className="slider-container my-10 max-w-[1200px] mx-auto lg:px-5 relative">
      <Slider ref={sliderRef} {...settings}>
        {sliderImages.map((image, index) => (
          <div key={index} className="relative w-full h-[220px]">
            <Image
              src={image}
              alt={`Slider Image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
