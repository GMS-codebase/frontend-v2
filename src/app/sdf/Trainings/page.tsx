"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu,Select } from "@mantine/core";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";
import DeleteModal from "@/components/Modals/DeleteModal";
import { trainingsData } from "@/utils/constants/trainings";
import { Training } from "@/types";

const Page = () => {
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
    const trainings = useSelector((state: any) => state.trainings);

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

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="w-full">{row.original?.title}</div>
            ),
        },
        {
            accessorKey: "applicant",
            header: "Applicant",
            cell: ({ row }) => (
                <div className="w-full">{row.original?.Applicant}</div>
            ),
        },
        {
            accessorKey: "call",
            header: "Call",
            cell: ({ row }) => (
                <div className="w-full">{row.original?.Call}</div>
            ),
        },
        {
            accessorKey: "request",
            header: "Request",
            cell: ({ row }) => {
                const { status, uuid, response } = row.original;

                if (status === "ACCEPTED") {
                    return (
                        <button
                            className="px-3 py-1 bg-primary text-white rounded-full text-sm"
                            onClick={() => {
                                window.location.href = `/applicant/trainings/${uuid}`;
                            }}
                        >
                            Respond
                        </button>
                    );
                }

                if (status === "UNDER REVIEW") {
                    return (
                        <button
                            className="px-3 py-1 bg-primary text-white rounded-full text-sm"
                            onClick={() => {
                                console.log("Request action for", uuid);
                            }}
                        >
                            Respond
                        </button>
                    );
                }

                return <div className="text-gray-400">-</div>;
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
                                    Open
                                </Link>
                            </Menu.Item>
                            
                        </Menu.Dropdown>
                    </Menu>
                </div>
            ),
        },
    ];

    

    const filteredTrainings =
        trainings?.mytrainings?.filter((training: Training) =>
            training?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        ) ?? [];

    return (
        <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
            <div className="w-full flex flex-col md:flex-row md:justify-between items-center p-4 gap-4">
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

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <FilterDropDown
                        placeholderText="Filter By status"
                        data={["ACCEPTED", "REJECTED", "UNDER REVIEW"]}
                    />

                    <FilterDropDown
                        placeholderText="Filter By requests"
                        data={["Respond"]}
                    />
                    <FilterDropDown
                        placeholderText="Filter By Call"
                        data={["call 1,call 2"]}
                    />

                    <FilterDropDown
                        placeholderText="Filter By Sector"
                        data={["Manufacturing", "Constrution"]}
                    />
                </div>
            </div>

            <div className="w-full h-full">
                <DataTable
                    columns={columns}
                    data={trainingsData}
                    loading={trainings?.loading}
                    noDataMessage={
                        searchQuery
                            ? `No trainings matching "${searchQuery}"`
                            : "You do not have any trainings yet"
                    }
                />
            </div>

            {/* <AddEditTraining
        isOpen={isOpenAddEditTraining}
        close={() => {
          closeAddEditTraining();
          setSelectedTraining(null);
        }}
        defaultData={selectedTraining}
      /> */}

            {/* <DeleteModal
        closeModal={() => {
          setSelectedTraining(null);
          closeDeleteTraining();
        }}
        id={selectedTraining?.uuid as any}
        type="trainings"
        isOpenModal={isOpenDeleteTraining}
      /> */}
        </div>
    );
};

export default Page;
