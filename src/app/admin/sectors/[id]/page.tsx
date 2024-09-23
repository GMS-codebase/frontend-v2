"use client";
import React, { useState } from "react";
import {
  SolarPen2Bold,
  SolarAddFolderBold,
  SolarClockSquareBold,
  SolarBookmarkBold,
} from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { DataTable } from "@/components/core/data-table";
import { CiSearch } from "react-icons/ci";
import AddSector from "@/components/Modals/AddSector";
import { useDisclosure } from "@mantine/hooks";
import AddSectorTrade from "@/components/Modals/sectors/AddSectorTrade";
import UpdateSector from "@/components/Modals/UpdateSector";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Menu } from "@mantine/core";
import { RiDeleteBinLine } from "react-icons/ri";
import { Trade } from "@/types";
import RemoveTradeFromSectorModal from "@/components/Modals/sectors/RemoveTradeFromSector";
import AddEditSector from "@/components/Modals/sectors/AddEditSector";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSector, { open, close }] = useDisclosure(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isRemoveTrade, { open: openRemoveTrade, close: closeRemoveTrade }] =
    useDisclosure(false);
  const [isUpdateSector, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);
  const sectors = useSelector((state: any) => state.sectors);
  const windows = useSelector((state: any) => state.windows);
  const sector = sectors.sectors.filter((sec: any) => sec.uuid === id)[0];
  const filteredTrades = sector?.trades?.filter(
    (tr: any) =>
      tr.title.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      tr.shortname.toLowerCase().includes(searchQuery?.toLowerCase()),
  );

  const getWindowForTrade = (trade: Trade) => {
    const windowWithSubWindow = windows.windows.find((win: any) =>
      win.subWindows.some((subWindow: any) =>
        subWindow.sectors.some((sec: any) => sec.uuid === sector?.uuid),
      ),
    );
    return windowWithSubWindow ? windowWithSubWindow.title : "No Window";
  };

  const columns: ColumnDef<Trade>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="w-full">{row.original?.title}</div>,
    },
    {
      accessorKey: "shortname",
      header: "Short Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.shortname}</div>
      ),
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
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => <div>{getWindowForTrade(row.original)}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="">
          <Menu shadow="lg" width={300}>
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
              <Menu.Item>
                <div
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                  onClick={() => {
                    setSelectedTrade(row.original);
                    openRemoveTrade();
                  }}
                >
                  <RiDeleteBinLine size={21} color="#576074" />
                  Remove
                </div>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
          <div className="px-8 space-y-5">
            <div className="space-y-2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Title</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">{sector?.name}</h1>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit ">
                <span className="">
                  <SolarClockSquareBold />
                </span>
                <div>Description</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-semibold">{sector?.description}</h1>
              </div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              <DataTable
                columns={columns}
                data={filteredTrades || []}
                noDataMessage={
                  searchQuery
                    ? `No Trades in this sector matching ${searchQuery}`
                    : "No Trades in this sector yet"
                }
              />
            </div>
          </div>
        </div>
        <AddSectorTrade
          isOpenAddSectorTrade={isAddSector}
          closeAddSectorTrade={close}
        />
        <RemoveTradeFromSectorModal
          id={selectedTrade?.uuid as any}
          closeModal={closeRemoveTrade}
          isOpenModal={isRemoveTrade}
          sectorId={sector?.uuid}
        />
        <AddEditSector
          defaultData={sector}
          closeAddEditSector={closeUpdate}
          isOpenAddEditSector={isUpdateSector}
        />
      </div>
    </div>
  );
};

export default Page;
