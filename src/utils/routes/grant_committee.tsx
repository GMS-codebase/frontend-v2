"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const grant_committeeRoutes: Route[] = [
  {
    label: "Dashboard",
    path: "/grant_committee",
    icon: <Icons.SolarPieChart2Bold />,
  },
  {
    label: "Applications",
    path: "/grant_committee/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Applicants",
    path: "/grant_committee/applicants",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Application Reports",
    path: "/grant_committee/reports/application",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Reports",
    path: "/grant_committee/reports/reports",
    icon: <Icons.SolarDocumentsBold />,
  },
  {
    label: "M&E and OSHE Reports",
    path: "/grant_committee/reports/m_and_e",
    icon: <Icons.SolarFileBold />,
  },
  {
    label: "Profile",
    path: "/grant_committee/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default grant_committeeRoutes;
