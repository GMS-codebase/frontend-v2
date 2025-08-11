"use client";
import { BiSearch } from "react-icons/bi";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import { Menu, Select } from "@mantine/core";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { useEffect, useState } from "react";
import { UnknownAction } from "redux";
import { getApplicants } from "@/services";
import { IPaginatedQuery } from "@/types/base.type";

const Page = () => {
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
          {row.original?.businesses[0]?.businessName ?? "N/A"}
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

  const dispatch = useDispatch();

  const {
    applicants,
    loading,
    total: totalApplicants,
    page: currentPageFromRedux,
  } = useSelector((state: any) => state.applicants);

  // Local state for pagination
  const [paginateOpts, setLocalPaginateOpts] = useState<
    IPaginatedQuery & { totalPages: number }
  >({
    page: (currentPageFromRedux ?? 1) - 1, // UI 0-based
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    setLocalPaginateOpts((prev) => ({
      ...prev,
      totalPages: Math.ceil((totalApplicants ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalApplicants]);

  // Fetch data whenever page or limit changes
  useEffect(() => {
    dispatch(
      getApplicants(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit]);

  const setPaginateOpts: React.Dispatch<
    React.SetStateAction<IPaginatedQuery & { totalPages: number }>
  > = (value) => {
    if (typeof value === "function") {
      setLocalPaginateOpts((prev) => {
        const next = value(prev);
        dispatch(
          getApplicants(
            (next.page ?? 0) + 1,
            next.limit
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getApplicants(
          (value.page ?? 0) + 1,
          value.limit
        ) as unknown as UnknownAction
      );
    }
  };

  const [filteredApplicants, setFilteredApplicants] = useState(applicants);
  const [selectedFilters, setSelectedFilters] = useState<string>("All");

  useEffect(() => {
    setFilteredApplicants(
      applicants?.filter((applicant: any) =>
        selectedFilters === "All"
          ? true
          : selectedFilters === "Completed Profile"
            ? applicant.has_completed_profile
            : !applicant.has_completed_profile
      )
    );
  }, [applicants, selectedFilters]);

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full lg:flex justify-between items-center p-4">
        <div className="relative lg:w-[25rem] w-full mb-4">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-10 text-base text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
        <Select
          data={["All", "Completed Profile", "Incomplete Profile"]}
          placeholder="Filter by"
          onChange={(value) => setSelectedFilters(value ?? "All")}
          value={selectedFilters}
          className="w-fit px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
        />
      </div>
      <div className="w-full h-full">
        {loading ? (
          <TableSkeleton columns={columns} />
        ) : filteredApplicants?.length === 0 ? (
          <h1 className="text-center text-2xl font-bold py-10">
            No Applicants Found!
          </h1>
        ) : (
          <DataTable
            columns={columns}
            data={filteredApplicants ?? []}
            totalApplications={totalApplicants}
            paginationProps={{
              isPaginated: true,
              paginateOpts,
              setPaginateOpts,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
