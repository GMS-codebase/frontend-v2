"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form as IForm } from "@/types/questions-form";
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
      setFormData({
        ...formData,
        name: form?.name || "",
        qns: JSON.parse(form?.qns || "{}"),
      });
    }
    setPageLoading(false);
  }, [form, id]);

  useEffect(() => {
    // ... existing code ...
  }, [formData]);

  if (forms.loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading</div>
    );
  }
  return (
    <div className="w-full !overflow-x-hidden">
      <p className="text-2xl font-semibold text-gray-800">{form.name}</p>
      <Form
        mode="viewing"
        formData={formData as any}
        setFormData={setFormData as any}
      />
    </div>
  );
};

export default Page;
