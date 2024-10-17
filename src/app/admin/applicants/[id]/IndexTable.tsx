"use client";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";

const ApplicantTable = ({ data }: { data: any }) => {
  console.log("applicant info", data);
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
      cell: ({ row }) => <div>{row.original?.mobile}</div>,
    },
    {
      accessorKey: "mobile2",
      header: "Mobile 2",
      cell: ({ row }) => <div>{row.original?.mobile1}</div>,
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
      cell: ({ row }) => <div>{row.original?.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original?.email}</div>,
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => <div>{row.original?.currentStage}</div>,
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
        <div className="flex gap-2">
          <button
            onClick={() => handleTableChange("contacts")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "contacts"
                ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50"
                : "bg-[#005DE9] bg-opacity-50"
            }`}
          >
            <h1 className="text-base font-medium text-white">Contacts</h1>
          </button>
          {/* <button
            onClick={() => handleTableChange("applications")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "applications"
                ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50"
                : "bg-[#005DE9] bg-opacity-50"
            }`}
          >
            <h1 className="text-base font-medium text-white">Applications</h1>
          </button> */}
        </div>
      </div>
      <div className="w-full h-full">
        {activeTable === "contacts" && (
          <DataTable
            columns={contactColumns}
            data={data?.applicantContacts ?? []}
          />
        )}
        {/* {activeTable === "applications" && (
          <DataTable
            columns={applicationColumns}
            data={data?.applications ?? []}
          />
        )} */}
      </div>
    </div>
  );
};

export default ApplicantTable;
