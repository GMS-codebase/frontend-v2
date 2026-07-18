"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";
import { FaCertificate } from "react-icons/fa";
import { PeopleNearby } from "solar-icon-set";

const applicantRoutes: Route[] = [
  {
    label: "Applications",
    path: "/applicant/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Contracts",
    path: "/applicant/contracts",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Surveys",
    path: "/applicant/surveys",
    icon: <Icons.SolarPaperclipRounded2Bold />,
  },
  {
    label: "Minutes",
    path: "/applicant/minutes",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Trainees",
    path: "/applicant/trainees",
    icon: <Icons.SolarUsersGroupRoundedBold />,
  },
  {
    label: "Trainings",
    path: "/applicant/trainings",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Certifications",
    path: "/applicant/certifications",
    icon: <Icons.SolarFileBold />,
  },
  {
    label: "Contacts",
    path: "/applicant/contacts",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Profile",
    path: "/applicant/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default applicantRoutes;
