"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import AddContract from "@/components/Modals/AddContract";
import { useSelector } from "react-redux";
import { unauthorizedApi } from "@/utils/api";
import { Menu, Select, Tabs } from "@mantine/core";
import { CiEdit, CiSearch } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { myContracts: contracts } = useSelector(
    (state: any) => state.contracts,
  );
  const { myApplications: applications, myApplicationsLoading } = useSelector(
    (state: any) => state.applications,
  );
  const [contractsSignedApplications, setContractsSignedApplications] =
    useState<any[]>([]);
  useEffect(() => {
    setContractsSignedApplications(
      applications.filter((a: any) => (a?.application?.uploadedContract || a?.uploadedContract)),
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
          {row.original?.application?.applicant?.name ?? row.original?.applicant?.name}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.applicant?.phone ?? row.original?.applicant?.phone}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.application?.applicant?.email ?? row.original?.applicant?.email}
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
              (c: any) => (c?.application_ID === row.original?.uuid)
            )?.[0]?.contractNumber
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
            >
              <Link href={`/applicant/contracts/${row?.original?.uuid}`} className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
                <CiEdit size={21} color="#576074" />
                View Contract
              </Link>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
    const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col mb-20 pb-10">
      <div className="w-full overflow-auto lg:flex justify-between items-center p-4">
        <div className="relative lg:w-[20rem] w-full mb-2">
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
   <div className="relative flex lg:w-[80%] w-full overflow-auto">
      <button
        className="lg:hidden absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 bg-white shadow-md"
        onClick={scrollLeft}
      >
        <FiChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex w-full gap-3 lg:flex-row lg:items-center overflow-auto scroll-smooth"
      >
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

      <button
        className="lg:hidden absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 bg-white shadow-md"
        onClick={scrollRight}
      >
        <FiChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
      </div>
      <Tabs defaultValue="contracts">
        <Tabs.List className="w-auto float-end my-6 mr-5">
          <Tabs.Tab value="contracts" className="px-4">
            Contracts Signed
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="contracts" className="bg-white rounded-2xl mt-4">
          <h1 className="text-xl font-bold  p-4">Contracts Signed</h1>
          <DataTable
            columns={contractColumns}
            data={contractsSignedApplications}
            loading={myApplicationsLoading}
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
