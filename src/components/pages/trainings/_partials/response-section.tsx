"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { FC, useState } from "react";
import ResponseCard from "./response-card";
import { useDispatch } from "react-redux";
import { sdfMakeTrainingDecision } from "@/services";
import { IResponse, ITraining } from "@/types/trainings";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/another-select";

interface ResponseSectionProps {
  training: ITraining;
  selectedRequest: string;
  setSelectedRequest: (value: string) => void;
  currentRole?: string;
  trainingResponse: IResponse[];
}

const ResponseSection: FC<ResponseSectionProps> = ({
  training,
  selectedRequest,
  setSelectedRequest,
  currentRole,
  trainingResponse,
}) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [addNumber, setAddNumber] = useState(1);
  const [decision, setDecision] = useState("");

  const { decisionLoading } = useSelector((state: any) => state.trainings);

  const handleSend = () => {
    if (selectedRequest) {
      switch (selectedRequest) {
        case "ADD":
          // Handle adding trainees
          break;
        case "EDIT":
          // Handle editing trainees
          break;
        case "REMOVE":
          // Handle removing trainees
          break;
        case "APPROVE_TRAINING":
          handleMakeDecisionRequest();
          break;
        default:
          break;
      }

      // Reset the form
      setMessage("");
      setSelectedRequest("");
    }
  };

  //handle request make decision by sdf
  const handleMakeDecisionRequest = () => {
    if (!decision || !message.trim())
      return notifications.show({
        message: "Please provide a message and select a decision.",
        color: "red",
      });
    if (currentRole === "SDF_SECRETARIATE") {
      dispatch(
        sdfMakeTrainingDecision({
          trainingId: training?.uuid,
          message,
          decision,
        }) as any
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Responses
      </h2>

      <div className="space-y-4 bg-[#F6F6F6] px-5 py-3 md:px-10 md:py-9 rounded-[21px]">
        {trainingResponse ? (
          trainingResponse.map((response, idx) => (
            <ResponseCard key={idx} response={response} />
          ))
        ) : (
          <h2 className="text-gray-500 text-sm my-5 text-center">
            No responses yet
          </h2>
        )}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full mt-4">
          {/* Select */}
          <div className="w-full lg:w-auto">
            <Select value={selectedRequest} onValueChange={setSelectedRequest}>
              <SelectTrigger className="min-w-[180px] rounded-lg w-full lg:w-auto bg-white">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>

              <SelectContent className="bg-white w-full">
                {training.status === "REVIEW" &&
                  currentRole === "SDF_SECRETARIATE" && (
                    <SelectItem value="APPROVE_TRAINING">
                      Approve Training
                    </SelectItem>
                  )}

                {training.status === "ACCEPTED" &&
                  currentRole === "APPLICANT" && (
                    <>
                      <SelectItem value="ADD">Adding trainees</SelectItem>
                      <SelectItem value="EDIT">Editing trainees</SelectItem>
                      <SelectItem value="REMOVE">Removing trainees</SelectItem>
                    </>
                  )}
              </SelectContent>
            </Select>
          </div>

          {/* Number Input (only when ADD is selected) */}
          {selectedRequest === "ADD" && (
            <div className="w-full lg:w-28">
              <Input
                type="number"
                value={addNumber}
                onChange={(e) => setAddNumber(Number(e.target.value))}
                className="rounded-2xl"
              />
            </div>
          )}
          {selectedRequest === "APPROVE_TRAINING" &&
            training.status === "REVIEW" && (
              <div className="w-full lg:w-fit">
                <Select value={decision} onValueChange={setDecision}>
                  <SelectTrigger className="rounded-2xl w-full lg:w-auto">
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ACCEPT">Accept Training</SelectItem>
                    <SelectItem value="REJECT">Reject Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Textarea */}
          <div className="flex-1 w-full">
            <textarea
              id="textarea"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full p-3 border-none outline outline-1 outline-gray-200 bg-gray-50 rounded-2xl shadow-sm resize-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Send Button */}
          <div className="w-full lg:w-auto">
            <Button
              onClick={handleSend}
              className="w-full lg:w-auto bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-2xl font-medium"
              disabled={!selectedRequest || !message.trim() || decisionLoading}
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
