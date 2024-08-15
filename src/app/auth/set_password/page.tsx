"use client";
import React from "react";
import logo from "../../../assets/Images/logo2.png";
import side from "../../../assets/Vectors/sidevecto.svg";
import side2 from "../../../assets/Vectors/sidevector2.svg";
import Image from "next/image";
import { SolarLockKeyholeMinimalisticOutline } from "@/components/core/icons";
import { IoMdClose } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";

function Page() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const close = () => {
    // Add functionality to close the modal or navigate away
  };

  return (
    <div className="relative w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Image src={logo} alt="Logo" className="w-[400px] h-auto" />
        <div className="w-[40vw] h-[70vh] flex-col gap-4 rounded-2xl bg-white p-10 relative flex items-center justify-center">
          
          <Image
            src={side}
            alt=""
            className="absolute right-0 bottom-[30%] w-8"
          />
          <Image src={side2} alt="" className="absolute left-0 top-[10%] w-8" />

          <div className="w-full flex flex-col gap-10 relative">
            <div className="absolute top-3 right-3 m-4 text-center mt-0">
              <button
                onClick={close}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-center font-bold mb-4">
              <h2 className="text-3xl font-bold text-primaryText">
                Set password
              </h2>
              <p className="text-primaryText opacity-40 font-medium text-xl">
                Provide your password below.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 text-primaryText"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold">
                  Email
                </label>
                <div className="relative w-full">
                  <span className="inline-block mr-2 absolute top-3 left-2">
                    <SolarLockKeyholeMinimalisticOutline />
                  </span>
                  <input
                    type="email"
                    id="email"
                    placeholder="type in your email"
                    name="email"
                    className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-8 outline-primary transition-all duration-150"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 font-semibold">
                <label htmlFor="password" className="font-semibold">
                  Password
                </label>
                <div className="relative w-full">
                  <span className="inline-block mr-2 absolute top-3 left-2">
                    <SolarLockKeyholeMinimalisticOutline />
                  </span>
                  <input
                    type="password"
                    id="password"
                    placeholder="type in password"
                    name="password"
                    className="w-full bg-gray-100 p-4 py-2 rounded-xl pl-8 outline-primary transition-all duration-150"
                    required
                  />
                </div>
              </div>
              <div className="border text-center bg-primary rounded-full p-2 text-white font-semibold text-xl">
                <input type="submit" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-4 z-30">
        <h2 className="text-black font-extrabold">© 2024 Rwanda TVET Board.</h2>
      </div>
      <div className="absolute bottom-0 right-0 p-4 z-30">
        <button className="py-2 px-4 lg:px-8 bg-white font-bold text-primary flex items-center rounded-full">
          <IoDownloadOutline className="w-4 h-4 mx-2" />
          Download User Manual
        </button>
      </div>
    </div>
  );
}

export default Page;
