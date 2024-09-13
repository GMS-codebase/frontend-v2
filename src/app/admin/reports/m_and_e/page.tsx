"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { meReports as data } from "@/utils/constants/dummy";
import { CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import AddCall from "@/components/Modals/call/AddCall";
import { Select } from "@mantine/core";
import { HiDotsHorizontal } from "react-icons/hi";
import MeActions from "./MeActions";
import { SolarFileBold } from "@/components/core/icons";
import AddReportModal from "@/components/Modals/AddReportModalsProps";
import { useSelector } from "react-redux";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";

const Page = () => {
  const [isOpenReportModal, { open: openReport, close: closeReport }] =
    useDisclosure(false);
  const [isOpenCall, { open: openCall, close: closeCall }] =
    useDisclosure(false);
  const mereports = useSelector((state: any) => state.mereports);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original?.title}</div>,
    },
    {
      accessorKey: "call",
      header: "Call",
      cell: ({ row }) => <div>{row.original?.call}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div>
          {" "}
          {row.original?.description.length > 50
            ? row.original?.description.slice(0, 50) + "..."
            : row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <MeActions />,
    },
  ];

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
        className="w-full px-3 py-2 text-base text-black rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
      />
    );
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
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Call"
              data={Array.from(new Set(data.map((item) => item.call)))}
            />
          </div>
          <div
            className="flex  justify-between text-center items-center gap-2 px-4 py-3 bg-[#005DE9] rounded-full text-white"
            onClick={openReport}
          >
            <span>
              <SolarFileBold />
            </span>
            <div>Add new Report</div>
          </div>
          <div className="flex  justify-between text-center items-center gap-2 px-4 py-3 bg-[#005DE9] rounded-full text-white">
            <span>
              <SolarFileBold />
            </span>
            <div>Export Report</div>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        {mereports?.loading ? (
          <TableSkeleton columns={columns} />
        ) : (
          <DataTable columns={columns} data={mereports?.mereports ?? []} />
        )}
      </div>
      <AddReportModal isOpen={isOpenReportModal} onClose={closeReport} />
      <AddCall isOpenAddCall={isOpenCall} closeAddCall={closeCall} />
    </div>
  );
};
export default Page;
