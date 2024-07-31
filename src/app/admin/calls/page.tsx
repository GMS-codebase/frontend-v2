import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import { ColumnDef } from "@tanstack/react-table";
const Page = ()=>{
    const columns: ColumnDef<any>[] = [
        {
          accessorKey: "origin",
          header: "Origin",
          cell: ({ row }) => <div>{row.original?.departure_point}</div>,
        },
        {
          accessorKey: "destination",
          header: "Destination",
          cell: ({ row }) => <div>{row.original?.destination_point}</div>,
        },
        {
          accessorKey: "departTime",
          header: "Depart Time",
          cell: ({ row }) => (
            <div>{row.original?.depart_time}</div>
          ),
        },
        {
          accessorKey: "arrivalTime",
          header: "Arrival Time",
          cell: ({ row }) => (
            <div>{row.original?.arrival_time}</div>
          ),
        },
        {
          accessorKey: "price",
          header: "Price",
          cell: ({ row }) => <div>{row.original?.price}</div>,
        },
        {
          accessorKey: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-2  justify-start">
              <button className="p-3 rounded-full border  text-white hover:bg-red-100">
                {/* <RiDeleteBin2Line color="red" size={17} /> */}
              </button>
            </div>
          ),
        },
      ];
    return(
        <div className="w-full flex flex-col bg-white p-4 rounded-2xl">
            <div className="w-full flex justify-between items-center">
                <div className="relative w-[25rem]">
                    <span className="absolute top-4 left-2">
                        <BiSearch size={25}/>
                    </span>
                    <input name="search" className="w-full p-3 py-4 pl-10 text-base text-black rounded-full bg-[#005DE908] border-none outline-none" placeholder="Search"/>
                </div>

                <button className="bg-[#005DE9] text-white py-3 px-7 rounded-full flex flex-row items-center gap-3">
                    <span className="text-2xl">
                        <SolarAddFolderBold/>
                    </span>
                    <h1 className="text-base font-medium text-white">New Call</h1>
                </button>
            </div>
        </div>
    )
}
export default Page;