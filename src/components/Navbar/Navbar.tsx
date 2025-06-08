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
  getAppeals,
  getNegotiatedMinutes,
  getApplicantProfile,
  getApplicationsByEmployee,
} from "@/services";
import { Menu } from "@mantine/core";
import { IoMdLogOut } from "react-icons/io";
import { LOGOUT } from "@/actions/AuthActions";
import { GET_PROFILE_ERROR } from "@/actions/ProfileActions";
import { notifications } from "@mantine/notifications";

const Navbar = () => {
  const dispatch = useDispatch();
  const [pageName, setPageName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const active = usePathname();
  const auth = useSelector((state: any) => state.auth);
  const [traineeData, setTraineeData] = useState<any>(null);

  useEffect(() => {
    // Get trainee data from localStorage
    const storedData = localStorage.getItem("traineeData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.role === "TRAINEE") {
          setTraineeData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing trainee data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (traineeData) {
      // Clear trainee data from localStorage
      localStorage.removeItem("traineeData");
    } else {
      dispatch({ type: LOGOUT });
      dispatch({ type: GET_PROFILE_ERROR });
    }
    setLoading(true);
    navigate.push("/");
    notifications.show({
      message: "Logged Out Successfully!",
      color: "blue",
    });
  };

  useEffect(() => {
    setPageName(getCookie("breadcrumb") || "");
  }, []);

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
          : active.startsWith("/employee")
            ? "EMPLOYEE"
            : active.startsWith("/grant_committee")
              ? "GRANT_COMMITTEE"
              : active.startsWith("/trainee")
                ? "TRAINEE"
                : null;

    if (role === "ADMIN") {
      getApplicants(dispatch);
      getEmployees(dispatch);
      getRoles(dispatch);
      getBudgetLines(dispatch);
      getAppeals(dispatch, "admin");
      getApplications(dispatch);
    } else if (role === "EMPLOYEE") {
      getApplicants(dispatch);
      getAnnouncement(dispatch);
      getEmpStages(dispatch);
      getWindows(dispatch);
      getSectors(dispatch);
      getSubWindows(dispatch);
      getTrades(dispatch);
      getCalls(dispatch);
      getMyProfile(dispatch);
      getApplicationsByEmployee(dispatch);
      getMEReports(dispatch);
      getProfile(dispatch);
      getSectorTrades(dispatch);
      getForms(dispatch);
    } else if (role === "SDF_SECRETARIATE") {
      getApplicants(dispatch);
      getContracts(dispatch);
      getMinutes(dispatch);
      getApplicationsReadyForMinutes(dispatch, "sdf");
      getUploadedMinutes(dispatch, "sdf");
      getApprovedMinutes(dispatch, "sdf");
      getRejectedMinutes(dispatch, "sdf");
      getNegotiatedMinutes(dispatch, "sdf");
      getAppeals(dispatch, "sdf");
      getApplicationsForContractSigning(dispatch);
      getApplications(dispatch);
    } else if (role === "GRANT_COMMITTEE") {
      getApplications(dispatch);
    } else if (role === "APPLICANT") {
      getApplicantProfile(dispatch);
      getMyContacts(dispatch);
      getMyContracts(dispatch);
      getMyApplicantProfile(dispatch);
      getMyApplications(dispatch);
      getUploadedMinutes(dispatch, "applicant");
      getApprovedMinutes(dispatch, "applicant");
      getRejectedMinutes(dispatch, "applicant");
      getNegotiatedMinutes(dispatch, "applicant");
      getBudgetLines(dispatch);
      getAppeals(dispatch, "applicant");
      getApplications(dispatch);
    }
  }, []);

  const { profile } = useSelector((state: any) => state.profile);

  // Get display name based on user type
  const getDisplayName = () => {
    if (traineeData) {
      return traineeData.firstname || "Trainee";
    }
    return profile?.firstname ?? "----";
  };

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
                {getDisplayName()}
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
