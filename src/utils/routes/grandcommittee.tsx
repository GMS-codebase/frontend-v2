"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const grandcommitteeRoutes: Route[] = [
    {
        label: "Dashboard",
        path: "/grandcommittee",
        icon: <Icons.SolarPieChart2Bold />,
    },
    {
        label: "Applicants",
        path: "/grandcommittee/applicants",
        icon: <Icons.SolarUsersGroupTwoRoundedBold />,
    },
    {
        label: "Applications",
        path: "/grandcommittee/applications",
        icon: <Icons.SolarFolderWithFilesBold />,
    },
    {
        label: "Application Reports",
        path: "/grandcommittee/reports/application",
        icon: <Icons.SolarDocumentBold />,
    },
    {
        label: "Reports",
        path: "/grandcommittee/reports/reports",
        icon: <Icons.SolarDocumentsBold />,
    },
    {
        label: "M&E Reports",
        path: "/grandcommittee/reports/m_and_e",
        icon: <Icons.SolarFileBold />,
    },
    {
        label: "Profile",
        path: "/grandcommittee/profile",
        icon: <Icons.SolarUserCircleBold />,
    },
];

export default grandcommitteeRoutes;
