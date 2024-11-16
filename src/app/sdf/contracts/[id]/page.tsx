"use client";
import React, { useEffect, useState } from "react";
import {
  SolarPen2Bold,
  SolarAddFolderBold,
  SolarClockSquareBold,
  SolarBookmarkBold,
} from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { DataTable } from "@/components/core/data-table";
import { CiEdit, CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import AddEditWindowSubwindow from "@/components/Modals/windows/AddEditWindowSubwindow";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import AddEditWindow from "@/components/Modals/windows/AddEditWindow";
import { Menu, Modal } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import DeleteModal from "@/components/Modals/DeleteModal";
import ActivateDeactivateModal from "@/components/Modals/ActivateDeactivateModal";
import PDFViewerModal from "@/components/PDFViewer";
import InstallmentsActions from "./InstallmentsActions";

const Page = () => {
  const { id: applicationId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { contracts, loading } = useSelector((state: any) => state.contracts);
  const { applications, loading: loadingApplications } = useSelector(
    (state: any) => state.applications,
  );
  const application = applications.find(
    (a: any) => a.uuid === applicationId,
  ) ?? [0];
  const contract = contracts.find(
    (c: any) => c.application_ID === applicationId,
  ) ?? [0];
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.title?.length > 30
            ? row.original?.title?.slice(0, 30) + "..."
            : row.original?.title}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <div className="w-full">{row.original?.amount}</div>,
    },
    {
      accessorKey: "percentage",
      header: "Percentage",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.percentage} %</div>
      ),
    },
    {
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.condition?.length > 50
            ? row.original?.condition?.slice(0, 50) + "..."
            : row.original?.condition}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.paid ? "PAID" : "UNPAID"}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <InstallmentsActions data={row.original} contractId={contract?.uuid} />
      ),
    },
  ];

  const [isOpenViewPDF, { open: openViewPDF, close: closeViewPDF }] =
    useDisclosure(false);
  const pdfPath = contract?.contractAttachment;
  return contract?.uuid ? (
    <div className="bg-white rounded-2xl py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between px-10">
            <div className="text-xl font-bold">Contract Details</div>
            <div className="flex gap-2">
            <button
              onClick={openViewPDF}
              className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
            >
                <div>View Contract Attachment</div>
              </button>
              <button
              onClick={openViewPDF}
              className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
            >
                <div>View Minutes Attachment</div>
              </button>
            </div>
          </div>
          <div className=" px-10 space-y-5">
            <div className="space-y-2 flex items-center gap-3">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Contract Number</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">
                  {contract?.contractNumber}
                </h1>
              </div>
            </div>
            <div className="space-y-2 flex items-center gap-3">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Contract Amount</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">
                  {parseInt(contract?.totalAmount)}
                </h1>
              </div>
            </div>
            <div className="space-y-2 flex items-center gap-3">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Paid Amount</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">
                  {parseInt(contract?.totalAmount) -
                    parseInt(contract?.remainedAmount)}
                </h1>
              </div>
            </div>
            <div className="space-y-2 flex items-center gap-3">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Remaining Amount</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">
                  {parseInt(contract?.remainedAmount)}
                </h1>
              </div>
            </div>
            <div className="space-y-2 flex items-center gap-3">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Number of trainees</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">
                  {contract?.numberOfTrainees}
                </h1>
              </div>
            </div>
            <div className="space-y-2 flex items-center gap-3">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Status</div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-start ">
                <h1 className="font-bold text-xl">
                  {contract?.contractStatus}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-3/5  font-semibold px-10"></div>
          <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
            <div className="w-full flex justify-between items-center py-4 px-10">
              <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                <span>
                  <SolarBookmarkBold />
                </span>
                <div>Installments</div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="relative w-[25rem]">
                  <span className="absolute top-4 left-2">
                    <CiSearch size={25} />
                  </span>
                  <input
                    name="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-full">
              <DataTable
                columns={columns}
                data={contract.installments ?? []}
                loading={false}
                noDataMessage={"No Installments Created"}
              />
            </div>
          </div>
        </div>
      </div>
      <PDFViewerModal
        isOpenViewPDF={isOpenViewPDF}
        closeViewPDF={closeViewPDF}
        pdfPath={pdfPath}
      />
    </div>
  ) : (
    <div className="flex items-center justify-center h-full">
      <p>Loading</p>
    </div>
  );
};

export default Page;
