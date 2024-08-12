"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";

const applicantRoutes: Route[] = [
    {
        label: "Appeals Reports",
        path: "/externalUser/reports/appeals",
        icon: <Icons.SolarShieldWarningBold />,
    },
    {
        label: "Submission Reports",
        path: "/externalUser/reports/submission",
        icon: <Icons.SolarPaperclipRounded2Bold />,
    },
    {
        label: "Applications",
        path: "/externalUser/applications",
        icon: <Icons.SolarFolderWithFilesBold />,
    },
    {
        label: "Reports",
        path: "/externalUser/reports/reports",
        icon: <Icons.SolarDocumentsBold />,
    },
    {
        label: "Profile",
        path: "/externalUser/profile",
        icon: <Icons.SolarUserCircleBold />,
    },
    {
        label: "M&E Reports",
        path: "/externalUser/reports/m_and_e",
        icon: <Icons.SolarFileBold />,
    },
];

export default applicantRoutes;
