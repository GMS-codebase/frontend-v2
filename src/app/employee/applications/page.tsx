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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.applicationNumber}</div>
      ),
    },
    {
      accessorKey: "institutionName",
      header: "Institution Name",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.applicant?.businesses[0].businessName}
        </div>
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
             console.log(
                 "Scrolling left",
                 filtersContainerRef.current.scrollLeft
             );
         } else {
             filtersContainerRef.current.scrollLeft += scrollAmount;
             console.log(
                 "Scrolling right",
                 filtersContainerRef.current.scrollLeft
             );
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
      <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
          {/* <div className="w-full lg:flex justify-between items-center p-4 gap-5">
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
              <div className="relative flex lg:w-[80%] w-full items-center">
                  {/* Left Scroll Button */}

          {/* <DataTable
              data={filteredApplications}
              columns={columns}
              loading={loading}
              totalApplications={totalApplications}
              // page={page} // Todo: to update in case of an error
              // setPage={setPage}
              // paginationFuncs={{
              //   onChangePage: handleChangePage,
              //   onNextPage: handleNextPage,
              //   onPreviousPage: handlePreviousPage
              // }}
              paginationProps={{
                  isPaginated: true,
                  paginateOpts: {
                      page: page - 1,
                      totalPages: totalPages,
                      limit: limit,
                  },
                  setPaginateOpts: () => {},
              }}
          /> */}

          <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
              <div className="w-full lg:flex justify-between items-center p-4 gap-5">
                  {/* Search Bar */}
                  <div className="relative w-full lg:w-[20rem] mb-4">
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

                  {/* Filters Container */}
                  <div className="relative flex w-full lg:w-[80%] items-center">
                      {/* Left Scroll Button */}
                      <button
                          onClick={() => handleScroll("left")}
                          className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md"
                      >
                          <FiChevronLeft size={30} />
                      </button>

                      {/* Scrollable Filters */}
                      <div
                          ref={filtersContainerRef}
                          className="flex w-full overflow-x-auto space-x-4 py-2 scrollbar-hide lg:space-x-6 sm:space-x-3"
                      >
                          <FilterDropDown
                              placeholderText="Select Stage"
                              data={filterOptions.stages}
                              filterKey="stage"
                              className="min-w-[200px] sm:min-w-[150px] lg:min-w-[250px]"
                          />
                          <FilterDropDown
                              placeholderText="Select Window"
                              data={filterOptions.windows}
                              filterKey="window"
                              className="min-w-[200px] sm:min-w-[150px] lg:min-w-[250px]"
                          />
                          <FilterDropDown
                              placeholderText="Select SubWindow"
                              data={filterOptions.subwindows}
                              filterKey="subWindow"
                              className="min-w-[200px] sm:min-w-[150px] lg:min-w-[250px]"
                          />
                          <FilterDropDown
                              placeholderText="Select Sector"
                              data={filterOptions.sectors}
                              filterKey="sector"
                              className="min-w-[200px] sm:min-w-[150px] lg:min-w-[250px]"
                          />
                          <FilterDropDown
                              placeholderText="Select Trade"
                              data={filterOptions.trades}
                              filterKey="trade"
                              className="min-w-[200px] sm:min-w-[150px] lg:min-w-[250px]"
                          />
                      </div>

                      {/* Right Scroll Button */}
                      <button
                          onClick={() => handleScroll("right")}
                          className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-md"
                      >
                          <FiChevronRight size={30} />
                      </button>
                  </div>
              </div>

              {/* Data Table */}
              <DataTable
                  data={filteredApplications}
                  columns={columns}
                  loading={loading}
                  totalApplications={totalApplications}
                  // page={page}
                  // setPage={setPage}
                  // paginationFuncs={{
                  //     onChangePage: handleChangePage,
                  //     onNextPage: handleNextPage,
                  //     onPreviousPage: handlePreviousPage,
                  // }}
                  paginationProps={{
                      isPaginated: true,
                      paginateOpts: {
                          page: page - 1,
                          totalPages: totalPages,
                          limit: limit,
                      },
                      setPaginateOpts: () => {},
                  }}
              />
          </div>
      </div>
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
