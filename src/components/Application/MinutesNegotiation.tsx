import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { SolarDownloadMinimalisticBold } from "../core/icons";

const MinutesNegotiation = () => {
  const [loading, setLoading] = useState({
    decision: "",
    status: false,
  });
  const [action, setAction] = useState("");
  const router = useRouter();
  const { id } = useParams();

  const handleDecision = async (decision: string) => {
    setLoading({
      decision,
      status: true,
    });
    try {
      await authorizedApi.put(`/contracts/negotiate/${id}/accept-reject`, {
        accept: decision === "accept" ? true : false,
      });
      notifications.show({
        message: `Terms ${
          decision === "accept" ? "accepted" : "declined"
        } successfully!`,
        color: "blue",
      });
      router.push("/applicant/applications");
    } catch (err: any) {
      notifications.show({
        message:
          err.response?.data?.message ?? "Failed to process your decision!",
        color: "red",
      });
    } finally {
      setLoading({
        decision: "",
        status: false,
      });
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contracts Contract negotiation</h1>
      <div className="flex gap-2 text-[#005DE9] bg-[#005DE9] bg-opacity-10 px-4 py-2 rounded-full mx-auto w-fit font-bold cursor-pointer items-center justify-center">
        <span>
          <SolarDownloadMinimalisticBold />
        </span>
        <p>Download Contract negotiation</p>
      </div>
      <div className="w-full flex justify-center mt-4 space-x-4">
        <button
          type="button"
          onClick={() => handleDecision("decline")}
          disabled={loading.decision === "decline" && loading.status}
          className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading.decision === "decline" && loading.status
            ? "Processing..."
            : "Reject"}
        </button>
        <button
          type="button"
          onClick={() => handleDecision("accept")}
          disabled={loading.decision === "accept" && loading.status}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading.decision === "accept" && loading.status
            ? "Processing..."
            : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default MinutesNegotiation;
