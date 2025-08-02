"use client";
import React, { useState } from "react";
import { SolarPen2Bold } from "@/components/core/icons";
import ApplicantTable from "./IndexTable";
import { authorizedApi } from "@/utils/api";
import { useParams } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { Applicant } from "@/types";
const Page = () => {
  const { id } = useParams();
  const [downloading, setDownloading] = useState(false);
  const applicants = useSelector((state: any) => state.applicants);
  const applicant = applicants.applicants.filter(
    (app: Applicant) => app.uuid === id,
  )[0];

  return (
    <div className="">
      <div className="bg-white rounded-2xl p-10 mb-10 flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Legal Status</div>
            <div
              className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
              onClick={async (): Promise<void> => {
                setDownloading(true);
                try {
                  const response = await authorizedApi.get(
                    `/admin/applicant-details/${id}`,
                    {
                      responseType: "blob",
                    },
                  );
                  const contentDisposition =
                    response.headers["content-disposition"];
                  const fileNameMatch =
                    contentDisposition?.match(/filename="(.+)"/);
                  const fileName = fileNameMatch
                    ? fileNameMatch[1]
                    : "applicant-data";
                  const blob = new Blob([response.data], {
                    type: response.data.type,
                  });
                  const downloadUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = downloadUrl;
                  link.download = fileName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(downloadUrl);
                  notifications.show({
                    title: "Download Successful",
                    message: "The file has been downloaded successfully.",
                    color: "green",
                  });
                } catch (error) {
                  console.error("Download error:", error);
                  notifications.show({
                    title: "Download Failed",
                    message:
                      "There was an issue downloading the file. Please try again.",
                    color: "red",
                  });
                } finally {
                  setDownloading(false);
                }
              }}
            >
              {downloading ? (
                <p>Loading ....</p>
              ) : (
                <>
                  <span>
                    <SolarPen2Bold />
                  </span>
                  <div>Export Applicant Details</div>
                </>
              )}
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Institution Name</div>
              </div>
              <div className="mt-2 ml-4">
                {applicant?.businesses[0]?.businessName || ""}
              </div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Institution Type </div>
              </div>
              <div className="mt-2 ml-4">
                {applicant?.businesses[0].businessType || ""}
              </div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Phone</div>
              </div>
              <div className="mt-2 ml-4">{applicant?.phone}</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Email</div>
              </div>
              <div className="mt-2 ml-4">{applicant?.email}</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>TIN</div>
              </div>
              <div className="mt-2 ml-4">
                {applicant?.businesses[0].tinNumber}
              </div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Bank</div>
              </div>
              <div className="mt-2 ml-4">
                {applicant?.businesses[0].bankName}
              </div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>PO Box</div>
              </div>
              <div className="mt-2 ml-4">{applicant?.po_box}</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Registration date</div>
              </div>
              <div className="mt-2 ml-4">
                {new Date(applicant?.done_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Bank Account</div>
              </div>
              <div className="mt-2 ml-4">{applicant?.businesses[0].bank}</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Year of estabrishment</div>
              </div>
              <div className="mt-2 ml-4">2013</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Number of Employee</div>
              </div>
              <div className="mt-2 ml-4">8</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Address</div>
              </div>
              <div className="mt-2 ml-4">
                Rutare-gicumbi district-northern province-Rwanda{" "}
              </div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Institution Name</div>
              </div>
              <div className="mt-2 ml-4">Butare Tvet</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Institution Name</div>
              </div>
              <div className="mt-2 ml-4">Butare Tvet</div>
            </div>
          </div>
        </div>
      </div>
      <ApplicantTable />
    </div>
  );
};

export default Page;
