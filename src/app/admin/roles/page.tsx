"use client";
import Roles from "@/components/Application/Roles/Roles";
import { SolarAddSquareBold } from "@/components/core/icons";
import React, { useState } from "react"; // Import useState
import { CiSearch } from "react-icons/ci";
import AddRoleModal from "../../../components/Modals/AddRole";
import { useSelector } from "react-redux";
import { Skeleton } from "@mantine/core";
const rolesData = [
  { id: "1", role: "Admin", numberOfUsers: 5 },
  { id: "2", role: "Manager", numberOfUsers: 12 },
  { id: "3", role: "Editor", numberOfUsers: 7 },
  { id: "4", role: "Viewer", numberOfUsers: 25 },
  { id: "5", role: "Developer", numberOfUsers: 8 },
  { id: "6", role: "Designer", numberOfUsers: 3 },
  { id: "7", role: "Analyst", numberOfUsers: 4 },
  { id: "8", role: "Tester", numberOfUsers: 9 },
];

const Page = () => {
  const { roles, loading } = useSelector((state: any) => state.roles);

  const [isOpenAddEditRole, setIsOpenAddEditRole] = useState(false);

  const openModal = () => {
    setIsOpenAddEditRole(true);
  };

  const closeModal = () => {
    setIsOpenAddEditRole(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[20rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
        <div
          onClick={openModal}
          className="flex justify-between text-center items-center gap-2 px-4 py-3 bg-[#005DE9] rounded-full text-white cursor-pointer"
        >
          <span>
            <SolarAddSquareBold />
          </span>
          <div>Add new Role</div>
        </div>
      </div>
      <div className="grid grid-cols-4 p-4 gap-5">
        {loading
          ? [0, 0, 0, 0, 0, 0].map((_, index) => (
              <Skeleton key={index} width={250} height={170} radius={30} />
            ))
          : roles.map((role: any, index: any) => (
              <Roles
                key={index}
                role={role}
                numberOfUsers={role.users.length}
                id={role.uuid}
              />
            ))}
      </div>
      <AddRoleModal
        isOpenAddEditRole={isOpenAddEditRole}
        closeAddEditRole={closeModal}
      />
    </div>
  );
};

export default Page;
