"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { DataTable } from "@/components/core/data-table";
import { Menu } from "@mantine/core";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import EditRoleModal from "@/components/Modals/EditRoleModel";
import AddRoleModal from "@/components/Modals/EditRoleModel";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useDisclosure } from "@mantine/hooks";
import RemoveUserFromRole from "@/components/Modals/RemoveUserFromRole";
import { SolarAddFolderBold } from "@/components/core/icons";
import AddRoleUser from "@/components/Modals/AddRoleUser";

const Page = () => {
  const [isDeleteUser, { open, close }] = useDisclosure(false);
  const [isAddUser, { open: openAddUser, close: closeAddUser }] =
    useDisclosure(false);
  const { id: roleId } = useParams();
  const roles = useSelector((state: any) => state.roles);
  const role = roles?.roles?.filter((role: any) => role.uuid === roleId)[0];

  const [selectedRoleData, setSelectedRoleData] = useState<any>(null);
  const openModal = (data: any) => {

    setSelectedRoleData(data);
    open();
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "roleTitle",
      header: "Role Users",
      cell: ({ row }) => <div className="w-full">{row.original?.email}</div>,
    },
    {
      accessorKey: "permissions",
      header: "Permissions/Tabs Accessed",
      cell: ({ row }) => (
        <div className="w-full flex items-center gap-2">
          [
          {row.original?.tabs?.map((perm: any, index: number) => (
            <div key={index}>
              {index !== row.original.tabs.length - 1
                ? `${perm?.title ?? perm},`
                : (perm?.title ?? perm)}
            </div>
          ))}
          ]
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
              <button className="p-2" onClick={(e) => e.stopPropagation()}>
                <HiDotsHorizontal size={20} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => openModal(row.original)} color="red">
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full flex justify-end items-center mb-6">
        <button
          onClick={openAddUser}
          className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">Add User</h1>
        </button>
      </div>
      <DataTable data={role?.users ?? []} columns={columns} />
      <RemoveUserFromRole
        closeModal={close}
        isOpen={isDeleteUser}
        user={selectedRoleData}
        role={roleId}
      />
      <AddRoleUser
        role={String(roleId)}
        isOpenAddRoleUser={isAddUser}
        closeAddRoleUser={closeAddUser}
      />
    </div>
  );
};

export default Page;
