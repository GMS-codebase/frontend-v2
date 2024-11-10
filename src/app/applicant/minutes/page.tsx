"use client";

import React from "react";
import CallsList from "../../../components/CallsList/page";
import { ColumnDef } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu } from "@mantine/core";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { DataTable } from "@/components/core/data-table";
import { getApplicationStatus } from "../applications/page";
import { handleDownloadFile } from "@/utils/funcs";
import MinutesDecisionConfirm from "@/components/Modals/MinutesDecisionConfirm";

const Page = () => {
  
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "number",
      header: "Application number",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original.application.applicationNumber}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Application Title",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original.application.projectFunding.title}
        </div>
      ),
    },
    {
      accessorKey: "currentStage",
      header: "Current Stage",
      cell: ({ row }) => (
        <div className="truncate">
          {getApplicationStatus(row.original.application) || "-"}
        </div>
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
                <button
                  onClick={() =>
                    handleDownloadFile(
                      row.original.minutes[0]?.minuteNegotiationAttachment,
                      "minute-negotiation",
                    )
                  }
                >
                  Download
                </button>
              </Menu.Item>
              <Menu.Item className="bg-[#F0F0F0]">
                <button
                  onClick={() =>
                    setOpenedMinute({
                      ...openedMinute,
                      open: true,
                      minute: row.original,
                      decision: "Approve",
                    })
                  }
                >
                  Approve
                </button>
              </Menu.Item>
              <Menu.Item className="bg-[#F0F0F0]">
                <button
                  onClick={() =>
                    setOpenedMinute({
                      ...openedMinute,
                      open: true,
                      minute: row.original,
                      decision: "Reject",
                    })
                  }
                >
                  Reject
                </button>
              </Menu.Item>
              <Menu.Item className="bg-[#F0F0F0]">
                <button
                  onClick={() =>
                    setOpenedMinute({
                      ...openedMinute,
                      open: true,
                      minute: row.original,
                      decision: "Negotiate",
                    })
                  }
                >
                  Negotiate
                </button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];
  const defaultOpenMinute = {
    open: false,
    minute: null,
    decision: "",
  };
  const [openedMinute, setOpenedMinute] = React.useState({
    open: false,
    minute: null,
    decision: "",
  });
  const { uploadedMinutes, uploadedMinutesLoading } = useSelector(
    (state: any) => state.minutes,
  );
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Minutes</h2>
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

        <button className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3">
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">Export as Excel</h1>
        </button>
      </div>
      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={uploadedMinutes}
          loading={uploadedMinutesLoading}
          noDataMessage={"You don't any minutes yet"}
        />
      </div>

      <MinutesDecisionConfirm
        decision={openedMinute.decision}
        minute={openedMinute.minute}
        isOpen={openedMinute.open}
        onClose={() => setOpenedMinute(defaultOpenMinute)}
      />
    </div>
  );
};

export default Page;
