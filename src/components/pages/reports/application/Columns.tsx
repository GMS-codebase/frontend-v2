import { getApplicationStatus, shortenString } from "@/services";
import { calculateTotalTrainees, capitalize, getFinalDecisionFromDecisionsArray } from "@/utils/funcs";
import { Button, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import Link from "next/link";
import { Fragment } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { VscEye } from "react-icons/vsc";

export const submissionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "applicationNumber",
    header: "Application Number",
    cell: ({ row }) => (
      <div className="truncate">{row.original?.applicationNumber}</div>
    ),
  },
  {
    accessorKey: "institutionName",
    header: "Institution Name",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(
          row.original?.applicant?.businesses?.[0]?.businessName,
        ) ?? "Not Set"}
      </div>
    ),
  },
  {
    accessorKey: "institutionType",
    header: "Institution Type",
    cell: ({ row }) => (
      <div className="truncate">
        {capitalize(row.original?.applicant.businesses?.[0]?.businessType) ??
          "Not Set"}
      </div>
    ),
  },
  {
    accessorKey: "legalStatus",
    header: "Legal Status",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original?.applicant.businesses?.[0]?.private
          ? "Private"
          : "Public"}
      </div>
    ),
  },
  {
    accessorKey: "contacts",
    header: "Contacts",
    cell: ({ row }) => (
      <div className="truncate">{row.original?.applicant?.phone}</div>
    ),
  },
  {
    accessorKey: "window",
    header: "Window",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.window?.title)}
      </div>
    ),
  },
  {
    accessorKey: "subWindow",
    header: "Sub Window",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.subWindow?.title)}
      </div>
    ),
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.sector?.name)}
      </div>
    ),
  },
  {
    accessorKey: "trade",
    header: "Trade",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.trade?.trade?.title)}
      </div>
    ),
  },
  {
    accessorKey: "requestedBeneficiaries",
    header: "Requested Beneficiaries",
    cell: ({ row }) => (
      <div className="truncate w-full text-center">
        {calculateTotalTrainees(JSON.parse(row?.original.answers))! ?? "None"}
      </div>
    ),
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.applicant.businesses?.[0]?.addressLine?.split("-")[3] ??
          "Not set"}
      </div>
    ),
  },
  {
    accessorKey: "businessSector",
    header: "Sector",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.applicant.businesses?.[0]?.addressLine?.split("-")[2] ??
          "Not set"}
      </div>
    ),
  },
  {
    accessorKey: "cell",
    header: "Cell",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.applicant.businesses?.[0]?.addressLine?.split("-")[1] ??
          "Not set"}
      </div>
    ),
  },
  {
    accessorKey: "call",
    header: "Call",
    cell: ({ row }) => (
      <div className="truncate">{shortenString(row.original?.call?.title)}</div>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.finishedAnswering ? "SUBMITTED" : "ANSWERING"}
      </div>
    ),
  },
  {
    accessorKey: "submissionDate",
    header: "Submission Date",
    cell: ({ row }) => (
      <div className="truncate">
        {formatDate(row?.original?.lastUpdatedAt, "yyyy-MM-dd")}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <Menu shadow="lg" width={200}>
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
                href={`/admin/applications/${row.original.uuid}`}
                className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
              >
                <VscEye size={21} color="#576074" />
                View
              </Link>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    ),
  },
];

export const evaluationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "applicationNumber",
    header: "Application Number",
    cell: ({ row }) => (
      <div className="truncate">{row.original?.applicationNumber}</div>
    ),
  },
  {
    accessorKey: "institutionName",
    header: "Institution Name",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(
          row.original?.applicant?.businesses?.[0]?.businessName,
        ) ?? "Not Set"}
      </div>
    ),
  },
  {
    accessorKey: "institutionType",
    header: "Institution Type",
    cell: ({ row }) => (
      <div className="truncate">
        {capitalize(row.original?.applicant.businesses?.[0]?.businessType) ??
          "Not Set"}
      </div>
    ),
  },
  {
    accessorKey: "legalStatus",
    header: "Legal Status",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original?.applicant.businesses?.[0]?.private
          ? "Private"
          : "Public"}
      </div>
    ),
  },
  {
    accessorKey: "contacts",
    header: "Contacts",
    cell: ({ row }) => (
      <div className="truncate">{row.original?.applicant?.phone}</div>
    ),
  },
  {
    accessorKey: "window",
    header: "Window",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.window?.title)}
      </div>
    ),
  },
  {
    accessorKey: "subWindow",
    header: "Sub Window",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.subWindow?.title)}
      </div>
    ),
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.sector?.name)}
      </div>
    ),
  },
  {
    accessorKey: "trade",
    header: "Trade",
    cell: ({ row }) => (
      <div className="truncate">
        {shortenString(row.original?.trade?.trade?.title)}
      </div>
    ),
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.applicant.businesses?.[0]?.addressLine?.split("-")[3] ??
          "Not set"}
      </div>
    ),
  },
  {
    accessorKey: "businessSector",
    header: "Sector",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.applicant.businesses?.[0]?.addressLine?.split("-")[2] ??
          "Not set"}
      </div>
    ),
  },
  {
    accessorKey: "cell",
    header: "Cell",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.applicant.businesses?.[0]?.addressLine?.split("-")[1] ??
          "Not set"}
      </div>
    ),
  },
  {
    accessorKey: "call",
    header: "Call",
    cell: ({ row }) => (
      <div className="truncate">{shortenString(row.original?.call?.title)}</div>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.finishedAnswering ? "SUBMITTED" : "ANSWERING"}
      </div>
    ),
  },
  {
    accessorKey: "evaluationStatus",
    header: "Status",
    cell: ({ row }) => (
      <div className="truncate">{getFinalDecisionFromDecisionsArray(row?.original?.evaluationDecisions)}</div>
    ),
  },
  {
    accessorKey: "requestedBeneficiaries",
    header: "Requested Beneficiaries",
    cell: ({ row }) => (
      <div className="truncate w-full text-center">
        {calculateTotalTrainees(JSON.parse(row?.original.answers))! ?? "None"}
      </div>
    ),
  },
  {
    accessorKey: "approvedBeneficiaries",
    header: "Approved Beneficiaries",
    cell: ({ row }) => (
      <div className="truncate text-center">{row?.original?.numberOfTrainees ?? "0"}</div>
    ),
  },
  {
    accessorKey: "generalComment",
    header: "General Comment",
    cell: ({ row }) => (
      <div className="truncate text-center">{row.original?.evaluationFinalDecision ? <CommentModal applicant={row.original?.applicant?.businesses?.[0]?.businessName ?? "Unnamed Institution"} comment={row.original?.evaluationFinalDecision}/> : "N/A"}</div>
      
    ),
  },
  {
    accessorKey: "submissionDate",
    header: "Submission Date",
    cell: ({ row }) => (
      <div className="truncate">
        {formatDate(row?.original?.lastUpdatedAt, "yyyy-MM-dd")}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <Menu shadow="lg" width={200}>
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
                href={`/admin/applications/${row.original.uuid}`}
                className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
              >
                <VscEye size={21} color="#576074" />
                View
              </Link>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    ),
  },
];

interface ICommentModal {
  comment: string;
  applicant: any;
}
const CommentModal = ({applicant, comment}: ICommentModal) =>{
  const [isOpen, {open,close}] = useDisclosure(false);
  return (
    <Fragment>
      <Button size="sm" variant="link" onClick={open}>View Comment</Button>
      <Modal opened={isOpen} onClose={close} title={applicant + "'s General Comment"}>
        <div className="w-full bg-white p-4">
          <h1>{comment}</h1>
        </div>
      </Modal>
    </Fragment>
  )
}