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
import { CiEdit, CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import AddEditWindowSubwindow from "@/components/Modals/windows/AddEditWindowSubwindow";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import AddEditWindow from "@/components/Modals/windows/AddEditWindow";
import { Menu } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import DeleteModal from "@/components/Modals/DeleteModal";

const Page = () => {
  const navigate = useRouter();
  const [
    isAddEditSubWindow,
    { open: openAddEditSubWindow, close: closeAddEditSubWindow },
  ] = useDisclosure(false);
  const [
    isDeleteSubWindow,
    { open: openDeleteSubWindow, close: closeDeleteSubWindow },
  ] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { id: windowId } = useParams();
  const [isUpdateWindow, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);
  const windows = useSelector((state: any) => state.windows);
  const window = windows.windows?.filter(
    (window: any) => window.uuid === windowId
  )[0];
  const filteredSubWindows = window?.subWindows.filter((subW: any) =>
    subW.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [selectedSubWindow, setSelectedSubWindow] = useState<any>();
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
              <Menu.Item className="bg-[#F0F0F0]">
                <div
                  onClick={() =>
                    navigate.push(
                      `/admin/windows/${window?.uuid}/${row.original?.uuid}`
                    )
                  }
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={21} color="#576074" />
                  View
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedSubWindow(row.original);
                    openAddEditSubWindow();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <CiEdit size={21} color="#576074" />
                  Edit
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                  onClick={() => {
                    setSelectedSubWindow(row.original);
                    openDeleteSubWindow();
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
  return window?.uuid ? (
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
          <div className=" px-10 space-y-5">
            <div className="space-y-2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Title</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">{window?.title}</h1>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center  w-fit">
                <span className="">
                  <SolarClockSquareBold />
                </span>
                <div>Description</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-medium text-base text-gray-500">
                  {window?.description}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-3/5  font-semibold px-10"></div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
                    placeholder="Search"
                  />
                </div>

                <button
                  onClick={openAddEditSubWindow}
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
                data={filteredSubWindows ?? []}
                loading={!filteredSubWindows}
                noDataMessage={
                  searchQuery
                    ? "No Sub Windows found matching " + searchQuery
                    : `No Sub Windows Created For ${window?.title}`
                }
              />
            </div>
          </div>
        </div>
        <AddEditWindowSubwindow
          isOpenAddEditWindowSubwindow={isAddEditSubWindow}
          closeAddEditWindowSubwindow={() => {
            closeAddEditSubWindow();
            selectedSubWindow && setSelectedSubWindow(null);
          }}
          defaultData={selectedSubWindow}
        />
        <AddEditWindow
          isOpenAddEditWindow={isUpdateWindow}
          closeAddEditWindow={closeUpdate}
          defaultData={window}
        />
        <DeleteModal
          type="subwindows"
          closeModal={() => {
            closeDeleteSubWindow();
            selectedSubWindow && setSelectedSubWindow(null);
          }}
          id={selectedSubWindow?.uuid}
          isOpenModal={isDeleteSubWindow}
          windowId={window?.uuid}
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full">
      <p>Loading</p>
    </div>
  );
};

export default Page;
