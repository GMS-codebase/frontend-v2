/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {  useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { getApplicationsPaginated } from "@/services";
import { useDispatch } from "react-redux";
import { UnknownAction } from "redux";
import { filterByStep } from "@/utils/funcs";
import EmployeeApplicationsPage from "@/components/pages/applications/employees";

const Page = () => {
  const {
    applications,
    loading,
    page,
  } = useSelector((state: any) => state.applications);

  const dispatch = useDispatch();
  const [limit] = useState(10);
  useEffect(() => {
    dispatch(getApplicationsPaginated(page, limit) as unknown as UnknownAction);
  }, [dispatch, page, limit]);
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
            (app?.currentStage === stage && filterByStep(app, step))) &&
          (call === "All" || app.call?.title === call) &&
          (window === "All" || app.window?.title === window) &&
          (subWindow === "All" || app.subWindow?.title === subWindow) &&
          (sector === "All" || app.sector?.name === sector) &&
          (trade === "All" || app.trade?.trade.title === trade)
        );
      });
  }, [applications, searchTerm, selectedFilters]);

  return (
    <EmployeeApplicationsPage applications={filteredApplications} type="admin" loading={loading}  selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  );
};

export default Page;
