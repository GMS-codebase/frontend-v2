"use client";

import { DataTable } from "@/components/core/data-table";
import DeleteTraineeModal from "@/components/Modals/DeleteTranee";
import AddEditTrainingTrainee from "@/components/Modals/trainee/AddEditTrainingTrainee";
import Button from "@/components/ui/Button";
import { ITraining, ITrainingTrainee } from "@/types/trainings";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { VscEdit, VscEye, VscTrash } from "react-icons/vsc";
import { Pen2 } from "solar-icon-set";

type props = {
  training: ITraining;
  handleAddTraineeRequest?: () => void;
  handleEditTraineeRequest?: () => void;
  handleRemoveTraineeRequest?: () => void;
  currentRole: string | null;
  setSelectedTraineeIds: (ids: string[]) => void;
};

const Trainees = ({
  training,
  handleAddTraineeRequest,
  handleEditTraineeRequest,
  handleRemoveTraineeRequest,
  currentRole,
  setSelectedTraineeIds,
}: props) => {
  const trainees: ITrainingTrainee[] = training?.trainees;

  const traineesToAdd = training?.traineesToAdd ?? 0;
  const canAddTrainees = traineesToAdd > 0;

  const [selectedTrainee, setSelectedTrainee] =
    useState<ITrainingTrainee | null>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpenAddEditTrainee, setIsOpenAddEditTrainee] = useState(false);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const newIds = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      setSelectedTraineeIds(newIds);
      return newIds;
    });
  };

  const [
    isOpenDeleteTrainee,
    { open: openDeleteTrainee, close: closeDeleteTrainee },
  ] = useDisclosure(false);

  const traineesColumns: ColumnDef<ITrainingTrainee>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <input
            className="w-4 h-5"
            type="checkbox"
            checked={
              table.getRowModel().rows.length > 0 &&
              table
                .getRowModel()
                .rows.every((row) => selectedIds.includes(row.original.uuid))
            }
            onChange={(e) => {
              if (e.target.checked) {
                const newIds = table
                  .getRowModel()
                  .rows.map((r) => r.original.uuid);
                setSelectedIds(newIds);
                setSelectedTraineeIds(newIds);
              } else {
                setSelectedIds([]);
                setSelectedTraineeIds([]);
              }
            }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <input
            className="w-4 h-4"
            type="checkbox"
            checked={selectedIds.includes(row.original.uuid)}
            onChange={() => handleToggle(row.original.uuid)}
          />
        </div>
      ),
    },
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
                <span className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]">
                  <VscEye size={21} color="#576074" />
                  View
                </span>
              </Menu.Item>
              {currentRole === "APPLICANT" && (
                <>
                  {row.original.canBeEdited ? (
                    <Menu.Item
                      className="bg-[#F0F0F0]"
                      onClick={() => {
                        setSelectedTrainee(row.original);
                        setIsOpenAddEditTrainee(true);
                      }}
                    >
                      <span className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]">
                        <VscEdit size={21} color="blue" />
                        Edit Trainee
                      </span>
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      className="bg-[#F0F0F0]"
                      onClick={() => {
                        const newIds = [row.original.uuid];
                        setSelectedIds(newIds);
                        setSelectedTraineeIds(newIds);
                        handleEditTraineeRequest?.();
                      }}
                      disabled={row.original.editRequested}
                    >
                      <span className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]">
                        <VscEdit size={21} color="blue" />
                        {row.original.editRequested
                          ? "Pending edit Request"
                          : "Request Edit"}
                      </span>
                    </Menu.Item>
                  )}
                  {row.original.canBeRemoved ? (
                    <Menu.Item
                      className="bg-[#F0F0F0] text-[#576074]"
                      onClick={() => {
                        setSelectedTrainee(row.original);
                        openDeleteTrainee();
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <VscTrash size={21} color="red" />
                        Delete
                      </span>
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      className="bg-[#F0F0F0]"
                      onClick={() => {
                        const newIds = [row.original.uuid];
                        setSelectedIds(newIds);
                        setSelectedTraineeIds(newIds);
                        handleRemoveTraineeRequest?.();
                      }}
                      disabled={row.original.removalRequested}
                    >
                      <span className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]">
                        <VscTrash size={21} color="red" />
                        {row.original.removalRequested
                          ? "Pending Delete Request"
                          : "Request Delete"}
                      </span>
                    </Menu.Item>
                  )}
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
        {currentRole === "APPLICANT" && training.status === "ACCEPTED" && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 w-full lg:w-auto">
            {selectedIds.length > 0 && (
              <Button
                onClick={() => {
                  setSelectedTraineeIds(selectedIds);
                  handleRemoveTraineeRequest?.();
                }}
                className="!rounded-full bg-red-500 text-white gap-2 !py-3"
              >
                <VscTrash />
                Request Remove Trainee/s
              </Button>
            )}
            {selectedIds.length > 0 && (
              <Button
                onClick={() => {
                  setSelectedTraineeIds(selectedIds);
                  handleEditTraineeRequest?.();
                }}
                className="!rounded-full bg-primary text-white gap-2 !py-3"
              >
                <Pen2 />
                Request Edit Trainee/s
              </Button>
            )}
            {canAddTrainees ? (
              <Button
                onClick={() => {
                  setSelectedTrainee(undefined);
                  setIsOpenAddEditTrainee(true);
                }}
                className="!rounded-full bg-primary text-white gap-2 !py-3"
              >
                <Pen2 />
                Add Trainee/s
              </Button>
            ) : (
              <Button
                onClick={() => handleAddTraineeRequest?.()}
                className="!rounded-full bg-primary text-white gap-2 !py-3"
              >
                <Pen2 />
                Request Add Trainee/s
              </Button>
            )}
          </div>
        )}
      </div>
      <div>
        <DataTable
          columns={traineesColumns}
          data={trainees ?? []}
          loading={false}
          noDataMessage={"You do not have any trainees yet"}
        />
      </div>

      <AddEditTrainingTrainee
        isOpenAddEditTrainee={isOpenAddEditTrainee}
        closeAddEditTrainee={() => setIsOpenAddEditTrainee(false)}
        trainingId={training?.uuid}
        defaultData={selectedTrainee!}
      />

      <DeleteTraineeModal
        closeModal={() => {
          closeDeleteTrainee();
          setSelectedTrainee(null);
        }}
        trainingId={training.uuid}
        id={selectedTrainee?.uuid as any}
        isOpenModal={isOpenDeleteTrainee}
      />
    </div>
  );
};

export default Trainees;
