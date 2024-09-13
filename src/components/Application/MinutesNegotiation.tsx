import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";

const MinutesNegotiation = () => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const router = useRouter();
  const { id } = useParams();

  const handleDecision = async (decision: string) => {
    setLoading(decision === "decline");
    try {
      await authorizedApi.put(`/contracts/${id}/terms-conditions`, {
        accept: decision === "accept",
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
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contracts Minutes Negotiation</h1>
      <div className="mb-6">
        <button>Download Minutes Negotiation</button>
      </div>
      <div className="w-full flex justify-center mt-4 space-x-4">
        <button
          type="button"
          onClick={() => handleDecision("decline")}
          disabled={loading}
          className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Processing..." : "Reject"}
        </button>
        <button
          type="button"
          onClick={() => handleDecision("accept")}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Processing..." : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default MinutesNegotiation;
