"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddSquareBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { sectorsData as data } from "@/utils/constants/dummy";
import SectorsActions from "../../../components/Actions/SectorsAction";
import { CiSearch } from "react-icons/ci";

const Page = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original?.name}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.original?.description}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <SectorsActions/>
    },
  ];
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[25rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-12 text-base text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>

        <button className="bg-[#005DE9] text-white py-3 px-7 rounded-full flex flex-row items-center gap-3">
          <span className="text-2xl">
            <SolarAddSquareBold />
          </span>
          <h1 className="text-base font-medium text-white">New Sector</h1>
        </button>
      </div>

      <div className="w-full h-full">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
export default Page;
