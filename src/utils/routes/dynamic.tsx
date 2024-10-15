"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const dynamicRoutes: Route[] = [
  {
    label: "Dashboard",
    path: "/dynamic",
    icon: <Icons.SolarPieChart2Bold />,
  },
  {
    label: "Calls",
    path: "/dynamic/calls",
    icon: <Icons.SolarFolder2Bold />,
  },
  {
    label: "Windows",
    path: "/dynamic/windows",
    icon: <Icons.SolarWindowFrameBold />,
  },
  {
    label: "Sectors",
    path: "/dynamic/sectors",
    icon: <Icons.SolarBenzeneRingBold />,
  },
  {
    label: "Trades",
    path: "/dynamic/trades",
    icon: <Icons.SolarSuitcaseBold />,
  },
  {
    label: "Applicants",
    path: "/dynamic/applicants",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Applications",
    path: "/dynamic/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Application Reports",
    path: "/dynamic/reports/application",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Notifications",
    path: "/dynamic/notifications",
    icon: <Icons.SolarBellBold />,
  },
  {
    label: "Users",
    path: "/dynamic/employees",
    icon: <Icons.SolarUsersGroupRoundedBold />,
  },
  {
    label: "Reports",
    path: "/dynamic/reports/reports",
    icon: <Icons.SolarDocumentsBold />,
  },
  {
    label: "M&E Reports",
    path: "/dynamic/reports/m_and_e",
    icon: <Icons.SolarFileBold />,
  },
  {
    label: "Profile",
    path: "/dynamic/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default dynamicRoutes;
