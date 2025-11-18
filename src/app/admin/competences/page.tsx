"use client";
import { SolarAddSquareBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { Menu } from "@mantine/core";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { ICompetence } from "@/types/competences";
import AddEditCompetency from "@/components/Modals/competences/AddEditCompetency";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { UnknownAction } from "redux";
import { getCompetences } from "@/services";
import {useRouter} from 'next/navigation';

type Competency = ICompetence;
 const Page = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [selected, setSelected] = useState<Competency | null>(null);
  const [isOpenAddEdit, { open: openAddEdit, close: closeAddEdit }] = useDisclosure(false);
  const router = useRouter();

  // Redux state
  const {
    competences,
    loading,
    error,
    total: totalCompetences,
    page: currentPageFromRedux,
  } = useSelector((state: any) => ({
    competences: state.competences.competences || [],
    total: state.competences.total,
    page: state.competences.page,
    loading: state.competences.loading,
    error: state.competences.error,
  }));

  // Local state for pagination
  const [paginateOpts, setLocalPaginateOpts] = useState<
    { page: number; limit: number; totalPages: number }
  >({
    page: (currentPageFromRedux ?? 1) - 1,
    limit: 10,
    totalPages: 1,
  });

  // Update totalPages when totalCompetences changes
  useEffect(() => {
    setLocalPaginateOpts((prev) => ({
      ...prev,
      totalPages: Math.ceil((totalCompetences ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalCompetences]);

  // Fetch competences when page, limit, or debouncedSearch changes
  useEffect(() => {
    console.log("Fetching competences with:", { page: (paginateOpts.page ?? 0) + 1, limit: paginateOpts.limit, search: debouncedSearch });
    dispatch(
      getCompetences(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit,
        // debouncedSearch
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit, debouncedSearch]);

  console.log("Competences:", competences, "Error:", error);

  const setPaginateOpts: React.Dispatch<
    React.SetStateAction<{ page: number; limit: number; totalPages: number }>
  > = (value) => {
    if (typeof value === "function") {
      setLocalPaginateOpts((prev) => {
        const next = value(prev);
        dispatch(
          getCompetences(
            (next.page ?? 0) + 1,
            next.limit,
            // debouncedSearch
          ) as unknown as UnknownAction
        );
        return next;
      });
    } else {
      setLocalPaginateOpts(value);
      dispatch(
        getCompetences(
          (value.page ?? 0) + 1,
          value.limit,
        //   debouncedSearch
        ) as unknown as UnknownAction
      );
    }
  };


  const columns: ColumnDef<Competency>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original?.name || "-"}</div>,
    },
    {
      accessorKey: "code",
      header: "Competence Code",
      cell: ({ row }) => (
        <div className="truncate">{row.original?.code || "-"}</div>
      ),
    },
    {
      accessorKey: "trade",
      header: "Trade",

      cell: ({ row }) => (
        <div>
          {row.original.trades?.length
            ? row.original.trades.map((t: any) => t.title).join(", ")
            : "-"}
        </div>
      ),
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Menu shadow="lg" width={260}>
          <Menu.Target>
            <button
              style={{
                background:
                  "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
              }}
              className="p-3 rounded-full border text-white"
            >
              <HiDotsHorizontal size={25} color="white" />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              <h1 className="text-lg">Actions</h1>
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item
              onClick={()=>{
                setSelected(row.original);
                router.push(`/admin/competences/${row.original.uuid}`)
              }}
              className="bg-[#F0F0F0]"
            >
              <div className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
                <FiEye size={21} color="#576074" />
                View
              </div>
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setSelected(row.original);
                openAddEdit();
              }}
            >
              <div className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
                <CiEdit size={21} color="#576074" />
                Edit
              </div>
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setSelected(row.original);
              }}
            >
              <div className="w-full py-1 flex text-base items-center gap-3 text-[#576074]">
                <RiDeleteBinLine size={21} color="#576074" />
                Remove
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const filteredCompetences = debouncedSearch
    ? competences.filter((competence: Competency) =>
        competence.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        competence.code?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        competence.tradeId?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : competences;

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-4 items-end md:items-center p-4">
        <div className="relative lg:w-[25rem] w-full mb-4">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search competencies"
          />
        </div>

        <button
          onClick={() => {
            setSelected(null);
            openAddEdit();
          }}
          className="bg-[#005DE9] text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <SolarAddSquareBold />
          </span>
          <h1 className="text-base font-medium text-white">New Competency</h1>
        </button>
      </div>

      <div className="w-full h-full">
        {error && <div className="text-red-500 p-4 mb-4 rounded">{error}</div>}
        <DataTable
          columns={columns}
          data={filteredCompetences}
          loading={loading}
          noDataMessage={
            searchQuery
              ? `No competencies matching "${searchQuery}" found`
              : "No Competencies Available"
          }
          totalApplications={totalCompetences}
        //   paginationProps={{
        //     isPaginated: true,
        //     paginateOpts,
        //     setPaginateOpts,
        //   }}
        />
      </div>

      <AddEditCompetency
        isOpen={isOpenAddEdit}
        onClose={() => {
          setSelected(null);
          closeAddEdit();
        }}
       defaultData={selected}
      />

    </div>
  );
};

export default Page;