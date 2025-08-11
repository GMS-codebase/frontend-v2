"use client";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import AddSurveyTrainee from "@/components/Modals/trainee/AddEditSurveyTrainee";
import { useSelector } from "react-redux";
import { Menu, Button } from "@mantine/core";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";

import DeleteModal from "@/components/Modals/DeleteModal";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [
    isOpenCreateEdit,
    { open: openCreateEditModal, close: closeCreateEditModal },
  ] = useDisclosure(false);
  const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const surveyTrainee = useSelector((state: any) => state.surveyTrainee);
  const [selectedSurveyTrainee, setSelectedSurveyTrainee] = useState<any>(null);

  const filteredSurveyTrainee =
    surveyTrainee.surveyTrainees?.filter((item: any) => {
      const fullname = `${item.firstname} ${item.lastname}`.toLowerCase();
      return (
        fullname.includes(searchQuery.toLowerCase()) ||
        (item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (item.nationalId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (item.sector?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (item.window?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (item.subWindow?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    }) ?? [];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "fullname",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={`${row.original.firstname} ${row.original.lastname}`}>
          {`${row.original.firstname} ${row.original.lastname}`}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px]" title={row.original.email || "-"}>
          {row.original.email || "-"}
        </div>
      ),
    },
    {
      accessorKey: "nationalId",
      header: "National ID",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.nationalId || "-"}>
          {row.original.nationalId || "-"}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.phoneNumber || "-"}>
          {row.original.phoneNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <div className="truncate max-w-[80px]" title={row.original.gender || "-"}>
          {row.original.gender || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: ({ row }) => (
        <div className="truncate max-w-[120px]" title={row.original.dob ? new Date(row.original.dob).toLocaleDateString() : "-"}>
          {row.original.dob ? new Date(row.original.dob).toLocaleDateString() : "-"}
        </div>
      ),
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[180px]" title={row.original.applicant?.name || "-"}>
          {row.original.applicant?.name || "-"}
        </div>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]" title={row.original.sector?.name || "-"}>
          {row.original.sector?.name || "-"}
        </div>
      ),
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div className="truncate max-w-[180px]" title={row.original.window?.title || "-"}>
          {row.original.window?.title || "-"}
        </div>
      ),
    },
    {
      accessorKey: "subWindow",
      header: "Sub Window",
      cell: ({ row }) => (
        <div className="truncate max-w-[180px]" title={row.original.subWindow?.title || "-"}>
          {row.original.subWindow?.title || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="truncate max-w-[100px]" title={row.original.deletedStatus ? "Deleted" : "Active"}>
          {row.original.deletedStatus ? "Deleted" : "Active"}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
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
            <Menu.Item>
              <div
                onClick={() => {
                  setSelectedSurveyTrainee(row.original);
                  openCreateEditModal();
                }}
                className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
              >
                <CiEdit size={21} color="#576074" />
                Edit
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                onClick={() => {
                  setSelectedSurveyTrainee(row.original);
                  openDeleteModal();
                }}
              >
                <RiDeleteBinLine size={21} color="#576074" />
                Remove
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];


  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-4 items-end md:items-center p-4">
        <div className="relative lg:w-[25rem] w-full mb-4">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>

        <button
          onClick={openCreateEditModal}
          className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">New Survey Trainee</h1>
        </button>
      </div>
      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredSurveyTrainee}
          loading={surveyTrainee.loading}
          noDataMessage={
            searchQuery
              ? `No Survey Trainee found related to ${searchQuery}`
              : "No Survey Trainee Added So Far"
          }
        />
      </div>
      <AddSurveyTrainee
        isOpenAddEditSurveyTrainee={isOpenCreateEdit}
        closeAddEditSurveyTrainee={() => {
          closeCreateEditModal();
          setSelectedSurveyTrainee(null);
        }}
        defaultData={selectedSurveyTrainee}
      />
      <DeleteModal
        isOpenModal={isOpenDelete}
        closeModal={() => {
          closeDeleteModal();
          setSelectedSurveyTrainee(null);
        }}
        type="surveyTrainee"
        id={selectedSurveyTrainee?.uuid}
      />
    </div>
  );
};

export default Page;
