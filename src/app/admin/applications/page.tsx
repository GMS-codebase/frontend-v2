"use client";
import { BiSearch } from "react-icons/bi";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useDisclosure } from "@mantine/hooks";
import { useState, useRef } from "react";
import { Select } from "@mantine/core";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import CallsActions from "./CallsAction";
import AddEditCall from "@/components/Modals/call/AddEditCall";

const Page = () => {
  const [isOpenCall, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filtersContainerRef = useRef<HTMLDivElement>(null);

  const applications = useSelector((state: any) => state.applications);

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
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => <div>{row.original?.sectors[0]?.name}</div>,
    },
    {
      accessorKey: "trade",
      header: "Trade",
      cell: ({ row }) => (
        <div>
          {row.original?.trades[0]
            ? row.original?.trades[0]?.title
            : "Not Assigned"}
        </div>
      ),
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => <div>{row.original?.currentStage}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <CallsActions application={row.original} />,
    },
  ];

  const FilterDropDown = ({
    placeholderText,
    data,
  }: {
    placeholderText: string;
    data: any[];
  }) => (
    <Select
      data={data}
      placeholder={placeholderText}
      defaultValue={placeholderText}
      className="w-full px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
    />
  );

  const filteredApplications =
    applications?.applications?.filter((application: any) =>
      application?.applicant?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) ?? [];

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

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[20rem]">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 bg-white shadow-lg rounded-full mr-2"
          >
            <FiChevronLeft size={25} />
          </button>

           <div
            ref={filtersContainerRef}
            className="flex items-center gap-3 overflow-x-hidden scrollbar-hide"
            style={{ scrollBehavior: "smooth", maxWidth: "calc(4 * 11rem)" }}
          >
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By stage"
                data={["Duediligence"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Window"
                data={["Window 1: Apprenticeship and Internships"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Subwindow"
                data={["Rapid apprentices"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Sector"
                data={["ICT & Innovations"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By trade"
                data={["Agriculture"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By District"
                data={[
                  "Kicukiro",
                  "Musanze",
                  "Nyagatare",
                  "Muhanga",
                  "Nyarugenge",
                  "Kamonyi",
                  "Nyanza",
                  "Gasabo",
                ]}
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

      <div className="w-full h-full">
        {applications?.loading ? (
          <TableSkeleton columns={columns} />
        ) : filteredApplications.length === 0 ? (
          <h1>No Applications Found!</h1>
        ) : (
          <DataTable
            columns={columns}
            data={filteredApplications} 
            tableWidth={1800}
          />
        )}
      </div>
      <AddEditCall isOpenAddEditCall={isOpenCall} closeAddEditCall={close} />
    </div>
  );
};

export default Page;
