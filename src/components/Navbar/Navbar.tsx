/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as Icons from "@/components/core/icons";
import { usePathname, useRouter } from "next/navigation";
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
  getApplicationsForContractSigning,
  getEmpStages,
  getMyApplications,
  getMinutes,
  getRoles,
  getSectorTrades,
  getBudgetLines,
  getApplicationsReadyForMinutes,
  getRejectedMinutes,
  getApprovedMinutes,
  getUploadedMinutes,
  getAnnouncement,
  getForms,
} from "@/utils/funcs";
import { Menu } from "@mantine/core";
import { IoMdLogOut } from "react-icons/io";
import { LOGOUT } from "@/actions/AuthActions";
import { GET_PROFILE_ERROR } from "@/actions/ProfileActions";
import { notifications } from "@mantine/notifications";

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
      getRoles(dispatch);
      getBudgetLines(dispatch);
    } else if (role === "SDF_SECRETARIATE") {
      getApplicants(dispatch);
      getContracts(dispatch);
      getMinutes(dispatch);
      getApplicationsReadyForMinutes(dispatch, "sdf");
      getUploadedMinutes(dispatch, "sdf");
      getApprovedMinutes(dispatch, "sdf");
      getRejectedMinutes(dispatch, "sdf");
    } else if (role === "APPLICANT") {
      getMyContacts(dispatch);
      getMyApplicantProfile(dispatch);
      getMyApplications(dispatch);
      getUploadedMinutes(dispatch, "applicant");
      getApprovedMinutes(dispatch, "applicant");
      getRejectedMinutes(dispatch, "applicant");
      getBudgetLines(dispatch);
    }
    getAnnouncement(dispatch);
    getApplicationsForContractSigning(dispatch);
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
    getSectorTrades(dispatch);
    getForms(dispatch);
  }, []);

  const { profile } = useSelector((state: any) => state.profile);

  return (
    <div className="w-full flex items-center justify-between py-3 bg-white rounded-2xl px-5">
      <h1 className="text-xl font-extrabold text-primary">{pageName}</h1>
      <div>
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <div className="flex items-center gap-3 bg-background p-3 rounded-full cursor-pointer">
              <button className="text-2xl text-primary ">
                <Icons.SolarUserBold />
              </button>
              <h1 className="text-lg font-medium capitalize">
                {profile?.firstname ?? "----"}
              </h1>
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item className="bg-[#F0F0F0]">
              <button
                className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
                onClick={() => handleLogout()}
              >
                <IoMdLogOut size={21} color="#576074" />
                Logout
              </button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
