/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as Icons from "@/components/core/icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
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

const Navbar = () => {
  const dispatch = useDispatch();
  const [pageName, setPageName] = useState(getCookie("breadcrumb") || "");

  const active = usePathname();
  const auth = useSelector((state: any) => state.auth);

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
      <div className="flex items-center gap-3">
        <button className="text-3xl text-primary bg-background p-3 rounded-full">
          <Icons.SolarUserBold />
        </button>
        <h1 className="text-xl font-medium">{profile?.firstname ?? ""}</h1>
      </div>
    </div>
  );
};

export default Navbar;
