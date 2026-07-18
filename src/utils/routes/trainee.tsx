
"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const traineeRoutes: Route[] = [
  {
    label: "Survey",
    path: "/trainee/survey",
    icon: <Icons.SolarPaperclipRounded2Bold />,
  },
  {
    label: "Profile",
    path: "/trainee/profile",
    icon: <Icons.SolarUserBold />,
  },
];

export default traineeRoutes;

