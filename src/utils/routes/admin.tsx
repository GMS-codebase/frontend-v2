"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";
import * as SolarIconSet from "solar-icon-set";
const adminRoutes: Route[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <Icons.SolarPieChart2Bold />,
  },
  {
    label: "Calls",
    path: "/admin/calls",
    icon: <Icons.SolarFolder2Bold />,
  },
  {
    label: "Windows",
    path: "/admin/windows",
    icon: <Icons.SolarWindowFrameBold />,
  },
  {
    label: "Sectors",
    path: "/admin/sectors",
    icon: <Icons.SolarBenzeneRingBold />,
  },
  {
    label: "Trades",
    path: "/admin/trades",
    icon: <Icons.SolarSuitcaseBold />,
  },
  {
    label: "Competences",
    path: "/admin/competences",
    icon: <Icons.SolarFolder2Bold />,
  },
  {
    label: "Budget Lines",
    path: "/admin/budgetlines",
    icon: <Icons.SolarSuitcaseBold />,
  },
  {
    label: "Question Forms",
    path: "/admin/forms",
    icon: <Icons.SolarSuitcaseBold />,
  },
  {
    label: "Survey",
    path: "/admin/survey",
    icon: <Icons.SolarPaperclipRounded2Bold />,
  },
  {
    label: "Survey Trainees",
    path: "/admin/s-trainees",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Applicants",
    path: "/admin/applicants",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Appeals",
    path: "/admin/appeals",
    icon: <Icons.SolarDocumentTextBroken />,
  },
  {
    label: "Application Reports",
    path: "/admin/reports/application",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: <Icons.SolarBellBold />,
  },
  {
    label: "Users",
    path: "/admin/employees",
    icon: <Icons.SolarUsersGroupRoundedBold />,
  },
  {
    label: "Reports",
    path: "/admin/reports/reports",
    icon: <Icons.SolarDocumentsBold />,
  },
  {
    label: "M&E and OSHE Reports",
    path: "/admin/reports/m_and_e",
    icon: <Icons.SolarFileBold />,
  },
  {
    label: "Roles",
    path: "/admin/roles",
    icon: <SolarIconSet.ShieldUser iconStyle="Bold" size={30} />,
  },
  {
    label: "Announcements",
    path: "/admin/announcements",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default adminRoutes;
