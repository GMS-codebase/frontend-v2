"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form as IForm } from "@/types/surveys-form";
import SurveyForms from "@/components/forms/SurveyForms";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ADD_FORM_SUCCESS, UPDATE_FORM_SUCCESS } from "@/actions/FormsActions";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const surveys = useSelector((state: any) => state.surveys);
  const survey = surveys.surveys.find((survey: IForm) => survey.uuid === id);
  const [surveyData, setSurveyData] = useState<IForm | null>();
  const dispatch = useDispatch();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (survey) {
      setSurveyData({
        ...surveyData,
        name: survey?.name || "",
        qns: JSON.parse(survey?.qns || "{}"),
      });
    }
    setPageLoading(false);
  }, [survey, id]);

  if (surveys.loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading</div>
    );
  }
  return (
    <div className="w-full !overflow-x-hidden">
      <p className="text-2xl font-semibold text-gray-800">{survey.name}</p>
      <SurveyForms
        mode="viewing"
        formData={surveyData as any}
        setFormData={setSurveyData as any}
      />
    </div>
  );
};

export default Page;
