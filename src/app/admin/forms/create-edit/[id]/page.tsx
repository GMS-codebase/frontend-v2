"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form as IForm, QuestionForm } from "@/types/questions-form";
import Form from "@/components/forms/Form";
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

  useEffect(() => {
    if (form) {
      setFormData((prevData) => ({
        ...prevData,
        name: form?.name || "",
        qns: JSON.parse(form?.qns || "{}"),
      }));
    }
    setPageLoading(false);
  }, [form, id]);

  const handleSaveForm = () => {
    setLoading(true);
    const sanitizedQns = Object.entries(formData?.qns ?? {})
      .filter(
        ([_, type]: any) =>
          type.pages &&
          type.pages.some(
            (page: any) => page.questions && page.questions.length > 0
          )
      )
      .reduce((acc, [key, type]: any) => {
        acc[key] = {
          ...type,
          pages: type.pages.filter(
            (page: any) => page.questions && page.questions.length > 0
          ),
        };
        return acc;
      }, {} as QuestionForm);

    const updatedFormData = Object.fromEntries(
      Object.entries(sanitizedQns).map(([key, module]) => [
        key,
        {
          ...module,
          pages: module.pages.map((page, pageIndex) => ({
            ...page,
            questions: page.questions.map((question, questionIndex) => ({
              ...question,
              id: `${key}-q-${pageIndex}-${questionIndex}`,
            })),
          })),
        },
      ])
    );
    const request = form
      ? authorizedApi.put(`/forms/update/${id}`, {
          name: formData?.name,
          qns: JSON.stringify(updatedFormData),
        })
      : authorizedApi.post("/forms/create", {
          name: formData?.name,
          qns: JSON.stringify(updatedFormData),
        });

    request
      .then((res) => {
        notifications.show({
          message: form
            ? "Question Form is updated successfully"
            : "Question Form is created successfully",
          color: "blue",
        });

        dispatch({
          type: form ? UPDATE_FORM_SUCCESS : ADD_FORM_SUCCESS,
          payload: res.data?.data.data,
        });
        router.back();
      })
      .catch((err) => {
        if (err.response) {
          const errorMessage = err.response.data.message;
          if (errorMessage && errorMessage.includes("duplicate key")) {
            notifications.show({
              message: `Failed to ${
                form ? "update" : "create"
              } form. It seems a form with similar details already exists.`,
              color: "red",
            });
          } else {
            notifications.show({
              message:
                errorMessage ??
                `Failed to ${form ? "update" : "create"} form! Please try again.`,
              color: "red",
            });
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (forms.loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading</div>
    );
  }
  return (
    <div className="w-full !overflow-x-hidden">
      <div className="flex items-center justify-between my-4">
        <p className="text-2xl font-bold">{form ? "Update" : "Create"} Form</p>
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handleSaveForm}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80"
          >
            {loading ? "Loading.." : "Save"}
          </button>
        </div>
      </div>
      <Form
        mode="creating"
        formData={formData as any}
        setFormData={setFormData as any}
      />
    </div>
  );
};

export default Page;
