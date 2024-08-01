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



function Page() {
    const [isOpenRegister, { open: openRegister, close: closeRegister }] =
        useDisclosure(false);
    const [isOpenLogin, { open: openLogin, close: closeLogin }] =
        useDisclosure(false);

    return (
        <div className="relative h-screen">
            <div className="absolute inset-0 bg-white opacity-60 z-10"></div>
            <div className="image h-full">
                <Image
                    src={bg}
                    alt="home"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="opacity-90"
                />
            </div>
            <div className="absolute top-0 left-0 w-full p-6 lg:p-8 flex items-center justify-between z-20">
                <div>
                    <Image src={logo} alt="logo" width={400} height={400} />
                </div>
                <div className="flex gap-4 ml-auto">
                    <button
                        className="py-2 px-4 lg:px-8 bg-white font-bold text-[#005DE9] rounded-full"
                        onClick={openLogin}
                    >
                        Login
                    </button>
                    <button
                        className="py-2 px-4 lg:px-8 text-white font-bold bg-[#005DE9] rounded-full"
                        onClick={openRegister}
                    >
                        Register
                    </button>
                </div>
            </div>

            <div className="absolute flex justify-center flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30">
                <h1 className="font-extrabold text-black text-2xl md:text-4xl">
                    Welcome To SDF GRANT MANAGEMENT SYSTEM
                </h1>
                <h2 className="text-black text-md md:text-xl w-[90%] md:w-[75%] mt-4 font-normal">
                    Unfortunately there is no open call. Please subscribe to get
                    notified when there is a new call.
                </h2>
                <div className="p-3 bg-white w-[80%] md:w-[70%] mt-5 rounded-full justify-center items-center flex">
                    <HiOutlineMail className="text-[#005DE9] ml-3 w-8 h-8" />
                    <input
                        type="text"
                        className="w-full ml-3 border-none text-black bg-white outline-none"
                        placeholder="Type your email"
                    />
                    <button className="bg-[#005DE9] bg-opacity-10 text-[#005DE9] font-bold rounded-full px-4 py-2">
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
                <button className="py-2 px-4 lg:px-8 bg-white font-bold text-[#005DE9] flex items-center rounded-full">
                    <IoDownloadOutline className="w-4 h-4 mx-2" />
                    Download User Manual
                </button>
            </div>

            <RegisterModal
                isOpenRegister={isOpenRegister}
                closeRegister={closeRegister}
            />
            <LoginModal opened={isOpenLogin} close={closeLogin} />
        </div>
    );
}

export default Page;
