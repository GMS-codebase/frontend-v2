"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { Menu, Select } from "@mantine/core";
import { useRef, useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";
import { getApplicationStatus, shortenString } from "@/utils/funcs";

const Page = () => {
  // Select applications from Redux store
  const { applications: rawApplications, loading } = useSelector(
    (state: any) => state.applications,
  );
  const { stages } = useSelector((state: any) => state.empStages);
  console.log(stages);

  const applications = useMemo(
    () =>
      rawApplications
        .map((app: any) => ({
          ...app,
          sector: app.sectors[0] || null,
          trade: app.trades[0] || null,
        }))
        .filter((app: any) => {
          const matchingStage = stages.find(
            (stage: any) => stage.sector == app.sector.name,
          );
          console.log("Filtering app:", app, "Matching stage:", matchingStage);
          return matchingStage;
        }),
    [rawApplications, stages],
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

  // Helper function to get unique values for dropdown filters
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

  // Format stage string
  const formatStage = (stage: string) => {
    return stage.replace(/_/g, " ").toUpperCase();
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.applicationNumber}</div>
      ),
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.applicant?.name}</div>
      ),
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div className="truncate">
          {shortenString(row.original?.window?.title)}
        </div>
      ),
    },
    {
      accessorKey: "call",
      header: "Call",
      cell: ({ row }) => (
        <div className="truncate">
          {shortenString(row.original?.call?.title)}
        </div>
      ),
    },
    {
      accessorKey: "subWindow",
      header: "Sub Window",
      cell: ({ row }) => (
        <div className="truncate">
          {shortenString(row.original?.subWindow?.title)}
        </div>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.sector?.name}</div>
      ),
    },
    {
      accessorKey: "trade",
      header: "Trade",
      cell: ({ row }) => (
        <div className="truncate">
          {shortenString(row.original?.trade?.trade?.title)}
        </div>
      ),
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => (
        <div className="truncate">{getApplicationStatus(row.original)}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <Menu shadow="lg" width={200}>
            <Menu.Target>
              <button
                style={{
                  background:
                    "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
                }}
                className="p-3 rounded-full border text-white hover:bg-red-100"
              >
                <HiDotsHorizontal size={25} color="white" />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <h1 className="text-lg">Actions</h1>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item className="bg-[#F0F0F0]">
                <Link
                  href={`/employee/applications/${row.original.uuid}`}
                  className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <VscEye size={21} color="#576074" />
                  View
                </Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  const FilterDropDown = ({
    placeholderText,
    data,
    filterKey,
    className,
  }: {
    placeholderText: string;
    data: any[];
    filterKey: keyof typeof selectedFilters;
    className?: string;
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
          (stage === "All" || getApplicationStatus(app) === stage) &&
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
      />
    </div>
  );
};

export default Page;
