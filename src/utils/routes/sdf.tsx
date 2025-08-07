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
        label: "Trainings",
        path: "/sdf/Trainings",
        icon: <Icons.SolarFolderWithFilesBold />,
    },
    {
        label: "Minutes",
        path: "/sdf/minutes",
        icon: <Icons.SolarDocumentBold />,
    },

    {
        label: "Applications",
        path: "/sdf/applications",
        icon: <Icons.SolarFolderWithFilesBold />,
    },
    {
        label: "Applicants",
        path: "/sdf/applicants",
        icon: <Icons.SolarFileBold />,
    },
    {
        label: "Appeals",
        path: "/sdf/appeals",
        icon: <Icons.SolarDocumentTextBroken />,
    },
    {
        label: "Application Reports",
        path: "/sdf/reports/application",
        icon: <Icons.SolarDocumentBold />,
    },
    {
        label: "Reports",
        path: "/sdf/reports/reports",
        icon: <Icons.SolarDocumentsBold />,
    },
    {
        label: "M&E and OSHE Reports",
        path: "/sdf/reports/m_and_e",
        icon: <Icons.SolarFileBold />,
    },
    {
        label: "Surveys",
        path: "/sdf/survey",
        icon: <Icons.SolarPaperclipRounded2Bold />,
    },
    {
        label: "Profile",
        path: "/sdf/profile",
        icon: <Icons.SolarUserCircleBold />,
    },
];

export default sdfRoutes;
