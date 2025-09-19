"use client";

import { DataTable } from "@/components/core/data-table";
import { getCertifiedTrainees, handleDownloadFile } from "@/services";
import { IPaginatedQuery } from "@/types/base.type";
import { ITrainingTrainee } from "@/types/trainings";
import { Menu, Select } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import { VscEye } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { UnknownAction } from "redux";
import { useDebounce } from "use-debounce";

const CertifiedTraineesContainer = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const {
    certifiedTrainees,
    loadingCertifiedTrainees,
    total: totalTrainees,
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
      totalPages: Math.ceil((totalTrainees ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalTrainees]);

  // Fetch data whenever page or limit changes
  useEffect(() => {
    dispatch(
      getCertifiedTrainees(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit,
        debouncedSearch
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit, debouncedSearch]);

  const setPaginateOpts: React.Dispatch<
    React.SetStateAction<IPaginatedQuery & { totalPages: number }>
  > = (value) => {
    if (typeof value === "function") {
      setLocalPaginateOpts((prev) => {
        const next = value(prev);
        dispatch(
          getCertifiedTrainees(
            (next.page ?? 0) + 1,
            next.limit
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getCertifiedTrainees(
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

  const traineesColumns: ColumnDef<ITrainingTrainee>[] = [
    {
      accessorKey: "firstName",
      header: "First name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.firstName}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last name",
      cell: ({ row }) => <div className="w-full">{row.original?.lastName}</div>,
    },
    {
      accessorKey: "nid",
      header: "NID",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.nationalId}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone number",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.traineePhoneNumber}</div>
      ),
    },
    {
      accessorKey: "educationLevel",
      header: "Education Level",
      cell: ({ row }) => (
        <div className="w-full truncate max-w-[180px]">
          {row.original?.educationLevel}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div className="w-full">{row.original?.gender}</div>,
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
              {/* <Menu.Item className="bg-[#F0F0F0]">
                <span className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]">
                  <VscEye size={21} color="#576074" />
                  Preview
                </span>
              </Menu.Item> */}
              <Menu.Item
                className="bg-[#F0F0F0]"
                onClick={() =>
                  handleDownloadFile(row?.original?.certificatePath, "training")
                }
              >
                <span className="w-full h-full py-1 flex text-base items-center gap-3 text-[#576074]">
                  <Download size={21} color="#576074" />
                  Download
                </span>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];
  const filteredCertifiedTrainees = debouncedSearch
      ?certifiedTrainees.filter((trainee:any) =>
          [trainee.firstName, trainee.lastName, trainee.nationalId].some((field) =>
            field?.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        ):certifiedTrainees;
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex flex-col md:flex-row md:justify-end items-center p-4 gap-4">
        <div className="relative lg:w-[25rem] w-full mt-4 lg:mt-0">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search certified trainee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
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
        </div> */}
      </div>

      <div className="w-full h-full">
        <DataTable
          columns={traineesColumns}
          data={filteredCertifiedTrainees ?? []}
          loading={loadingCertifiedTrainees}
          noDataMessage={
            searchQuery
              ? `No trainee matching "${searchQuery}"`
              : "There are no trainee yet"
          }
          totalApplications={totalTrainees}
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

export default CertifiedTraineesContainer;
