"use client";
import React, { useState } from "react";
import Image from "next/image";
import bg from "../assets/Images/landing.jpg";
import logo from "../assets/Images/logo.png";
import { HiOutlineMail } from "react-icons/hi";
import { IoDownloadOutline } from "react-icons/io5";
import RegisterModal from "@/components/Modals/RegisterModal";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import TechInnov from "../components/Modals/techInnov"

function Page() {
  const randomCalls = [
    { id: 1, title: "Call for Proposal 1" },
    { id: 2, title: "Call for Proposal 2" },
    { id: 3, title: "Call for Proposal 3" },
    { id: 4, title: "Call for Proposal 4" },
    { id: 5, title: "Call for Proposal 5" },
  ];
  const [hasCalls, setHasCalls] = useState(true);
  const [isOpenRegister, { open: openRegister, close: closeRegister }] = useDisclosure(false);
  const [isOpenLogin, { open: openLogin, close: closeLogin }] = useDisclosure(false);

export default function Home() {
  const [isOpen, { open, close }] = useDisclosure(true);
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
      <div className="absolute top-0 left-0 w-full p-6 lg:p-8 flex items-center justify-between z-20">
        <div>
          <Image src={logo} alt="logo" width={400} height={400} />
        </div>
        <div className="flex gap-4 ml-auto">
          <button className="py-2 px-4 lg:px-8 bg-white font-bold text-[#005DE9] rounded-full" onClick={openLogin}>
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

      <div className="absolute flex justify-center flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30 w-full">
        <h1 className="font-extrabold text-black text-2xl w-[50%] md:text-4xl">
          Welcome To SDF GRANT MANAGEMENT SYSTEM
        </h1>
        <h2 className="text-black w-[40%] text-md md:text-xl mt-4 font-normal">
          Unfortunately there is no open call. Please subscribe to get notified when there is a new call.
        </h2>
        <div className="w-[80%] overflow-x-scroll no-scrollbar my-10">
          <div className="flex space-x-4">
            {hasCalls && randomCalls.map((call) => (
              <div key={call.id} className="min-w-[300px] p-4 bg-white rounded-full flex justify-between items-center shadow-md">
                <h3 className="font-bold text-black">{call.title}</h3>
                <button className="bg-[#005DE9] bg-opacity-10 text-[#005DE9] font-bold rounded-full px-4 py-2">
                  View details
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 w-[40%] md:w-[30%] bg-white mt-5 rounded-full justify-center items-center flex">
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

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
      <div className="absolute bottom-0 right-0 p-4 z-30">
        <button className="py-2 px-4 lg:px-8 bg-white font-bold text-[#005DE9] flex items-center rounded-full">
          <IoDownloadOutline className="w-4 h-4 mx-2" />
          Download User Manual
        </button>
      </div>

      <RegisterModal isOpenRegister={isOpenRegister} closeRegister={closeRegister} />
      <LoginModal opened={isOpenLogin} close={closeLogin} />
    </div>
  );
}

export default Page;
