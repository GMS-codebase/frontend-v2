"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { tradesData as data } from "@/utils/constants/dummy";
import { useDisclosure } from "@mantine/hooks";
import AddContract from "@/components/Modals/AddContract";
import Contracts from "@/components/contracts/contracts";
import { useSelector } from "react-redux";
import ContractsActions from "./ContractsActions";
import { useState } from "react";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";

const Page = () => {
  const [isOpenTrade, { open, close }] = useDisclosure(false);
  const [isContract, setIsContract] = useState({
    isOpen: false,
    application: null
  })
  const {applicationsForContractSigning: applications, loading} = useSelector((state: any)=> state.applications);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => <div className="w-full">{row.original?.applicationNumber}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="w-full">{row.original?.applicant?.name}</div>,
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => <div className="w-full">{row.original?.applicant?.phone}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.description.length > 50
            ? row.original?.description.slice(0, 50) + "..."
            : row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <ContractsActions data={row.original} setIsContract={setIsContract}/>
    },
  ];
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[25rem]">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="w-full h-full">
        <h1 className="text-xl p-4 font-bold">Applications Ready For Contract Signing</h1>
        {loading ? <TableSkeleton columns={columns}/>: <DataTable columns={columns} data={applications} noDataMessage="No Approved Applications"/>}
      </div>
      <AddContract data={isContract.application} isOpenAddContract={isContract.isOpen} closeAddContract={()=> setIsContract({isOpen: false, application: null})} />
    </div>
  );
};
export default Page;
