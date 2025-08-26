import Badge from "@/components/ui/Badge";
import { IResponse } from "@/types/trainings";
import { format } from "date-fns";
import { FC, useState } from "react";


type props = {
  response: IResponse;
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
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 px-3 py-1 rounded-full font-medium">
            REJECTED
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 rounded-full font-medium">
            ACCEPTED
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1 rounded-full font-medium">
            PENDING
          </Badge>
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
              {response.doneBy ?? "Unknown"}
            </div>
            <div className="text-gray-600 text-sm leading-relaxed break-words">
              {response.message}
            </div>
          </div>
        </div>
        <div className="text-gray-500 text-sm md:ml-4 whitespace-nowrap">
          {format(new Date(response.doneAt), "dd MMM yyyy")}
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
