"use client";
import React, { useEffect, useState } from "react";
import { Form as IForm } from "@/types/surveys-form";
import SurveyForms from "@/components/forms/SurveyForms";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";

const Page = () => {
  const [surveys, setSurveys] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await authorizedApi.get("/surveys");
      const surveyData = response.data.data.map((survey: any) => ({
        ...survey,
        qns: JSON.parse(survey.qns || "{}"),
      }));
      setSurveys(surveyData);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch surveys",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full !overflow-x-hidden">
      <div className="flex items-center justify-between my-4">
        <p className="text-2xl font-bold">Available Surveys</p>
      </div>
      {surveys.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No surveys available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {surveys.map((survey) => (
            <div key={survey.uuid} className="bg-white rounded-lg shadow p-6">
              <SurveyForms
                mode="viewing"
                formData={survey}
                setFormData={() => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
