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

const Page = () => {
  const { applications, loading } = useSelector(
    (state: any) => state.applications,
  );
  const filtersContainerRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    stage: "All",
    window: "All",
  });

  const getUniqueValues = (key: string) => {
    return [
      "All", // Adding the "All" option
      ...new Set(applications.map((app: any) => app[key]).filter(Boolean)),
    ];
  };

  const filterOptions = useMemo(
    () => ({
      stages: getUniqueValues("currentStage"),
      windows: getUniqueValues("window.title"),
    }),
    [applications],
  );

  const formatStage = (stage: string) => {
    return stage.replace(/_/g, " ").toUpperCase();
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => <div>{row.original?.applicationNumber}</div>,
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => <div>{row.original?.applicant?.name}</div>,
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => <div>{row.original?.window?.title}</div>,
    },
    {
      accessorKey: "call",
      header: "Call",
      cell: ({ row }) => <div>{row.original?.call?.title}</div>,
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => <div>{formatStage(row.original?.currentStage)}</div>,
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
  }: {
    placeholderText: string;
    data: any[];
    filterKey: keyof typeof selectedFilters;
  }) => {
    return (
      <Select
        data={data.map((item) => ({ value: item, label: item }))}
        placeholder={placeholderText}
        value={selectedFilters[filterKey]}
        onChange={(value) =>
          setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }))
        }
        className="w-full px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
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
        const { stage, window } = selectedFilters;
        return (
          (stage === "All" || formatStage(app.currentStage) === stage) &&
          (window === "All" || app.window?.title === window)
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
            className="flex items-center gap-3 overflow-x-hidden scrollbar-hide  flex-grow"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Stage"
                data={filterOptions.stages}
                filterKey="stage"
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Window"
                data={filterOptions.windows}
                filterKey="window"
              />
            </div>
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="p-2 bg-white shadow-lg rounded-full ml-2"
          >
            <FiChevronRight size={25} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <DataTable
          columns={columns}
          data={filteredApplications}
          loading={loading}
          noDataMessage={
            filteredApplications.length === 0
              ? `No applications found matching your search term or filters.`
              : ""
          }
        />
      </div>
    </div>
  );
};

export default Page;
