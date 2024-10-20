"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "@mantine/core";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import AddSectorTrade from "@/components/Modals/sectors/AddSectorTrade";
import RemoveTradeFromSectorModal from "@/components/Modals/sectors/RemoveTradeFromSector";
import AddEditSector from "@/components/Modals/sectors/AddEditSector";
import { Trade, Sector, Window, TradeSector } from "@/types";
import { authorizedApi } from "@/utils/api";
import { getSectors } from "@/utils/funcs";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [trades, setTrades] = useState<TradeSector[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<TradeSector | null>(null);

  const [isAddSector, { open: openAddSector, close: closeAddSector }] =
    useDisclosure(false);
  const [isRemoveTrade, { open: openRemoveTrade, close: closeRemoveTrade }] =
    useDisclosure(false);
  const [isUpdateSector, { open: openUpdateSector, close: closeUpdateSector }] =
    useDisclosure(false);

  // Redux selectors
  const sectors = useSelector((state: any) => state.sectors);
  const windows = useSelector((state: any) => state.windows);
  const dispatch = useDispatch();

  // Find the current sector
  const sector: Sector | undefined = useMemo(() => {
    return sectors.sectors.find((sec: Sector) => sec.uuid === id);
  }, [sectors, id]);
  // Fetch trades using useEffect
  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedApi.get(`/Sectors/${id}/trades`);

      setTrades(response.data.data.data);
    } catch (err: any) {
      console.error("Error fetching trades:", err);
      setError(err?.response?.data?.message || "Failed to fetch trades.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getSectors(dispatch);
      fetchTrades();
    }
  }, [id]);

  const filteredTrades = useMemo(() => {
    return trades?.filter(
      (tradeSector) =>
        tradeSector.trade.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tradeSector.trade.shortname
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [trades, searchQuery]);

  const columns: ColumnDef<TradeSector>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="w-full">{row.original.trade.title}</div>
        ),
      },
      {
        accessorKey: "shortname",
        header: "Short Name",
        cell: ({ row }) => (
          <div className="w-full">{row.original.trade.shortname}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="truncate">
            {row.original.trade.description?.length > 50
              ? `${row.original.trade.description?.slice(0, 50)}...`
              : row.original.trade.description}
          </div>
        ),
      },
      {
        accessorKey: "window",
        header: "Window",
        cell: ({ row }) => <div>{row.original.theWindow.title}</div>,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
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
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074] cursor-pointer"
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
        ),
      },
    ],
    [openRemoveTrade],
  );

  return (
    <div className="bg-white rounded-2xl py-10">
      <div className="flex flex-col gap-6">
        {/* Sector Information */}
        <div className="flex flex-col gap-6 text-black">
          <div className="flex justify-between px-10">
            <div className="text-xl font-bold">Sector Info</div>
            <button
              onClick={openUpdateSector}
              className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4 py-2 items-center justify-center"
            >
              <SolarPen2Bold />
              <span>Edit Sector</span>
            </button>
          </div>
          <div className="px-8 space-y-5">
            {/* Sector Title */}
            <div className="space-y-2">
              <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full items-center justify-center w-fit">
                <SolarAddFolderBold />
                <span>Title</span>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start">
                <h1 className="font-bold text-xl">{sector?.name || "N/A"}</h1>
              </div>
            </div>
            {/* Sector Description */}
            <div className="space-y-2">
              <div className="flex gap-2 bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full items-center justify-center w-fit">
                <SolarClockSquareBold />
                <span>Description</span>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start">
                <h1 className="font-semibold">
                  {sector?.description || "N/A"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Trades Section */}
        <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
          <div className="w-full flex justify-between items-center py-4 px-10">
            <div className="flex gap-2 bg-gray-400 rounded-full bg-opacity-10 px-4 py-2 font-semibold items-center justify-center">
              <SolarBookmarkBold />
              <span>Trades</span>
            </div>
            <div className="flex gap-3 items-center">
              {/* Search Bar */}
              <div className="relative w-[25rem]">
                <CiSearch className="absolute top-4 left-2" size={25} />
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
                  placeholder="Search"
                />
              </div>
              {/* Add New Trade Button */}
              <button
                onClick={openAddSector}
                className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
              >
                <SolarAddFolderBold className="text-2xl" />
                <span className="text-base font-medium">New Sector Trade</span>
              </button>
            </div>
          </div>
          <div className="w-full h-full px-10">
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <span>Loading trades...</span>
              </div>
            )}
            {/* Error Message */}
            {error && (
              <div className="flex justify-center items-center py-10 text-red-500">
                {error}
              </div>
            )}
            {/* Data Table */}
            {!loading && !error && (
              <DataTable
                columns={columns}
                data={filteredTrades}
                noDataMessage={
                  searchQuery
                    ? `No Trades in this sector matching "${searchQuery}"`
                    : "No Trades in this sector yet"
                }
              />
            )}
          </div>
        </div>
        <AddSectorTrade
          isOpenAddSectorTrade={isAddSector}
          closeAddSectorTrade={() => {
            fetchTrades();
            closeAddSector();
          }}
        />
        <RemoveTradeFromSectorModal
          tradeId={selectedTrade?.trade?.uuid || ""}
          windowId={selectedTrade?.theWindow.uuid || ""}
          closeModal={() => {
            fetchTrades();
            closeRemoveTrade();
          }}
          isOpenModal={isRemoveTrade}
        />
        <AddEditSector
          defaultData={sector}
          closeAddEditSector={closeUpdateSector}
          isOpenAddEditSector={isUpdateSector}
        />
      </div>
    </div>
  );
};

export default Page;
