'use client';
import * as Icons from "@/components/core/icons";
import { Route } from "@/types";
import * as SolarIcons from "solar-icon-set";

const adminRoutes:Route[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <Icons.SolarPieChart2Bold/>,
  },
  {
    label: 'Calls',
    path: '/admin/calls',
    icon: <Icons.SolarFolder2Bold/>,
  },
  {
    label: 'Sectors',
    path: '/admin/sectors',
    icon: <Icons.SolarBenzeneRingBold/>,
  },
  {
    label: 'Trades',
    path: '/admin/trades',
    icon: <Icons.SolarSuitcaseBold/>,
  },
  {
    label: 'Applicants',
    path: '/admin/applicants',
    icon: <Icons.SolarUsersGroupTwoRoundedBold/>,
  },
  {
    label: 'Applications',
    path: '/admin/applications',
    icon: <Icons.SolarFolderWithFilesBold/>,
  },
  {
    label: 'Application Reports',
    path: '/admin/reports/application',
    icon: <Icons.SolarDocumentBold/>,
  },
  {
    label: 'Appeals Reports',
    path: '/admin/reports/appeals',
    icon: <Icons.SolarShieldWarningBold/>,
  },
  {
    label: 'Submission Reports',
    path: '/admin/reports/submission',
    icon: <Icons.SolarPaperclipRounded2Bold/>,
  },
  {
    label: 'Notifications',
    path: '/admin/notifications',
    icon: <Icons.SolarBellBold/>,
  },
  {
    label: 'Employees',
    path: '/admin/employees',
    icon: <Icons.SolarUsersGroupRoundedBold/>,
  },
  {
    label: 'Reports',
    path: '/admin/reports/reports',
    icon: <Icons.SolarDocumentsBold/>,
  },
  {
    label: 'M&E Reports',
    path: '/admin/reports/m_and_e',
    icon: <Icons.SolarFileBold/>,
  },
  {
    label: 'Profile',
    path: '/admin/profile',
    icon: <Icons.SolarUserCircleBold/>,
  },
];

export default adminRoutes;
