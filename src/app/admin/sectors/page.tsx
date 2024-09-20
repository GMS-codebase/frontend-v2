"use client";
import { SolarAddSquareBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { sectorsData as data, sectorsData } from "@/utils/constants/dummy";
import SectorsActions from "../../../components/Actions/SectorsAction";
import { CiEdit, CiSearch } from "react-icons/ci";
import AddSector from "@/components/Modals/AddSector";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import UpdateSector from "@/components/Modals/UpdateSector";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { BiSearch } from "react-icons/bi";
import AddEditSector from "@/components/Modals/sectors/AddEditSector";
import DeleteModal from "@/components/Modals/DeleteModal";
import { Menu } from "@mantine/core";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

const Page = () => {
  const sectors = useSelector((state: any) => state.sectors);
  console.log("sectors --> ",sectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [
    isOpenCreateEdit,
    { open: openCreateEditModal, close: closeCreateEditModal },
  ] = useDisclosure(false);
  const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [selectedSector, setSelectedSector] = useState<any>();
  const filteredSectors =
    sectors.sectors?.filter(
      (sector: any) =>
        sector?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sector?.shortname?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original?.name}</div>,
    },
    {
      accessorKey: "shortname",
      header: "Short Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.shortname}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.description.length > 50
            ? row.original?.description.slice(0, 50) + "..."
            : row.original.description}
        </div>
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
              <Menu.Item className="bg-[#F0F0F0]">
                <Link
                  href={`/admin/sectors/${row.original.uuid}`}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={21} color="#576074" />
                  View
                </Link>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={() => {
                    setSelectedSector(row.original);
                    openCreateEditModal();
                  }}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <CiEdit size={21} color="#576074" />
                  Edit
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
                  <RiDeleteBinLine size={21} color="#576074" />
                  Activate
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                  onClick={() => {
                    setSelectedSector(row.original);
                    openDeleteModal();
                  }}
                >
                  <RiDeleteBinLine size={21} color="#576074" />
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

        <button
          onClick={openCreateEditModal}
          className="bg-[#005DE9] text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddSquareBold />
          </span>
          <h1 className="text-base font-medium text-white">New Sector</h1>
        </button>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredSectors}
          loading={sectors.loading}
          noDataMessage={"No Sectors Available"}
        />
      </div>
      <AddEditSector
        isOpenAddEditSector={isOpenCreateEdit}
        closeAddEditSector={() => {
          setSelectedSector(null);
          closeCreateEditModal();
        }}
        defaultData={selectedSector}
      />
      <DeleteModal
        isOpenModal={isOpenDelete}
        closeModal={() => {
          setSelectedSector(null);
          closeDeleteModal();
        }}
        type="sectors"
        id={selectedSector?.uuid}
      />
    </div>
  );
};
export default Page;
