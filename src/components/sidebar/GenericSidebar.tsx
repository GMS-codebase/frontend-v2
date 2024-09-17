"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Image from "next/image";
import logo from "@/assets/Images/dashboard-logo.png";
import { BiLogOut } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Skeleton } from "@mantine/core";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
// import { LOGOUT_SUCCESS } from "@/actions/AuthActions";
import { Route } from "@/types";
import { ArrowLeft } from "solar-icon-set";
import { PiCaretLeftBold } from "react-icons/pi";
import { setCookie } from "cookies-next";

const GenericSidebar = ({
  routes,
  isCompressed,
  toggle,
  isDynamic,
  loading,
}: {
  routes: Route[];
  isCompressed: boolean;
  toggle: () => void;
  isDynamic?: boolean;
  loading?: boolean;
}) => {
  const active = usePathname();
  const isActiveLink = (path: string, index: number) => {
    if (index === 0) return active === path;
    return active.startsWith(path);
  };
  return (
    <div className={`w-full h-full flex flex-col`}>
      <div
        className={`flex ${
          isCompressed ? "flex-col gap-2 mb-8 " : "flex-row mb-5"
        } items-center justify-start pt-4 pl-4 gap-2 cursor-pointer   relative`}
      >
        <Image src={logo} className="w-[80px] h-[60px]" alt="" />
        <h1 className="text-2xl uppercase text-primary font-bold">GMS</h1>

        <button
          onClick={toggle}
          className={`absolute  ${
            isCompressed
              ? "rotate-180  left-[80%]    top-[18vh]"
              : "left-[95%]    top-[5vh]"
          }  flex items-center gap-0 bg-primary rounded-full h-fit py-1.5 px-1`}
        >
          <PiCaretLeftBold color="#fff" size={20} />
          <PiCaretLeftBold color="#fff" size={20} className="-ml-3" />
        </button>
      </div>
      <h1 className="text-lg text-neutral-400 p-3">Menu</h1>
      <div className="w-full h-screen overflow-y-auto pb-[17vh] sidebar-container">
        {isDynamic && loading ? (
          <div className="w-full flex flex-col gap-3">
            <Skeleton width={"100%"} height={100} />
            <Skeleton width={"100%"} height={100} />
            <Skeleton width={"100%"} height={100} />
            <Skeleton width={"100%"} height={100} />
            <Skeleton width={"100%"} height={100} />
            <Skeleton width={"100%"} height={100} />
            <Skeleton width={"100%"} height={100} />
          </div>
        ) : (
          routes.map((route, index: any) => {
            if (isCompressed)
              return (
                <div key={index} className="mx-2">
                  <Link
                    onClick={() => setCookie("breadcrumb", route.label)}
                    href={route.path}
                    className={`flex items-center justify-center gap-5  py-3 my-1 ${
                      isActiveLink(route.path, index)
                        ? "bg-primary text-white"
                        : "bg-white hover:bg-blue-200"
                    }  cursor-pointer rounded-full`}
                  >
                    <span
                      className={
                        isActiveLink(route.path, index)
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
                <div key={index} className="mx-2">
                  <Link
                    onClick={() => setCookie("breadcrumb", route.label)}
                    href={route.path}
                    className={`flex items-center gap-5  py-3 my-1  px-4 ${
                      isActiveLink(route.path, index)
                        ? "bg-primary text-white"
                        : "bg-white hover:bg-blue-200"
                    }  cursor-pointer rounded-full`}
                  >
                    <span
                      className={
                        isActiveLink(route.path, index)
                          ? "text-white font-extrabold text-3xl"
                          : "text-black font-extrabold text-3xl"
                      }
                    >
                      {route.icon}
                    </span>
                    <span
                      className={`text-lg ${
                        isActiveLink(route.path, index)
                          ? "font-semibold text-white"
                          : ""
                      } hidden lg:inline`}
                    >
                      {route.label}
                    </span>
                  </Link>
                </div>
              );
          })
        )}
      </div>
    </div>
  );
};

export default GenericSidebar;
