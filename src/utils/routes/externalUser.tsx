"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const externalUserRoutes: Route[] = [
    {
        label: "Dashboard",
        path: "/externalUser",
        icon: <Icons.SolarPieChart2Bold />,
    },
    {
        label: "Applications",
        path: "/externalUser/applications",
        icon: <Icons.SolarFolderWithFilesBold />,
    },
    {
        label: "Profile",
        path: "/externalUser/profile",
        icon: <Icons.SolarUserCircleBold />,
    },
];
export default externalUserRoutes;
