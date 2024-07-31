"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Image from "next/image";
import logo from "@/assets/Images/dashboard-logo.png";
import { BiLogOut } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
// import { LOGOUT_SUCCESS } from "@/actions/AuthActions";
import { Route } from "@/types";
import { ArrowLeft } from "solar-icon-set";
import { PiCaretLeftBold } from "react-icons/pi";

const GenericSidebar = ({
  routes,
  isCompressed,
  toggle,
}: {
  routes: Route[];
  isCompressed: boolean;
  toggle: () => void;
}) => {
  const active = usePathname();
  return (
    <div className={`w-full h-full flex flex-col`}>
      <div
        className={`flex ${isCompressed ? "flex-col gap-8" : "flex-row"} items-center justify-start pt-4 pl-4 gap-4 cursor-pointer mb-6 pb-10 relative`}
      >
        <Image src={logo} className="w-[117px] h-[72px]" alt="" />
        <h1 className="text-2xl uppercase text-[#005DE9] font-bold">GMS</h1>

        <button
          onClick={toggle}
          className={`absolute right-4 inset-y-0 ${isCompressed && "rotate-180 top-5"} flex items-center`}
        >
          <PiCaretLeftBold color="#0075FF" size={25} />
          <span className="-ml-4">
            <PiCaretLeftBold color="#0075FF" size={25} />
          </span>
        </button>
      </div>
      <h1 className="text-lg text-neutral-400 p-3">Menu</h1>
      <div className="w-full h-screen overflow-y-auto pb-[17vh] sidebar-container">
        {routes.map((route, index) => {
          if (isCompressed)
            return (
              <div key={index} className="mx-4">
                <Link
                  href={route.path}
                  className={`flex items-center justify-center gap-5 px-4 py-3 my-1 ${active === route.path ? "bg-[#005DE9] text-white" : "bg-white hover:bg-blue-200"}  cursor-pointer rounded-full`}
                >
                  <span
                    className={
                      active === route.path
                        ? "text-white font-extrabold text-3xl"
                        : "text-black font-extrabold text-3xl"
                    }
                  >
                    {route.icon}
                  </span>
                </Link>
              </div>
            );
          else
            return (
              <div key={index} className="mx-4">
                <Link
                  href={route.path}
                  className={`flex items-center gap-5 px-4 py-3 my-1 pl-10 ${active === route.path ? "bg-[#005DE9] text-white" : "bg-white hover:bg-blue-200"}  cursor-pointer rounded-full`}
                >
                  <span
                    className={
                      active === route.path
                        ? "text-white font-extrabold text-3xl"
                        : "text-black font-extrabold text-3xl"
                    }
                  >
                    {route.icon}
                  </span>
                  <span
                    className={`text-lg ${active === route.path ? "font-semibold text-white" : ""} hidden lg:inline`}
                  >
                    {route.label}
                  </span>
                </Link>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default GenericSidebar;
