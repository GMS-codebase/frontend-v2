"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Menu } from "@mantine/core";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
const Page = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="w-full">{row.original?.name}</div>,
    },
    {
      accessorKey: "institution",
      header: "Institution Name",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.businesses[0]?.businessName}
        </div>
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
                  href={`/admin/applicants/${row.original.uuid}`}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={21} color="#576074" />
                  View
                </Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];
  const applicants = useSelector((state: any) => state.applicants);

  const ApplicantsWithProfile = applicants?.applicants?.filter(
    (applicant: any) =>
      applicant.has_completed_profile || applicant.applications.length > 0,
  );

  const filteredApplicants = ApplicantsWithProfile?.filter(
    (applicant: any) =>
      applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.businesses[0]?.businessName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-full md:w-[20rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} color="" />
          </span>
          <input
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredApplicants ?? []}
          loading={applicants?.loading}
          noDataMessage={
            searchTerm
              ? `No applicants matching ${searchTerm} found`
              : "No applicants yet"
          }
        />
      </div>
    </div>
  );
};
export default Page;
