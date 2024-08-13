"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const externalRoutes: Route[] = [
  {
    label: "Dashboard",
    path: "/external",
    icon: <Icons.SolarPieChart2Bold />,
  },
  {
    label: "Applications",
    path: "/external/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Application Reports",
    path: "/external/reports/application",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Reports",
    path: "/external/reports/reports",
    icon: <Icons.SolarDocumentsBold />,
  },
  {
    label: "M&E Reports",
    path: "/external/reports/m_and_e",
    icon: <Icons.SolarFileBold />,
  },
  {
    label: "Profile",
    path: "/external/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default externalRoutes;
