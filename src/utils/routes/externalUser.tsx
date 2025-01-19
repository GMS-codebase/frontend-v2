"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const externalEmployeeRoutes: Route[] = [
  {
    label: "Applications",
    path: "/employee/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Applicants",
    path: "/employee/applicants",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Profile",
    path: "/employee/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default externalEmployeeRoutes;
