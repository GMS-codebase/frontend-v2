"use client";
import React from "react";
import {
  SolarPen2Bold,
  SolarAddFolderBold,
  SolarClockSquareBold,
  SolarBookmarkBold,
} from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { DataTable } from "@/components/core/data-table";
import { tradesData as data } from "@/utils/constants/dummy";
import { CiSearch } from "react-icons/ci";
import AddSector from "@/components/Modals/AddSector";
import { useDisclosure } from "@mantine/hooks";
import AddSectorTrade from "@/components/Modals/AddSectorTrade";
import UpdateSector from "@/components/Modals/UpdateSector";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

const Page = () => {
  const [isAddSector, { open, close }] = useDisclosure(false);
  const sectors = useSelector((state: any)=> state.sectors);
  const {id} = useParams();
  console.log(id);
  const sector = sectors.sectors.find((sector: any)=> sector.uuid === id);
  console.log(sectors);
  const [isUpdateSector, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="w-full">{row.original?.name}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.description.length > 50
            ? row.original?.description.slice(0, 50) + "..."
            : row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <button
            style={{
              background:
                "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
            }}
            className="p-3 rounded-full border text-white hover:bg-red-100"
          >
            <HiDotsHorizontal size={25} color="white" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-white rounded-2xl py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between px-10">
            <div className="text-xl font-bold">Sector Info</div>
            <button
              onClick={openUpdate}
              className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
            >
              <span>
                <SolarPen2Bold />
              </span>
              <div>Edit Sector</div>
            </button>
          </div>
          <div className="flex justify-between w-3/5  font-semibold px-10">
            <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
              <span className="">
                <SolarAddFolderBold />
              </span>
              <div>Title</div>
            </div>
            <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center ">
              <span className="">
                <SolarClockSquareBold />
              </span>
              <div>Description</div>
            </div>
          </div>
          <div className="flex gap-2 px-10">
            <div className="flex flex-col gap-6 justify-start items-start ">
              <h1 className="font-bold text-xl">
                {sector?.name} ({sector?.shortname})
              </h1>
            </div>
          </div>
          <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
            <div className="w-full flex justify-between items-center py-4 px-10">
              <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                <span>
                  <SolarBookmarkBold />
                </span>
                <div>Trades</div>
              </div>
              <div className="flex gap-3 items-center">
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

                <button
                  onClick={open}
                  className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
                >
                  <span className="text-2xl">
                    <SolarAddFolderBold />
                  </span>
                  <h1 className="text-base font-medium text-white">
                    New Sector Trade
                  </h1>
                </button>
              </div>
            </div>

            <div className="w-full h-full">
              <DataTable columns={columns} data={sectors.sectors.trades ?? []} noDataMessage="No Trades For This Sector"/>
            </div>
          </div>
        </div>
        <AddSectorTrade
          isOpenAddSectorTrade={isAddSector}
          closeAddSectorTrade={close}
        />
        <UpdateSector
          sector={{}}
          isOpenUpdateSector={isUpdateSector}
          closeUpdateSector={closeUpdate}
        />
      </div>
    </div>
  );
};

export default Page;
