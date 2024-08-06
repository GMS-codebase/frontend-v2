"use client";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import CallsActions from "@/app/admin/calls/CallsAction";
import { Contact as contactData } from "@/utils/constants/contact";
import { applicationsData as data } from "@/utils/constants/dummy";

const ApplicantTable = () => {
  const [activeTable, setActiveTable] = useState("contacts");
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
      cell: ({ row }) => <CallsActions setIsCall={setIsOpenCall} call={isOpenCall.call} />,
    },
  ];

  const applicationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => <div>{row.original?.applicationNumber}</div>,
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => <div>{row.original?.applicantName}</div>,
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div>
          WINDOW {row.original?.window.number} : {row.original?.window.name}
        </div>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => <div>{row.original?.sector}</div>,
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => <div>{row.original?.stage}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <CallsActions call={isOpenCall.call} setIsCall={setIsOpenCall}/>,
    },
  ];

  const handleTableChange = (table:any) => {
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
        <div className="flex gap-2">
          <button
            onClick={() => handleTableChange("contacts")}
       className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
                activeTable === "contacts" ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50" : "bg-[#005DE9] bg-opacity-50"
              }`}
          >
            <h1 className="text-base font-medium text-white">Contacts</h1>
          </button>
          <button
            onClick={() => handleTableChange("applications")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "applications" ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50" : "bg-[#005DE9] bg-opacity-50"
            }`}
          >
            <h1 className="text-base font-medium text-white">Applications</h1>
          </button>
        </div>
      </div>
      <div className="w-full h-full">
        {activeTable === "contacts" && <DataTable columns={contactColumns} data={contactData} />}
        {activeTable === "applications" && <DataTable columns={applicationColumns} data={data} />}
      </div>
    </div>
  );
};

export default ApplicantTable;

