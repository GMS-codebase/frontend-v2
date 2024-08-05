import React from "react";
import { SolarDownloadMinimalisticBold } from "@/components/core/icons";
import TextArea from "@/components/ApplicantDetails/TextArea";
const IndicativeBudget = () => {
     const handleDownload = () => {
         const data = `
            Title of Application:
            The focus of this application is to provide a Master in Business Administration (MBA) in ICT program for Leaders, Professional Managers for a meaningful impact in the disruptive new era.
            
            Project Activities and Outcome:
            COFOPRO is a private company limited by individual shares aimed to develop made in Rwanda garment manufacturing at a fair and affordable prices on the Rwandan market and also aimed to expand our garment manufacturing by exporting our products. we also give out training to skills upgrading for works and other peoples who have knowledge in tailoring, we also give training on the use of modern tailoring equipment. in modern tailoring we have a problem on professionals skills works as
            
            Information about the institution to host beneficiaries:
            We are a domestic garment company which sew all kind of men clothes which are: suites, shirts, trousers and different kind of uniforms and we also deal with women clothes excluding underwear.
            
            Information about the institution to host beneficiaries - (Continued):
            The applying company/industry to host apprentices should attach the recommendation from PSF
        `;
         const blob = new Blob([data], { type: "text/plain" });
         const url = URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.download = "Applicant_Details.txt";
         link.click();
         URL.revokeObjectURL(url); // Clean up the URL object
     };
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <h2>Budget Summary</h2>
                <p>
                    List the most important activities you are soliciting
                    funding for and the indicative budget for each activity. On
                    rare case, add detailed justification in attachment if the
                    training period exceed 6 months and adjust the budget
                    accordingly.
                </p>
                <div
                    className="flex gap-2 text-white cursor-pointer bg-blue-700"
                    onClick={handleDownload}
                >
                    <span>
                        <SolarDownloadMinimalisticBold />
                    </span>
                    <p>Download</p>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <p>
                    Justify how the institution will contribute to facilitate
                    the training.
                </p>
                <div>
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
            <div className="flex gap-4">
                <button
                    className="flex gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                    disabled
                >
                    <span>i</span>
                    <p>Previous</p>
                </button>
                <button className="flex gap-2 cursor-not-allowed" disabled>
                    <p>Next</p>
                    <span>i</span>
                </button>
            </div>
        </div>
    );
};

export default IndicativeBudget;
