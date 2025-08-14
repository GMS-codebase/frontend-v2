import { DataTable } from "@/components/core/data-table";
import Button from "@/components/ui/Button";
import { ITrainingTrainee } from "@/types/trainings";
import { traineesData } from "@/utils/constants/trainings";
import { Menu } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Edit2Icon } from "lucide-react";
import Link from "next/link";
import { HiDotsHorizontal } from "react-icons/hi";
import { VscEdit, VscEye, VscTrash } from "react-icons/vsc";
import { Pen2 } from "solar-icon-set";

type props = {
  trainees: ITrainingTrainee[];
  handleAddTraineeRequest?: () => void;
  currentRole: string | null;
};

const Trainees = ({
  trainees,
  handleAddTraineeRequest,
  currentRole,
}: props) => {
  const traineesColumns: ColumnDef<ITrainingTrainee>[] = [
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
      cell: ({ row }) => (
        <div className="w-full">{row.original?.nationalId}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone number",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.traineePhoneNumber}</div>
      ),
    },
    {
      accessorKey: "educationLevel",
      header: "Education Level",
      cell: ({ row }) => (
        <div className="w-full truncate max-w-[180px]">
          {row.original?.educationLevel}
        </div>
      ),
    },
    {
      accessorKey: "institutionName",
      header: "Institution Name",
      cell: ({ row }) => (
        <div className="w-full truncate max-w-[180px]">
          {row.original?.institutionName}
        </div>
      ),
    },
    {
      accessorKey: "graduateStatus",
      header: "Graduate Status",
      cell: ({ row }) => (
        <div className="w-full truncate max-w-[180px] text-center">
          {row.original?.graduateStatus}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div className="w-full">{row.original?.gender}</div>,
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
              {currentRole === "APPLICANT" && (
                <>
                  <Menu.Item className="bg-[#F0F0F0]">
                    <Link
                      href={`#`}
                      className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
                    >
                      <VscEdit size={21} color="blue" />
                      Request Edit
                    </Link>
                  </Menu.Item>
                  <Menu.Item className="bg-[#F0F0F0]">
                    <Link
                      href={`#`}
                      className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
                    >
                      <VscTrash size={21} color="red" />
                      Request Delete
                    </Link>
                  </Menu.Item>
                </>
              )}
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
        {currentRole === "APPLICANT" && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 w-full lg:w-auto">
            <Button
              onClick={() => handleAddTraineeRequest?.()}
              className="!rounded-full bg-primary text-white gap-2 !py-3"
            >
              <Pen2 />
              Request Add Trainee/s
            </Button>
          </div>
        )}
      </div>
      <div>
        <DataTable
          columns={traineesColumns}
          data={trainees}
          loading={false}
          noDataMessage={"You do not have any trainings yet"}
        />
      </div>
    </div>
  );
};

export default Trainees;
