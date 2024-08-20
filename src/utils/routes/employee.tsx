"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const employeeRoutes: Route[] = [
  {
    label: "Dashboard",
    path: "/employee",
    icon: <Icons.SolarPieChart2Bold />,
  },
  {
    label: "Applicants",
    path: "/employee/applicants",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Applications",
    path: "/employee/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Application Reports",
    path: "/employee/reports/application",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Reports",
    path: "/employee/reports/reports",
    icon: <Icons.SolarDocumentsBold />,
  },
  {
    label: "M&E Reports",
    path: "/employee/reports/m_and_e",
    icon: <Icons.SolarFileBold />,
  },
  {
    label: "Profile",
    path: "/employee/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default employeeRoutes;
