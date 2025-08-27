import { IRequest } from "@/types/trainings";
import React from "react";
import RequestCard from "./_partials/request-card";

type props = {
  trainingRequests: IRequest[];
  currentRole: string;
};
const TraineeRequestContainer = ({ trainingRequests, currentRole }: props) => {
  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-primaryText">
          Requests
        </h2>
        <div className="space-y-4 bg-[#F6F6F6] px-5 py-3 md:px-10 md:py-9 rounded-[21px]">
          {trainingRequests.length > 0 ? (
            trainingRequests.map((request, idx) => (
              <RequestCard
                key={idx}
                request={request}
                currentRole={currentRole}
              />
            ))
          ) : (
            <h2 className="text-gray-500 text-sm my-5 text-center">
              No Pending Request yet
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraineeRequestContainer;
