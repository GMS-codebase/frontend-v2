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
import { IPaginatedQuery } from "@/types/base.type";
import { getApplicationsForContractSigning } from "@/services";
import { UnknownAction } from "redux";
import { useDispatch } from "react-redux";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useRouter();

  const dispatch = useDispatch();

  const {
    applicationsForContractSigning: applications,
    applicationsReadyForContractSigningLoading: paginationLoading,
    total: totalApplications,
    page: currentPageFromRedux,
  } = useSelector((state: any) => state.applications);

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
      totalPages: Math.ceil((totalApplications ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalApplications]);

  // Fetch data whenever page or limit changes
  useEffect(() => {
    dispatch(
      getApplicationsForContractSigning(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit]);

  const setPaginateOpts: React.Dispatch<
    React.SetStateAction<IPaginatedQuery & { totalPages: number }>
  > = (value) => {
    if (typeof value === "function") {
      setLocalPaginateOpts((prev) => {
        const next = value(prev);
        dispatch(
          getApplicationsForContractSigning(
            (next.page ?? 0) + 1,
            next.limit
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getApplicationsForContractSigning(
          (value.page ?? 0) + 1,
          value.limit
        ) as unknown as UnknownAction
      );
    }
  };

  const { contracts, loading: loadingContracts } = useSelector(
    (state: any) => state.contracts
  );

  const [contractsSignedApplications, setContractsSignedApplications] =
    useState<any[]>([]);

  const [applicationsForContractSigning, setApplicationsForContractSigning] =
    useState<any[]>([]);

 useEffect(() => {
   const safeApps = Array.isArray(applications) ? applications : [];

   setContractsSignedApplications(
     safeApps.filter((a) => a?.application?.uploadedContract)
   );

   setApplicationsForContractSigning(
     safeApps.filter(
       (a) =>
         !a?.application?.uploadedContract &&
         a?.application?.uploadedSignedMinutes
     )
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
              (c: any) => c?.application_ID === row.original?.application?.uuid
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
              onClick={() =>
                navigate.push(
                  `/sdf/contracts/${row?.original?.application?.uuid}`
                )
              }
            >
              <div className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
                <CiEdit size={21} color="#576074" />
                View Contract Info
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col mb-20 pb-10">
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center p-4 gap-4">
        <div className="relative w-full md:w-[20rem]">
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
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
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
      <Tabs defaultValue="applications" className="mt-6">
        {/* Wrapper for Heading and Tabs */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Heading */}
          <h1 className="text-xl font-bold p-4">
            Applications Ready For Contract Signing
          </h1>

          {/* Tabs List */}
          <Tabs.List className="flex gap-4 justify-center lg:justify-end">
            <Tabs.Tab value="applications">
              Applications Ready For Contract Signing
            </Tabs.Tab>
            <Tabs.Tab value="contracts">Contracts Signed</Tabs.Tab>
          </Tabs.List>
        </div>

        {/* Panels */}
        <Tabs.Panel value="applications" className="flex flex-col mt-4">
          <DataTable
            columns={contractColumns}
            data={applicationsForContractSigning ?? []}
            loading={paginationLoading}
            noDataMessage={"No Approved Applications yet"}
            totalApplications={totalApplications}
            paginationProps={{
              isPaginated: true,
              paginateOpts,
              setPaginateOpts,
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="contracts" className="flex flex-col mt-4">
          <h1 className="text-xl font-bold p-4">Contracts Signed</h1>
          <DataTable
            columns={contractColumns}
            data={contractsSignedApplications}
            loading={loadingContracts}
            noDataMessage="No Created Contracts"
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Page;
