"use client";

import TextArea from "@/components/textarea2";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Select, SelectItem } from "@/components/ui/Select";
import { useState } from "react";
import ResponseCard from "./response-card";

interface Response {
  id: string;
  user: string;
  message: string;
  status: "rejected" | "accepted" | "pending" | "edit";
  timestamp: string;
}

const mockResponses: Response[] = [
  {
    id: "1",
    user: "RTB SDF",
    message: "Remember to add all points that were discussed yesterday",
    status: "rejected",
    timestamp: "21/7/2025 - 20:23:21",
  },
  {
    id: "2",
    user: "RTB SDF",
    message:
      "We talked about including tvet schools in the summit , I think you forgot to mention it",
    status: "rejected",
    timestamp: "02/6/2025 - 16:23:21",
  },
  {
    id: "3",
    user: "RTB SDF",
    message: "Request allowed",
    status: "accepted",
    timestamp: "02/6/2025 - 16:23:21",
  },
  {
    id: "4",
    user: "RTB SDF",
    message: "Request allowed",
    status: "edit",
    timestamp: "02/6/2025 - 16:23:21",
  },
];

const ResponseSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Responses
      </h2>

      <div className="space-y-4 bg-[#F6F6F6] px-5 py-3 md:px-10 md:py-9 rounded-[21px]">
        {mockResponses.map((response, idx) => (
          <ResponseCard key={idx} response={response} />
        ))}
      </div>
    </div>
  );
};

export default ResponseSection;
