"use client";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { useSelector, useDispatch } from "react-redux";
import { useDisclosure } from "@mantine/hooks";
import { Button, Menu } from "@mantine/core";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { SolarAddFolderBold } from "@/components/core/icons";
import AddEditSurveyTrainee from "@/components/Modals/trainee/AddEditSurveyTrainee";
import ImportTraineesModal from "@/components/Modals/trainee/ImportTraineesModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import { getSurveyTrainee } from "@/services";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";

interface SurveyTraineeTableProps {
  applicantId: string;
}

const SurveyTraineeTable = ({ applicantId }: SurveyTraineeTableProps) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
  
  const [
    isOpenCreateEdit,
    { open: openCreateEditModal, close: closeCreateEditModal },
  ] = useDisclosure(false);
  
  const [
    isOpenImport,
    { open: openImportModal, close: closeImportModal },
  ] = useDisclosure(false);
  
  const [
    isOpenDelete,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const surveyTrainee = useSelector((state: any) => state.surveyTrainee);

  // Fetch trainees for this specific applicant when component mounts
  useEffect(() => {
    if (applicantId) {
      getSurveyTrainee(dispatch, applicantId);
    }
  }, [applicantId, dispatch]);

  // Filter trainees for this specific applicant
  const filteredTrainees = surveyTrainee.surveyTrainees?.filter((trainee: any) => {
    // If trainee has applicantId, filter by it, otherwise show all (for admin view)
    if (applicantId && trainee.applicantId) {
      return trainee.applicantId === applicantId;
    }
    return true;
  }) || [];

  const searchFilteredTrainees = filteredTrainees.filter((trainee: any) => {
    const fullname = `${trainee.firstname} ${trainee.lastname}`.toLowerCase();
    return (
      fullname.includes(searchQuery.toLowerCase()) ||
      (trainee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.nationalId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.sector?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.window?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.subWindow?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  });

  const handleEdit = (trainee: any) => {
    setSelectedTrainee(trainee);
    openCreateEditModal();
  };

  const handleDelete = (trainee: any) => {
    setSelectedTrainee(trainee);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrainee) return;
    
    try {
      await authorizedApi.delete(`/survey-trainee/${selectedTrainee.uuid}`);
      notifications.show({
        message: "Survey trainee deleted successfully",
        color: "green",
      });
      getSurveyTrainee(dispatch, applicantId); // Re-fetch with applicantId
      closeDeleteModal();
    } catch (error: any) {
      notifications.show({
        message: error.response?.data?.message || "Failed to delete trainee",
        color: "red",
      });
    }
  };

  const handleAddNew = () => {
    setSelectedTrainee(null);
    openCreateEditModal();
  };

  const handleImport = () => {
    openImportModal();
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "fullname",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="truncate">
          {`${row.original.firstname} ${row.original.lastname}`}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="truncate">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="truncate">{row.original.phoneNumber}</div>
      ),
    },
    {
      accessorKey: "nationalId",
      header: "National ID",
      cell: ({ row }) => (
        <div className="truncate">{row.original.nationalId}</div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <div className="truncate capitalize">{row.original.gender?.toLowerCase()}</div>
      ),
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div className="truncate">{row.original.window?.title}</div>
      ),
    },
    {
      accessorKey: "subWindow",
      header: "Sub Window",
      cell: ({ row }) => (
        <div className="truncate">{row.original.subWindow?.title}</div>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => (
        <div className="truncate">{row.original.sector?.name}</div>
      ),
    },
    {
      accessorKey: "trade",
      header: "Trade",
      cell: ({ row }) => (
        <div className="truncate">{row.original.trade?.title}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="subtle" size="sm">
              <HiDotsHorizontal size={16} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => handleEdit(row.original)}>
              <div className="flex items-center gap-2">
                <CiEdit size={16} />
                Edit
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => handleDelete(row.original)}>
              <div className="flex items-center gap-2 text-red-600">
                <RiDeleteBinLine size={16} />
                Delete
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div></div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
          >
            <span className="text-2xl">
              <SolarAddFolderBold />
            </span>
            <h1 className="text-base font-medium text-white">Add Trainee</h1>
          </button>
          <button
            onClick={handleImport}
            className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
          >
            <span className="text-2xl">
              <SolarAddFolderBold />
            </span>
            <h1 className="text-base font-medium text-white">Import Trainees</h1>
          </button>
        </div>
      </div>
      
      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={searchFilteredTrainees}
        />
      </div>

      {/* Add/Edit Modal */}
      <AddEditSurveyTrainee
        isOpenAddEditSurveyTrainee={isOpenCreateEdit}
        closeAddEditSurveyTrainee={closeCreateEditModal}
        defaultData={selectedTrainee}
        applicantId={applicantId}
      />

      {/* Import Modal */}
      <ImportTraineesModal
        isOpen={isOpenImport}
        onClose={closeImportModal}
        applicantId={applicantId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpenModal={isOpenDelete}
        closeModal={closeDeleteModal}
        id={selectedTrainee?.uuid || ""}
        type="surveyTrainee"
      />
    </div>
  );
};

export default SurveyTraineeTable;
