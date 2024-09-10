/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as Icons from "@/components/core/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { SolarArrowDown } from "@/components/core/icons";

import {
  getApplicants,
  getApplications,
  getCalls,
  getEmployees,
  getMyApplicantProfile,
  getMyContacts,
  getMEReports,
  getMyProfile,
  getProfile,
  getSectors,
  getTrades,
  getWindows,
  getSubWindows,
  getMyContracts,
  getContracts,
  getApplicationsForContracts,
  getEmpStages,
  getMyApplications,
} from "@/utils/funcs";
import ClipLoader from "react-spinners/ClipLoader"; 
import { LOGOUT } from '../../actions/AuthActions';
import { notifications } from "@mantine/notifications";
import { GET_PROFILE_ERROR } from "@/actions/ProfileActions";

const Navbar = () => {
  const dispatch = useDispatch();
  const [pageName, setPageName] = useState(getCookie("breadcrumb") || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const active = usePathname();
  const auth = useSelector((state: any) => state.auth);

 const handleLogout = () => {
    dispatch({ type: LOGOUT });
    dispatch({ type: GET_PROFILE_ERROR });
    setLoading(true);
    navigate.push("/");
    notifications.show({
      message: "Logged Out Successfully!",
      color: "blue",
      duration: 6000,
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setPageName(getCookie("breadcrumb") || "");
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [active]);

  useEffect(() => {
    const role = active.startsWith("/admin")
      ? "ADMIN"
      : active.startsWith("/applicant")
        ? "APPLICANT"
        : active.startsWith("/sdf")
          ? "SDF_SECRETARIATE"
          : null;

    if (role === "ADMIN") {
      getApplicants(dispatch);
      getEmployees(dispatch);
    } else if (role === "SDF_SECRETARIATE") {
      getContracts(dispatch);
      getApplicationsForContracts(dispatch);
    } else if (role === "APPLICANT") {
      getMyContacts(dispatch);
      getMyApplicantProfile(dispatch);
      getMyApplications(dispatch);
    }
    getEmpStages(dispatch);
    getWindows(dispatch);
    getSectors(dispatch);
    getSubWindows(dispatch);
    getTrades(dispatch);
    getCalls(dispatch);
    getMyProfile(dispatch);
    getApplications(dispatch);
    getMEReports(dispatch);
    getProfile(dispatch);
  }, []);

  const { profile } = useSelector((state: any) => state.profile);

  return (
    <div className="w-full flex items-center justify-between py-6 bg-white rounded-2xl px-5">
      <h1 className="text-xl font-extrabold text-primary">{pageName}</h1>
      <div className="relative">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <button className="text-3xl text-primary bg-background p-3 rounded-full">
            <Icons.SolarUserBold />
          </button>
          <h1 className="text-xl font-medium">{profile?.firstname ?? ""}</h1>
          <SolarArrowDown/>
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 h-32 bg-white rounded-md shadow-lg py-2 z-10">
            <h1 className="text-center">Profile dropdown</h1>
            <div className="w-full flex justify-end ">
              <button
                onClick={handleLogout}
                type="button"
                className="w-full px-4 py-2 mt-4 text-black hover:text-white text-start bg-slate-50 shadow-sm focus:outline-none focus:ring-2 hover:bg-red-500 focus:ring-offset-2"
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
