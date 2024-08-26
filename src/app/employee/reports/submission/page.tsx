"use client";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { applicationsData as data } from "@/utils/constants/dummy";
import CallsActions from "../../applications/CallsAction";
import { CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import AddCall from "@/components/Modals/AddCall";
import { Select } from "@mantine/core";

const Page = () => {
  const [isOpenCall, { open, close }] = useDisclosure(false);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => <div>{row.original?.applicationNumber}</div>,
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => <div>{row.original?.applicantName}</div>,
    },
    {
      accessorKey: "window",
      header: "Window",
      cell: ({ row }) => (
        <div>
          WINDOW {row.original?.window.number} : {row.original?.window.name}
        </div>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => <div>{row.original?.sector}</div>,
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => <div>{row.original?.stage}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <CallsActions application={row.original} />,
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
        className="w-full px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
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
              placeholderText="Filter By Date"
              data={["1 - 25 / July/2024", "26 - 19 / August/2024"]}
            />
          </div>
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Window"
              data={["Window 1: Apprenticeship and Internships"]}
            />
          </div>
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Sector"
              data={["ICT & Innovations"]}
            />
          </div>
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Ditrict"
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
      </div>

      <div className="w-full h-full">
        <DataTable columns={columns} data={data} />
      </div>
      <AddCall isOpenAddCall={isOpenCall} closeAddCall={close} />
    </div>
  );
};
export default Page;
