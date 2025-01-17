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
  getApplicationStatus,
  handleAddComments,
  handleDownloadFile,
  handleViewFile,
} from "@/services";
import GrantCommitteeDetails from "@/components/Modals/GrantCommitteeDetails";
import Form from "@/components/forms/Form";
import { Form as IForm, QuestionForm } from "@/types/questions-form";
import { ApplicationStage } from "@/types/application";
import GeneralCommentModal from "@/components/Modals/GeneralCommentModal";
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { stages } = useSelector((state: any) => state.empStages);
  const stagesArr = stages?.map((stage: any) => stage?.stage);
  const profile = useSelector((state: any) => state.auth);
  const [decisionsLoading, setDecisionsLoading] = useState(false);
  const [loading, setLoading] = useState<any>();
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
  const [
    isOpenGeneralCommentModal,
    { open: openGeneralCommentModal, close: closeGeneralCommentModal },
  ] = useDisclosure(false);
  const [selectedStage, setSelectedStage] = useState<
    "Evaluation" | "Due Diligence"
  >();
  const [generalCommentType, setGeneralCommentType] = useState<
    "EVALUATION" | "DUE_DILIGENCY"
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
    const foundSubWindow = Object.keys(
      JSON.parse(application?.call.subwindowForms || "{}")
    ).find((key: string) => key === application?.subWindow.uuid);

    return (
      form.uuid ===
      JSON.parse(application?.call.subwindowForms || "{}")[
        foundSubWindow as any
      ]
    );
  });
  const [comments, setComments] = useState<{ [key: string]: any }>({});

  const hasCommentableQuestion = (): boolean => {
    try {
      if (!form.qns) {
        throw new Error("The form structure is invalid or missing questions.");
      }
      const questionForm: QuestionForm = JSON.parse(form.qns);
      for (const [sectionKey, section] of Object.entries(questionForm)) {
        for (const page of section.pages) {
          for (const question of page.questions) {
            if (question.commentable) {
              return true;
            }
          }
        }
      }
      return false;
    } catch (error: any) {
      throw new Error(
        `An error occurred while checking commentable questions: ${error.message}`
      );
    }
  };

  const [downloading, setDownloading] = useState(false);

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
                  color: "green",
                });
              } catch (error) {
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
                Sector
              </p>
              <p>{application?.sector?.name}</p>
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
                    "business_certificates"
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
      </div>
      <div className="flex gap-6">
        <div
          className={`flex  ${getApplicationStatus(application) === "ANSWERING" ? "w-full" : "w-[70%]"} gap-4 `}
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
            {hasCommentableQuestion() &&
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
                      setLoading("save");
                      handleAddComments(
                        "save",
                        comments,
                        form,
                        application,
                        () => fetchApplication()
                      );
                      setLoading(null);
                    }}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading == "save" ? "Loading..." : "Save Comments"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setLoading("submit");
                      handleAddComments(
                        "submit",
                        comments,
                        form,
                        application,
                        () => fetchApplication()
                      );
                      setLoading(null);
                    }}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading === "submit" ? "Loading..." : "Submit Comments"}
                  </button>
                </div>
              )}
          </div>
        </div>
        {decisionsLoading ? (
          <div className="flex  h-[500px] items-center justify-center bg-white w-[30%] rounded-2xl p-5 gap-4">
            <p>Loading ....</p>
          </div>
        ) : getApplicationStatus(application) === "ANSWERING" ? (
          <div></div>
        ) : (
          <div className="flex flex-col bg-white w-[30%] rounded-2xl p-5 gap-4">
            <h2 className="font-bold">Decision</h2>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Evaluation Stage</h3>
              <div
                className={`font-medium  ${
                  application?.stages?.find(
                    (stage: any) => stage.stage === ApplicationStage.EVALUATION
                  )?.status !== "REJECTED"
                    ? "bg-[#4BC500] text-[#4BC500]"
                    : "bg-red-600 text-red-600"
                } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
              >
                {application?.stages?.find(
                  (stage: any) => stage.stage === ApplicationStage.EVALUATION
                )?.status ?? "PENDING"}
              </div>
              {application?.evaluationDecisions?.length < 3 &&
                !application?.evaluationDecisions?.find(
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

              {application?.evaluationDecisions?.length == 3 && (
                <>
                  <div
                    onClick={() => {
                      setGeneralCommentType("EVALUATION");
                      openGeneralCommentModal();
                    }}
                    className="flex items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
                  >
                    <p>
                      {application?.evaluationFinalDecision
                        ? "View general comment"
                        : "Provide a general comment"}
                    </p>
                  </div>
                </>
              )}

              {application?.evaluationDecisions?.length > 0 && (
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
            {application?.currentStage !== ApplicationStage.EVALUATION &&
              stagesArr?.includes(ApplicationStage.DUE_DILIGENCY) && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold">Due Diligence Stage</h3>
                  <div
                    className={`font-medium  ${
                      application?.stages?.find(
                        (stage: any) =>
                          stage.stage === ApplicationStage.DUE_DILIGENCY
                      )?.status !== "REJECTED"
                        ? "bg-[#4BC500] text-[#4BC500]"
                        : "bg-red-600 text-red-600"
                    } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
                  >
                    {application?.stages?.find(
                      (stage: any) =>
                        stage.stage === ApplicationStage.DUE_DILIGENCY
                    )?.status ?? "PENDING"}
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
                  {application?.duediligencyDecisions?.length == 3 &&
                    !application?.dueFinalDecision && (
                      <>
                        <div
                          onClick={() => {
                            setGeneralCommentType("DUE_DILIGENCY");
                            openGeneralCommentModal();
                          }}
                          className="flex items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
                        >
                          <p>Provide a general comment</p>
                        </div>
                      </>
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
        firstEvaluationModal={application?.evaluationDecisions?.length === 0}
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
      <GeneralCommentModal
        isOpen={isOpenGeneralCommentModal}
        close={closeGeneralCommentModal}
        onClose={() => fetchApplication()}
        application={application}
        type={generalCommentType as any}
      />
    </div>
  );
};

export default Page;
