import React from "react";
import { SolarDownloadMinimalisticBold } from "@/components/core/icons";
import TextArea from "@/components/ApplicantDetails/TextArea";
import NextPrevButtons from "../core/NextPrevButtons";
const IndicativeBudget = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold">Budget Summary</h2>
        <p className="font-light ">
          List the most important activities you are soliciting funding for and
          the indicative budget for each activity. On rare case, add detailed
          justification in attachment if the training period exceed 6 months and
          adjust the budget accordingly.
        </p>
        <div
          className="flex gap-2 text-white cursor-pointer bg-blue-700 items-center justify-center px-2 py-2 rounded-full "
          // onClick={handleDownload}
        >
          <span>
            <SolarDownloadMinimalisticBold />
          </span>
          <p>Download</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold">
          Required contribution from the applicant(for non-government applicant)
        </h2>
        <p className="font-light">
          Justify how the institution will contribute to facilitate the
          training.
        </p>
        <div className="text-gray-400  ">
          <TextArea
            readOnly
            defaultText="(GMDC) GENERATION  MINING DEVELOPMENT COMPANY Ltd will contribute to facilitate the training in many ways as follows;

(GMDC) GENERATION  MINING DEVELOPMENT COMPANY Ltd will make sure that it has the following on the ground:
-	The equipment are available.
-	Infrastructures are available. 
-	Workshop big for training more than 500 persons are available
-	Administrative staff  to facilitate Trainings are available at the site 
-	The company has enough space
-	The company has a solid management capable to run the execution of this project
An effective training program is built by following a systematic, step-by step process. Training initiatives that stand alone (one-off events) often fail to meet organizational objectives and participant expectations.
On daily basis the institution will follow these steps to ensure smooth running of the internships, number one will be Assess training needs, Set organizational training objective; Create training action plan; Evaluate & revise training.   
"
          />
        </div>
      </div>
      <NextPrevButtons
        isFirst={true}
        handleNext={() => {}}
        handlePrev={() => {}}
      />
    </div>
  );
};

export default IndicativeBudget;
