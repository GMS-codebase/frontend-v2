"use client";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { useSelector, useDispatch } from "react-redux";
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "@mantine/core";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiShow } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import AddEditSurveyTrainee from "@/components/Modals/trainee/AddEditSurveyTrainee";
import ImportTraineesModal from "@/components/Modals/trainee/ImportTraineesModal";
import ViewTraineeModal from "@/components/Modals/trainee/ViewTraineeModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import { getSurveyTrainee } from "@/services";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";

const ApplicantTable = ({ data, applicantId }: { data: any; applicantId: string }) => {
  const dispatch = useDispatch();
  const [activeTable, setActiveTable] = useState("contacts");
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

  const [
    isOpenView,
    { open: openViewModal, close: closeViewModal },
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
      (trainee.subWindow?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.province?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.district?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.residenceSector?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.cell?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (trainee.village?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
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

  const handleView = (trainee: any) => {
    setSelectedTrainee(trainee);
    openViewModal();
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

  const [isOpenCall, setIsOpenCall] = useState({
    openUpdate: false,
    openDelete: false,
    call: null,
  });

  const contactColumns: ColumnDef<any>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ row }) => <div>{row.original?.firstName}</div>,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ row }) => <div>{row.original?.lastName}</div>,
    },
    {
      accessorKey: "mobile1",
      header: "Mobile 1",
      cell: ({ row }) => <div>{row.original?.mobile}</div>,
    },
    {
      accessorKey: "mobile2",
      header: "Mobile 2",
      cell: ({ row }) => <div>{row.original?.mobile1}</div>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div>{row.original?.gender}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original?.email}</div>,
    },
  ];

  const applicationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => <div>{row.original?.applicationNumber}</div>,
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => <div>{row.original?.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original?.email}</div>,
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => <div>{row.original?.currentStage}</div>,
    },
  ];

  const traineeColumns: ColumnDef<any>[] = [
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
      accessorKey: "province",
      header: "Province",
      cell: ({ row }) => (
        <div className="truncate">{row.original.province || "-"}</div>
      ),
    },
    {
      accessorKey: "district",
      header: "District",
      cell: ({ row }) => (
        <div className="truncate">{row.original.district || "-"}</div>
      ),
    },
    {
      accessorKey: "residenceSector",
      header: "Residence Sector",
      cell: ({ row }) => (
        <div className="truncate">{row.original.residenceSector || "-"}</div>
      ),
    },
    {
      accessorKey: "cell",
      header: "Cell",
      cell: ({ row }) => (
        <div className="truncate">{row.original.cell || "-"}</div>
      ),
    },
    {
      accessorKey: "village",
      header: "Village",
      cell: ({ row }) => (
        <div className="truncate">{row.original.village || "-"}</div>
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
        <div className="truncate">{row.original.sector?.name || row.original.sector || "-"}</div>
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
            <button className="bg-primary text-white p-2 rounded-full">
              <HiDotsHorizontal size={16} color="white" />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => handleView(row.original)}>
              <div className="flex items-center gap-2">
                <BiShow size={16} />
                View
              </div>
            </Menu.Item>
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

  const handleTableChange = (table: any) => {
    setActiveTable(table);
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[25rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} />
          </span>
          <input
            name="search"
            value={activeTable === "trainees" ? searchQuery : ""}
            onChange={(e) => activeTable === "trainees" ? setSearchQuery(e.target.value) : undefined}
            className="w-full p-3 py-4 pl-12 text-base text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder={activeTable === "trainees" ? "Search trainees..." : "Search"}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleTableChange("contacts")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "contacts"
                ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50"
                : "bg-[#005DE9] bg-opacity-50"
            }`}
          >
            <h1 className="text-base font-medium text-white">Contacts</h1>
          </button>
          <button
            onClick={() => handleTableChange("trainees")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "trainees"
                ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50"
                : "bg-[#005DE9] bg-opacity-50"
            }`}
          >
            <h1 className="text-base font-medium text-white">Survey Trainees</h1>
          </button>
          {/* <button
            onClick={() => handleTableChange("applications")}
            className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
              activeTable === "applications"
                ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50"
                : "bg-[#005DE9] bg-opacity-50"
            }`}
          >
            <h1 className="text-base font-medium text-white">Applications</h1>
          </button> */}
        </div>
      </div>
      
      {/* Action buttons for trainees tab */}
      {activeTable === "trainees" && (
        <div className="w-full flex justify-end items-center p-4">
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
      )}

      <div className="w-full h-full">
        {activeTable === "contacts" && (
          <DataTable
            columns={contactColumns}
            data={data?.applicantContacts ?? []}
          />
        )}
        {activeTable === "trainees" && (
          <DataTable
            columns={traineeColumns}
            data={searchFilteredTrainees}
          />
        )}
        {/* {activeTable === "applications" && (
          <DataTable
            columns={applicationColumns}
            data={data?.applications ?? []}
          />
        )} */}
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

      {/* View Trainee Modal */}
      <ViewTraineeModal
        isOpen={isOpenView}
        onClose={closeViewModal}
        trainee={selectedTrainee}
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

export default ApplicantTable;
