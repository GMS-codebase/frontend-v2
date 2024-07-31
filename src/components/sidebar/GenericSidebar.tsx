"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Image from "next/image";
import logo from "@/assets/Images/dashboard-logo.png";
import { BiLogOut } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import {ClipLoader} from "react-spinners"
import { useDispatch } from "react-redux";
// import { LOGOUT_SUCCESS } from "@/actions/AuthActions";
import { Route } from "@/types";
const GenericSidebar = ({
  routes,
  children,
}: {
  routes: Route[];
  children: React.ReactNode;
}) => {
  const active = usePathname();
  const [isLogout, { open, close }] = useDisclosure(false);
  const [opened, setOpened] = useState("");
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const handleLogout = () => {
    setRedirecting(true);
    // dispatch({ type: LOGOUT_SUCCESS });
    navigate.push("/login");
  };
  return (
    <div className="w-full h-screen flex flex-col border-r border-r-[#EAEFF4]">
      <div className="flex items-center justify-start pt-10 pl-14 gap-4 cursor-pointer mb-10">
        <Image src={logo} className="w-14 h-14 rounded-full" alt="" />
        {children}
      </div>
      <div className="w-full h-screen overflow-y-auto">
        {routes.map((route, index) => {
          return (
            <div key={index} className="mx-3">
              <Link
                href={route.path}
                className={`flex items-center gap-5 px-4 py-3 my-1 pl-10 ${active === route.path ? "bg-[#5D87FF] text-white" : "bg-white"} hover:bg-blue-200 cursor-pointer rounded-md`}
              >
                {route.icon}
                <span
                  className={`text-sm ${active === route.path ? "font-semibold text-white" : ""} hidden lg:inline`}
                >
                  {route.label}
                </span>
              </Link>
            </div>
          );
        })}
        <button
          onClick={open}
          className="w-[94%] flex items-center gap-4 mx-auto px-4 py-3 mt-[10vh] pl-8 hover:bg-red-300 cursor-pointer text-sm rounded-md hover:text-white font-semibold mb-10"
        >
          <BiLogOut size={25} />
          Logout
        </button>
      </div>
      <Modal opened={isLogout} onClose={close} size={"md"}>
        <h1 className="w-full flex justify-center text-lg font-semibold">
          Are you sure you want to logout ?
        </h1>
        <div className="w-full flex items-center justify-between mt-10">
          <button
            onClick={close}
            className="py-3 px-5 bg-neutral-200 font-semibold rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="py-3 px-5 bg-red-400 font-semibold rounded-md"
          >
            {redirecting ? (
              <div className="w-full h-full flex items-center justify-center">
                <ClipLoader size={20} color="white" />
              </div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GenericSidebar;
