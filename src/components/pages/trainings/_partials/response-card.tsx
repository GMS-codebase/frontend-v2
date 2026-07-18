import { FC } from "react";
import { format } from "date-fns";
import { IResponse } from "@/types/trainings";

type props = {
  response: IResponse;
};

const ResponseCard: FC<props> = ({ response }) => {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium text-sm">
            REJECTED
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium text-sm">
            APPROVED
          </span>
        );
      case "PENDING":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium text-sm">
            PENDING
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full border rounded-lg shadow-sm bg-white p-4">
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-2">
        <div className="flex items-start md:items-center gap-4 flex-1 w-full">
          {renderStatusBadge(response.status)}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 mb-1 break-words">
              {response.user
                ? response.user.firstname + " " + response.user.lastname
                : "Unknown"}
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
