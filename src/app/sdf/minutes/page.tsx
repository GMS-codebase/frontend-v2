"use client";
import { BiSearch } from "react-icons/bi";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { useState } from "react";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import AddMinute from "@/components/Modals/contracts/AddMinutes";
import MinutesActions from "./MinutesActions";
import { SolarAddFolderBold, SolarFileBold } from "@/components/core/icons";

const Page = () => {
  const [isOpenTrade, { open, close }] = useDisclosure(false);
  const [isMinute, setIsMinute] = useState({
    isOpen: false,
    application: null,
  });

  const { minutes, loading: loadingMinutes } = useSelector(
    (state: any) => state.minutes,
  );
  const { applicationsForContractSigning: applications, loading } = useSelector(
    (state: any) => state.applications,
  );
  const minuteColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.name}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.phone}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.email}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Minute Approval Status",
      cell: ({ row }) => (
        <div className="w-full">
          {row.original?.approval_status?.toUpperCase()}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <MinutesActions
          data={row.original}
          setIsMinute={setIsMinute}
          isNew={false}
        />
      ),
    },
  ];
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application Number",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicationNumber}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.name}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Applicant Phone",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.phone}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original?.description?.length > 50
            ? row.original?.description?.slice(0, 50) + "..."
            : row.original?.description}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <MinutesActions
          data={row.original}
          setIsMinute={setIsMinute}
          isNew={true}
        />
      ),
    },
  ];
  console.log(minutes);
  console.log(applications);
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
      <div className="w-full flex justify-between items-center p-4">
        <div className="relative w-[25rem]">
          <span className="absolute top-4 left-2">
            <BiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="w-full h-full mb-10">
        <h1 className="text-xl p-4 font-bold">Minutes Uploaded</h1>
        <DataTable
          columns={minuteColumns}
          data={minutes}
          loading={loadingMinutes}
          noDataMessage="No Created Minutes"
        />
      </div>

      <div className="w-full h-full">
        <h1 className="text-xl p-4 font-bold">
          Applications Ready For Minutes Negotiations
        </h1>
        <DataTable
          columns={columns}
          loading={loading}
          data={applications.filter(
            (app: any) =>
              minutes.find(
                (min: any) =>
                  min.application.uuid == app.uuid &&
                  min.approval_status.toUpperCase() === "APPROVED",
              ) === null,
          )}
          noDataMessage="No Applications ready for minutes negotiation"
        />
      </div>

      {/* AddMinute Modal */}
      <AddMinute
        data={isMinute.application}
        isOpenAddMinute={isMinute.isOpen}
        closeAddMinute={() => setIsMinute({ isOpen: false, application: null })}
      />
    </div>
  );
};
export default Page;
