"use client";
import React, { useState, useEffect, Suspense, useRef } from "react";
import Image from "next/image";
import bg from "../assets/Images/landing.jpg";
import logo from "../assets/Images/logo.png";
import { IoDownloadOutline } from "react-icons/io5";
import RegisterModal from "@/components/Modals/auth/RegisterModal";
import { useDisclosure } from "@mantine/hooks";
import LoginModal from "@/components/Modals/auth/Login";
import CallModal from "@/components/Modals/techInnov";
import SuccessModal from "@/components/Modals/success";
import SetPasswordModal from "@/components/Modals/auth/SetPasswordModal";
import {
    SolarFolder2Bold,
    SolarShieldWarningBold,
} from "@/components/core/icons";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getCalls } from "@/services";
import { unauthorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import ForgotPasswordModal from "@/components/Modals/auth/ForgotPassword";
import Link from "next/link";
import TraineeLoginModal from "@/components/Modals/auth/TraineeLogin";

function Page() {
  const dispatch = useDispatch();
  useEffect(() => {
    getCalls(dispatch);
  }, []);
  const { calls, loading: loadingCalls } = useSelector(
    (state: any) => state.calls
  );
  const sortedCalls = calls
    ? [...calls]
        .filter((call: any) => call.status === "OPEN")
        .sort(
          (a: any, b: any) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
    : [];

  console.log(new Date("13 January 2025"), new Date());
  const [isOpenRegister, { open: openRegister, close: closeRegister }] =
    useDisclosure(false);
  const [
    isOpenForgotPassword,
    { open: openForgotPassword, close: closeForgotPassword },
  ] = useDisclosure(false);
  const [isOpenLogin, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);
  const [isOpenSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);
  const [openCall, setOpenCall] = useState({
    isOpen: false,
    call: null,
  });
  const [
    isOpenSetPassword,
    { open: openSetPassword, close: closeSetPassword },
  ] = useDisclosure(false);
  const [
    isOpenTraineeLogin,
    { open: openTraineeLogin, close: closeTraineeLogin },
  ] = useDisclosure(false);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (token) {
            openSetPassword();
        }
    }, [token, openSetPassword]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -200,
                behavior: "smooth",
            });
        }
    };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-white opacity-60 z-10"></div>
      <div className="image mr-0">
        <Image
          src={bg}
          alt="home"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="opacity-90"
        />
      </div>
      <div className="absolute  w-full  py-6 md:flex items-center justify-between px-6 z-20">
        <div className="">
          <Image src={logo} alt="logo" width={360} height={360} />
        </div>
        <div className="flex gap-4 justify-center ml-12">
          <button
            className="py-2 px-4 lg:px-8 bg-white font-bold text-primary rounded-full"
            onClick={openLogin}
          >
            Login
          </button>
          {/* <button
            className="py-2 px-4 lg:px-8 text-white font-bold bg-primary rounded-full"
            onClick={openTraineeLogin}
          >
            Login as Trainee
          </button> */}
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
        <div
          className="w-[80%] overflow-x-auto no-scrollbar m-10"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex space-x-4 items-start mt-[4vh]">
            {/* <div className="w-full flex justify-center">
              {new Date("13 January 2025") > new Date() && (
                <div className="bg-white rounded-md p-4  w-fit flex items-center mb-3">
                  <SolarShieldWarningBold className="w-8 h-8 text-[#be1f1f]" />
                  <h3 className="text-[#be1f1f]">
                    We would like to announce that we have extended the call
                    from 10th January to 13th January 2025 at 12.00AM
                    Sharp.Thank you
                  </h3>
                </div>
              )}
            </div> */}
            {sortedCalls.length ? (
              sortedCalls.map((call: any) => (
                <div
                  key={call.id}
                  className="min-w-[350px] p-4 bg-white rounded-full flex justify-between items-center shadow-md"
                >
                  <SolarFolder2Bold className="w-8 h-8 text-[#005DE9]" />
                  <h3 className="font-bold text-black">
                    {call.title?.length >= 15
                      ? `${call?.title?.slice(0, 15)}...`
                      : call?.title}
                  </h3>
                  <button
                    className="bg-[#1F5DB014] text-primary font-bold rounded-full px-4 py-2"
                    onClick={() =>
                      setOpenCall({
                        isOpen: true,
                        call: call,
                      })
                    }
                  >
                    View details
                  </button>
                </div>
              ))
            ) : (
              <h2 className="text-black w-full text-base text-center md:text-xl mt-4 font-normal">
                Unfortunately there is no open call.
              </h2>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-4 z-30">
        <h2 className="text-black font-extrabold">
          © {new Date().getFullYear()} Rwanda TVET Board.
        </h2>
      </div>
      <div className="absolute bottom-0 right-0 p-4 z-30">
        <a
          href={"/files/user_guide.pdf"}
          download={true}
          className="py-2 px-4 lg:px-8 bg-white font-bold text-primary flex items-center rounded-full"
        >
          <IoDownloadOutline className="w-4 h-4 mx-2" />
          <span className="hidden lg:flex"> Download User Manual</span>
        </a>
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
        openForgotPassword={() => {
          closeLogin();
          openForgotPassword();
        }}
      />
      <ForgotPasswordModal
        opened={isOpenForgotPassword}
        close={closeForgotPassword}
      />
      <SuccessModal opened={isOpenSuccess} close={closeSuccess} />
      <CallModal
        openLogin={openLogin}
        call={openCall.call}
        opened={openCall.isOpen}
        close={() => setOpenCall({ isOpen: false, call: null })}
      />
      <SetPasswordModal
        opened={isOpenSetPassword}
        close={closeSetPassword}
        token={token as string}
        openLogin={openLogin}
      />
      {/* <TraineeLoginModal
        opened={isOpenTraineeLogin}
        close={closeTraineeLogin}
      /> */}
    </div>
  );
}
export default function DefaultPage() {
    return (
        <Suspense>
            <Page />
        </Suspense>
    );
}
