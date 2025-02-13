/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { SolarPen2Bold } from "@/components/core/icons";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import EvaluationDetails from "@/components/Modals/EvaluationDetails";
import { useDisclosure } from "@mantine/hooks";
import MakeGrantCommitteeDecision from "@/components/Modals/MakeGrantCommitteeDecision";
import DueDiligenceModal from "@/components/Modals/DueDiigence";
import {
  getApplicationStatus,
  handleDownloadFile,
  handleViewFile,
} from "@/services";
import Form from "@/components/forms/Form";
import DueDiligencyDetails from "@/components/Modals/DueDiligencyDetails";
import { ApplicationStage } from "@/types/application";
import DecisionsBox from "./DecisionsBox";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const forms = useSelector((state: any) => state.forms);
  const [
    isOpenEvaluationDetails,
    { open: openEvaluationDetails, close: closeEvaluationDetails },
  ] = useDisclosure(false);
  const [
    isOpenDueDiligencyDetails,
    { open: openDueDiligencyDetails, close: closeDueDiligencyDetails },
  ] = useDisclosure(false);
  const [
    isOpenGrantCommitteeDetails,
    { open: openGrantCommitteeDetails, close: closeGrantCommitteeDetails },
  ] = useDisclosure(false);

  const [downloading, setDownloading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [application, setApplication] = useState<any>();
  const { stages } = useSelector((state: any) => state.empStages);
  const stagesArr = stages?.map((stage: any) => stage?.stage);
  const form = forms.forms.find((form: any) => {
    const foundSubWindow = Object.keys(
      JSON.parse(application?.call.subwindowForms || "{}"),
    ).find((key: string) => key === application?.subWindow.uuid);

    return (
      form.uuid ===
      JSON.parse(application?.call.subwindowForms || "{}")[
        foundSubWindow as any
      ]
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
                Sector
              </p>
              <p>{application?.sectors?.[0]?.name}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Sub Window
              </p>
              <p>{application?.subWindow?.title}</p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Trade
              </p>
              <p>{application?.trades?.[0]?.trade?.title}</p>
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
            <div className="flex items-center gap-2">
              <div
                className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4 py-2 items-center justify-center cursor-pointer"
                onClick={() =>
                  handleViewFile(
                    application?.applicant?.businesses[0]?.businessCertificate,
                    "business_certificates",
                  )
                }
              >
                <span>
                  <SolarPen2Bold />
                </span>
                <div>View Certificate</div>
              </div>
              <div
                className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4 py-2 items-center justify-center cursor-pointer"
                onClick={() =>
                  handleDownloadFile(
                    application?.applicant?.businesses[0]?.businessCertificate,
                    "business_certificates",
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
      <div className="flex gap-2 ">
        <div
          className={`flex  rounded-2xl ${getApplicationStatus(application) === "ANSWERING" ? "w-full" : "w-[70%]"}   `}
        >
          {form && (
            <Form
              mode={"viewing"}
              answers={JSON.parse(application.answers)}
              comments={JSON.parse(application.comments)}
              formData={{
                name: form?.name,
                qns: JSON.parse(form?.qns || "{}"),
              }}
            />
          )}
        </div>

        {getApplicationStatus(application) === "ANSWERING" ? (
          <div></div>
        ) : (
          <DecisionsBox
            application={application}
            openDueDiligencyDetails={openDueDiligencyDetails}
            openEvaluationDetails={openEvaluationDetails}
            stagesArr={stagesArr}
            openGrantCommitteeDetails={openGrantCommitteeDetails}
          />
        )}
      </div>
      <DueDiligencyDetails
        application={application}
        opened={isOpenDueDiligencyDetails}
        close={closeDueDiligencyDetails}
        decisions={application?.duediligencyDecisions}
      />
      <MakeGrantCommitteeDecision
        application={application}
        closeModal={closeGrantCommitteeDetails}
        isOpen={isOpenGrantCommitteeDetails}
        onMakeDecision={() => {}}
      />
      <EvaluationDetails
        opened={isOpenEvaluationDetails}
        close={closeEvaluationDetails}
        evaluations={application?.evaluationDecisions}
        application={application}
      />
    </div>
  );
};

export default Page;
