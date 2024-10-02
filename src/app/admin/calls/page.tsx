"use client";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiEdit, CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import AddEditCall from "@/components/Modals/call/AddEditCall";
import { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Menu } from "@mantine/core";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Call } from "@/types";
import DeleteModal from "@/components/Modals/DeleteModal";

const Page = () => {
  const [
    isOpenAddEditModal,
    { open: openAddEditModal, close: closeAddEditModal },
  ] = useDisclosure(false);
  const calls = useSelector((state: any) => state.calls);
  const [selectedCall, setSelectedCall] = useState<Call | null>();
  const [isOpenCall, setIsOpenCall] = useState<any>({
    openUpdate: false,
    openDelete: false,
    call: null,
  });
  const [
    isOpenDeleteModal,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
      cell: ({ row }) => (
        <div
          className={`${row.original?.status === "OPEN" ? "bg-lime-100 text-lime-900" : "bg-red-50 text-red-500"} text-center px-2 rounded-full py-1`}
        >
          {row.original?.status}
        </div>
      ),
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
              <Menu.Item className="bg-[#F0F0F0]">
                <Link
                  href={`/admin/calls/${row.original.uuid}`}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={21} color="#576074" />
                  View
                </Link>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedCall(row.original);
                    openAddEditModal();
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
                    setSelectedCall(row.original);
                    openDeleteModal();
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

  const filteredCalls = calls?.calls?.filter((call: Call) => {
    const query = searchQuery.toLowerCase();
    return (
      call.title.toLowerCase().includes(query) ||
      format(new Date(call.startDate), "dd MMMM yyyy")
        .toLowerCase()
        .includes(query) ||
      format(new Date(call.endDate), "dd MMMM yyyy")
        .toLowerCase()
        .includes(query) ||
      call.status.toLowerCase().includes(query)
    );
  });

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={openAddEditModal}
          className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">New Call</h1>
        </button>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredCalls}
          noDataMessage="No Calls Created Yet"
          loading={calls.loading}
        />
      </div>
      <AddEditCall
        isOpenAddEditCall={isOpenAddEditModal}
        closeAddEditCall={() => {
          setSelectedCall(null);
          closeAddEditModal();
        }}
        defaultData={selectedCall as any}
      />
      <DeleteModal
        type="calls"
        closeModal={() => {
          setSelectedCall(null);
          closeDeleteModal();
        }}
        id={selectedCall?.uuid || ""}
        isOpenModal={isOpenDeleteModal}
      />
    </div>
  );
};

export default Page;
