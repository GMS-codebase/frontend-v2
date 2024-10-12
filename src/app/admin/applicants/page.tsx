"use client";
import { useState, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { applicantsData as data } from "@/utils/constants/dummy";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import { RiDeleteBinLine } from "react-icons/ri";
import { Menu, Select } from "@mantine/core";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
const Page = () => {
  const [isOpenCall, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search state
  const filtersContainerRef = useRef<HTMLDivElement>(null);
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
    (applicant: any) => applicant.has_completed_profile
  );
  // Filter applicants by search term
  const filteredApplicants = ApplicantsWithProfile?.filter(
    (applicant: any) =>
      applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.businesses[0]?.businessName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
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
  const handleScroll = (direction: "left" | "right") => {
    if (filtersContainerRef.current) {
      const scrollAmount = 100;
      if (direction === "left") {
        filtersContainerRef.current.scrollLeft -= scrollAmount;
      } else {
        filtersContainerRef.current.scrollLeft += scrollAmount;
      }
    }
  };
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[20rem]">
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
        <div className="flex items-center">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 bg-white shadow-lg rounded-full mr-2"
          >
            <FiChevronLeft size={25} />
          </button>
          <div
            ref={filtersContainerRef}
            className="flex items-center gap-3 overflow-x-hidden scrollbar-hide"
            style={{ scrollBehavior: "smooth", maxWidth: "calc(4 * 11rem)" }}
          >
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By stage"
                data={["Duediligence"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Window"
                data={["Window 1: Apprenticeship and Internships"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Subwindow"
                data={["Rapid apprentices"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By Sector"
                data={["ICT & Innovations"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By trade"
                data={["Agriculture"]}
              />
            </div>
            <div className="w-44 flex-shrink-0">
              <FilterDropDown
                placeholderText="Filter By District"
                data={[
                  "Kicukiro",
                  "Musanze",
                  "Nyagatare",
                  "Muhanga",
                  "Nyarugenge",
                  "Kamonyi",
                  "Nyanza",
                  "Gasabo",
                ]}
              />
            </div>
          </div>
          <button
            onClick={() => handleScroll("right")}
            className="p-2 bg-white shadow-lg rounded-full ml-2"
          >
            <FiChevronRight size={25} />
          </button>
        </div>
      </div>
      <div className="w-full h-full">
        {applicants?.loading ? (
          <TableSkeleton columns={columns} />
        ) : filteredApplicants?.length === 0 ? (
          <h1>No Applicants Found!</h1>
        ) : (
          <DataTable columns={columns} data={filteredApplicants ?? []} />
        )}
      </div>
    </div>
  );
};
export default Page;












