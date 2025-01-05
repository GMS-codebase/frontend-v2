import { getApplicationStatus, shortenString } from "@/services";
import { Menu } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import Link from "next/link";
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
          {row.original?.applicant?.businesses?.[0]?.businessName ?? "Not Set"}
        </div>
      ),
    },
    {
        accessorKey: "institutionType",
        header: "Institution Type",
        cell: ({ row }) => (
          <div className="truncate">
            {row.original?.applicant.businesses?.[0]?.businessType ?? "Not Set"}
          </div>
        ),
      },
      {
        accessorKey: "legalStatus",
        header: "Legal Status",
        cell: ({ row }) => (
          <div className="truncate">
            {row.original?.applicant.businesses?.[0]?.private ? "Private": "Public"}
          </div>
        ),
      },
      {
        accessorKey: "contacts",
        header: "Contacts",
        cell: ({ row }) => (
          <div className="truncate">
            {row.original?.applicant?.phone}
          </div>
        ),
      },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div className="truncate">{shortenString(row.original?.window?.title)}</div>
      ),
    },
    {
        accessorKey: "subWindow",
        header: "Sub Window",
        cell: ({ row }) => (
          <div className="truncate">{shortenString(row.original?.subWindow?.title)}</div>
        ),
      },
      {
        accessorKey: "sector",
        header: "Sector",
        cell: ({ row }) => (
          <div className="truncate">{shortenString(row.original?.sector?.name)}</div>
        ),
      },
      {
        accessorKey: "trade",
        header: "Trade",
        cell: ({ row }) => (
          <div className="truncate">{shortenString(row.original?.trade?.trade?.title)}</div>
        ),
      },
      {
        accessorKey: "requestedBeneficiaries",
        header: "Requested Beneficiaries",
        cell: ({ row }) => (
          <div className="truncate">{shortenString(row.original?.trade?.trade?.title)}</div>
        ),
      },
      {
        accessorKey: "district",
        header: "District",
        cell: ({ row }) => (
          <div className="truncate">{row.original.applicant.businesses?.[0]?.addressLine?.split("-")[0]}</div>
        ),
      },
      {
        accessorKey: "businessSector",
        header: "Sector",
        cell: ({ row }) => (
          <div className="truncate">{row.original.applicant.businesses?.[0]?.addressLine?.split("-")[1]}</div>
        ),
      },
      {
        accessorKey: "cell",
        header: "Cell",
        cell: ({ row }) => (
          <div className="truncate">{row.original.applicant.businesses?.[0]?.addressLine?.split("-")[2]}</div>
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
          {getApplicationStatus(row.original) || "-"}
        </div>
      ),
    },
    {
        accessorKey: "submissionDate",
        header: "Submission Date",
        cell: ({ row }) => (
          <div className="truncate">{formatDate(row?.original?.lastUpdatedAt, "yyyy-MM-dd")}</div>
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