import React from "react";
import { SolarDownloadMinimalisticBold } from "@/components/core/icons";
import TextArea from "@/components/ApplicantDetails/TextArea";
const Project6 = () => {
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
        <div>
            <div>
                <h2>Recruitment of trainees</h2>
                <p>
                    List down the number of trainees you need to train and their
                    background qualification for a period ranging from few days
                    to 6 months.
                </p>
            </div>
            <div>
                <div className="flex gap-4">
                    <button className="flex gap-2 bg-gray-300 text-gray-700 px-4 py-2 cursor-not-allowed" disabled>
                        <span>i</span>
                        <p>Previous</p>
                    </button>
                    <button className="flex gap-2 cursor-not-allowed" disabled>
                        <p>Next</p>
                        <span>i</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Project6;
