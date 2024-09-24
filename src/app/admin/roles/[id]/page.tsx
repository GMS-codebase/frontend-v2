"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { DataTable } from "@/components/core/data-table";
import { Menu } from "@mantine/core";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import EditRoleModal from "@/components/Modals/EditRoleModel"; // Import your modal component
import AddRoleModal from "@/components/Modals/EditRoleModel";

const Page = () => {
    // Sample data for the table
    const data = [
        {
            id: "1", // Add an ID for identifying the role
            roleTitle: "Admin Access",
            permissions: [{ name: "Full access to manage everything" }],
        },
        {
            id: "2",
            roleTitle: "User Management",
            permissions: [
                { name: "Access to manage user roles and permissions" },
            ],
        },
        {
            id: "3",
            roleTitle: "View Reports",
            permissions: [{ name: "Can view and export reports" }],
        },
    ];

    const [isOpenEditRole, setIsOpenEditRole] = useState(false);
    const [selectedRoleData, setSelectedRoleData] = useState<any>(null);

    // Define the columns
    const columns: ColumnDef<(typeof data)[0]>[] = [
        {
            accessorKey: "roleTitle",
            header: "Role Title",
            cell: ({ row }) => (
                <div className="w-full">{row.original?.roleTitle}</div>
            ),
        },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: ({ row }) => (
                <div className="w-full">
                    {row.original.permissions.map(
                        (perm: any, index: number) => (
                            <div key={index}>{perm.name}</div>
                        )
                    )}
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="w-full flex justify-center">
                    <Menu shadow="lg" width={200}>
                        <Menu.Target>
                            <button
                                className="p-2"
                                onClick={(e) => e.stopPropagation()} // Prevent row selection
                            >
                                <HiDotsHorizontal size={20} />
                            </button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item className="w-full h-full">
                                <div
                                    className="w-full h-full"
                                    onClick={() => {
                                        setSelectedRoleData(row.original);
                                        setIsOpenEditRole(true);
                                    }}
                                >
                                    Edit
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                // icon={<RiDeleteBinLine size={14} />}
                                onClick={() => {
                                    // Add delete functionality
                                }}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            ),
        },
    ];

    return (
        <div>
            <DataTable data={data} columns={columns} />
            {isOpenEditRole && (
                <AddRoleModal
                    isOpenAddEditRole={isOpenEditRole}
                    closeAddEditRole={() => setIsOpenEditRole(false)} // Function to close the modal
                    initialData={selectedRoleData} // Pass the selected role data for editing
                    onSubmit={(updatedData) => {
                        // Handle the role creation/update logic here
                        console.log("Updated Role Data:", updatedData);
                    }}
                />
            )}
        </div>
    );
};

export default Page;
