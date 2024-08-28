"use client";
import React, { useEffect, useState } from "react";
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
import { useDisclosure } from "@mantine/hooks";
import AddWindowSubwindow from "@/components/Modals/AddWindowSubwindow";
import UpdateWindow from "@/components/Modals/UpdateWindow";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { authorizedApi } from "@/utils/api";

const Page = () => {
  const [isAddWindow, { open, close }] = useDisclosure(false);
  const [window, setWindow] = useState<any>({});
  const [subWindows, setSubWindows] = useState([]);
  const { id: windowId } = useParams();
  const [isUpdateWindow, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);
  useEffect(() => {
    authorizedApi
      .get(`/window/${windowId}`)
      .then((res) => {
        setWindow(res.data?.data?.data);
        setSubWindows(res.data?.data?.data?.subWindows);
      })
      .catch((err) => {
      });
  }, [windowId]);
  // const window = windows.windows?.filter((window: any) => window.uuid === windowId)
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="w-full">{row.original?.title}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.description?.length > 50
            ? row.original?.description?.slice(0, 50) + "..."
            : row.original?.description}
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
            <div className="text-xl font-bold">Window Info</div>
            <button
              onClick={openUpdate}
              className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
            >
              <span>
                <SolarPen2Bold />
              </span>
              <div>Edit Window</div>
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
          <div className="flex justify-between items-center w-3/5  font-semibold px-10">
            <div className="flex flex-col gap-6 justify-start items-start ">
              <h1 className="font-bold text-xl">{window?.title}</h1>
            </div>
            <div className="flex flex-col gap-6 justify-start items-start ">
              <h1 className="font-medium text-base text-gray-500">
                {window?.description}
              </h1>
            </div>
          </div>
          <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
            <div className="w-full flex justify-between items-center py-4 px-10">
              <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                <span>
                  <SolarBookmarkBold />
                </span>
                <div>Sub Windows</div>
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
                    New Sub-Window
                  </h1>
                </button>
              </div>
            </div>

            <div className="w-full h-full">
              <DataTable
                columns={columns}
                data={subWindows ?? []}
                noDataMessage={`No Sub Windows Created For ${window?.title}`}
              />
            </div>
          </div>
        </div>
        <AddWindowSubwindow
          setSubWindows={setSubWindows}
          isOpenAddWindowSubwindow={isAddWindow}
          closeAddWindowSubwindow={close}
        />
        <UpdateWindow
          Window={window}
          isOpenUpdateWindow={isUpdateWindow}
          closeUpdateWindow={closeUpdate}
        />
      </div>
    </div>
  );
};

export default Page;
