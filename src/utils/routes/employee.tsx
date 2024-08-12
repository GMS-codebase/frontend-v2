"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const adminRoutes: Route[] = [
    {
        label: "Dashboard",
        path: "/employee",
        icon: <Icons.SolarPieChart2Bold />,
    },
    {
        label: "Calls",
        path: "/employee/calls",
        icon: <Icons.SolarFolder2Bold />,
    },
    {
        label: "Windows",
        path: "/employee/windows",
        icon: <Icons.SolarWindowFrameBold />,
    },
    {
        label: "Sectors",
        path: "/employee/sectors",
        icon: <Icons.SolarBenzeneRingBold />,
    },
    {
        label: "Trades",
        path: "/employee/trades",
        icon: <Icons.SolarSuitcaseBold />,
    },
    {
        label: "Applicants",
        path: "/employee/applicants",
        icon: <Icons.SolarUsersGroupTwoRoundedBold />,
    },
    {
        label: "Applications",
        path: "/employee/applications",
        icon: <Icons.SolarFolderWithFilesBold />,
    },
    {
        label: "Application Reports",
        path: "/employee/reports/application",
        icon: <Icons.SolarDocumentBold />,
    },
    {
        label: "Appeals Reports",
        path: "/employee/reports/appeals",
        icon: <Icons.SolarShieldWarningBold />,
    },
    {
        label: "Submission Reports",
        path: "/employee/reports/submission",
        icon: <Icons.SolarPaperclipRounded2Bold />,
    },
    {
        label: "Notifications",
        path: "/employee/notifications",
        icon: <Icons.SolarBellBold />,
    },
    {
        label: "Employees",
        path: "/employee/employees",
        icon: <Icons.SolarUsersGroupRoundedBold />,
    },
    {
        label: "Reports",
        path: "/employee/reports/reports",
        icon: <Icons.SolarDocumentsBold />,
    },
    {
        label: "M&E Reports",
        path: "/employee/reports/m_and_e",
        icon: <Icons.SolarFileBold />,
    },
    {
        label: "Profile",
        path: "/employee/profile",
        icon: <Icons.SolarUserCircleBold />,
    },
];

export default adminRoutes;
