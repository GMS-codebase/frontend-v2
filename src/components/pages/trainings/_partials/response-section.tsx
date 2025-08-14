"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select, SelectItem } from "@/components/ui/Select";
import { FC, useState } from "react";
import ResponseCard from "./response-card";

interface Response {
  id: string;
  user: string;
  message: string;
  status: "rejected" | "accepted" | "pending" | "edit";
  timestamp: string;
}

interface ResponseSectionProps {
  selectedRequest: string;
  setSelectedRequest: (value: string) => void;
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

const ResponseSection: FC<ResponseSectionProps> = ({
  selectedRequest,
  setSelectedRequest,
}) => {
  const [message, setMessage] = useState("");
  const [addNumber, setAddNumber] = useState(1);

  const handleSend = () => {
    console.log("Sending response:", { selectedRequest, message });
    setMessage("");
    setSelectedRequest("");
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Responses
      </h2>

      <div className="space-y-4 bg-[#F6F6F6] px-5 py-3 md:px-10 md:py-9 rounded-[21px]">
        {mockResponses.map((response, idx) => (
          <ResponseCard key={idx} response={response} />
        ))}
        <div className="flex flex-col lg:flex-row gap-4 items-center w-full mt-4">
          {/* Select */}
          <div className="rounded-2xl w-full lg:w-auto">
            <Select
              value={selectedRequest}
              onValueChange={setSelectedRequest}
              className="!min-w-[150px] w-full lg:w-auto h-full rounded-2xl"
            >
              <SelectItem value="ADD">Adding trainees</SelectItem>
              <SelectItem value="EDIT">Editing trainees</SelectItem>
              <SelectItem value="REMOVE">Removing trainees</SelectItem>
              <SelectItem value="SELECT_COMPETENCE">
                Select competence
              </SelectItem>
            </Select>
          </div>
          <div className=" w-full lg:w-[70px]">
            {selectedRequest === "ADD" && (
              <Input
                type="number"
                value={addNumber}
                onChange={(e) => setAddNumber(Number(e.target.value))}
              />
            )}
          </div>

          {/* Textarea */}
          <div className="flex-1 w-full h-full">
            <textarea
              id="textarea"
              name={"message"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full h-full p-2 pl-4 border-none outline outline-1 outline-[#000F2305] bg-[#000F2308] rounded-2xl shadow-sm resize-none focus:ring-opacity-50"
            />
          </div>

          {/* Send Button */}
          <div className="w-full lg:w-auto">
            <Button
              onClick={handleSend}
              className="w-full lg:w-auto bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-2xl font-medium"
              disabled={!selectedRequest || !message.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseSection;
