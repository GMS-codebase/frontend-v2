"use client";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
// import CallsActions from "@/app/admin/calls/CallsAction";
import { Contact as contactData } from "@/utils/constants/contact";
import ContractsAction from "@/components/Actions/ContractsAction";
import { shortenString } from "@/services";
interface Props {
  installments: any[];
  trainees: any[];
}
const TraineeTable = ({ installments, trainees }: Props) => {
  const [activeTable, setActiveTable] = useState("installments");
  const [isOpenCall, setIsOpenCall] = useState({
    openUpdate: false,
    openDelete: false,
    call: null,
  });
  const contactColumns: ColumnDef<any>[] = [
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
      header: "Email",
      cell: ({ row }) => <div>{row.original?.email}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        // <CallsActions setIsCall={setIsOpenCall} call={isOpenCall.call} />
        <div></div>
      ),
    },
  ];

  const applicationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original?.title}</div>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <div>{row.original?.amount}</div>,
    },
    {
      accessorKey: "percentage",
      header: "Percentage",
      cell: ({ row }) => <div>{row.original?.percentage}%</div>,
    },
    {
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => (
        <div>{shortenString(row.original?.condition, 40)}</div>
      ),
    },
    {
      accessorKey: "paid",
      header: "Paid",
      cell: ({ row }) => <div>{row.original?.paid ? "Yes" : "No"}</div>,
    },
  ];

  const handleTableChange = (table: any) => {
    setActiveTable(table);
  };

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
        <div className="flex gap-2 w-[35rem] justify-end">
          <button
            onClick={() => handleTableChange("installments")}
            className={`w-[48%] text-center justify-center  rounded-md py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "installments"
                ? "bg-[#005DE90A] border-b-[#005DE9] border-b-2 font-semibold text-blue-500"
                : "bg-[#000F2303] text-black"
            }`}
          >
            <h1 className="text-base font-medium">Contract Installments</h1>
          </button>
          {/* <button //Todo: to be uncommented when starting trainees module
            onClick={() => handleTableChange("trainees")}
            className={`w-full text-center justify-center  py-3 px-7 flex flex-row items-center gap-3 rounded-md ${
              activeTable === "trainees"
                ? "bg-[#005DE90A] border-b-[#005DE9] border-b-2 font-semibold text-blue-500"
                : "bg-[#000F2303] text-black"
            }`}
          >
            <h1 className="text-base font-medium">Trainees</h1>
          </button> */}
        </div>
      </div>
      <div className="w-full h-full">
        {activeTable === "trainees" && (
          <DataTable
            columns={contactColumns}
            data={trainees}
            verticalPadding={5}
            tableWidth={trainees ? "100rem" : "100%"}
          />
        )}
        {activeTable === "installments" && (
          <DataTable
            columns={applicationColumns}
            data={installments}
            verticalPadding={5}
          />
        )}
      </div>
    </div>
  );
};

export default TraineeTable;
