"use client";
import Image from "next/image";
import React from "react";
import logo from "@/app/assets/logo.png";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="px-3 bg-[#edf2f6]">
      <div className="flex justify-between items-center max-w-[1150px] mx-auto pt-4">
        <Image
          onClick={() => router.push("/")}
          className="cursor-pointer"
          src={logo}
          alt="Company Logo"
          width={140}
          height={60}
        />
        <div>
          <Button
            size="small"
            variant="contained"
            sx={{
              borderRadius: "20px",
              backgroundColor: "#32d095",
              marginRight: "10px",
              color: "white",
              padding: "5px 20px",
            }}
          >
            Travel Agency
          </Button>
          <Button
            variant="contained"
            size="small"
            href="#contained-buttons"
            sx={{
              borderRadius: "50px",
              backgroundColor: "#525371",
              color: "white",
              padding: "5px 20px",
            }}
          >
            Login / Signup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
