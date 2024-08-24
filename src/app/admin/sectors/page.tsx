"use client";
import { SolarAddSquareBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { sectorsData as data, sectorsData } from "@/utils/constants/dummy";
import SectorsActions from "../../../components/Actions/SectorsAction";
import { CiSearch } from "react-icons/ci";
import AddSector from "@/components/Modals/AddSector";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import UpdateSector from "@/components/Modals/UpdateSector";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const [isAddSector, { open, close }] = useDisclosure(false);
  const sectors = useSelector((state: any) => state.sectors);
  const [isSector, setIsSector] = useState({
    open: false,
    sector: null,
  });
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original?.name}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.description}</div>
      ),
    },
    {
      accessorKey: "    ",
      header: "     ",
      id: "1",
      cell: () => <div className="">{""}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <SectorsActions sector={row.original} setIsSector={setIsSector} />
      ),
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
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>

        <button
          onClick={open}
          className="bg-[#005DE9] text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddSquareBold />
          </span>
          <h1 className="text-base font-medium text-white">New Sector</h1>
        </button>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={sectors.sectors ?? []}
          loading={sectors.loading} 
        />
      </div>
      <AddSector isOpenAddSector={isAddSector} closeAddSector={close} />
      <UpdateSector
        sector={isSector.sector}
        isOpenUpdateSector={isSector.open}
        closeUpdateSector={() => setIsSector({ open: false, sector: null })}
      />
    </div>
  );
};
export default Page;
