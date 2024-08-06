import { SolarUserPlusBold } from "@/components/core/icons";
import { Select } from "@mantine/core";
import { CiSearch } from "react-icons/ci";
import { UserCircle } from "solar-icon-set";
import { FileDownload } from "solar-icon-set";

const Page = () => {
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
    <div className="w-full">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[20rem]">
        <h1 className="font-bold text-xl">Export Report</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Call"
              data={[
                "Tech innovators",
                "Call for application",
              ]}
            />
          </div>
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Stage"
              data={[
                " Evaluation",

              ]}
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
          <div className="w-44">
            <FilterDropDown
              placeholderText="Filter By Decision"
              data={[
                "Approved",
                "Pending",
                "Rejected",
              ]}
            />
          </div>
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
                        <UserCircle className="w-10 h-10 mt-2"/>
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
                    <button
          className="w-full mt-10 text-center justify-center bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
        >
          <span className="text-2xl">
            <FileDownload/>
          </span>
          <h1 className="text-base font-medium text-white">New Employee</h1>
        </button>
        </div>
    </div>
  );
};
export default Page;
