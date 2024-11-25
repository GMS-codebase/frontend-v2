"use client";
import React, { useEffect, useState } from "react";
import { SolarPen2Bold } from "@/components/core/icons";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import MakeDecision from "@/components/Modals/MakeDecision";
import EvaluationDetails from "@/components/Modals/EvaluationDetails";
import { useDisclosure } from "@mantine/hooks";
import MakeFirstDueDiligencyDecision from "@/components/Modals/MakeFirstDueDiligencyDecision";
import DueDiligencyDetails from "@/components/Modals/DueDiligencyDetails";
import {
  getApplications,
  handleAddComments,
  handleDownloadFile,
} from "@/utils/funcs";
import GrantCommitteeDetails from "@/components/Modals/GrantCommitteeDetails";
import Form from "@/components/forms/Form";
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { stages } = useSelector((state: any) => state.empStages);
  const stagesArr = stages?.map((stage: any) => stage?.stage);
  const profile = useSelector((state: any) => state.auth);
  const [decisionsLoading, setDecisionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const forms = useSelector((state: any) => state.forms);
  const [applicationLoading, setApplicationLoading] = useState(true);

  const [
    isOpenEvaluationDetails,
    { open: openEvaluationDetails, close: closeEvaluationDetails },
  ] = useDisclosure(false);
  const [application, setApplication] = useState<any>();
  const [
    isOpenDueDiligencyDetails,
    { open: openDueDiligencyDetails, close: closeDueDiligencyDetails },
  ] = useDisclosure(false);
  const [
    isOpenMakeDecision,
    { open: openMakeDecision, close: closeMakeDecision },
  ] = useDisclosure(false);
  const [
    isOpenGrantCommitteeDetails,
    { open: openGrantCommitteeDetails, close: closeGrantCommitteeDetails },
  ] = useDisclosure(false);
  const [
    isOpenMakeFirstDueDiligencyDecision,
    {
      open: openMakeFirstDueDiligencyDecision,
      close: closeMakeFirstDueDiligencyDecision,
    },
  ] = useDisclosure(false);
  const [selectedStage, setSelectedStage] = useState<
    "Evaluation" | "Due Diligence"
  >();
  const fetchApplication = async () => {
    setApplicationLoading(true);
    try {
      const res = await authorizedApi.get(`/application/get-application/${id}`);
      setApplication(res.data.data.data);
      setComments(JSON.parse(res.data.data.data.comments));
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
  const form = forms.forms.find((form: any) => {
    const foundSubWindow = form?.subWindows?.find((subW: any) => {
      const isMatch = subW?.uuid === application?.subWindow?.uuid;
      return isMatch;
    });
    return foundSubWindow != null;
  });
  const [comments, setComments] = useState<{ [key: string]: any }>({});

  const [downloading, setDownloading] = useState(false);

  if (applicationLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm">
        Loading ...
      </div>
    );
  }
  console.log(application);
  console.log(Object.values(JSON.parse(application?.comments || "{}")).length);
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
                  `/admin/applicant-details/${application?.applicant?.uuid ?? id}`,
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

          <div className="flex flex-col justify-start items-start gap-6 font-semibold w-1/2 ml-7">
            <h1 className="text-2xl font-bold">Applicant Information</h1>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Applicant name
              </p>
              <p>{application?.applicant.name}</p>
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
      </div>
      <div className="flex gap-6">
        <div
          className={`flex  ${application?.currentStage === "SUBMITTED" ? "w-full" : "w-[70%]"} gap-4 `}
        >
          <div className="flex flex-col gap-4 w-full">
            {form && (
              <Form
                mode={
                  Object.values(JSON.parse(application?.comments || "{}"))
                    .length === 0
                    ? "commenting"
                    : "viewing"
                }
                answers={JSON.parse(application.answers)}
                comments={comments}
                setComments={
                  Object.values(JSON.parse(application?.comments || "{}"))
                    .length === 0
                    ? (key: string, value: any) =>
                        setComments({ ...comments, [key]: value })
                    : undefined
                }
                formData={{
                  name: form?.name,
                  qns: JSON.parse(form?.qns || "{}"),
                }}
              />
            )}
            {(
              Object.values(JSON.parse(application?.comments || "{}"))
                .length === 0
            ) &&
              application?.currentStage !== "SUBMITTED" && (
                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setLoading(true);
                      handleAddComments(comments, form, application, () =>
                        fetchApplication()
                      );
                      setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading ? "Loading..." : "Save Comments"}
                  </button>
                </div>
              )}
          </div>
        </div>
        {decisionsLoading ? (
          <div className="flex  h-[500px] items-center justify-center bg-white w-[30%] rounded-2xl p-5 gap-4">
            <p>Loading ....</p>
          </div>
        ) : application?.currentStage === "SUBMITTED" ? (
          <div></div>
        ) : (
          <div className="flex flex-col bg-white w-[30%] rounded-2xl p-5 gap-4">
            <h2 className="font-bold">Decision</h2>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Evaluation Stage</h3>
              <div
                className={`font-medium  ${
                  application?.stages?.find(
                    (stage: any) => stage.stage === "EVALUATION"
                  )?.status === "APPROVED"
                    ? "bg-[#4BC500] text-[#4BC500]"
                    : application?.status === "PENDING"
                      ? "bg-red-600 text-red-600"
                      : ""
                } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
              >
                {
                  application?.stages?.find(
                    (stage: any) => stage.stage === "EVALUATION"
                  )?.status
                }
              </div>
              {application?.evaluationDecisions.length < 3 &&
                !application?.evaluationDecisions.find(
                  (ev: any) =>
                    ev.employee.user_id.toString() ===
                    profile?.userProfile?.data.uuid.toString()
                ) && (
                  <>
                    <div
                      onClick={() => {
                        setSelectedStage("Evaluation");
                        openMakeDecision();
                      }}
                      className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
                    >
                      <p>Make a decision</p>
                    </div>
                  </>
                )}

              {application?.evaluationDecisions.length > 0 && (
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
            {application?.currentStage !== "EVALUATION" &&
              stagesArr?.includes("DUE_DILIGENCY") && (
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
                  {application?.duediligencyDecisions?.length < 4 &&
                    !application?.duediligencyDecisions.find(
                      (dec: any) =>
                        dec?.employee?.user_id ===
                        profile?.userProfile?.data.uuid
                    ) && (
                      <div
                        onClick={() => {
                          setSelectedStage("Due Diligence");
                          if (
                            !application?.duediligencyForm &&
                            application?.duediligencyDecisions?.length < 2
                          ) {
                            openMakeFirstDueDiligencyDecision();
                          } else {
                            openMakeDecision();
                          }
                        }}
                        className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
                      >
                        <p>Make a decision</p>
                      </div>
                    )}
                  {application?.duediligencyForm && (
                    <div className="flex flex-col gap-2 mt-4">
                      <button
                        onClick={openDueDiligencyDetails}
                        className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                      >
                        View details
                      </button>
                    </div>
                  )}
                </div>
              )}
            {application?.stages?.find(
              (stage: any) => stage?.stage === "GRANT_COMMITTEE"
            ) && (
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Grant Committee</h3>
                <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
                  {!application?.grantCommitteeDecision
                    ? "Pending"
                    : "APPROVED"}
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
            )}
          </div>
        )}
      </div>
      <MakeFirstDueDiligencyDecision
        application={application}
        closeModal={closeMakeFirstDueDiligencyDecision}
        afterMakeDecision={fetchApplication}
        isOpenModal={isOpenMakeFirstDueDiligencyDecision}
      />
      <DueDiligencyDetails
        application={application}
        opened={isOpenDueDiligencyDetails}
        close={closeDueDiligencyDetails}
        decisions={application?.duediligencyDecisions}
      />
      <MakeDecision
        type={selectedStage as any}
        firstEvaluationModal={application?.evaluationDecisions.length === 0}
        application={application}
        isOpen={isOpenMakeDecision}
        close={closeMakeDecision}
        onMakeDecision={() => fetchApplication()}
      />
      <GrantCommitteeDetails
        application={application}
        close={closeGrantCommitteeDetails}
        opened={isOpenGrantCommitteeDetails}
      />
      <EvaluationDetails
        opened={isOpenEvaluationDetails}
        close={closeEvaluationDetails}
        evaluations={application?.evaluationDecisions || []}
        application={application}
      />
    </div>
  );
};

export default Page;
