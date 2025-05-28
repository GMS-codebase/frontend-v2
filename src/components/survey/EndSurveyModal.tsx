"use client";

import { Modal } from "@mantine/core";
import { useState } from "react";
import type { EndSurveyModalProps } from "./../../app/admin/survey/types";
import { AlertTriangle } from "lucide-react";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ESurveyStatus } from "@/types/surveys-form";

const EndSurveyModal = ({
  isOpenModal,
  closeModal,
  survey,
}: EndSurveyModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleEndSurvey = async () => {
    if (!survey?.id) {
      notifications.show({
        message: "Survey ID not found",
        color: "red",
      });
      return;
    }

    try {
      setLoading(true);

      // Make API call to end the survey using the correct endpoint
      await authorizedApi.put(`/survey/${survey.id}/end-survey`);

      notifications.show({
        message: "Survey ended successfully",
        color: "green",
      });

      closeModal();
    } catch (error: any) {
      console.error("Error ending survey:", error);
      notifications.show({
        message: error.response?.data?.message || "Failed to end survey",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpenModal}
      onClose={closeModal}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">End Survey</h2>
        </div>
      }
      centered
      size="md"
      overlayProps={{
        color: "#f8fafc",
        opacity: 0.65,
        blur: 3,
      }}
      styles={{
        body: {
          backgroundColor: "#fff",
          padding: "1.5rem",
        },
        header: {
          backgroundColor: "#fff",
          padding: "1.5rem 1.5rem 0.75rem 1.5rem",
          marginBottom: 0,
        },
        content: {
          borderRadius: "1rem",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
        title: {
          width: "100%",
        },
      }}
    >
      <div className="flex flex-col gap-5 bg-white">
        <p className="text-base text-gray-700">
          Are you sure you want to end the survey{" "}
          <span className="font-semibold">&quot;{survey?.name}&quot;</span>?
          This action cannot be undone.
        </p>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Ending this survey will
            prevent any new responses from being submitted. Existing responses
            will still be available for review.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-2">
          <button
            onClick={closeModal}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors order-2 sm:order-1 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleEndSurvey}
            disabled={loading}
            style={{
              background: loading
                ? "#9CB3FD"
                : "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {loading ? "Processing..." : "End Survey"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EndSurveyModal;
