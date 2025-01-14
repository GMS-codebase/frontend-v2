/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { DataTable } from "@/components/core/data-table";
import { CiSearch } from "react-icons/ci";
import { Select } from "@mantine/core";
import { useRef, useState, useMemo, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { getApplications, getApplicationStatus } from "@/services";
import ExportForm from "@/components/core/data-table/ExportForm";
import MainModal from "./MainModal";
import { useDisclosure } from "@mantine/hooks";
import { calculateTotalTrainees, capitalize, exportDataToExcel, getStage } from "@/utils/funcs";
import { submissionColumns } from "./Columns";
import { formatDate } from "date-fns";
import { useDispatch } from "react-redux";

const Page = () => {
  const [isShowExport, {open: showExport, close: closeExport}] = useDisclosure(false);
  const [reportType, setReportType] = useState("Submission Report");
  const { applications: rawApplications, paginatedApplications, loading } = useSelector(
    (state: any) => state.applications,
  );
  const dispatch = useDispatch();
  const applications = useMemo(
    () =>
      rawApplications.map((app: any) => ({
        ...app,
        sector: app.sectors[0] || null,
        trade: app.trades[0] || null,
      })),
    [rawApplications],
  );

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
        applications
          .map((app: any) =>
            key.split(".").reduce((obj, property) => obj?.[property], app),
          )
          .filter(Boolean),
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
    [applications],
  );


  const FilterDropDown = ({
    placeholderText,
    data,
    filterKey,
    className,
    defaultValue
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

  const getReportName = (call: string, sector: string, type: string): string =>{
    return `${call == "All" ? "All Calls" : call} - ${sector == "All" ? "All Sectors" : sector} - ${type}`;
  }
  const filteredApplications = useMemo(() => {
    return applications
      .filter(
        (app: any) =>
          app.applicationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.applicant?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((app: any) => {
        const { stage, window, call, subWindow, sector, trade } =
          selectedFilters;
        return (
          (stage === "All" || app?.currentStage === stage) &&
          (call === "All" || app.call?.title === call) &&
          (window === "All" || app.window?.title === window) &&
          (subWindow === "All" || app.subWindow?.title === subWindow) &&
          (sector === "All" || app.sector?.name === sector) &&
          (trade === "All" || app.trade?.trade.title === trade)
        );
      });
  }, [applications, searchTerm, selectedFilters]);

  const formattedSubmissionData = filteredApplications.map((row: any, index: any)=>{
    return {
      index: index,
      applicationNumber: row.applicationNumber,
      institutionName: row.applicant?.businesses?.[0]?.businessName ?? "Not set",
      window: row.window?.title,
      call: row.call?.title,
      subWindow: row.subWindow?.title,
      sector: row.sectors[0]?.name,
      trade: row.trades[0]?.trade?.title,
      stage: row.currentStage,
      contacts: row.applicant?.phone,
      institutionType: capitalize(row.applicant.businesses?.[0]?.businessType),
      legalStatus: row.applicant.businesses?.[0]?.private ? "Private": "Public",
      requestedBeneficiaries: calculateTotalTrainees(JSON.parse(row?.answers)) ?? "None",
      district: row.applicant.businesses?.[0]?.addressLine?.split("-")[0] ?? "",
      businessSector: row.applicant.businesses?.[0]?.addressLine?.split("-")[1] ?? "",
      cell:row.applicant.businesses?.[0]?.addressLine?.split("-")[2] ?? "",
      submissionDate: formatDate(row?.lastUpdatedAt, "yyyy-MM-dd"),
    }
  })

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
        <div className="flex items-center max-w-[60%]">
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
            <Select
              data={["Submission Report", "Evaluation Report", "Due Diligence Report", "Grant Committee Report"]}
              placeholder={"Select Report Type"}
              value={reportType}
              onChange={(value: any)=> {setReportType(value); setSelectedFilters({...selectedFilters, stage: getStage(value)})}}
              className={`w-[33%] px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black`}
            />
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="p-2 bg-white shadow-lg rounded-full ml-2"
          >
            <FiChevronRight size={25} />
          </button>
        </div>
        <button
            className="w-[8rem] p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 m-4"
            onClick={showExport}
          >
            Export Data
          </button>
      </div>

      <DataTable
        data={filteredApplications}
        columns={submissionColumns}
        loading={loading}
      />
      <MainModal title={"Export " + reportType}isOpen={isShowExport} onClose={closeExport}>
        <ExportForm exportAllToExcel={()=> exportDataToExcel(getReportName(selectedFilters.call, selectedFilters.sector, reportType),formattedSubmissionData, submissionColumns)} data={formattedSubmissionData!} onClose={closeExport} />
      </MainModal>
    </div>
  );
};

export default Page;
