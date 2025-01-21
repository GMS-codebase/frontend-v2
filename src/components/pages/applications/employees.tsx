/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { DataTable } from "@/components/core/data-table";
import { CiSearch } from "react-icons/ci";
import { Select } from "@mantine/core";
import { useRef, useState, useMemo, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { getEmployeeApplicationsPaginated } from "@/services";
import { UnknownAction } from "redux";
import { useDispatch } from "react-redux";
import { filterByStep } from "@/utils/funcs";
import { ApplicationsColumns } from "./columns";
import { FilterDropDown } from "./filters";

interface IApplicationsPage {
  type: "admin" | "employee" | "sdf";
  applications: any[];
  loading: boolean;
  selectedFilters: any;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedFilters: any;
}

const EmployeeApplicationsPage = ({
  type,
  applications,
  loading,
  selectedFilters,
  searchTerm,
  setSearchTerm,
  setSelectedFilters,
}: IApplicationsPage) => {
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  console.log(applications);

  // Helper function to get unique values for dropdown filters
  const getUniqueValues = (key: string) => {
    return [
      "All",
      ...new Set(
        applications
          .map((app: any) =>
            key.split(".").reduce((obj, property) => obj?.[property], app)
          )
          .filter(Boolean)
      ),
    ];
  };

  const filterOptions = useMemo(
    () => ({
      stages: getUniqueValues("currentStage"),
      windows: getUniqueValues("window.title"),
      subwindows: getUniqueValues("subWindow.title"),
      sectors: getUniqueValues("sector.name"),
      trades: getUniqueValues("trade.trade.title"),
      call: getUniqueValues("call.title"),
    }),
    [applications]
  );
  const filters = [
    {
      label: "Window",
      data: filterOptions.windows,
      filterKey: "window",
    },
    {
      label: "Sub Window",
      data: filterOptions.subwindows,
      filterKey: "subWindow",
    },
    {
      label: "Sector",
      data: filterOptions.sectors,
      filterKey: "sector",
    },
    {
      label: "Trade",
      data: filterOptions.trades,
      filterKey: "trade",
    },
  ];
  const handleScroll = (direction: "left" | "right") => {
    if (filtersContainerRef.current) {
      const scrollAmount = 100;
      if (direction === "left") {
        filtersContainerRef.current.scrollLeft -= scrollAmount;
      } else {
        filtersContainerRef.current.scrollLeft += scrollAmount;
      }
    }
  };

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
                  .includes(searchTerm.toLowerCase())
            )
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
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4 gap-5">
        <div className="relative w-[20rem]">
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
        <div className="flex items-center max-w-[70%]">
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
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
            {selectedFilters?.stage?.toLowerCase() !== "all" &&
              selectedFilters?.stage?.toLowerCase() !== "answering" && (
                <div className="flex items-center gap-3 ">
                  <button
                    onClick={() =>
                      setSelectedFilters({
                        ...selectedFilters,
                        step: "PENDING",
                      })
                    }
                    className={`py-3 px-5 transition-all duration-200 rounded-full ${selectedFilters.step === "PENDING" ? "bg-blue-400" : "bg-blue-100"} font-semibold text-white`}
                  >
                    PENDING
                  </button>
                  <button
                    onClick={() =>
                      setSelectedFilters({
                        ...selectedFilters,
                        step: "EVALUATED",
                      })
                    }
                    className={`py-3 px-5 transition-all duration-200 rounded-full ${selectedFilters.step === "EVALUATED" ? "bg-blue-400" : "bg-blue-100"} font-semibold text-white`}
                  >
                    EVALUATED
                  </button>
                  <button
                    onClick={() =>
                      setSelectedFilters({
                        ...selectedFilters,
                        step: "APPROVED",
                      })
                    }
                    className={`py-3 px-5 transition-all duration-200 rounded-full ${selectedFilters.step === "APPROVED" ? "bg-green-400" : "bg-green-100"} font-semibold text-white`}
                  >
                    APPROVED
                  </button>
                  <button
                    onClick={() =>
                      setSelectedFilters({
                        ...selectedFilters,
                        step: "REJECTED",
                      })
                    }
                    className={`py-3 px-5 transition-all duration-200 rounded-full ${selectedFilters.step === "REJECTED" ? "bg-red-400" : "bg-red-100"} font-semibold text-white`}
                  >
                    REJECTED
                  </button>
                </div>
              )}

            {filters.map((filter, index) => {
              return (
                <FilterDropDown
                  key={index}
                  placeholderText={"Filter By " + filter.label}
                  data={filter.data}
                  filterKey={filter.filterKey}
                  className="flex-shrink-0"
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              );
            })}
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
        data={applications}
        columns={ApplicationsColumns(type)}
        loading={loading}
      />
    </div>
  );
};

export default EmployeeApplicationsPage;
