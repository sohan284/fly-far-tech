import React from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import Image from "next/image";
import cirtification1 from "@/app/assets/pay1.png";
import cirtification2 from "@/app/assets/pay2.png";
import cirtification3 from "@/app/assets/pay3.png";
import cirtification4 from "@/app/assets/pay4.png";
import cirtification5 from "@/app/assets/pay5.png";
import paywith from "@/app/assets/paywith.png";
import { IoIosSend } from "react-icons/io";
const Footer = () => {
  return (
    <div className="bg-[#32d095] text-white py-10 mt-20 mb-5 border-t-3 border-[#525371]">
      <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Need Help Section */}
        <div>
          <h3 className="text-md font-bold mb-4 ">Need Help</h3>
          <p className="flex items-center mb-2 text-sm">
            <FaMapMarkerAlt className="mr-2" />
            Ka 11/2A, Bashundhara R/A Road, Jagannathpur, Dhaka 1229
          </p>
          <p className="flex items-center mb-2 text-sm">
            <FaEnvelope className="mr-2" />
            support@flyfarint.com
          </p>
          <p className="flex items-center mb-2 text-sm">
            <FaPhoneAlt className="mr-2" />
            +880 1755 572 099
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaWhatsapp className="cursor-pointer" />
          </div>
        </div>

        {/* Discover Section */}
        <div>
          <h3 className="text-md font-bold mb-4">Discover</h3>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Payment Method</li>
            <li>Terms and Condition</li>
            <li>Privacy Policy</li>
            <li>Refund & Cancellation Policy</li>
          </ul>
        </div>

        {/* Certification Section */}
        <div>
          <h3 className="text-md font-bold mb-4">Certification</h3>
          <div className="grid grid-cols-2 gap-4">
            <Image src={cirtification1} alt="IATA" width={80} height={40} />
            <Image src={cirtification2} alt="ATAB" width={80} height={40} />
            <Image src={cirtification3} alt="Taab" width={80} height={40} />
            <Image src={cirtification4} alt="PATA" width={80} height={40} />
            <Image src={cirtification5} alt="Agent" width={80} height={40} />
          </div>
        </div>

        {/* Get In Touch Section */}
        <div>
          <h3 className="text-md font-bold mb-4">Get In Touch</h3>
          <p className="mb-4">
            Question or feedback we would love to hear from you
          </p>
          <div className="flex items-center bg-white rounded-full overflow-hidden relative">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 px-4 py-2 text-gray-700 focus:outline-none"
            />
            <button className="bg-[#32d095] text-white mr-2 p-2 rounded-full absolute right-0 cursor-pointer">
              <IoIosSend />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto flex items-center justify-center mt-20">
        <h3 className="text-md font-bold mx-2">Pay With</h3>
        <div className="max-w-[600px] border-x px-2 border-[#98e7ca]">
          <Image src={paywith} alt="Agent" />
        </div>
      </div>
      <div className="mt-10 border-t-2 border-[#eeeeee] pt-6 max-w-[1200px] mx-auto">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <p className="text-sm">
            © Copyright 2025 by Fly Far Tech | B2C OTA Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
