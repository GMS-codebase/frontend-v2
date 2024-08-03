"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { Contact as data} from "@/utils/constants/contact";
import CallsActions from "@/app/admin/calls/CallsAction";
import { CiSearch } from "react-icons/ci";

const ApplicantTable = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ row }) => <div>{row.original?.firstName}</div>,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ row }) => <div>{row.original?.lastName}</div>,
    },
    {
      accessorKey: "mobile1",
      header: "Mobile 1",
      cell: ({ row }) => <div>{row.original?.mobile1}</div>,
    },
    {
      accessorKey: "mobile2",
      header: "Mobile 2",
      cell: ({ row }) => <div>{row.original?.mobile2}</div>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div>{row.original?.gender}</div>,
    },
    {
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => <div>{row.original?.email}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <CallsActions/>,
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

      <div className="flex gap-2">
      <button className="bg-primary text-white py-3 px-7 flex flex-row items-center gap-3">
          <h1 className="text-base font-medium text-white">Contacts</h1>
        </button>
        <button className="bg-primary text-white py-3 px-7 flex flex-row items-center gap-3">
          <h1 className="text-base font-medium text-white">Applications</h1>
        </button>
      </div>
      </div>

      <div className="w-full h-full">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
export default ApplicantTable;
