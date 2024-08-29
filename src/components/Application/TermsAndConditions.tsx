import React, { useState } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";

const TermsAndConditions = () => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const router = useRouter();
  const { id } = useParams();

  const handleDecision = async (decision: string) => {
    setLoading(decision === "decline");
    try {
      await authorizedApi.patch(`/applications/terms_conditions/${id}`, {
        decision,
      });
      notifications.show({
        message: `Terms ${
          decision === "accept" ? "accepted" : "declined"
        } successfully!`,
        color: "blue",
      });
      router.push("/next-page"); // Adjust the redirect path as needed
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
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <div className="mb-6">
        <p>
          {/* Dummy realistic terms and conditions text */}
          By using this application, you agree to the following terms and
          conditions. These terms govern your use of our services and any
          content that you may provide. Please read them carefully. If you do
          not agree to these terms, you may not use our services.
          <br />
          <br />
          1. **Acceptance of Terms**: By accessing or using the service, you
          agree to be bound by these terms and conditions.
          <br />
          <br />
          2. **Modification of Terms**: We reserve the right to modify these
          terms at any time. Your continued use of the service signifies your
          acceptance of the updated terms.
          <br />
          <br />
          3. **User Responsibilities**: You are responsible for maintaining the
          confidentiality of your account information and for all activities
          that occur under your account.
          <br />
          <br />
          4. **Limitation of Liability**: We are not liable for any indirect,
          incidental, or consequential damages arising out of or in connection
          with your use of the service.
          <br />
          <br />
          5. **Governing Law**: These terms are governed by the laws of the
          jurisdiction in which the service operates.
        </p>
      </div>
      <div className="w-full flex justify-center mt-4 space-x-4">
        <button
          type="button"
          onClick={() => handleDecision("decline")}
          disabled={loading}
          className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Processing..." : "Decline"}
        </button>
        <button
          type="button"
          onClick={() => handleDecision("accept")}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Processing..." : "Accept"}
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
