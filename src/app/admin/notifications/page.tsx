"use client";
import React, { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import { ChangeEvent } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { CiSearch } from "react-icons/ci";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { HiDotsHorizontal } from "react-icons/hi";
import TableSkeleton from "@/components/core/data-table/TableSkeleton";

const Page = () => {
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    filters: {
      call: "",
      window: "",
      sector: "",
      stage: "",
      status: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { windows } = useSelector((state: any) => state.windows);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { calls } = useSelector((state: any) => state.calls);
  const { sectors } = useSelector((state: any) => state.sectors);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const { applicants, loading: applicantsLoading } = useSelector(
    (state: any) => state.applicants,
  );

  // const filterApplicants = () => {
  //   const query = `/applicant/filter?callId=${formData.filters.call}&windowId=${formData.filters.window}&sectorId=${formData.filters.sector}&stage=${formData.filters.stage}&status=${formData.filters.status}`;

  //   setLoading(true);
  //   authorizedApi
  //     .get(query)
  //     .then((response) => {
  //       const applicants = JSON.stringify(response.data.data.data) == "{}" ? [] : response.data.data.data;

  //       // Search logic for name, institution, email, phone
  //       const searchFilteredApplicants = applicants.filter((applicant: any) => {
  //         return (
  //           applicant.name.toLowerCase().includes(text.toLowerCase()) ||
  //           applicant.institution.toLowerCase().includes(text.toLowerCase()) ||
  //           applicant.email.toLowerCase().includes(text.toLowerCase()) ||
  //           applicant.phone.toLowerCase().includes(text.toLowerCase())
  //         );
  //       });

  //       setFilteredApplicants(searchFilteredApplicants);
  //     })
  //     .catch((error) => {

  //     })
  //     .finally(() => setLoading(false));
  // };

  // useEffect(() => {
  //   filterApplicants()
  // }, [formData.filters, text]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="w-full">{row.original?.name}</div>,
    },
    {
      accessorKey: "institution",
      header: "Institution Name",
      cell: ({ row }) => (
        <div className="w-full">{row.original?.institution}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="w-full">{row.original?.email}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div className="w-full">{row.original?.phone}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <button
            style={{
              background:
                "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
            }}
            className="p-3 rounded-full border text-white hover:bg-red-100"
          >
            <HiDotsHorizontal size={25} color="white" />
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsSubmitting(true);
    authorizedApi
      .post("/notifications", formData)
      .then((res) => {
        notifications.show({
          message: res.data.message,
          color: res.data.status === 204 ? "red" : "blue",
        });
        if (res.data.status !== 204) {
          setFormData({
            subject: "",
            message: "",
            filters: {
              call: "",
              window: "",
              sector: "",
              stage: "",
              status: "",
            },
          });
        }
      })
      .catch((error) => {
        notifications.show({
          message: error.response.data.message,
          color: "red",
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const FilterDropDown = ({
    placeholderText,
    data,
    onChange,
    value,
  }: {
    placeholderText: string;
    data: any[];
    onChange: (value: any) => void;
    value: string;
  }) => {
    return (
      <Select
        data={data}
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-base text-black rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black"
      />
    );
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Send Notifications</h1>
        <div className="flex items-center gap-3 w-4/5 overflow-x-auto">
          <div className="w-48">
            <FilterDropDown
              value={formData.filters.call}
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  filters: { ...formData.filters, call: value },
                })
              }
              placeholderText="Filter By Call"
              data={
                calls
                  ? calls.map((call: any) => ({
                      value: call.uuid,
                      label: call.title,
                    }))
                  : []
              }
            />
          </div>
          <div className="w-48">
            <FilterDropDown
              value={formData.filters.window}
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  filters: { ...formData.filters, window: value },
                })
              }
              placeholderText="Filter By Window"
              data={
                windows
                  ? windows.map((window: any) => ({
                      value: window.uuid,
                      label: window?.title,
                    }))
                  : []
              }
            />
          </div>
          <div className="w-48">
            <FilterDropDown
              value={formData.filters.sector}
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  filters: { ...formData.filters, sector: value },
                })
              }
              placeholderText="Filter By Sector"
              data={
                sectors
                  ? sectors.map((sector: any) => ({
                      value: sector.uuid,
                      label: sector?.name,
                    }))
                  : []
              }
            />
          </div>
          <div className="w-48">
            <FilterDropDown
              value={formData.filters.stage}
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  filters: { ...formData.filters, stage: value },
                })
              }
              placeholderText="Filter By Stage"
              data={[
                { value: "EVALUATION", label: "Evaluation" },
                { value: "DUE_DILIGENCY", label: "Due Diligency" },
                { value: "SDF_SECRETARIATE", label: "Sdf Secretariate" },
                { value: "GRANT_COMMITTEE", label: "Grand Committee" },
                { value: "CONTRACT_SIGNING", label: "Contract Signing" },
                {
                  value: "FINISH_GRANT_APPROVAL",
                  label: "Finish Grant Approval",
                },
              ]}
            />
          </div>
          <div className="w-48">
            <FilterDropDown
              value={formData.filters.status}
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  filters: { ...formData.filters, status: value },
                })
              }
              placeholderText="Filter By Status"
              data={[
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 w-full">
        <div className="pb-0 mt-5 w-full">
          <label className="block text-sm text-gray-600" htmlFor="subject">
            Subject:
          </label>
          <textarea
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-2 p-2 w-full border border-primary rounded-md shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-white"
          />
        </div>
        <label className="block text-sm text-gray-600" htmlFor="textarea">
          Comment:
        </label>
        <textarea
          id="textarea"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="mt-2 p-2 w-full border border-primary rounded-md shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 bg-white"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 mt-5 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <ClipLoader size={20} color="white" />
          ) : (
            "Send notification"
          )}
        </button>
      </form>
      {/* <div className="relative w-full my-5 flex justify-between">
        <h1 className="font-bold text-xl">Concerned Applicants</h1>
        <div className="relative w-[20rem]">
          <span className="absolute top-4 left-4">
            <CiSearch size={25} />
          </span>
          <input
            name="search"
            className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
            placeholder="Search"
            value={text}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="w-full h-full">
        {applicantsLoading || loading ? (
          <TableSkeleton columns={columns} />
        ) : filteredApplicants?.length === 0 ? (
          <h1 className="w-full text-center">No Applicants Found!</h1>
        ) : (
          <DataTable columns={columns} data={filteredApplicants ?? []} />
        )}
      </div> */}
    </div>
  );
};

export default Page;
