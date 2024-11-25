"use client";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { Menu, Button, Text, rem } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import DeleteModal from "@/components/Modals/DeleteModal";
import ActivateDeactivateModal from "@/components/Modals/ActivateDeactivateModal";

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [
        isOpenCreateEdit,
        { open: openCreateEditModal, close: closeCreateEditModal },
    ] = useDisclosure(false);
    const [
        isOpenActivateDeactivateForm,
        {
            open: openActivateDeactivateFormModal,
            close: closeActivateDeactivateFormModal,
        },
    ] = useDisclosure(false);
    const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] =
        useDisclosure(false);

    const forms = useSelector((state: any) => state.forms);
    const [selectedForm, setSelectedForm] = useState<any>("");
    console.log(forms);
    const filteredForms =
        forms?.forms?.filter(
            (trade: any) =>
                trade?.title
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                trade?.shortname
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
        ) ?? [];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="w-full">{row.original?.title}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className="truncate">{row.original?.status || "-"}</div>
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="">
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
                                        setSelectedForm(row.original);
                                        openActivateDeactivateFormModal();
                                    }}
                                    className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                                >
                                    <CiEdit size={21} color="#576074" />
                                    {row.original.status === "ACTIVE"
                                        ? "Deactivate"
                                        : "Activate"}
                                </div>
                            </Menu.Item>
                            <Menu.Item>
                                <div
                                    onClick={() => {
                                        setSelectedForm(row.original);
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
                                        setSelectedForm(row.original);
                                        openDeleteModal();
                                    }}
                                >
                                    <RiDeleteBinLine
                                        size={21}
                                        color="#576074"
                                    />
                                    Remove
                                </div>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
            <div className="w-full flex justify-between items-center p-4">
                <div className="relative w-[25rem]">
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

                <Link
                    href={"/admin/forms/create"}
                    className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
                >
                    <span className="text-2xl">
                        <SolarAddFolderBold />
                    </span>
                    <h1 className="text-base font-medium text-white">
                        New Form
                    </h1>
                </Link>
            </div>
            <div className="w-full h-full">
                <DataTable
                    columns={columns}
                    data={filteredForms}
                    loading={forms.loading}
                    noDataMessage={
                        searchQuery
                            ? `No Forms found related to ${searchQuery}`
                            : "No Forms Added So Far"
                    }
                />
            </div>
            <DeleteModal
                isOpenModal={isOpenDelete}
                closeModal={() => {
                    closeDeleteModal();
                    setSelectedForm(null);
                }}
                type="forms"
                id={selectedForm?.uuid}
            />
            <ActivateDeactivateModal
                type="forms"
                closeModal={() => {
                    closeActivateDeactivateFormModal();
                    setSelectedForm(null);
                }}
                id={selectedForm?.uuid}
                isActive={selectedForm?.status === "ACTIVE"}
                isOpenModal={isOpenActivateDeactivateForm}
            />
        </div>
    );
};

export default Page;
