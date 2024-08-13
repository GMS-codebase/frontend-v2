"use client";

import React from "react";
import CallsList from "../../../components/CallsList/page";
import { SolarFileBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { callData as data } from "@/utils/constants/dummy";
import { CiSearch } from "react-icons/ci";
import { calls as callsData } from "@/utils/constants/dummy";
const Page = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "number",
      header: "Application number",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.number?.length > 50
            ? row.original.number.slice(0, 50) + "..."
            : row.original.number}
        </div>
      ),
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.window?.length > 50
            ? row.original.window.slice(0, 50) + "..."
            : row.original.window}
        </div>
      ),
    },
    {
      accessorKey: "sector",
      header: "sector",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.sector?.length > 50
            ? row.original.sector.slice(0, 50) + "..."
            : row.original.sector}
        </div>
      ),
    },
    {
      accessorKey: "currentStage",
      header: "Current Stage",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.currentStage?.length > 50
            ? row.original.currentStage.slice(0, 50) + "..."
            : row.original.currentStage}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full  flex flex-col gap-4">
      <div className="font-bold text-2xl w-full">Open calls</div>
      {/* <div>
                {calls.map((call, index) => {
                    return <Calls key={index} call={call} />;
                })}
            </div> */}
            <div className="w-full relative">
                <CallsList
                    calls={callsData}
                    cardWidth="100%" // Example: setting custom card width
                    scrollAmount={1500} // Example: setting custom scroll amount
                    showArrows={true} // Example: showing arrows
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Latest applications</h2>
                    <div className="flex gap-2"></div>
                    <div className="relative w-[25rem]">
                        <span className="absolute top-4 left-2">
                            <CiSearch size={25} />
                        </span>
                        <input
                            name="search"
                            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
                            placeholder="Search"
                        />
                    </div>
                    <div className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center">
                        <span>
                            <SolarFileBold />
                        </span>
                        <div>Export as PDF</div>
                    </div>
                </div>
                <div className="w-full h-full">
                    <DataTable columns={columns} data={data.slice(0, 5)} />
                </div>
            </div>
        </div>
    );
};

export default Page;
