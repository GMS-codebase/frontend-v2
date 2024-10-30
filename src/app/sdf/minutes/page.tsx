"use client";
import { BiSearch } from "react-icons/bi";
import { Select, Tabs } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { useState } from "react";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import AddMinute from "@/components/Modals/contracts/AddMinutes";
import MinutesActions from "./MinutesActions";

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
  console.log("applicatioons", applications);
  console.log("minutes", minutes);

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
      accessorKey: "email",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.email}</div>
      ),
    },
    {
      accessorKey: "approval_status",
      header: "Minute Approval Status",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.terms?.toUpperCase()}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <MinutesActions
          data={row.original}
          setIsMinute={setIsMinute}
          status="uploaded"
        />
      ),
    },
  ];
  const approvedColumns: ColumnDef<any>[] = [
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
      accessorKey: "email",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.email}</div>
      ),
    },
    {
      accessorKey: "approval_status",
      header: "Minute Approval Status",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.terms?.toUpperCase()}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <MinutesActions
          data={row.original}
          setIsMinute={setIsMinute}
          status="approved"
        />
      ),
    },
  ];
  const rejectedColumns: ColumnDef<any>[] = [
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
      accessorKey: "email",
      header: "Applicant Email",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.applicant?.email}</div>
      ),
    },
    {
      accessorKey: "approval_status",
      header: "Minute Approval Status",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.terms?.toUpperCase()}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <MinutesActions
          data={row.original}
          setIsMinute={setIsMinute}
          status="rejected"
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
            ? row.original?.description.slice(0, 50) + "..."
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
          status="ready"
        />
      ),
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
        <div
          // ref={filtersContainerRef}
          className="flex items-center gap-3 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: "smooth", maxWidth: "calc(4 * 11rem)" }}
        >
          <div className="w-44 flex-shrink-0">
            <FilterDropDown
              placeholderText="Filter By Call"
              data={["Call Test"]}
            />
          </div>
          <div className="w-44 flex-shrink-0">
            <FilterDropDown
              placeholderText="Filter By Sector"
              data={["ICT & Innovations"]}
            />
          </div>
          <div className="w-44 flex-shrink-0">
            <FilterDropDown
              placeholderText="Filter By trade"
              data={["Agriculture"]}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="applications">
        <Tabs.List className="w-auto my-2 ml-5 float-end">
          <Tabs.Tab value="applications">
            Ready for Minutes Negotiations
          </Tabs.Tab>
          <Tabs.Tab value="minutes">Meeting minutes Uploaded</Tabs.Tab>
          <Tabs.Tab value="approved">Approved meeting minutes</Tabs.Tab>
          <Tabs.Tab value="rejected">Rejected meeting minutes</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="minutes">
          <h1 className="text-xl p-4 font-bold">Minutes Uploaded</h1>
          <DataTable
            columns={minuteColumns}
            data={minutes}
            loading={loadingMinutes}
            noDataMessage="No Created Minutes"
          />
        </Tabs.Panel>

        <Tabs.Panel value="applications">
          <h1 className="text-xl p-4 font-bold">
            {" "}
            Ready For Minutes Negotiations
          </h1>
          <DataTable
            columns={columns}
            data={applications.filter(
              (app: any) =>
                !minutes.find(
                  (min: any) =>
                    min.application.uuid === app.uuid &&
                    min.terms === "PENDING",
                ),
            )}
            loading={loading}
            noDataMessage="No Application ready for minute negotiation"
          />
        </Tabs.Panel>

        <Tabs.Panel value="approved">
          <h1 className="text-xl p-4 font-bold">Approved minute negotiation</h1>
          <DataTable
            columns={approvedColumns}
            loading={loading}
            data={applications.filter(
              (app: any) =>
                minutes.find(
                  (min: any) =>
                    min.application.uuid == app.uuid &&
                    min.terms === "APPROVED",
                ) === null,
            )}
            noDataMessage="No Approved minute negotiation"
          />
        </Tabs.Panel>

        <Tabs.Panel value="rejected">
          <h1 className="text-xl p-4 font-bold">Rejected minute negotiation</h1>
          <DataTable
            columns={rejectedColumns}
            data={applications.filter((app: any) =>
              minutes.find(
                (min: any) =>
                  min.application.uuid === app.uuid && min.terms === "REJECTED",
              ),
            )}
            loading={loading}
            noDataMessage="No Rejected Minute Negotiations"
          />
        </Tabs.Panel>
      </Tabs>

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
