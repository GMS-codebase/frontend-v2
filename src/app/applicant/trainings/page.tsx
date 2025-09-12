"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Menu } from "@mantine/core";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";
import DeleteModal from "@/components/Modals/DeleteModal";
import { Training } from "@/types";
import AddEditTraining from "@/components/Modals/training/AddEditTraining";
import { getTrainings, requestTrainingReview } from "@/services";

const Page = () => {
  const dispatch = useDispatch();
  const [
    isOpenAddEditTraining,
    { open: openAddEditTraining, close: closeAddEditTraining },
  ] = useDisclosure(false);
  const [
    isOpenDeleteTraining,
    { open: openDeleteTraining, close: closeDeleteTraining },
  ] = useDisclosure(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { trainings, loading } = useSelector((state: any) => state.trainings);
  const applications = useSelector((state: any) => state.applications);

  useEffect(() => {
    getTrainings(dispatch);
  }, [dispatch]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="w-full">{row.original?.title}</div>,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.original?.startDate
          ? new Date(row.original.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "-";
        return <div className="w-full">{date}</div>;
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = row.original?.endDate
          ? new Date(row.original.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "-";
        return <div className="w-full">{date}</div>;
      },
    },
    {
      accessorKey: "response",
      header: "Response",
      cell: ({ row }) => {
        const { status, uuid } = row.original;

        if (status === "ACCEPTED" || status === "REJECTED") {
          return (
            <button
              className="px-3 py-1 bg-primary text-white rounded-full text-sm"
              onClick={() => {
                window.location.href = `/applicant/trainings/${uuid}`;
              }}
            >
              View response
            </button>
          );
        } else if (status === "REVIEW") {
          return (
            <button
              className="px-3 py-1 bg-primary/20 border border-primary text-primary rounded-full text-sm"
              onClick={() => {
                window.location.href = `/applicant/trainings/${uuid}`;
              }}
            >
              View Training
            </button>
          );
        } else if (status === "DRAFT") {
          return (
            <button
              className="px-3 py-1 bg-primary/20 border border-primary text-primary rounded-full text-sm"
              onClick={() => dispatch(requestTrainingReview(uuid) as any)}
            >
              Request
            </button>
          );
        } else return <div className="text-gray-400">-</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-full capitalize">
          {row.original?.status || "draft"}
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
                <Link
                  href={`/applicant/trainings/${row.original.uuid}`}
                  className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <VscEye size={21} color="#576074" />
                  View
                </Link>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedTraining(row.original);
                    openAddEditTraining();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <CiEdit size={21} color="#576074" />
                  Request Edit
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedTraining(row.original);
                    openDeleteTraining();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <RiDeleteBinLine size={21} color="#576074" />
                  Remove
                </div>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  const filteredTrainings =
    trainings?.filter((training: Training) =>
      training?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const applicationId = applications?.myApplications?.find(
    (app: any) => app.currentStage === "CONTRACT_SIGNING"
  )?.uuid;

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full lg:flex justify-between items-center p-4">
        <div className="relative lg:w-[25rem] w-full mt-4 lg:mt-0">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search trainings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={openAddEditTraining}
          className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3 mt-0 sm:mt-3"
        >
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">New Training</h1>
        </button>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredTrainings || []}
          loading={loading}
          noDataMessage={
            searchQuery
              ? `No trainings matching "${searchQuery}"`
              : "You do not have any trainings yet"
          }
        />
      </div>

      <AddEditTraining
        isOpenAddEditTraining={isOpenAddEditTraining}
        closeAddEditTraining={() => {
          closeAddEditTraining();
          setSelectedTraining(null);
        }}
        defaultData={selectedTraining as any}
        applicationId={applicationId}
      />

      <DeleteModal
        closeModal={() => {
          setSelectedTraining(null);
          closeDeleteTraining();
        }}
        id={selectedTraining?.uuid as any}
        type="trainings"
        isOpenModal={isOpenDeleteTraining}
      />
    </div>
  );
};

export default Page;
