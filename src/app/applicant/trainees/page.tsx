"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu } from "@mantine/core";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";
import { SolarAddFolderBold } from "@/components/core/icons";
import { useDisclosure } from "@mantine/hooks";
import AddTrainee from "@/components/Modals/AddTrainee";
import { authorizedApi } from "@/utils/api";

const Page = () => {
  const [isOpenAddTrainee, { open: openAddTrainee, close: closeAddTrainee }] =
    useDisclosure(false);
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchTrainees = async (page: number) => {
    setLoading(true);
    try {
      const response = await authorizedApi.get(
        `/applicant/trainees?page=${page}&limit=10`
      );
      setTrainees(response.data.data);
      setTotal(response.data.total);
      setLastPage(response.data.lastPage);
    } catch (error) {
      console.error("Error fetching trainees:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainees(page);
  }, [page]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="w-full">{row.original?.name}</div>,
    },
    {
      accessorKey: "nationalId",
      header: "ID Number",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.nationalId}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="w-full">{row.original?.email}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div className="w-full">{row.original?.phone}</div>,
    },
    {
      accessorKey: "approvalStatus",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.approvalStatus}</div>
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
                  href={`/applicant/trainees/${row.original.uuid}`}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={21} color="#576074" />
                  View Details
                </Link>
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
        <h1 className="text-2xl font-bold">Trainees</h1>
        <button
          className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
          onClick={openAddTrainee}
        >
          <span className="text-2xl">
            <SolarAddFolderBold />
          </span>
          <h1 className="text-base font-medium text-white">Add Trainee</h1>
        </button>
      </div>
      <div className="w-full h-full px-4">
        <DataTable
          columns={columns}
          data={trainees}
          loading={loading}
          paginationProps={{
            isPaginated: true,
            paginateOpts: {
              page: page - 1,
              limit: 10,
              totalPages: lastPage,
            },
            setPaginateOpts: () => setPage(page + 1),
          }}
          totalApplications={total}
        />
      </div>

      <AddTrainee
        isOpenEditTrainee={isOpenAddTrainee}
        closeEditTrainee={closeAddTrainee}
      />
    </div>
  );
};

export default Page;
