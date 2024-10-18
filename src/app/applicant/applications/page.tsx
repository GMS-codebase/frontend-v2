"use client";

import React from "react";
import CallsList from "../../../components/CallsList/page";
import { SolarFileBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { callData as data } from "@/utils/constants/dummy";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import { HiDotsHorizontal } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { Menu } from "@mantine/core";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { Call } from "@/types";
const Page = () => {
  const navigate = useRouter;
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "number",
      header: "Application number",
      cell: ({ row }) => (
        <div className="truncate">{row.original.applicationNumber}</div>
      ),
    },
    {
      accessorKey: "call",
      header: "Call Title",
      cell: ({ row }) => (
        <div className="truncate">{row.original.call?.title}</div>
      ),
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div className="truncate">{row.original.window.title}</div>
      ),
    },
    {
      accessorKey: "currentStage",
      header: "Current Stage",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.currentStage || "-"}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div>
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
                  href={
                    row.original.stages.length > 0
                      ? `/admin/applications/${row.original.uuid}`
                      : `/admin/applications/${row.original.call.uuid}/${row.original.uuid}/apply`
                  }
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={21} color="#576074" />
                  View
                </Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];
  const myApplications = useSelector((state: any) => state.applications);
  const calls = useSelector((state: any) => state.calls);

  return (
    <div className="w-full  flex flex-col gap-4">
      {calls?.calls?.filter((call: Call) => call.status === "OPEN").length >
        0 && (
        <div className="p-7 rounded-2xl bg-white space-y-4">
          <div className="font-bold text-2xl w-full">Open calls</div>
          <div className="w-full ">
            <CallsList />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest applications</h2>
          <div className="flex gap-2"></div>
          {/* <div className="relative w-[25rem]">
            <span className="absolute top-4 left-2">
              <CiSearch size={25} />
            </span>
            <input
              name="search"
              className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
              placeholder="Search"
            />
          </div> */}
        </div>
        <div className="w-full h-full">
          <DataTable
            columns={columns}
            data={myApplications.myApplications}
            loading={myApplications.loading}
            noDataMessage={"You haven't made any applications yet"}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
