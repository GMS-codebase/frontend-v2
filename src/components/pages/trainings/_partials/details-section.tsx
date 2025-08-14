import { ITraining } from "@/types/trainings";
import DisplayListItem from "./display-list";
import { format } from "date-fns";

type props = {
  training: ITraining | null;
};

const DetailsSection = ({ training }: props) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Details
      </h2>
      <div className="space-y-2">
        <DisplayListItem
          title="Training Title"
          desc={training?.title || "N/A"}
        />
        {/* formated training date */}
        <DisplayListItem
          title="Start Date"
          desc={
            training?.startDate
              ? format(new Date(training.startDate), "dd MMM yyyy")
              : "N/A"
          }
        />
        <DisplayListItem
          title="End Date"
          desc={
            training?.endDate
              ? format(new Date(training.endDate), "dd MMM yyyy")
              : "N/A"
          }
        />
      </div>
    </div>
  );
};

export default DetailsSection;
