"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const traineeRoutes: Route[] = [
  {
    label: "Dashboard",
    path: "/trainee",
    icon: <Icons.SolarPieChart2Bold />,
  },
  {
    label: "Survey",
    path: "/trainee/survey",
    icon: <Icons.SolarPaperclipRounded2Bold />,
  },
];

export default traineeRoutes;
