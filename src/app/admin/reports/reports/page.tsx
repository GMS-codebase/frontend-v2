"use client"
import { SolarUserPlusBold } from "@/components/core/icons";
import { Select } from "@mantine/core";
import { useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { UserCircle } from "solar-icon-set";
import { FileDownload } from "solar-icon-set";

const Page = () => {
  const FilterDropDown = ({
    placeholderText,
    data,
    className,
  }: {
    placeholderText: string;
    data: any[];
    className:string;
  }) => {
    return (
      <Select
        data={data}
        placeholder={placeholderText}
        defaultValue={placeholderText}
        className="!min-w-[176px] px-3 py-2 flex-shrink-0 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
      />
    );
  };

    const filtersContainerRef = useRef<HTMLDivElement>(null);
  
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
    <div className="w-full">
      <div className="w-full lg:flex justify-between items-center p-4">
        <div className="relative lg:w-[20rem] w-full mb-4">
          <h1 className="font-bold text-xl">Export Report</h1>
        </div>
        <div className="flex w-full overflow-auto items-center gap-3 custom-scrollbar">
          <div className="w-44">
        <div className="flex items-center lg:max-w-[60%]">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 bg-white shadow-lg rounded-full mr-2"
          >
            <FiChevronLeft size={25} />
          </button>

          <div
            ref={filtersContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-grow"
            style={{ scrollBehavior: "smooth" }}
          >
            <FilterDropDown
              className="flex-shrink-0"
              placeholderText="Filter By Call"
              data={["Tech innovators", "Call for application"]}
            />

            <FilterDropDown
              className="flex-shrink-0"
              placeholderText="Filter By Stage"
              data={[" Evaluation"]}
            />

            <FilterDropDown
              className="flex-shrink-0"
              placeholderText="Filter By Sector"
              data={["ICT & Innovations"]}
            />

            <FilterDropDown
              className="flex-shrink-0"
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

            <FilterDropDown
              className="flex-shrink-0"
              placeholderText="Filter By Decision"
              data={["Approved", "Pending", "Rejected"]}
            />
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="p-2 bg-white shadow-lg rounded-full ml-2"
          >
            <FiChevronRight size={25} />
          </button>
        </div>
      </div>
      <div className="mt-10 ml-4">
        <label
          htmlFor="document"
          className="block text-xs font-bold text-gray-700"
        >
          Select File
        </label>
        <div className="mt-1 py-2 pl-8 relative block bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <span className="absolute left-4 top-[10px]">
            <UserCircle className="w-10 h-10 mt-2" />
          </span>
          <Select
            name="position"
            data={[
              { value: "CEO", label: "CEO" },
              { value: "CTO", label: "CTO" },
              {
                value: "Marketing Manager",
                label: "Marketing Manager",
              },
            ]}
            placeholder="Select file"
            required
          />
        </div>
        <button className="w-full mt-10 text-center justify-center bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3">
          <span className="text-2xl">
            <FileDownload />
          </span>
          <h1 className="text-base font-medium text-white">New Employee</h1>
        </button>
      </div>
    </div>
  );
};
export default Page;
