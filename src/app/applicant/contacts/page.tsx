"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import AddEditContact from "@/components/Modals/applicantContacts/AddEditContact";
import { useSelector } from "react-redux";
import { useState } from "react";
import DeleteContact from "@/components/Modals/applicantContacts/DeleteContact";
import { Menu } from "@mantine/core";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { Contact } from "@/types";
import DeleteModal from "@/components/Modals/DeleteModal";
const Page = () => {
  const [
    isOpenAddEditContact,
    { open: openAddEditContact, close: closeAddEditContact },
  ] = useDisclosure(false);
  const [
    isOpenDeleteContact,
    { open: openDeleteContact, close: closeDeleteContact },
  ] = useDisclosure(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const contacts = useSelector((state: any) => state.contacts);
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
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedContact(row.original);
                    openAddEditContact();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <CiEdit size={21} color="#576074" />
                  Edit
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedContact(row.original);
                    openDeleteContact();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
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
  const filteredContacts =
    contacts?.myContacts?.filter(
      (contact: any) =>
        contact?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full lg:flex justify-between items-center p-4">
        <div className="relative lg:w-[25rem] w-full mt-4 lg:mt-0">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {contacts.myContacts.length < 1 && (
          <button
            onClick={openAddEditContact}
            className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
          >
            <span className="text-2xl">
              <SolarAddFolderBold />
            </span>
            <h1 className="text-base font-medium text-white">New Contact</h1>
          </button>
        )}
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredContacts}
          loading={contacts?.loading}
          noDataMessage={
            searchQuery
              ? `No contacts matching ${searchQuery}`
              : "You do not have any contacts yet"
          }
        />
      </div>
      <AddEditContact
        isOpenAddEditContact={isOpenAddEditContact}
        closeAddEditContact={() => {
          closeAddEditContact();
          selectedContact && setSelectedContact(null);
        }}
        defaultData={selectedContact as any}
      />
      <DeleteModal
        closeModal={() => {
          setSelectedContact(null);
          closeDeleteContact();
        }}
        id={selectedContact?.uuid as any}
        type="contacts"
        isOpenModal={isOpenDeleteContact}
      />
    </div>
  );
};
export default Page;
