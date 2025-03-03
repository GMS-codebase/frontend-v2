"use client";

import { Select } from "@mantine/core";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { UserCircle, FileDownload } from "solar-icon-set";
import { useRef } from "react";

const Page = () => {
    const filtersContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (filtersContainerRef.current) {
            const scrollAmount = 200; // Adjust scroll speed
            if (direction === "left") {
                filtersContainerRef.current.scrollBy({
                    left: -scrollAmount,
                    behavior: "smooth",
                });
            } else {
                filtersContainerRef.current.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth",
                });
            }
        }
    };

    const FilterDropDown = ({
       
      
        placeholderText,
        data,
    }: {
   
      
        placeholderText: string;
        data: any[];
    }) => {
        return (
            <div className="flex flex-col min-w-[12rem]">
               
                <Select
                    data={data}
                    placeholder={placeholderText}
                    
                    className="w-full px-3 py-2 text-base text-black rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
                />
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="w-full lg:flex justify-between items-center p-4">
                <div className="relative lg:w-[20rem] w-full mb-4">
                    <h1 className="font-bold text-xl">Export Report</h1>
                </div>
                <div className="relative flex w-full lg:w-[60%] items-center flex-1">
                    <button
                        onClick={() => handleScroll("left")}
                        className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md  lg:left-0"
                    >
                        <FiChevronLeft size={25} />
                    </button>

                    <div
                        ref={filtersContainerRef}
                        className="flex w-full overflow-x-auto space-x-4 py-2 scrollbar-hide lg:space-x-6 sm:space-x-3 px-12"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        <FilterDropDown
                            placeholderText="Select Call"
                            data={["Tech innovators", "Call for application"]}
                        />
                        <FilterDropDown
                            placeholderText="Select Stage"
                            data={["Evaluation"]}
                        />
                        <FilterDropDown
                            placeholderText="Select Sector"
                            data={["ICT & Innovations"]}
                        />
                        <FilterDropDown
                            placeholderText="Select District"
                            data={[
                                "Kicukiro",
                                "Musanze",
                                "Nyagatare",
                                "Muhanga",
                            ]}
                        />
                        <FilterDropDown
                            placeholderText="Select Decision"
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
                <div className="mt-1 py-2 pl-8 relative block bg-[#000F230A] rounded-2xl shadow-sm">
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
                <button className="w-full mt-10 text-center bg-primary text-white py-3 px-7 rounded-full flex items-center gap-3">
                    <FileDownload className="text-2xl" />
                    <h1 className="text-base font-medium text-white">
                        Export Report
                    </h1>
                </button>
            </div>
        </div>
    );
};

export default Page;
