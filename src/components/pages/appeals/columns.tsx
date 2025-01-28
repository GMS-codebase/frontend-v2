import { Menu } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { HiDotsHorizontal } from "react-icons/hi";
interface IGetColumns {
    setViewAppeal: (appeal: any) => void;
}
export const getColumns = ({setViewAppeal}: IGetColumns):ColumnDef<any>[] =>{
    return [
        {
          accessorKey: "title",
          header: "Application Number",
          cell: ({ row }) => <div>{row.original?.application_number}</div>,
        },
        {
          accessorKey: "institution_name",
          header: "Institution Name",
          cell: ({ row }) => <div>{row.original?.company_name}</div>,
        },
        {
          accessorKey: "legal_status",
          header: "Legal Status",
          cell: ({ row }) => <div>{row.original.legal_status}</div>,
        },
        {
          accessorKey: "stage",
          header: "Application Stage",
          cell: ({ row }) => <div>{row.original?.stage}</div>,
        },
        {
          accessorKey: "status",
          header: "Appeal Status",
          cell: ({ row }) => (
            <div
              className={`${row.original?.status === "PENDING" ? "bg-lime-100 text-lime-900" : row.original?.status === "APPROVED" ? "bg-green-300 text-lime-900" : "bg-red-50 text-red-500"} text-center rounded-full py-1`}
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
}