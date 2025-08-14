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
    </div>
  );
};

export default ResponseCard;
