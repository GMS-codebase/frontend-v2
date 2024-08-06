"use client";
import React, { useState } from "react";
import Image from "next/image";
import bg from "../assets/Images/landing.jpg";
import logo from "../assets/Images/logo.png";
import { HiOutlineMail } from "react-icons/hi";
import { IoDownloadOutline } from "react-icons/io5";
import RegisterModal from "@/components/Modals/RegisterModal";
import { useDisclosure } from "@mantine/hooks";
import LoginModal from "@/components/Modals/Login";
import CallModal from "@/components/Modals/techInnov";
import SuccessModal from "@/components/Modals/success";
import { SolarFolder2Bold } from "@/components/core/icons";

function Page() {
  const randomCalls = [
    { id: 1, title: "Call for Proposal 1" },
    { id: 2, title: "Call for Proposal 2" },
    { id: 3, title: "Call for Proposal 3" },
    { id: 4, title: "Call for Proposal 4" },
    { id: 5, title: "Call for Proposal 5" },
  ];
  const [hasCalls, setHasCalls] = useState(true);
  const [isOpenRegister, { open: openRegister, close: closeRegister }] =
    useDisclosure(false);
  const [isOpenLogin, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);
  const [isOpenSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);
  const [isOpenCall, { open: openCall, close: closeCall }] =
    useDisclosure(false);

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-white opacity-60 z-10"></div>
      <div className="image">
        <Image
          src={bg}
          alt="home"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="opacity-90"
        />
      </div>
      <div className="absolute top-0 left-0 w-full px-[5vw] py-6 flex items-center justify-between z-20">
        <div>
          <Image src={logo} alt="logo" width={360} height={360} />
        </div>
        <div className="flex gap-4 ml-auto">
          <button
            className="py-2 px-4 lg:px-8 bg-white font-bold text-primary rounded-full"
            onClick={openLogin}
          >
            Login
          </button>
          <button
            className="py-2 px-4 lg:px-8 text-white font-bold bg-primary rounded-full"
            onClick={openRegister}
          >
            Register
          </button>
        </div>
      </div>

      <div className="absolute flex justify-center flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30 w-full">
        <h1 className="font-extrabold text-black text-2xl w-[50%] md:text-4xl">
          Welcome To SDF GRANT MANAGEMENT SYSTEM
        </h1>
        <h2 className="text-black w-[40%] text-md md:text-xl mt-4 font-normal">
          Unfortunately there is no open call. Please subscribe to get notified
          when there is a new call.
        </h2>
        <div
          className="w-[80%] overflow-x-auto no-scrollbar m-10"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex space-x-4">
            {hasCalls &&
              randomCalls.map((call) => (
                <div
                  key={call.id}
                  className="min-w-[350px] p-4 bg-white rounded-full flex justify-between items-center shadow-md"
                >
                  <SolarFolder2Bold className="w-8 h-8 text-[#005DE9]"/>
                  <h3 className="font-bold text-black">{call.title}</h3>
                  <button
                    className="bg-[#1F5DB014] text-primary font-bold rounded-full px-4 py-2"
                    onClick={openCall}
                  >
                    View details
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="p-3 w-[40%] md:w-[30%] bg-white mt-5 rounded-full justify-center items-center flex">
          <HiOutlineMail className="text-primary ml-3 w-8 h-8" />
          <input
            type="text"
            className="w-full ml-3 border-none text-black bg-white outline-none"
            placeholder="Type your email"
          />
          <button className="bg-[#1F5DB014] bg-opacity-10 text-primary font-bold rounded-full px-4 py-2">
            Subscribe
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-4 z-30">
        <h2 className="text-black font-extrabold">
          © 2024 Rwanda TVET Board.
        </h2>
      </div>
      <div className="absolute bottom-0 right-0 p-4 z-30">
        <button className="py-2 px-4 lg:px-8 bg-white font-bold text-primary flex items-center rounded-full">
          <IoDownloadOutline className="w-4 h-4 mx-2" />
          Download User Manual
        </button>
      </div>
      <RegisterModal
        openSuccess={openSuccess}
        isOpenRegister={isOpenRegister}
        closeRegister={closeRegister}
        openLogin={openLogin}
      />
      <LoginModal
        opened={isOpenLogin}
        close={closeLogin}
        openRegister={openRegister}
      />
      <SuccessModal opened={isOpenSuccess} close={closeSuccess}/>
      <CallModal opened={isOpenCall} close={closeCall} />
    </div>
  );
}

export default Page;
