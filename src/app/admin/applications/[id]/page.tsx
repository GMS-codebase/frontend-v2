/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  SolarPen2Bold,
} from "@/components/core/icons";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import EvaluationDetails from "@/components/Modals/EvaluationDetails";
import { useDisclosure } from "@mantine/hooks";
import MakeGrantCommitteeDecision from "@/components/Modals/MakeGrantCommitteeDecision";
import DueDiligenceModal from "@/components/Modals/DueDiigence";
import { handleDownloadFile } from "@/utils/funcs";
import Form from "@/components/forms/Form";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const forms = useSelector((state: any) => state.forms);

  const [isOpenAddDue, setIsOpenAddDue] = useState(false);
  const openAddDue = () => setIsOpenAddDue(true);
  const closeAddDue = () => setIsOpenAddDue(false);
  const [
    isOpenEvaluationDetails,
    { open: openEvaluationDetails, close: closeEvaluationDetails },
  ] = useDisclosure(false);
  const [
    isOpenGrantCommitteeDetails,
    { open: openGrantCommitteeDetails, close: closeGrantCommitteeDetails },
  ] = useDisclosure(false);
  const [
    isOpenGrantCommitteeMakeDecision,
    {
      open: openGrantCommitteeMakeDecision,
      close: closeGrantCommitteeMakeDecision,
    },
  ] = useDisclosure(false);

  const [downloading, setDownloading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [application, setApplication] = useState<any>();
  const form = forms.forms.find((form: any) => {
    const foundSubWindow = Object.keys(
      JSON.parse(application?.call.subwindowForms || "{}")
    ).find((key: string) => key === application?.subWindow.uuid);

    return (
      form.uuid ===
      JSON.parse(application?.call.subwindowForms || "{}")[foundSubWindow as any]
    );
  });


  const fetchApplication = async () => {
    setApplicationLoading(true);
    try {
      const res = await authorizedApi.get(`/application/get-application/${id}`);
      setApplication(res.data.data.data);
      setApplicationLoading(false);
    } catch (error: any) {
      if (error.response?.status === 404) {
        window.history.back();
      }
    }
  };
  useEffect(() => {
    fetchApplication();
  }, [id]);

  if (applicationLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm">
        Loading ...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl">
      <div className="bg-white rounded-2xl gap-6 p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-black font-semibold">Legal status</h2>
          <div
            className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
            onClick={async (): Promise<void> => {
              setDownloading(true);
              try {
                const response = await authorizedApi.get(
                  `/admin/applicant-details/${application?.applicant?.uuid}`,
                  {
                    responseType: "blob",
                  }
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
                  type: "success",
                });
              } catch (error) {
                console.error("Download error:", error);
                notifications.show({
                  title: "Download Failed",
                  message:
                    "There was an issue downloading the file. Please try again.",
                  type: "error",
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

        <div className="flex justify-between items-start mt-5">
          <div className="flex flex-col justify-start items-start gap-6 font-semibold w-1/2">
            <h1 className="text-2xl font-bold">Application Information</h1>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                Application number
              </p>
              <p>{application?.applicationNumber}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Call
              </p>
              <p>{application?.call?.title}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Window
              </p>
              <p>{application?.window?.title}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Application submission date
              </p>
              <p>{new Date(application?.doneAt)?.toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3 justify-start items-center font-semibold">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                Finished answering
              </p>
              <p>{application?.finishedAnswering === true ? "YES" : "NO"}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                Submitted
              </p>
              <p>{application?.finishedAnswering === true ? "YES" : "NO"}</p>
            </div>
            <div className="flex flex-col gap-4 font-semibold">
              <h2 className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start w-fit">
                Description
              </h2>
              <div>{application?.description}</div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-6 font-semibold w-1/2">
            <h1 className="text-2xl font-bold">Applicant Information</h1>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Applicant name
              </p>
              <p>{application?.applicant?.name}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Applicant&apos;s Phone Number
              </p>
              <p>{application?.applicant?.phone}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Institution name
              </p>
              <p>
                {application?.applicant?.businesses &&
                  application?.applicant?.businesses[0]?.businessName}
              </p>
            </div>
            <div
              className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4 py-2 items-center justify-center cursor-pointer"
              onClick={() =>
                handleDownloadFile(
                  application?.applicant?.businesses[0]?.businessCertificate,
                  "business_certificates"
                )
              }
            >
              {downloading ? (
                <p>Loading ....</p>
              ) : (
                <>
                  <span>
                    <SolarPen2Bold />
                  </span>
                  <div>Download Certificate</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col gap-4 font-semibold">
            <h2 className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start w-fit">
              Description
            </h2>
            <div>{application?.description}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 p-5">
        <div
          className={`flex bg-white rounded-2xl ${application?.currentStage === "SUBMITTED" ? "w-full" : "w-[70%]"}  gap-4 p-5`}
        >
          {form && <Form
            mode={"viewing"}
            answers={JSON.parse(application.answers)}
            comments={JSON.parse(application.comments)}
            formData={{name:form?.name,qns:JSON.parse(form?.qns || "{}")}}
          />}
        </div>

        {application?.currentStage === "SUBMITTED" ? (
          <div></div>
        ) : (
          <div className="flex flex-col bg-white w-[30%] rounded-2xl p-5 gap-4">
            <h2 className="font-bold">Decision</h2>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Evaluation Stage</h3>
              <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
                {application?.currentStage === "EVALUATION"
                  ? "Pending"
                  : "APPROVED"}
              </div>
              {application?.evaluationDecisions && (
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={openEvaluationDetails}
                    className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                  >
                    View details
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold">Due Diligence Stage</h3>
              <div
                className={`font-medium  ${
                  application?.status === "APPROVED" ||
                  application?.currentStage !== "EVALUATION"
                    ? "bg-[#4BC500] text-[#4BC500]"
                    : application?.status === "PENDING"
                      ? "bg-red-600 text-red-600"
                      : ""
                } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
              >
                {application?.currentStage !== "EVALUATION" &&
                application?.currentStage !== "DUE_DILIGENCY"
                  ? "APPROVED"
                  : application?.status}
              </div>
              {application?.currentStage !== "DUE_DILIGENCY" && (
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={openAddDue}
                    className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                  >
                    View details
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Grant Committee</h3>
              <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
                {!application?.grantCommitteeDecision ? "Pending" : "APPROVED"}
              </div>

              {application?.grantCommitteeDecision && (
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={openGrantCommitteeDetails}
                    className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                  >
                    View details
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <DueDiligenceModal
        application={application}
        opened={isOpenAddDue}
        close={closeAddDue}
      />
      <MakeGrantCommitteeDecision
        application={application}
        closeModal={closeGrantCommitteeMakeDecision}
        isOpen={isOpenGrantCommitteeMakeDecision}
        onMakeDecision={() => {}}
      />
      <EvaluationDetails
        opened={isOpenEvaluationDetails}
        close={closeEvaluationDetails}
        evaluations={
          application?.evaluationDecisions?.length &&
          application?.evaluators?.length
            ? application?.evaluationDecisions?.map(
                (decision: any, index: any) => ({
                  evaluator: application?.evaluators[index],
                  evaluationDecision: decision,
                })
              )
            : []
        }
        application={application}
      />
    </div>
  );
};

export default Page;
