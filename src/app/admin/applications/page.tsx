/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";
import {
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
<<<<<<< HEAD
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full lg:flex justify-between items-center p-4 gap-5">
        <div className="relative lg:w-[20rem] w-full mb-4">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} color="" />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center lg:max-w-[70%] w-full">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 bg-white shadow-lg rounded-full mr-2"
          >
            <FiChevronLeft size={25} />
          </button>

          <div
            ref={filtersContainerRef}
            className="flex items-center gap-3 overflow-x-hidden scrollbar-hide flex-grow"
            style={{ scrollBehavior: "smooth" }}
          >
            <FilterDropDown
              placeholderText="Filter By Stage"
              data={filterOptions.stages}
              filterKey="stage"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Filter By Window"
              data={filterOptions.windows}
              filterKey="window"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Filter By Sub Window"
              data={filterOptions.subwindows}
              filterKey="subWindow"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Filter By Sector"
              data={filterOptions.sectors}
              filterKey="sector"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Filter By Trade"
              data={filterOptions.trades}
              filterKey="trade"
              className="flex-shrink-0"
            />
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="p-2 bg-white shadow-lg rounded-full ml-2"
          >
            <FiChevronRight size={25} />
          </button>
        </div>
      </div>

      <DataTable
        data={filteredApplications}
        columns={columns}
        loading={loading}
        totalApplications={totalApplications}
        page={page}
        setPage={setPage}
        paginationFuncs={{
          onChangePage: handleChangePage,
          onNextPage: handleNextPage,
          onPreviousPage: handlePreviousPage
        }}
        paginationProps={{
          isPaginated: true,
          paginateOpts: {
              page: page - 1,
              totalPages: totalPages,
              limit: limit,
          },
          setPaginateOpts: () => {}
      }}
      />
    </div>
=======
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
>>>>>>> 04618d16693b41a3d326d060318ec29e9bb806da
  );
};

export default Page;
