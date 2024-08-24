"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { applicantContacts as data } from "@/utils/constants/dummy";
import { useDisclosure } from "@mantine/hooks";
import AddTrade from "@/components/Modals/AddTrade";
import AddEditContact from "@/components/Modals/applicantContacts/AddEditContact";
import { useSelector } from "react-redux";
import Actions from "./ContactsAction";
import { useState } from "react";
import DeleteContact from "@/components/Modals/applicantContacts/DeleteContact";
const Page = () => {
  const [isOpenAddEditContact, { open, close }] = useDisclosure(false);
  const contacts = useSelector((state: any) => state.contacts);
  const [isOpenContact, setIsOpenContact] = useState({
    openUpdate: false,
    openDelete: false,
    contact: null,
  });
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.firstName}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ row }) => <div className="w-full">{row.original?.lastName}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => <div className="w-full">{row.original?.mobile}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone Number 2",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.mobile1 || "-"}</div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div className="w-full">{row.original?.gender}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="w-full">{row.original?.email}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Actions contact={row.original} setIsContact={setIsOpenContact} />
      ),
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

        <button
          onClick={open}
          className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">New Contact</h1>
        </button>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={contacts?.myContacts}
          loading={contacts?.loading}
          noDataMessage={"You do not have any contacts yet"}
        />
      </div>
      <AddEditContact
        isOpenAddEditContact={isOpenAddEditContact}
        closeAddEditContact={close}
      />
      <DeleteContact
        isOpenDeleteContact={isOpenContact.openDelete}
        contact={isOpenContact.contact}
        closeDeleteContact={() =>
          setIsOpenContact({
            openDelete: false,
            contact: null,
            openUpdate: false,
          })
        }
      />
    </div>
  );
};
export default Page;
