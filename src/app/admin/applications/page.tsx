/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import EmployeeApplicationsPage from "@/components/pages/applications/employees";
import {
  getApplicationsPaginated,
  getApplicationStatus2
} from "@/services";
import { IPaginatedQuery } from "@/types/base.type";
import { filterByStep } from "@/utils/funcs";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UnknownAction } from "redux";

const Page = () => {
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

  const dispatch = useDispatch();

  const {
    paginatedApplications,
    paginationLoading,
    total: totalApplications,
    page: currentPageFromRedux,
  } = useSelector((state: any) => state.applications);

  // Local state for pagination
  const [paginateOpts, setLocalPaginateOpts] = useState<
    IPaginatedQuery & { totalPages: number }
  >({
    page: (currentPageFromRedux ?? 1) - 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    setLocalPaginateOpts((prev) => ({
      ...prev,
      totalPages: Math.ceil((totalApplications ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalApplications]);

  // Fetch data whenever page or limit changes
  useEffect(() => {
    dispatch(
      getApplicationsPaginated(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit]);

  const setPaginateOpts: React.Dispatch<
    React.SetStateAction<IPaginatedQuery & { totalPages: number }>
  > = (value) => {
    if (typeof value === "function") {
      setLocalPaginateOpts((prev) => {
        const next = value(prev);
        dispatch(
          getApplicationsPaginated(
            (next.page ?? 0) + 1,
            next.limit
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getApplicationsPaginated(
          (value.page ?? 0) + 1,
          value.limit
        ) as unknown as UnknownAction
      );
    }
  };

  const filteredApplications = useMemo(() => {
    return paginatedApplications
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
                  .includes(searchTerm.toLowerCase())
            )
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
  }, [paginatedApplications, searchTerm, selectedFilters]);

  return (
    <EmployeeApplicationsPage
      applications={filteredApplications.map((app: any) => ({
        ...app,
        currentStage: getApplicationStatus2(app),
      }))}
      type="admin"
      loading={paginationLoading}
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      totalApplications={totalApplications}
      paginationProps={{
        isPaginated: true,
        paginateOpts,
        setPaginateOpts,
      }}
    />
  );
};

export default Page;
