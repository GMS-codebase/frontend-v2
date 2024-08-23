"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const sdfRoutes: Route[] = [
  {
    label: "Contracts",
    path: "/sdf/contracts",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "M&E Reports",
    path: "/admin/reports/m_and_e",
    icon: <Icons.SolarFileBold />,
  },
  {
    label: "Profile",
    path: "/sdf/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default sdfRoutes;
