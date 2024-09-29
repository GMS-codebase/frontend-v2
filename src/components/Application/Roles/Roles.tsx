"use client";
import { SolarShieldUserBold } from "@/components/core/icons";
import React, { useState } from "react";
import { Menu } from "@mantine/core"; // Importing Mantine's Menu component for the dropdown
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import RemoveRole from "@/components/Modals/RemoveRole";
import { useDisclosure } from "@mantine/hooks";
import EditRoleModal from "@/components/Modals/EditRoleModel";
interface RolesProps {
  role: any;
  numberOfUsers: number;
  id: string;
}

const Roles: React.FC<RolesProps> = ({ role, numberOfUsers, id }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [isOpenRemoveRole, { open: openRemoveRole, close: closeRemoveRole }] =
    useDisclosure(false);
  const [isOpenEditRole, { open: openEditRole, close: closeEditRole }] =
    useDisclosure(false);
  const navigate = useRouter();
  return (
    <div className="bg-[#005DE9] bg-opacity-10 flex flex-col items-center justify-center p-5 rounded-3xl relative">
      {/* Kebab Menu (Three Dots) */}
      <div className="absolute top-2 right-2">
        <Menu
          opened={menuOpened}
          onOpen={() => setMenuOpened(true)}
          onClose={() => setMenuOpened(false)}
          shadow="md"
          width={150}
        >
          <Menu.Target>
            <button onClick={() => setMenuOpened(!menuOpened)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v.01M12 12v.01M12 18v.01"
                />
              </svg>
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>
              <button
                onClick={() => {
                  navigate.push(`/admin/roles/${id}`);
                  setCookie("breadcrumb", `roles/${role.title}`);
                }}
                className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
              >
                View
              </button>
            </Menu.Item>

            <Menu.Item onClick={openEditRole}>Edit</Menu.Item>
            <Menu.Item color="red" onClick={openRemoveRole}>
              Remove
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <EditRoleModal
        initialData={role}
        isOpenAddEditRole={isOpenEditRole}
        closeAddEditRole={closeEditRole}
      />
      <RemoveRole
        role={{ uuid: id, role: role.title }}
        isOpen={isOpenRemoveRole}
        closeModal={closeRemoveRole}
      />
      <span className="text-[#005DE9] text-5xl">
        <SolarShieldUserBold />
      </span>
      <p className="text-xl font-semibold">{role.title}</p>
      <p className="text-sm">Users: {numberOfUsers}</p>
    </div>
  );
};

export default Roles;
