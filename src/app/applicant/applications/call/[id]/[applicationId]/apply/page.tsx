"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { IoIosSave } from "react-icons/io";
import { useRouter } from "next/navigation";
import { getMyApplications, handleSubmit } from "@/utils/funcs";
import Form from "@/components/forms/Form";
import { useDispatch } from "react-redux";

const Page = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const { id, applicationId } = useParams();
  const [loading, setLoading] = useState<any>();
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [application, setApplication] = useState<any>();
  const fetchApplication = async () => {
    setApplicationLoading(true);
    try {
      const res = await authorizedApi.get(
        `/application/get-application/${applicationId}`,
      );
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
  }, [applicationId]);

  useEffect(() => {
    if (application) {
      setAnswers(JSON.parse(application?.answers || "{}"));
    }
  }, [application]);
  const dispatch = useDispatch();

  const forms = useSelector((state: any) => state.forms);
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

  if (applicationLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 w-full  ">
        <div className=" flex justify-between items-center">
          <p className="font-semibold text-2xl">Questions and answers</p>
        </div>
        {form && (
          <Form
            mode="answering"
            formData={{ name: form?.name, qns: JSON.parse(form?.qns || "{}") }}
            answers={answers}
            setAnswers={(key: string, value: any) => {
              setAnswers({ ...answers, [key]: value });
            }}
          />
        )}
        <div className="w-full flex justify-center mt-4 space-x-4">
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Here");
              console.log(application);
              handleSubmit(
                "submit",
                setLoading,
                answers,
                application,
                form,
                () => {
                  getMyApplications(dispatch);
                  router.push("/applicant/applications");
                },
              );
            }}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary text-white
              `}
          >
            {loading ? "Loading..." : "Send Application"}
          </button>
            <button
            className="bg-primary text-white text-center justify-center w-full px-4 py-2 flex items-center gap-2 rounded-full "
            onClick={() => {
              handleSubmit("save", setLoading, answers, application, form);
            }}
            disabled={loading === "save"}
          >
            {loading === "save" ? (
              <p>Loading...</p>
            ) : (
              <>
                <IoIosSave />
                <p className="">Save Draft</p>
              </>
            )}
          </button>
        </div>
         
      </div>
    </div>
  );
};

export default Page;
