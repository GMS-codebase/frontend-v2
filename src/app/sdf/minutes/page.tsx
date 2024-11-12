"use client";
import { BiSearch } from "react-icons/bi";
import { Select, Tabs } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";
import AddMinute from "@/components/Modals/contracts/AddMinutes";
import MinutesActions from "./MinutesActions";

const Page = () => {
  const [isMinute, setIsMinute] = useState({
    isOpen: false,
    application: null,
    type: "",
  });

  const {
    minutes,
    // uploadedMinutes,
    // approvedMinutes,
    // rejectedMinutes,
    loading: loadingMinutes,
    // uploadedMinutesLoading,
    // approvedMinutesLoading,
    // rejectedMinutesLoading,
    // applicationsReadyForMinutesLoading,
    // applicationsReadyForMinutes,
  } = useSelector((state: any) => state.minutes);

  const [uploadedMinutes, setUploadedMinutes] = useState<any[]>([]);
  const [readyForMinutesNegotiation, SetReadyForMinutesNegotiation] = useState<any[]>([]);
  const [approvedMinutes, setApprovedMinutes] = useState<any[]>([]);
  const [rejectedMinutes, setRejectedMinutes] = useState<any[]>([]);
  const [negotiatedMinutes, setNegotiatedMinutes] = useState<any[]>([]);

  console.log("minutes --> ",minutes);
  useEffect(()=>{
    SetReadyForMinutesNegotiation(minutes.filter((m: any)=> !m?.uploadedMinutes && !m?.uploadedSignedMinutes && !m?.uploadedContract));
    setUploadedMinutes(minutes.filter((m: any)=> m?.uploadedMinutes && !m?.uploadedSignedMinutes && !m?.uploadedContract  && m?.minuteStatus === "PENDING"));
    setApprovedMinutes(minutes.filter((m: any)=> m?.uploadedMinutes && !m?.uploadedSignedMinutes && !m?.uploadedContract && m?.minuteStatus === "APPROVED"));
    setRejectedMinutes(minutes.filter((m: any)=> m?.uploadedMinutes && !m?.uploadedSignedMinutes && !m?.uploadedContract  && m?.minuteStatus === "REJECTED"));
    setNegotiatedMinutes(minutes.filter((m: any)=> m?.uploadedMinutes && !m?.uploadedSignedMinutes && !m?.uploadedContract  && m?.minuteStatus === "NEGOTIATED"));
  },[minutes])
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
        <div className="w-full">
          APPROVED
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
      accessorKey: "call",
      header: "Call",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.call?.title}</div>
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
          <Tabs.Tab value="minutes">Meeting minutes Uploaded</Tabs.Tab>
          <Tabs.Tab value="applications">
            Ready for Minutes Negotiations
          </Tabs.Tab>
          <Tabs.Tab value="approved">Approved meeting minutes</Tabs.Tab>
          <Tabs.Tab value="rejected">Rejected meeting minutes</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="minutes">
          <h1 className="text-base p-4 font-bold">Minutes Uploaded</h1>
          <DataTable
            columns={minuteColumns}
            data={uploadedMinutes}
            loading={loadingMinutes}
            noDataMessage="No Created Minutes"
          />
        </Tabs.Panel>

        <Tabs.Panel value="applications">
          <h1 className="text-base p-4 font-bold">
            {" "}
            Ready For Minutes Negotiations
          </h1>
          <DataTable
            columns={columns}
            data={readyForMinutesNegotiation}
            loading={loadingMinutes}
            noDataMessage="No Application ready for minute negotiation"
          />
        </Tabs.Panel>

        <Tabs.Panel value="approved">
          <h1 className="text-base p-4 font-bold">
            Approved minute negotiation
          </h1>
          <DataTable
            columns={approvedColumns}
            loading={loadingMinutes}
            data={approvedMinutes}
            noDataMessage="No Approved minute negotiation"
          />
        </Tabs.Panel>

        <Tabs.Panel value="rejected">
          <h1 className="text-base p-4 font-bold">
            Rejected minute negotiation
          </h1>
          <DataTable
            columns={rejectedColumns}
            data={rejectedMinutes}
            loading={loadingMinutes}
            noDataMessage="No Rejected Minute Negotiations"
          />
        </Tabs.Panel>
      </Tabs>

      {/* AddMinute Modal */}
      <AddMinute
        type={isMinute.type}
        data={isMinute.application}
        isOpenAddMinute={isMinute.isOpen}
        closeAddMinute={() =>
          setIsMinute({ isOpen: false, application: null, type: "" })
        }
      />
    </div>
  );
};

export default Page;
