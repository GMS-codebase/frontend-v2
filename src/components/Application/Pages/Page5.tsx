import React from "react";
import { Comments } from "@/types";
import { handleDownloadFile } from "@/utils/funcs";

export const Page5 = ({
  data,
  setData,
  comments,
  setComments,
  isApplicant,
}: {
  data: any;
  setData?: any;
  comments?: Comments;
  setComments?: any;
  isApplicant?: boolean;
}) => {
  return (
    <>
      <div className="">
        <h3 className="text-lg font-bold">Sustainability</h3>
        <p className="text-sm text-gray-600">
          How will your project (the planned training activity) continue after
          this funding?
        </p>
        {
          <textarea
            value={(data && data.sustainability) || ""}
            onChange={(e) => setData("sustainability", e.target.value)}
            className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
            disabled={!!comments || !setData}
          />
        }
        {!isApplicant && comments && (
          <div className="mt-2">
            <h4 className="text-md font-semibold text-gray-700">Comment</h4>
            <textarea
              value={comments.sustainabilityComment || ""}
              onChange={(e) =>
                setComments &&
                setComments({
                  ...comments,
                  sustainabilityComment: e.target.value,
                })
              }
              className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
              disabled={!setComments}
            />
          </div>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-bold">Previous financial Report</h3>
        <p className="text-sm text-gray-600">
          Provide the financial report of the previous year.
        </p>
        {comments || !setData ? (
          <>
            <button
              onClick={() =>
                handleDownloadFile(
                  data?.previousFinancialReportAttachment,
                  "applications",
                )
              }
              className="bg-primary rounded-2xl  my-2 text-white font-semibold w-full py-2"
            >
              {data?.previousFinancialReportAttachment
                ? "Download File"
                : "No Report Found!"}
            </button>
            {!isApplicant && comments && (
              <div className="mt-2">
                <h4 className="text-md font-semibold text-gray-700">Comment</h4>
                <textarea
                  value={comments?.previousFinancialReportComment || ""}
                  onChange={(e) =>
                    setComments &&
                    setComments({
                      ...comments,
                      previousFinancialReportComment: e.target.value,
                    })
                  }
                  className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
                  disabled={!setComments}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
            <label
              htmlFor="file-upload-previousFinancialReportAttachment"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold">+</span>
              </div>
              {data.previousFinancialReportAttachment ? (
                <div className="text-center">
                  <p className="text-xl font-medium text-gray-700">
                    {data.previousFinancialReportAttachment.name}
                  </p>
                  <p className="text-sm text-gray-500">File selected</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-md text-gray-500">Upload file</p>
                  <p className="text-md text-gray-400">or drag and drop</p>
                </div>
              )}
            </label>
            <input
              id="file-upload-previousFinancialReportAttachment"
              name="previousFinancialReportAttachment"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) =>
                setData(
                  "previousFinancialReportAttachment",
                  e.target.files ? e.target.files[0] : null,
                )
              }
            />
          </div>
        )}
      </div>

      <div className="">
        <h3 className="text-lg font-bold">Contribution from the applicant</h3>
        <p className="text-sm text-gray-600">
          Justify how your institution will contribute to facilitate the
          training.
        </p>
        <textarea
          value={(data && data.contributionFromApplicant) || ""}
          onChange={(e) => setData("contributionFromApplicant", e.target.value)}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
          disabled={!!comments || !setData}
        />
        {!isApplicant && comments && (
          <div className="mt-2">
            <h4 className="text-md font-semibold text-gray-700">Comment</h4>
            <textarea
              value={comments.contributionFromApplicantComment || ""}
              onChange={(e) =>
                setComments &&
                setComments({
                  ...comments,
                  contributionFromApplicantComment: e.target.value,
                })
              }
              className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
              disabled={!setComments}
            />
          </div>
        )}
      </div>
    </>
  );
};
