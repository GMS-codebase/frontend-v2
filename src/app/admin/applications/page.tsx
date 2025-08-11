/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";
import {
  getApplications,
  getApplicationsPaginated,
  getApplicationStatus,
  getApplicationStatus2,
} from "@/services";
import { useDispatch } from "react-redux";
import { UnknownAction } from "redux";
import { filterByStep } from "@/utils/funcs";
import EmployeeApplicationsPage from "@/components/pages/applications/employees";

const Page = () => {
  const { applications, loading, page } = useSelector(
    (state: any) => state.applications,
  );

  const dispatch = useDispatch();
  const [limit] = useState(10);
  console.log("first application --> ", applications.slice(1, 5));
  console.log(loading);
  useEffect(() => {
    getApplications(dispatch);
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    stage: "All",
    step: "PENDING",
    window: "All",
    subWindow: "All",
    call: "All",
    sector: "All",
    trade: "All",
  });

  const filteredApplications = useMemo(() => {
    return applications
      .filter(
        (app: any) =>
          app.applicationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.applicant?.name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase() ||
                app.applicant?.businesses?.[0]?.businessName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
            ),
      )
      .filter((app: any) => {
        const { stage, window, call, subWindow, sector, trade, step } =
          selectedFilters;
        return (
          (stage === "All" ||
            (getApplicationStatus2(app) === stage &&
              filterByStep(app, step))) &&
          (call === "All" || app.call?.title === call) &&
          (window === "All" || app.window?.title === window) &&
          (subWindow === "All" || app.subWindow?.title === subWindow) &&
          (sector === "All" || app.sector?.name === sector) &&
          (trade === "All" || app.trade?.trade.title === trade)
        );
      });
  }, [applications, searchTerm, selectedFilters]);

  return (
    <EmployeeApplicationsPage
      applications={filteredApplications.map((app: any) => ({
        ...app,
        currentStage: getApplicationStatus2(app),
      }))}
      type="admin"
      loading={loading}
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};

export default Page;
