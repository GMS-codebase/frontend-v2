"use client";
import { DataTable } from "@/components/core/data-table";
import { getSDFTrainings } from "@/services";
import { Training } from "@/types";
import { IPaginatedQuery } from "@/types/base.type";
import { Menu, Select } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { VscEye } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { UnknownAction } from "redux";

const Page = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    trainings,
    loading,
    total: totalTrainings,
    page: currentPageFromRedux,
  } = useSelector((state: any) => state.trainings);

  // Local state for pagination
  const [paginateOpts, setLocalPaginateOpts] = useState<
    IPaginatedQuery & { totalPages: number }
  >({
    page: (currentPageFromRedux ?? 1) - 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    setLocalPaginateOpts((prev) => ({
      ...prev,
      totalPages: Math.ceil((totalTrainings ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalTrainings]);

  // Fetch data whenever page or limit changes
  useEffect(() => {
    dispatch(
      getSDFTrainings(
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
          getSDFTrainings(
            (next.page ?? 0) + 1,
            next.limit
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getSDFTrainings(
          (value.page ?? 0) + 1,
          value.limit
        ) as unknown as UnknownAction
      );
    }
  };

  const FilterDropDown = ({
    placeholderText,
    data,
  }: {
    placeholderText: string;
    data: any[];
  }) => (
    <Select
      data={data}
      placeholder={placeholderText}
      defaultValue={placeholderText}
      className="w-full px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
    />
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="w-full">{row.original?.title}</div>,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.original?.startDate
          ? new Date(row.original.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "-";
        return <div className="w-full">{date}</div>;
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = row.original?.endDate
          ? new Date(row.original.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "-";
        return <div className="w-full">{date}</div>;
      },
    },
    {
       accessorKey: "response",
       header: "Response",
       cell: ({ row }) => {
         const { status, uuid } = row.original;
 
         if (
           status === "ACCEPTED" ||
           status === "REJECTED" ||
           status === "DRAFT"
         ) {
           return (
             <button
               className="px-3 py-1 bg-primary text-white rounded-full text-sm"
               onClick={() => {
                 window.location.href = `/sdf/trainings/${uuid}`;
               }}
             >
               View Training
             </button>
           );
         } else if (status === "REVIEW") {
           return (
             <button
               className="px-3 py-1 bg-primary/20 border border-primary text-primary rounded-full text-sm"
               onClick={() => {
                  window.location.href = `/sdf/trainings/${uuid}`
               }}
             >
               Make decision
             </button>
           );
         } else return <div className="text-gray-400">-</div>;
       },
     },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-full capitalize">
          {row.original?.status || "draft"}
        </div>
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
                  href={`/sdf/trainings/${row.original.uuid}`}
                  className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <VscEye size={21} color="#576074" />
                  View
                </Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

const filteredTrainings =
  trainings?.trainings?.filter((training: Training) =>
    training?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center p-4 gap-4">
        <div className="relative lg:w-[25rem] w-full mt-4 lg:mt-0">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search trainings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <FilterDropDown
            placeholderText="Filter By status"
            data={["ACCEPTED", "REJECTED", "UNDER REVIEW"]}
          />

          <FilterDropDown
            placeholderText="Filter By requests"
            data={["Respond"]}
          />
          <FilterDropDown
            placeholderText="Filter By Call"
            data={["call 1,call 2"]}
          />

          <FilterDropDown
            placeholderText="Filter By Sector"
            data={["Manufacturing", "Constrution"]}
          />
        </div>
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={columns}
          data={filteredTrainings}
          loading={loading}
          noDataMessage={
            searchQuery
              ? `No trainings matching "${searchQuery}"`
              : "You do not have any trainings yet"
          }
          totalApplications={totalTrainings}
          paginationProps={{
            isPaginated: true,
            paginateOpts,
            setPaginateOpts,
          }}
        />
      </div>
    </div>
  );
};

export default Page;
