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
import { useState, useRef } from "react";
import { unauthorizedApi } from "@/utils/api";
import { Menu, Select } from "@mantine/core";
import { CiEdit, CiSearch } from "react-icons/ci";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Page = () => {
    const [isOpenTrade, { open, close }] = useDisclosure(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeTab, setActiveTab] = useState("applications");
    const [isContract, setIsContract] = useState<{
        isOpen: boolean;
        application: any;
    }>({
        isOpen: false,
        application: null,
    });

    const { contracts, loading: loadingContracts } = useSelector(
        (state: any) => state.contracts
    );
    const { applicationsForContractSigning: applications, loading } =
        useSelector((state: any) => state.applications);

    const FilterDropDown = ({
        placeholderText,
        data,
    }: {
        placeholderText: string;
        data: any[];
    }) => {
        return (
            <Select
                data={data}
                placeholder={placeholderText}
                defaultValue={placeholderText}
                className="w-full px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
            />
        );
    };

    const [loadingDownload, setLoadingDownload] = useState(false);
    const handleDownloadInstructions = async (file: any) => {
        setLoadingDownload(true);
        try {
            const filename = file.split("\\").pop();
            const response = await unauthorizedApi.get(
                `/admin/download/contracts/${filename}`,
                { responseType: "blob" }
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
            accessorKey: "email",
            header: "Applicant Email",
            cell: ({ row }) => (
                <div className="w-full">{row.original?.applicant?.email}</div>
            ),
        },
        {
            accessorKey: "contractName",
            header: "Contract Name",
            cell: ({ row }) => (
                <div className="w-full">{row.original?.name}</div>
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
                                handleDownloadInstructions(
                                    row.original.contract
                                )
                            }
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
                <div className="flex items-center gap-3 right-2 ">
                    <FilterDropDown
                        placeholderText="Filter By Call"
                        data={["call 1"]}
                    />
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
            <div className="flex mb-5">
                <button
                    className={`w-full text-center py-3 rounded-r-2xl ${activeTab === "applications" ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9]" : "bg-[#000F2303] text-black"}`}
                    onClick={() => setActiveTab("applications")}
                >
                    Applications Ready For Contract Signing
                </button>
                <button
                    className={`w-full text-center py-3 rounded-l-2xl ${activeTab === "contracts" ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9]" : "bg-[#000F2303] text-black"}`}
                    onClick={() => setActiveTab("contracts")}
                >
                    Contracts Signed
                </button>
            </div>
            {activeTab === "applications" ? (
                <div className="bg-white rounded-2xl">
                    <h1 className="text-xl p-4 font-bold">
                        Applications Ready For Contract Signing
                    </h1>
                    <DataTable
                        columns={applicationColumns}
                        data={applications}
                        loading={loading}
                        noDataMessage="No Approved Applications"
                    />
                </div>
            ) : (
                <div className="mb-10 bg-white rounded-2xl">
                    <h1 className="text-xl p-4 font-bold">Contracts Signed</h1>
                    <DataTable
                        columns={contractColumns}
                        data={contracts}
                        loading={loadingContracts}
                        noDataMessage="No Created Contracts"
                    />
                </div>
            )}
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
