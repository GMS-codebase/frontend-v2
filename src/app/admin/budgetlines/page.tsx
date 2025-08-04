"use client";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import AddBudgetLine from "@/components/Modals/budgetLines/AddEditBudgetLine";
import { useSelector } from "react-redux";
import { Menu, Button, Text, rem } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import DeleteModal from "@/components/Modals/DeleteModal";
import ActivateDeactivateModal from "@/components/Modals/ActivateDeactivateModal";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [
    isOpenCreateEdit,
    { open: openCreateEditModal, close: closeCreateEditModal },
  ] = useDisclosure(false);
  const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [
    isOpenActivateDeactivateBudgetLine,
    {
      open: openActivateDeactivateBudgetLineModal,
      close: closeActivateDeactivateBudgetLineModal,
    },
  ] = useDisclosure(false);

  const budgetLines = useSelector((state: any) => state.budgetLines);
  const [selectedBudgetLine, setSelectedBudgetLine] = useState<any>("");
  const filteredBudgetLines =
    budgetLines.budgetLines?.filter((budgetLine: any) =>
      budgetLine?.budgetLine?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.budgetLine}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.status || "-"}</div>
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
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedBudgetLine(row.original);
                    openActivateDeactivateBudgetLineModal();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <CiEdit size={21} color="#576074" />
                  {row.original.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedBudgetLine(row.original);
                    openCreateEditModal();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <CiEdit size={21} color="#576074" />
                  Edit
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                  onClick={() => {
                    setSelectedBudgetLine(row.original);
                    openDeleteModal();
                  }}
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

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-4 items-end md:items-center p-4">
        <div className="relative lg:w-[25rem] w-full mb-4">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>

        <button
          onClick={openCreateEditModal}
          className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">New BudgetLine</h1>
        </button>
      </div>
      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredBudgetLines}
          loading={budgetLines.loading}
          noDataMessage={
            searchQuery
              ? `No Budget Lines found related to ${searchQuery}`
              : "No Budget Lines Added So Far"
          }
        />
      </div>
      <AddBudgetLine
        isOpenAddEditBudgetLine={isOpenCreateEdit}
        closeAddEditBudgetLine={() => {
          closeCreateEditModal();
          setSelectedBudgetLine(null);
        }}
        defaultData={selectedBudgetLine}
      />
      <DeleteModal
        isOpenModal={isOpenDelete}
        closeModal={() => {
          closeDeleteModal();
          setSelectedBudgetLine(null);
        }}
        type="budgetLines"
        id={selectedBudgetLine?.uuid}
      />
      <ActivateDeactivateModal
        type="budgetLines"
        closeModal={() => {
          closeActivateDeactivateBudgetLineModal();
          setSelectedBudgetLine(null);
        }}
        id={selectedBudgetLine?.uuid}
        isActive={selectedBudgetLine?.status === "ACTIVE"}
        isOpenModal={isOpenActivateDeactivateBudgetLine}
      />
    </div>
  );
};

export default Page;
