"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { callsData as data } from "@/utils/constants/dummy";
import CallsActions from "./CallsAction";
import { CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import AddEditCall from "@/components/Modals/call/AddEditCall";
import { useState } from "react";
import { useSelector } from "react-redux";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import { format } from "date-fns";
const Page = () => {
  const [isOpen, { open, close }] = useDisclosure(false);
  const calls = useSelector((state: any) => state.calls);
  const [isOpenCall, setIsOpenCall] = useState<any>({
    openUpdate: false,
    openDelete: false,
    call: null,
  });
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original?.title}</div>,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <div>{format(row.original?.startDate, "dd MMMM yyyy")}</div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => (
        <div>{format(row.original?.endDate, "dd MMMM yyyy")}</div>
      ),
    },
    {
      accessorKey: "appealDays",
      header: "Appeal Days",
      cell: ({ row }) => <div>{row.original?.appealDays}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <div>{row.original?.status}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <CallsActions setIsCall={setIsOpenCall} call={row.original} />
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
            className="w-full p-3 py-4 pl-12 text-base placeholder:text-black text-black rounded-full bg-[#005DE908] border-none outline-none"
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
          <h1 className="text-base font-medium text-white">New Call</h1>
        </button>
      </div>

      <div className="w-full h-full">
        {calls.loading ? (
          <TableSkeleton columns={columns} />
        ) : (
          <DataTable
            columns={columns}
            data={calls?.calls}
            noDataMessage="No Calls Created Yet"
          />
        )}
      </div>
      {/* <AddCall isOpenAddCall={isOpen} closeAddCall={close} />
      <UpdateCall
        isOpenUpdateCall={isOpenCall.openUpdate}
        closeUpdateCall={() =>
          setIsOpenCall({
            openUpdate: false,
            call: null,
            openDelete: false,
          })
        }
      />
      <DeleteCall
        id={isOpenCall?.call?.id ?? ""}
        isOpenDeleteCall={isOpenCall.openDelete}
        closeDeleteCall={() =>
          setIsOpenCall({
            openDelete: false,
            call: null,
            openUpdate: false,
          })
        }
      /> */}
    </div>
  );
};
export default Page;
