"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import AddContract from "@/components/Modals/AddContract";
import { useSelector } from "react-redux";
import ContractsActions from "./ContractsActions";
import { unauthorizedApi } from "@/utils/api";
import { Menu, Select, Tabs } from "@mantine/core";
import { CiEdit, CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isOpenTrade, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useRouter();
  const { contracts, loading: loadingContracts } = useSelector(
    (state: any) => state.contracts,
  );
  const { applicationsForContractSigning: applications, loading } = useSelector(
    (state: any) => state.applications,
  );

  console.log("applications for contract signing", applications);

  const [contractsSignedApplications, setContractsSignedApplications] =
    useState<any[]>([]);
  const [applicationsForContractSigning, setApplicationsForContractSigning] =
    useState<any[]>([]);

  useEffect(() => {
    setContractsSignedApplications(
      applications.filter((a: any) => a?.application?.uploadedContract),
    );
    setApplicationsForContractSigning(
      applications.filter(
        (a: any) =>
          !a?.application?.uploadedContract &&
          a?.application?.uploadedSignedMinutes,
      ),
    );
  }, [applications]);
  const FilterDropDown = ({
    placeholderText,
    data,
  }: {
    placeholderText: string;
    data: any[];
  }) => (
    <Select
      data={data}
      placeholder={placeholderText}
      defaultValue={placeholderText}
      className="w-full px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
    />
  );

  const [loadingDownload, setLoadingDownload] = useState(false);
  const [contractState, setContractState] = useState<{
    isOpen: boolean;
    application: any | null;
  }>({
    isOpen: false,
    application: null,
  });

  const handleDownloadInstructions = async (file: any) => {
    setLoadingDownload(true);
    try {
      const filename = file.split("\\").pop();
      const response = await unauthorizedApi.get(
        `/admin/download/contracts/${filename}`,
        { responseType: "blob" },
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
        <div className="w-full">
          {row.original?.application?.applicant?.name}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.applicant?.phone}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.applicant?.email}
        </div>
      ),
    },
    {
      accessorKey: "contractName",
      header: "Contract Number",
      cell: ({ row }) => (
        <div className="w-full">
          {
            contracts.filter(
              (c: any) => c?.application_ID === row.original?.application?.uuid,
            )[0]?.contractNumber
          }
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
            <Menu.Item
              onClick={() => navigate.push(`/sdf/contracts/${row?.original?.application?.uuid}`)}
            >
              <div className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
                <CiEdit size={21} color="#576074" />
                View Contract
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const applicationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.applicationNumber}
        </div>
      ),
    },
    {
      accessorKey: "applicationTitle",
      header: "Application Title",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.projectFunding?.title}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.applicant?.name}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.applicant?.phone}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ContractsActions
          data={row.original}
          setIsContract={setContractState}
          isNew={true}
        />
      ),
    },
  ];
  return (
    <div className="w-full flex flex-col mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[20rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} />
          </span>
          <input
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
        <div className="flex items-center gap-3 right-2">
          <FilterDropDown placeholderText="Filter By Call" data={["call 1"]} />
          <FilterDropDown
            placeholderText="Filter By Sector"
            data={["ICT and innovations"]}
          />
          <FilterDropDown
            placeholderText="Filter By Trade"
            data={["Manufacturing"]}
          />
        </div>
      </div>
      <Tabs defaultValue="applications">
        <Tabs.List className="w-auto float-end my-6 mr-5">
          <Tabs.Tab value="applications" className=" p4-4">
            Applications Ready For Contract Signing
          </Tabs.Tab>
          <Tabs.Tab value="contracts" className="px-4">
            Contracts Signed
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="applications" className="bg-white rounded-2xl mt-4">
          <h1 className="text-xl font-bold p-4">
            Applications Ready For Contract Signing
          </h1>
          <DataTable
            columns={applicationColumns}
            data={applicationsForContractSigning}
            loading={loading}
            noDataMessage="No Approved Applications"
          />
        </Tabs.Panel>
        <Tabs.Panel value="contracts" className="bg-white rounded-2xl mt-4">
          <h1 className="text-xl font-bold  p-4">Contracts Signed</h1>
          <DataTable
            columns={contractColumns}
            data={contractsSignedApplications}
            loading={loadingContracts}
            noDataMessage="No Created Contracts"
          />
        </Tabs.Panel>
      </Tabs>
      <AddContract
        data={contractState.application}
        trades={contractState.application?.trades || []}
        isOpenAddContract={contractState.isOpen}
        closeAddContract={() =>
          setContractState({ isOpen: false, application: null })
        }
      />
    </div>
  );
};

export default Page;
