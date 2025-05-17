"use client"

import { Modal } from "@mantine/core"
import { useState } from "react"
import type {EndSurveyModalProps} from "./../../app/admin/survey/types";

const EndSurveyModal = ({ isOpenModal, closeModal, survey }: EndSurveyModalProps) => {
  const [loading, setLoading] = useState(false)

  const handleEndSurvey = async () => {
    try {
      setLoading(true)
      // Implement your end survey logic here
      console.log("Ending survey:", survey?.uuid)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      closeModal()
    } catch (error) {
      console.error("Error ending survey:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={isOpenModal}
      onClose={closeModal}
      title={<h2 className="text-xl font-semibold text-gray-800">End Survey</h2>}
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
          padding: "1.5rem 1.5rem 0 1.5rem",
        },
        content: {
          borderRadius: "1rem",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div className="flex flex-col gap-4 bg-white">
        <p className="text-base text-gray-700">
          Are you sure you want to end the survey <span className="font-semibold">&quot;{survey?.name}&quot;</span>? This action
          cannot be undone.
        </p>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Ending this survey will prevent any new responses from being
            submitted. Existing responses will still be available for review.
          </p>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={closeModal}
            className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEndSurvey}
            disabled={loading}
            style={{
              background: loading ? "#9CB3FD" : "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
            }}
            className="px-6 py-2.5 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "End Survey"}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EndSurveyModal
