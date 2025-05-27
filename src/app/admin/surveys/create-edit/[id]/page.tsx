"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Form as IForm, SurveyForm, ESurveyType } from "@/types/surveys-form";
import SurveyForms from "@/components/forms/SurveyForms";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ADD_FORM_SUCCESS, UPDATE_FORM_SUCCESS } from "@/actions/FormsActions";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const forms = useSelector((state: any) => state.forms);
  const form = forms.forms.find((form: IForm) => form.uuid === id);
  const [formData, setFormData] = useState<IForm | null>();
  const dispatch = useDispatch();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch single survey when editing
  const fetchSurvey = useCallback(
    async (surveyId: string) => {
      if (surveyId === "create") return;

      try {
        const response = await authorizedApi.get(
          `/survey/single-survey/${surveyId}`
        );
        const surveyData = response.data;

        // Transform API response to form structure
        let parsedQns;
        try {
          if (typeof surveyData.qns === "string") {
            const parsed = JSON.parse(surveyData.qns);

            // Check if it's the expected SurveyForm structure
            if (Array.isArray(parsed)) {
              // If it's an array (old format), transform to expected structure
              parsedQns = {
                general: {
                  name: "general",
                  description: "General Questions",
                  pages: [
                    {
                      surveys: parsed.map((item: any, index: number) => ({
                        id: `general-q-0-${index}`,
                        title:
                          item.question ||
                          item.title ||
                          `Question ${index + 1}`,
                        description: item.description || "",
                        type: item.type || "text",
                        required: item.required || false,
                        commentable: item.commentable || false,
                        choices: item.choices || [],
                        columns: item.columns || [],
                      })),
                    },
                  ],
                },
              };
            } else if (typeof parsed === "object" && parsed !== null) {
              // If it's already in the correct format
              parsedQns = parsed;
            } else {
              // Fallback to empty structure
              parsedQns = {};
            }
          } else {
            parsedQns = surveyData.qns || {};
          }
        } catch (parseError) {
          console.warn("Failed to parse survey questions:", parseError);
          parsedQns = {};
        }

        const transformedSurvey: IForm = {
          uuid: surveyData.id.toString(),
          id: surveyData.id,
          name: surveyData.name,
          qns: parsedQns,
          status:
            surveyData.survey_status === "ONGOING" ? "ongoing" : "expired",
          created_at: surveyData.created_at,
          expiry_date: surveyData.expiry_date,
          description: `Survey created on ${new Date(surveyData.created_at).toLocaleDateString()}`,
          survey_status: surveyData.survey_status,
          updated_at: surveyData.updated_at,
          survey_type: surveyData.survey_TYPE || surveyData.survey_type,
          hasSurvey_Started: surveyData.hasSurvey_Started,
          surveyStartingTime: surveyData.surveyStartingTime,
        };

        setFormData(transformedSurvey);
        dispatch({
          type: UPDATE_FORM_SUCCESS,
          payload: transformedSurvey,
        });
      } catch (error) {
        console.error("Error fetching survey:", error);
        notifications.show({
          message: "Failed to load survey data",
          color: "red",
        });
        router.push("/admin/survey");
      }
    },
    [dispatch, router]
  );

  useEffect(() => {
    if (id === "create") {
      // Reset form for new survey creation
      setFormData({
        name: "",
        qns: {},
        created_at: new Date(),
        expiry_date: new Date(),
        survey_type: ESurveyType.GENERALSURVEY, // Default to General Survey
      });
      setPageLoading(false);
    } else {
      // Fetch existing survey data
      fetchSurvey(id);
      setPageLoading(false);
    }
  }, [id, fetchSurvey]);

  const handleSaveForm = async () => {
    if (!formData?.name?.trim()) {
      notifications.show({
        message: "Please enter a survey name",
        color: "orange",
      });
      return;
    }

    if (!formData?.expiry_date) {
      notifications.show({
        message: "Please select an expiry date",
        color: "orange",
      });
      return;
    }

    if (!formData?.survey_type) {
      notifications.show({
        message: "Please select a survey dedication type",
        color: "orange",
      });
      return;
    }

    try {
      setSaveLoading(true);

      // Prepare survey data for API
      const surveyData = {
        name: formData.name,
        qns:
          typeof formData.qns === "object"
            ? JSON.stringify(formData.qns)
            : formData.qns,
        expiry_date:
          formData.expiry_date instanceof Date
            ? formData.expiry_date.toISOString().split("T")[0]
            : formData.expiry_date,
        survey_status: formData.survey_status || "DRAFT",
        survey_TYPE: formData.survey_type,
      };

      if (id === "create") {
        // Create new survey
        const response = await authorizedApi.post(
          "/survey/create-survey",
          surveyData
        );

        dispatch({
          type: ADD_FORM_SUCCESS,
          payload: response.data,
        });

        notifications.show({
          message: "Survey created successfully!",
          color: "green",
        });

        router.push("/admin/survey");
      } else {
        // Update existing survey
        const response = await authorizedApi.put(
          `/survey/update/${id}`,
          surveyData
        );

        dispatch({
          type: UPDATE_FORM_SUCCESS,
          payload: response.data,
        });

        notifications.show({
          message: "Survey updated successfully!",
          color: "green",
        });

        router.push("/admin/survey");
      }
    } catch (error: any) {
      console.error("Error saving survey:", error);
      notifications.show({
        message:
          error.response?.data?.message ||
          `Failed to ${id === "create" ? "create" : "update"} survey`,
        color: "red",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (forms.loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full !overflow-x-hidden">
      <div className="flex items-center justify-between my-4">
        <p className="text-2xl font-bold">
          {form ? "Update" : "Create"} Survey
        </p>
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveForm}
            disabled={saveLoading || !formData?.name}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveLoading ? "Saving..." : "Save Survey"}
          </button>
        </div>
      </div>

      {formData && (
        <SurveyForms
          mode="creating"
          formData={formData as any}
          setFormData={setFormData as any}
        />
      )}
    </div>
  );
};

export default Page;
