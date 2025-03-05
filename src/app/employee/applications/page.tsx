/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { Menu, Select } from "@mantine/core";
import { useRef, useState, useMemo, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";
import {
  getApplicationsPaginated,
  getApplicationStatus,
  getApplicationStatus2,
  getEmployeeApplicationsPaginated,
  shortenString,
} from "@/services";
import { UnknownAction } from "redux";
import { useDispatch } from "react-redux";
import { filterByStep } from "@/utils/funcs";
import EmployeeApplicationsPage from "@/components/pages/applications/employees";
const Page = () => {
  const {
    applications: rawApplications,
    loading,
    page,
  } = useSelector((state: any) => state.applications);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getEmployeeApplicationsPaginated(page, limit) as unknown as UnknownAction,
    );
  }, [dispatch, page, limit]);
  const { stages } = useSelector((state: any) => state.empStages);
  console.log(stages);

  const applications = useMemo(
    () =>
      rawApplications
        .map((app: any) => ({
          ...app,
          sector: app.sectors?.[0] || null,
          trade: app.trades?.[0] || null,
        }))
        .filter((app: any) => {
          const matchingStage = stages.find(
            (stage: any) => stage.sector == app.sector.name,
          );
          return matchingStage;
        }),
    [rawApplications, stages],
  );

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
      type="employee"
      loading={loading}
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};

export default Page;
