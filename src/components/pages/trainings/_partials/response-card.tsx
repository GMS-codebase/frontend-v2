import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Select, SelectItem } from "@/components/ui/Select";
import { FC, useState } from "react";

type responseStatus = "rejected" | "accepted" | "pending" | "edit";

interface Response {
  id: string;
  user: string;
  message: string;
  status: responseStatus;
  timestamp: string;
}

type props = {
  response: Response;
};

const ResponseCard: FC<props> = ({ response }) => {
  const [message, setMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");

  const handleSend = () => {
    console.log("Sending response:", { selectedRequest, message });
    setMessage("");
    setSelectedRequest("");
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 px-3 py-1 rounded-full font-medium">
            REJECTED
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 rounded-full font-medium">
            Accepted
          </Badge>
        );
      case "edit":
        return (
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1 rounded-full font-medium"
          >
            Edit
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-2 py-2 rounded-lg">
        <div className="flex items-start md:items-center gap-4 flex-1 w-full">
          {renderStatusBadge(response.status)}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 mb-1 break-words">
              {response.user}
            </div>
            <div className="text-gray-600 text-sm leading-relaxed break-words">
              {response.message}
            </div>
          </div>
        </div>
        <div className="text-gray-500 text-sm md:ml-4 whitespace-nowrap">
          {response.timestamp}
        </div>
      </div>

      {/* Action section */}
      {response.status === "accepted" && (
        <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full mt-4">
          {/* Select */}
          <div className="rounded-2xl w-full lg:w-auto">
            <Select
              value={selectedRequest}
              onValueChange={setSelectedRequest}
              className="!min-w-[150px] w-full lg:w-auto h-full rounded-2xl"
            >
              <SelectItem value="request training">Request training</SelectItem>
              <SelectItem value="Adding trainees">Adding trainees</SelectItem>
              <SelectItem value="Editing trainees">Editing trainees</SelectItem>
              <SelectItem value="Removing trainees">
                Removing trainees
              </SelectItem>
              <SelectItem value="Select competence">
                Select competence
              </SelectItem>
            </Select>
          </div>

          {/* Textarea */}
          <div className="flex-1 w-full">
            <textarea
              id="textarea"
              name={"message"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={1}
              className="w-full p-2 pl-4 border-none outline outline-1 outline-[#000F2305] bg-[#000F2308] rounded-2xl shadow-sm resize-none focus:ring-opacity-50"
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
      )}
    </div>
  );
};

export default ResponseCard;
