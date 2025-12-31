import { shortenString } from "@/services";
import { Menu } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { HiDotsHorizontal } from "react-icons/hi";
interface IGetColumns {
  setViewAppeal: (appeal: any) => void;
}
export const getColumns = ({
  setViewAppeal,
}: IGetColumns): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "title",
      header: "Application Number",
      cell: ({ row }) => <div>{row.original?.application_number}</div>,
    },
    {
      accessorKey: "institution_name",
      header: "Institution Name",
      cell: ({ row }) => (
        <div>{row.original?.applicant?.businesses?.[0]?.businessName}</div>
      ),
    },
    {
      accessorKey: "legal_status",
      header: "Legal Status",
      cell: ({ row }) => <div>{row.original.legal_status}</div>,
    },
    {
      accessorKey: "institution_name",
      header: "Applicant Info",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.applicant?.name} /
          <span className="font-bold">{row.original?.applicant?.phone}</span>
          <br />
          {row.original?.applicant?.email}
        </div>
      ),
    },
    {
      accessorKey: "stage",
      header: "Application Stage",
      cell: ({ row }) => <div>{row.original?.stage.stage}</div>,
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.application?.window?.title}
        </div>
      ),
    },
    {
      accessorKey: "stage",
      header: "Sub-Window",
      cell: ({ row }) => (
        <div className="truncate">
          {shortenString(row.original?.application?.subWindow?.title, 40)}
        </div>
      ),
    },
    {
      accessorKey: "stage",
      header: "Sector",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.application?.sectors?.[0]?.name}
        </div>
      ),
    },
    {
      accessorKey: "trade",
      header: "Trade",
      cell: ({ row }) => (
        <div className="truncate">
          {shortenString(row.original?.application?.trades?.[0]?.trade?.title)}
        </div>
      ),
    },
    {
      accessorKey: "stage",
      header: "Application Stage",
      cell: ({ row }) => <div>{row.original?.stage?.stage}</div>,
    },
    {
      accessorKey: "status",
      header: "Appeal Status",
      cell: ({ row }) => (
        <div
          className={`${row.original?.status === "PENDING" ? "bg-lime-100 text-lime-900" : row.original?.status === "APPROVED" ? "bg-green-300 text-lime-900" : "bg-red-50 text-red-500"} text-center rounded-full py-3`}
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
};
