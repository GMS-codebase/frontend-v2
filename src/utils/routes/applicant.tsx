"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";
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
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Minutes",
    path: "/applicant/minutes",
    icon: <Icons.SolarDocumentBold />,
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
