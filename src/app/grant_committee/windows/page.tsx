"use client";
import { SolarAddSquareBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { CiSearch } from "react-icons/ci";
import AddWindow from "@/components/Modals/AddWindow";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import UpdateWindow from "@/components/Modals/UpdateWindow";
import WindowsActions from "./WindowAction";
import DeleteWindow from "@/components/Modals/DeleteWindow";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { Window } from "@/types";
const windows = [
  {
    name: "Window 1: Rapid Response Training",
    description: "Short-term training of potential employees for investors",
  },
  {
    name: "Window 2: Rapid Response Training",
    description: "Short-term training of potential employees for investors",
  },
  {
    name: "Window 3: Rapid Response Training",
    description: "Short-term training of potential employees for investors",
  },
  {
    name: "Window 4: Rapid Response Training",
    description: "Short-term training of potential employees for investors",
  },
];
const Page = () => {
  const [isAddWindow, { open, close }] = useDisclosure(false);
  const windows = useSelector((state: any) => state.windows);
  const [isWindow, setIsWindow] = useState<{
    openDelete: boolean;
    openUpdate: boolean;
    window: Window | null;
  }>({
    openDelete: false,
    openUpdate: false,
    window: null,
  });
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original?.title}</div>,
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
        <WindowsActions Window={row.original} setIsWindow={setIsWindow} />
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
          <h1 className="text-base font-medium text-white">New Window</h1>
        </button>
      </div>

      {windows.loading ? (
        <div className="w-full flex items-center justify-center gap-4 mt-10">
          <h1>Loading Windows </h1>
          <ClipLoader size={20} color="black" />
        </div>
      ) : windows.error ? (
        <div className="w-full flex justify-center items-center">
          <h1 className="text-red-500 font-bold">{windows.error}</h1>
        </div>
      ) : (
        <div className="w-full h-full">
          <DataTable columns={columns} data={windows.windows} />
        </div>
      )}
      <AddWindow isOpenAddWindow={isAddWindow} closeAddWindow={close} />
      <UpdateWindow
        Window={isWindow.window}
        isOpenUpdateWindow={isWindow.openUpdate}
        closeUpdateWindow={() =>
          setIsWindow({ openDelete: false, openUpdate: false, window: null })
        }
      />
      <DeleteWindow
        id={isWindow.window?.uuid ?? ""}
        isOpenDeleteWindow={isWindow.openDelete}
        closeDeleteWindow={() =>
          setIsWindow({ openDelete: false, openUpdate: false, window: null })
        }
      />
    </div>
  );
};
export default Page;
