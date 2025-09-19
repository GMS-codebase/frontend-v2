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
import { VscEye } from "react-icons/vsc";
import DeleteModal from "@/components/Modals/DeleteModal";
import Link from "next/link";
import { Training } from "@/types";
import AddEditTraining from "@/components/Modals/training/AddEditTraining";
import {
  getMyApplications,
  getTrainings,
  requestTrainingReview,
} from "@/services";
import { IPaginatedQuery } from "@/types/base.type";
import { UnknownAction } from "redux";
import { useDebounce } from "use-debounce";

const Page = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

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

  const applications = useSelector((state: any) => state.applications);

  const {
    trainings,
    loading,
    total: totalTrainings,
    page: currentPageFromRedux,
  } = useSelector((state: any) => state.trainings);

  // Local state for pagination
  const [paginateOpts, setLocalPaginateOpts] = useState<
    IPaginatedQuery & { totalPages: number }
  >({
    page: (currentPageFromRedux ?? 1) - 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    setLocalPaginateOpts((prev) => ({
      ...prev,
      totalPages: Math.ceil((totalTrainings ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalTrainings]);

  // Fetch data whenever page or limit changes
  useEffect(() => {
    dispatch(
      getTrainings(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit,
        debouncedSearch
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit, debouncedSearch]);

  const setPaginateOpts: React.Dispatch<
    React.SetStateAction<IPaginatedQuery & { totalPages: number }>
  > = (value) => {
    if (typeof value === "function") {
      setLocalPaginateOpts((prev) => {
        const next = value(prev);
        dispatch(
          getTrainings(
            (next.page ?? 0) + 1,
            next.limit
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getTrainings(
          (value.page ?? 0) + 1,
          value.limit
        ) as unknown as UnknownAction
      );
    }
  };

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
                  Edit
                </div>
              </Menu.Item>
              {row.original.status === "DRAFT" && (
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
              )}
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  const applicationId = applications?.myApplications?.find(
    (app: any) => app.currentStage === "CONTRACT_SIGNING"
  )?.uuid;

  const filteredTrainings = debouncedSearch
    ? trainings.filter((training: Training) =>
        training.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : trainings;

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
          data={filteredTrainings ?? []}
          loading={loading}
          noDataMessage={
            searchQuery
              ? `No trainings matching "${searchQuery}"`
              : "You do not have any trainings yet"
          }
          totalApplications={totalTrainings}
          paginationProps={{
            isPaginated: true,
            paginateOpts,
            setPaginateOpts,
          }}
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
