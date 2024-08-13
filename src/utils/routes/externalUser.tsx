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
        label: "Application Reports",
        path: "/externalUser/reports/application",
        icon: <Icons.SolarDocumentBold />,
    },
    {
        label: "Reports",
        path: "/externalUser/reports/reports",
        icon: <Icons.SolarDocumentsBold />,
    },
    {
        label: "M&E Reports",
        path: "/externalUser/reports/m_and_e",
        icon: <Icons.SolarFileBold />,
    },
    {
        label: "Profile",
        path: "/externalUser/profile",
        icon: <Icons.SolarUserCircleBold />,
    },
];

export default externalUserRoutes;
