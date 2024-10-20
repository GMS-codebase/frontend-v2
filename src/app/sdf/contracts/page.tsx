"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { tradesData as data } from "@/utils/constants/dummy";
import { useDisclosure } from "@mantine/hooks";
import AddContract from "@/components/Modals/AddContract";
import Contracts from "@/components/contracts/contracts";
import { useSelector } from "react-redux";
import ContractsActions from "./ContractsActions";
import { useState } from "react";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import { unauthorizedApi } from "@/utils/api";
import { Menu } from "@mantine/core";
import { CiEdit } from "react-icons/ci";

const Page = () => {
  const [isOpenTrade, { open, close }] = useDisclosure(false);
  const [isContract, setIsContract] = useState<{
    isOpen: boolean;
    application: any;
  }>({
    isOpen: false,
    application: null,
  });

  const { contracts, loading: loadingContracts } = useSelector(
    (state: any) => state.contracts,
  );
  const { minutes, loading: loadingMinutes } = useSelector(
    (state: any) => state.minutes,
  );
  const { applicationsForContractSigning: applications, loading } = useSelector(
    (state: any) => state.applications,
  );


  // const filteredApplications = applications.filter(
  //   (app: any) =>
  //     app.stages.some(
  //       (stage: any) =>
  //         stage.name === "CONTRACT_SIGNING" && stage.status === "PENDING"
  //     ) &&
  //     minutes.find(
  //       (min: any) =>
  //         min.application.uuid === app.uuid &&
  //         min.approval_status.toUpperCase() === "APPROVED"
  //     ) !== null
  // );
  const [loadingDownload, setLoadingDownload] = useState(false);
  const handleDownloadInstructions = async (file: any) => {
    setLoadingDownload(true);
    try {

      const filename = file.split("\\").pop();

      const response = await unauthorizedApi.get(
        `/admin/download/contracts/${filename}`,
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file || "downloaded-file.jpg";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoadingDownload(false);
    }
  };
  const contractColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.name}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.phone}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.email}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contract Name",
      cell: ({ row }) => <div className="w-full">{row.original?.name}</div>,
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
                onClick={() =>
                  handleDownloadInstructions(row.original.contract)
                }
                className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
              >
                <CiEdit size={21} color="#576074" />
                Download Contract
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicationNumber}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.name}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.phone}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.description?.length > 50
            ? row.original?.description?.slice(0, 50) + "..."
            : row.original?.description}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ContractsActions
          data={row.original}
          setIsContract={setIsContract}
          isNew={true}
        />
      ),
    },
  ];
  return (
    <div className="w-full flex flex-col  mb-20 pb-10">
      <div className="w-full h-full mb-10 bg-white rounded-2xl ">
        <h1 className="text-xl p-4 font-bold">Contracts Signed</h1>
        <DataTable
          columns={contractColumns}
          data={contracts}
          loading={loading}
          noDataMessage="No Created Contracts"
        />
      </div>

      <div className="w-full h-full bg-white rounded-2xl ">
        <h1 className="text-xl p-4 font-bold">
          Applications Ready For Contract Signing
        </h1>
        <DataTable
          columns={columns}
          data={applications}
          loading={loading}
          noDataMessage="No Approved Applications"
        />
      </div>
      <AddContract
        data={isContract.application}
        trades={isContract.application?.trades || []}
        isOpenAddContract={isContract.isOpen}
        closeAddContract={() =>
          setIsContract({ isOpen: false, application: null })
        }
      />
    </div>
  );
};
export default Page;
