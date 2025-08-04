/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Menu, Select } from "@mantine/core";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import ViewAppealModal from "@/components/Modals/appeal/ViewAppeal";
import { getColumns } from "./columns";
import SolarIconSet from "@/components/core/icons/SolarIconSet";
import { FilterDropDown } from "../applications/filters";

const AppealsPage = () => {
  const { appeals, loading } = useSelector((state: any) => state.appeals);
  console.log(appeals)
  const [viewAppeal, setViewAppeal] = useState<any>({
    open: false,
    appeal: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    stage: "All",
    window: "All",
    subWindow: "All",
    call: "All",
    sector: "All",
    trade: "All",
  });

  const getUniqueValues = (key: string) => {
    return [
      "All",
      ...new Set(
        (appeals.data || [])?.map((app: any) =>
          key.split(".").reduce((obj, property) => obj?.[property], app),
        )
          .filter(Boolean),
      ),
    ];
  };

  const filterOptions = useMemo(
    () => ({
      stages: getUniqueValues("stage.stage"),
      windows: getUniqueValues("application.window.title"),
      subwindows: getUniqueValues("application.subWindow.title"),
      sectors: getUniqueValues("application.sectors?.[0].name"),
      trades: getUniqueValues("application.trade.trade.title"),
      call: getUniqueValues("call.title"),
    }),
    [appeals],
  );
  const FilterDropDown = ({
    placeholderText,
    data,
    filterKey,
    className,
    defaultValue,
  }: {
    placeholderText: string;
    data: any[];
    filterKey: keyof typeof selectedFilters;
    className?: string;
    defaultValue?: string;
  }) => {
    const displayValue =
      selectedFilters[filterKey] === "All" ? "" : selectedFilters[filterKey];
    return (
      <Select
        data={data.map((item) => ({ value: item, label: item }))}
        placeholder={placeholderText}
        value={displayValue}
        onChange={(value) =>
          setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }))
        }
        defaultValue={defaultValue}
        className={`w-fit px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black ${className}`}
      />
    );
  };

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
  const filteredAppeals = useMemo(() => {
    return (appeals.data || [])
      .filter(
        (app: any) =>
          app?.application_number
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ||
          app?.application?.applicant?.name
            .toLowerCase()
            ?.includes(searchTerm.toLowerCase()),
      )
      .filter((app: any) => {
        const { stage, window, call, subWindow, sector, trade } =
          selectedFilters;
        return (
          (stage === "All" || app?.stage?.stage === stage) &&
          (call === "All" || app.call?.title === call) &&
          (window === "All" || app?.application?.window?.title === window) &&
          (subWindow === "All" ||
            app?.application?.subWindow?.title === subWindow) &&
          (sector === "All" || app?.application?.sector?.name === sector) &&
          (trade === "All" || app?.application?.trade?.trade.title === trade)
        );
      });
  }, [appeals, searchTerm, selectedFilters]);

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4 gap-2">
        <div className="relative w-[25rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-12 text-base placeholder:text-black text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center lg:max-w-[60%]">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 bg-white shadow-lg rounded-full mr-2"
          >
            <FiChevronLeft size={25} />
          </button>

          <div
            ref={filtersContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-grow"
            style={{ scrollBehavior: "smooth" }}
          >
            <FilterDropDown
              placeholderText="Select Call"
              data={filterOptions.call}
              filterKey="call"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Select Sector"
              data={filterOptions.sectors}
              filterKey="sector"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Select Trade"
              data={filterOptions.trades}
              filterKey="trade"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Select Window"
              data={filterOptions.windows}
              filterKey="window"
              className="flex-shrink-0"
            />
            <FilterDropDown
              placeholderText="Select sub Window"
              data={filterOptions.subwindows}
              filterKey="subWindow"
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
        <button className="text-nowrap bg-primary py-2 text-white px-5 flex items-center gap-2 rounded-full">
          <SolarIconSet.FileLeft iconStyle="Bold" className="my-auto" />
          Export As Excel
        </button>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={getColumns({ setViewAppeal })}
          data={filteredAppeals}
          noDataMessage="No Appeals Created Yet"
          loading={loading}
        />
      </div>
      <ViewAppealModal
        isOpen={viewAppeal.open}
        onClose={() => setViewAppeal({ open: false, appeal: null })}
        appeal={viewAppeal.appeal}
      />
    </div>
  );
};

export default AppealsPage;
