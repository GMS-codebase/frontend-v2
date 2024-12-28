"use client";

import React, { useEffect, useState } from "react";
import CallsList from "../../../components/CallsList/page";
import { ColumnDef } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu, Tabs } from "@mantine/core";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { DataTable } from "@/components/core/data-table";
import { handleDownloadFile } from "@/utils/funcs";
import MinutesDecisionConfirm from "@/components/Modals/minutes/MinutesDecisionConfirm";
import { ApplicationStage } from "@/types/application";
const getApplicationStatus = (application: any) => {
  if (
    application?.currentStage === ApplicationStage.EVALUATION &&
    !application?.call?.closedEvaluation
  ) {
    return "EVALUATION IN PROGRESS";
  } else if (
    application?.currentStage === ApplicationStage.DUE_DILIGENCY &&
    !application?.call?.closedDueDiligency
  ) {
    return "DUE DILIGENCY IN  PROGRESS";
  } else if (
    application?.currentStage === "GRANT_COMMITTEE" &&
    !application?.call?.closedGrantCommittee
  ) {
    return "GRANT COMMITTEE IN PROGRESS";
  } else if (
    application?.currentStage === "CONTRACT_SIGNING" &&
    (!application?.call?.closedGrantCommittee ||
      !application?.call?.closedDueDiligency ||
      !application?.call?.closedEvaluation)
  ) {
    return "CONTRACT SIGNING IN PROGRESS";
  } else if (
    application?.currentStage === "CONTRACT_SIGNING" &&
    application?.call?.closedGrantCommittee &&
    application?.call?.closedDueDiligency &&
    application?.call?.closedEvaluation &&
    application?.uploadedContract
  ) {
    return "FINISH GRANT PROPOSALS";
  }
  {
    return application?.currentStage;
  }
};
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
      header: "Number of Trainees",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.application?.numberOfTrainees}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Minutes Status",
      cell: ({ row }) => (
        <div className="truncate">{row.original.minutes[0]?.status}</div>
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
  const {
    minutes,
    uploadedMinutes,
    approvedMinutes,
    rejectedMinutes,
    negotiatedMinutes,
    uploadedMinutesLoading,
    approvedMinutesLoading,
    rejectedMinutesLoading,
    negotiatedMinutesLoading,
    loading: loadingMinutes,
  } = useSelector((state: any) => state.minutes);
  console.log(
    "minutes --> ",
    minutes,
    uploadedMinutes,
    approvedMinutes,
    rejectedMinutes,
    negotiatedMinutes,
  );
  const [openedMinute, setOpenedMinute] = React.useState({
    open: false,
    minute: null,
    decision: "",
  });
  const approvedColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.applicant?.name ??
            row.original?.application?.applicant?.name}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.applicant?.phone ??
            row.original?.application?.applicant?.phone}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.applicant?.email ??
            row.original?.application?.applicant?.email}
        </div>
      ),
    },
    {
      accessorKey: "approval_status",
      header: "Minute Approval Status",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.minutesStatus?.toUpperCase() ??
            row.original?.application?.minutesStatus?.toUpperCase()}
        </div>
      ),
    },
  ];
  const rejectedColumns: ColumnDef<any>[] = [
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
      header: "Number of Trainees",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.application?.numberOfTrainees}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Minutes Status",
      cell: ({ row }) => (
        <div className="truncate">{row.original.minutes[0]?.status}</div>
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
  ];

  const negotiatedColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.applicant?.name ??
            row.original?.application?.applicant?.name}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.applicant?.phone ??
            row.original?.application?.applicant?.phone}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.applicant?.email ??
            row.original?.application?.applicant?.email}
        </div>
      ),
    },
    {
      accessorKey: "approval_status",
      header: "Minute Approval Status",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.minutesStatus?.toUpperCase() ??
            row.original?.application?.minutesStatus?.toUpperCase()}
        </div>
      ),
    },
  ];

  console.log(
    "uploadedMinutesLoading --> ",
    uploadedMinutesLoading,
    uploadedMinutes,
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
      <Tabs defaultValue="applications">
        <Tabs.List className="w-auto my-2 ml-5 float-end">
          <Tabs.Tab value="applications">Ready</Tabs.Tab>
          <Tabs.Tab value="approved">Approved</Tabs.Tab>
          <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
          <Tabs.Tab value="negotiated">Negotiated</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="applications">
          <h1 className="text-base p-4 font-bold">
            {" "}
            Ready For Contract negotiation
          </h1>
          <DataTable
            columns={columns}
            data={uploadedMinutes ?? []}
            loading={uploadedMinutesLoading}
            noDataMessage="No Application ready for contract negotiation"
          />
        </Tabs.Panel>
        <Tabs.Panel value="approved">
          <h1 className="text-base p-4 font-bold">
            Approved contract negotiations
          </h1>
          <DataTable
            columns={approvedColumns}
            loading={approvedMinutesLoading}
            data={approvedMinutes ?? []}
            noDataMessage="No Approved contract negotiation"
          />
        </Tabs.Panel>

        <Tabs.Panel value="rejected">
          <h1 className="text-base p-4 font-bold">
            Rejected contract negotiations
          </h1>
          <DataTable
            columns={rejectedColumns}
            data={rejectedMinutes ?? []}
            loading={rejectedMinutesLoading}
            noDataMessage="No Rejected contract negotiations"
          />
        </Tabs.Panel>
        <Tabs.Panel value="negotiated">
          <h1 className="text-base p-4 font-bold">
            Negotiated contract negotiations
          </h1>
          <DataTable
            columns={negotiatedColumns}
            data={negotiatedMinutes ?? []}
            loading={negotiatedMinutesLoading}
            noDataMessage="No Negotiated contract negotiations"
          />
        </Tabs.Panel>
      </Tabs>
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
