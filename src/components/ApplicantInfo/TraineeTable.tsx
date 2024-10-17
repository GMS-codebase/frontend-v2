"use client";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
// import CallsActions from "@/app/admin/calls/CallsAction";
import { Contact as contactData } from "@/utils/constants/contact";
import { ContractDetails as contract } from "@/utils/constants/dummy";
import ContractsAction from "@/components/Actions/ContractsAction";

const TraineeTable = () => {
  const [activeTable, setActiveTable] = useState("trainees");
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
      cell: ({ row }) => <div>{row.original?.percentage}</div>,
    },
    {
      accessorKey: "paid",
      header: "Paid",
      cell: ({ row }) => <div>{row.original?.paid}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <ContractsAction />,
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
        <div className="flex gap-2 w-[35rem]">
          <button
            onClick={() => handleTableChange("trainees")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "trainees"
                ? "bg-[#005DE9] border-b-[#005DE9] text-blue-500 bg-opacity-20"
                : "bg-[#005DE9] bg-opacity-20 text-blue-500"
            }`}
          >
            <h1 className="text-base font-medium text-blue-500">Trainees</h1>
          </button>
          <button
            onClick={() => handleTableChange("contractInstallments")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "contractInstallments"
                ? "bg-[#005DE9] border-b-[#005DE9] text-blue-500 bg-opacity-20"
                : "bg-[#005DE9] bg-opacity-20 text-blue-500"
            }`}
          >
            <h1 className="text-base font-medium text-blue-500">
              Contract Installments
            </h1>
          </button>
        </div>
      </div>
      <div className="w-full h-full">
        {activeTable === "trainees" && (
          <DataTable columns={contactColumns} data={contactData} />
        )}
        {activeTable === "contractInstallments" && (
          <DataTable columns={applicationColumns} data={contract} />
        )}
      </div>
    </div>
  );
};

export default TraineeTable;
