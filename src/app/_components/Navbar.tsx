import Image from "next/image";
import React from "react";
import logo from "@/app/assets/logo.png";

const Navbar = () => {
  return (
    <div className="">
      <div className="max-w-[1150px] mx-auto pt-4">
        <Image src={logo} alt="Company Logo" width={140} height={60} />
      </div>
    </div>
  );
};

export default Navbar;
