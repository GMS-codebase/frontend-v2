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
import ViewAppealModal from "@/components/Modals/appeal/ViewAppeal";

const Page = () => {

  const { appeals, loading } = useSelector((state: any) => state.appeals);
  const [viewAppeal, setViewAppeal] = useState<any>({
    open: false,
    appeal: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Application Number",
      cell: ({ row }) => <div>{row.original?.application_number}</div>,
    },
    {
      accessorKey: "company_name",
      header: "Company Name",
      cell: ({ row }) => <div>{row.original?.company_name}</div>,
    },
    {
      accessorKey: "legal_status",
      header: "Legal Status",
      cell: ({ row }) => <div>{row.original.legal_status}</div>,
    },
    {
      accessorKey: "appeal_comment",
      header: "Appeal Description",
      cell: ({ row }) => (
        <div>
          {row.original?.appeal_comment?.length > 30
            ? row.original?.appeal_comment?.slice(0, 30) + "..."
            : row.original?.appeal_comment}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Appeal Status",
      cell: ({ row }) => (
        <div
          className={`${row.original?.status === "PENDING" ? "bg-lime-100 text-lime-900" : row.original?.status === "APPROVED" ? "bg-green-300 text-lime-900" : "bg-red-50 text-red-500"} text-center px-2 rounded-full py-1`}
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
                <button
                  onClick={() =>
                    setViewAppeal({
                      open: true,
                      appeal: row.original,
                    })
                  }
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={21} color="#576074" />
                  View
                </button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  const filteredAppeals = appeals?.filter((appeal: any) => {
    const query = searchQuery.toLowerCase();
    return appeal?.appeal_comment.toLowerCase().includes(query);
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
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredAppeals}
          noDataMessage="No Appeals Created Yet"
          loading={loading}
        />
      </div>
      <ViewAppealModal
        isOpen={viewAppeal.open}
        onClose={() => setViewAppeal({ open: false, appeal: null })}
        appeal={viewAppeal.appeal}
      />
    </div>
  );
};

export default Page;