"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/Images/dashboard-logo.png";
import { PiCaretLeftBold } from "react-icons/pi";
import { setCookie } from "cookies-next";
import { Route } from "@/types";
import { CloseSquare, HamburgerMenu } from "solar-icon-set";
import { Skeleton } from "@mantine/core";

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
  const navigate = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isActiveLink = (path: string, index: number) => {
    if (index === 0) return active === path;
    return active.startsWith(path);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        className={`${!isSidebarOpen ? "lg:hidden flex items-center text-white bg-blue-600 justify-center fixed top-2 left-2 z-50 w-6 h-6 rounded-full" : "bg-white"}`}
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {!isSidebarOpen && <HamburgerMenu className="rounded-full" />}
      </button>

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-white lg:bg-none lg:shadow-none shadow-lg z-40 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 w-[250px] lg:w-full flex flex-col`}
      >
        <div
          className={`flex ${
            isCompressed ? "flex-col gap-2 mb-8" : "flex-row mb-5"
          } items-center justify-start pt-4 pl-4 gap-2 cursor-pointer relative`}
        >
          <Image
            src={logo}
            className="w-[80px] h-[60px]"
            alt="Dashboard Logo"
            onClick={() => navigate.push("/")}
          />
          <h1 className="text-2xl uppercase text-primary font-bold">GMS</h1>

          <button
            onClick={toggle}
            className={`absolute ${
              isCompressed
                ? "rotate-180 left-[80%] top-[18vh]"
                : "left-[95%] top-[5vh]"
            } hidden lg:flex items-center gap-0 bg-primary rounded-full h-fit py-1.5 px-1`}
          >
            <PiCaretLeftBold color="#fff" size={20} />
            <PiCaretLeftBold color="#fff" size={20} className="-ml-3" />
          </button>
        </div>
        <h1 className="text-lg text-neutral-400 p-3">Menu</h1>
        <div className="w-full h-screen overflow-y-auto pb-[17vh] sidebar-container">
          {isDynamic && loading ? (
            <div className="w-full flex flex-col gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} width="100%" height={100} />
              ))}
            </div>
          ) : (
            routes.map((route, index) => (
              <div key={index} className="mx-2">
                <Link
                  onClick={() => {
                    setCookie("breadcrumb", route.label);
                    setSidebarOpen(false);
                  }}
                  href={route.path}
                  className={`flex items-center ${
                    isCompressed ? "justify-center" : "gap-5 px-4"
                  } font-semibold py-3 my-1 ${
                    isActiveLink(route.path, index)
                      ? "bg-primary font-extrabold text-white"
                      : "bg-white hover:bg-blue-200"
                  } cursor-pointer rounded-full`}
                >
                  <span
                    className={`${
                      isActiveLink(route.path, index)
                        ? "text-white"
                        : "text-black"
                    } font-extrabold text-3xl`}
                  >
                    {route.icon}
                  </span>
                  {!isCompressed && (
                    <span
                      className={`text-lg ${
                        isActiveLink(route.path, index)
                          ? "font-semibold text-white"
                          : ""
                      }`}
                    >
                      {route.label}
                    </span>
                  )}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericSidebar;
