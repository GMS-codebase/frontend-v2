"use client"
import React,{useState} from "react";
import { Select } from "@mantine/core";
import { ChangeEvent } from "react";
import { TableData } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { applicationsData as data } from "@/utils/constants/dummy";
import CallsActions from "../calls/CallsAction";
import { CiSearch } from "react-icons/ci";

const Page = () => {
  const [text, setText] = useState("");
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
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => <CallsActions setIsCall={function (employee: any): void {
        throw new Error("Function not implemented.");
      } } call={undefined} />,
    },
  

  ];
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
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
    <div>
    <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[20rem]">
       <h1 className="text-2xl font-bold">Send Notifications</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Call"
              data={["Call for apprentices"]}
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
              placeholderText="Filter By Stage"
              data={[
                "Duediligence",
              ]}
            />
          </div>
        </div>
      </div>
     <div className="p-4 mt-5 w-full">
       <label className="block text-sm text-gray-600" htmlFor="textarea">
         Comment:
       </label>
      <textarea
        id="textarea"
        name="textarea"
        value={text}
        onChange={handleChange}
        rows={4}
        className="mt-2 p-2 w-full border border-primary rounded-md shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-white"
      />
       <button
              type="submit"
              className="w-full px-4 py-2 mt-5 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send notification
            </button>
    </div>
      <div className="relative  w-full my-5 flex justify-between">
        <h1 className="font-bold text-xl">Concerned Applicants</h1>
        <div className="relative  w-[20rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} color="" />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
        </div>
      <div className="w-full h-full">
        <DataTable columns={columns} data={data}/>
      </div>
    </div>
  );
};
export default Page;
