'use client';
import { Route } from "@/types";
import * as SolarIcons from "solar-icon-set";

const adminRoutes:Route[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <SolarIcons.PieChart2 size={30}/>,
  },
  {
    label: 'Calls',
    path: '/admin/calls',
    icon: <SolarIcons.Folder2 size={30}/>,
  },
  {
    label: 'Sectors',
    path: '/admin/sectors',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Trades',
    path: '/admin/trades',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Applicants',
    path: '/admin/applicants',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Applications',
    path: '/admin/applications',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Application Reports',
    path: '/admin/reports/application',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Appeals Reports',
    path: '/admin/reports/appeals',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Submission Reports',
    path: '/admin/reports/submission',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Notifications',
    path: '/admin/notifications',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Employees',
    path: '/admin/employees',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Reports',
    path: '/admin/reports/reports',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'M&E Reports',
    path: '/admin/reports/m_and_e',
    icon: <SolarIcons.PieChart size={30}/>,
  },
  {
    label: 'Profile',
    path: '/admin/profile',
    icon: <SolarIcons.PieChart size={30}/>,
  },
];

export default adminRoutes;
