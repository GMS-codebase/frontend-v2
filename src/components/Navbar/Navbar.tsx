/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as Icons from "@/components/core/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import {
  getApplicants,
  getCalls,
  getEmployees,
  getMyApplicantProfile,
  getMyContacts,
  getMEReports,
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
  getSurveyTrainee,
  getApplications,
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
  const [profileLoading, setProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useRouter();
  const active = usePathname();
  const auth = useSelector((state: any) => state.auth);
  const [traineeData, setTraineeData] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  // Get current user role
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
                : active.startsWith("/survey_trainee")
                  ? "SURVEY_TRAINEE"
                  : null;

    setCurrentRole(role);
  }, [active]);

  // Direct API call function
  const fetchUserProfile = async () => {
    try {
      const token = getCookie("token") || localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        return null;
      }

      const response = await fetch(
        "http://197.243.20.222:8081/api/v2/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🎯 Direct API call result:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("🎯 Direct API call result:", result);

      if (result.success && result.data?.data) {
        setUserProfile(result.data.data);
        return result.data.data;
      }

      return null;
    } catch (error) {
      console.error("❌ Direct API call failed:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("🎯 Current Role:", currentRole);
    if (currentRole) {
      fetchUserProfile().finally(() => setProfileLoading(false));
    }
  }, [currentRole]);

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    dispatch({ type: GET_PROFILE_ERROR });
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

  // Fetch other data based on role (keep existing Redux calls for other data)
  useEffect(() => {
    if (!currentRole) return;

    const fetchOtherData = async () => {
      try {
        if (currentRole === "ADMIN") {
          await Promise.all([
            getApplicants(dispatch),
            getEmployees(dispatch),
            getRoles(dispatch),
            getBudgetLines(dispatch),
            getAppeals(dispatch, "admin"),
            getWindows(dispatch),
            getSectors(dispatch),
            getSubWindows(dispatch),
            getTrades(dispatch),
            getCalls(dispatch),
            getSectorTrades(dispatch),
            getForms(dispatch),
            getProfile(dispatch),
            getMEReports(dispatch),
          ]);
        } else if (currentRole === "EMPLOYEE") {
          await Promise.all([
            getApplicants(dispatch),
            getAnnouncement(dispatch),
            getEmpStages(dispatch),
            getWindows(dispatch),
            getSectors(dispatch),
            getSubWindows(dispatch),
            getTrades(dispatch),
            getCalls(dispatch),
            getApplicationsByEmployee(dispatch),
            getMEReports(dispatch),
            getSectorTrades(dispatch),
            getProfile(dispatch),
            getForms(dispatch),
          ]);
        } else if (currentRole === "SDF_SECRETARIATE") {
          await Promise.all([
            getApplicants(dispatch),
            getContracts(dispatch),
            getMinutes(dispatch),
            getEmpStages(dispatch),
            getApplicationsReadyForMinutes(dispatch, "sdf"),
            getUploadedMinutes(dispatch, "sdf"),
            getApprovedMinutes(dispatch, "sdf"),
            getRejectedMinutes(dispatch, "sdf"),
            getNegotiatedMinutes(dispatch, "sdf"),
            getAppeals(dispatch, "sdf"),
            getApplicationsForContractSigning(dispatch),
            getProfile(dispatch),
            getForms(dispatch),
          ]);
        } else if (currentRole === "GRANT_COMMITTEE") {
          await Promise.all([getProfile(dispatch)]);
        } else if (currentRole === "SURVEY_TRAINEE") {
          await Promise.all([getProfile(dispatch)]);
        } else if (currentRole === "APPLICANT") {
          await Promise.all([
            getApplicantProfile(dispatch),
            getWindows(dispatch),
            getSectors(dispatch),
            getSubWindows(dispatch),
            getTrades(dispatch),
            getSurveyTrainee(dispatch),
            getMyContacts(dispatch),
            getMyContracts(dispatch),
            getMyApplicantProfile(dispatch),
            getMyApplications(dispatch),
            getUploadedMinutes(dispatch, "applicant"),
            getApprovedMinutes(dispatch, "applicant"),
            getRejectedMinutes(dispatch, "applicant"),
            getNegotiatedMinutes(dispatch, "applicant"),
            getBudgetLines(dispatch),
            getAppeals(dispatch, "applicant"),
            getCalls(dispatch),
            getForms(dispatch),
          ]);
        }
      } catch (error) {
        console.error("❌ Error fetching other data:", error);
      }
    };

    fetchOtherData();
  }, [currentRole, dispatch]);

  const { profile } = useSelector((state: any) => state.profile);
  const { applicantProfile } = useSelector((state: any) => state.profile);

  // Get display name based on user type
  const getDisplayName = () => {
    if (profileLoading) {
      return "Loading...";
    }

    if (traineeData) {
      return traineeData.firstname || traineeData.name || "Trainee";
    }

    // Use local profile data first (from direct API call)
    if (userProfile) {
      const fullName =
        `${userProfile.firstname || ""} ${userProfile.lastname || ""}`.trim();
      return fullName || userProfile.email || "User";
    }

    if (currentRole === "APPLICANT") {
      if (applicantProfile?.applicant?.name) {
        return applicantProfile.applicant.name;
      }
      if (applicantProfile?.name) {
        return applicantProfile.name;
      }
    }

    // Fallback to Redux profile
    if (profile) {
      const fullName =
        `${profile.firstname || ""} ${profile.lastname || ""}`.trim();
      return (
        fullName || profile.name || profile.username || profile.email || "User"
      );
    }

    return "----";
  };

  // Manual refresh function
  // const handleRefreshProfile = async () => {
  //   console.log("🔄 Manual profile refresh triggered");
  //   setProfileLoading(true);
  //   await fetchUserProfile();
  //   setProfileLoading(false);
  // };

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
              <h1 className="text-sm md:text-lg font-medium capitalize">
                {getDisplayName()}
              </h1>
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item className="bg-[#F0F0F0]" onClick={handleRefreshProfile}>
              <button className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]">
                🔄 Refresh Profile
              </button>
            </Menu.Item> */}
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
