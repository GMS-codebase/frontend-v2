"use client";
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";
import { PeopleNearby } from 'solar-icon-set';

const applicantRoutes: Route[] = [
  {
    label: "Contacts",
    path: "/applicant/contacts",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Applications",
    path: "/applicant/applications",
    icon: <Icons.SolarFolderWithFilesBold />,
  },
  {
    label: "Applicant Contracts",
    path: "/applicant/contracts",
    icon: <Icons.SolarDocumentBold />,
  },
  {
    label: "Trainees",
    path: "/applicant/trainees",
    icon: <Icons.SolarUsersGroupTwoRoundedBold />,
  },
  {
    label: "Profile",
    path: "/applicant/profile",
    icon: <Icons.SolarUserCircleBold />,
  },
];

export default applicantRoutes;
