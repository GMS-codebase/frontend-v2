import { DataTable } from "@/components/core/data-table";
import Button from "@/components/ui/Button";
import { traineesData } from "@/utils/constants/trainings";
import { Menu } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Edit2Icon } from "lucide-react";
import Link from "next/link";
import { HiDotsHorizontal } from "react-icons/hi";
import { VscEye } from "react-icons/vsc";
import { Pen2 } from "solar-icon-set";

const Trainees = () => {
  const traineesColumns: ColumnDef<any>[] = [
    {
      accessorKey: "firstName",
      header: "First name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.firstName}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last name",
      cell: ({ row }) => <div className="w-full">{row.original?.lastName}</div>,
    },
    {
      accessorKey: "nid",
      header: "NID",
      cell: ({ row }) => <div className="w-full">{row.original?.nid}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone number",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.phoneNumber}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="w-full truncate max-w-[180px]">
          {row.original?.email}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "DOB",
      cell: ({ row }) => <div className="w-full">{row.original?.dob}</div>,
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
                  href={`#`}
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
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 lg:items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-primaryText">
          Trainees
        </h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 w-full lg:w-auto">
          <Button className="!rounded-full bg-primary text-white gap-2 !py-3">
            <Pen2 />
            Request Remove Trainee/s
          </Button>
          <Button className="!rounded-full bg-primary text-white gap-2 !py-3">
            <Pen2 />
            Request Remove Trainee/s
          </Button>
          <Button className="!rounded-full bg-primary text-white gap-2 !py-3">
            <Pen2 />
            Request Remove Trainee/s
          </Button>
        </div>
      </div>
      <div>
        <DataTable
          columns={traineesColumns}
          data={traineesData}
          loading={false}
          noDataMessage={"You do not have any trainings yet"}
        />
      </div>
    </div>
  );
};

export default Trainees;
