"use client";
import React, { useState } from "react";
import Project from "@/components/ApplicantDetails/Project";
import IndicativeBudget from "@/components/ApplicantDetails/IndicativeBudget";
import {
    SolarFileBold,
    SolarFolder2Bold,
    SolarEyeLinear,
} from "@/components/core/icons";
const Page = () => {
    const [currentComponent, setCurrentComponent] = useState<
        "Project" | "IndicativeBudget"
    >("Project");

    const renderComponent = () => {
        switch (currentComponent) {
            case "Project":
                return <Project />;
            case "IndicativeBudget":
                return <IndicativeBudget />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-6 p-8 rounded-3xl">
            <div className="bg-white rounded-2xl gap-6 p-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-black font-semibold">Legal status</h2>
                    <div className="flex justify-between items-center gap-2 px-4 py-2 bg-[#005DE9] rounded-full text-white w-fit">
                        <span>
                            <SolarFileBold />
                        </span>
                        <div>Export Applicant Details</div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-5">
                    <div className="flex flex-col justify-start items-start gap-6 font-semibold">
                        <div className="flex gap-6 justify-center items-center">
                            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                                Application number
                            </p>
                            <p>GMS-APP-000896</p>
                        </div>
                        <div className="flex gap-6 justify-center items-center font-semibold">
                            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                                Finished answering
                            </p>
                            <p>YES</p>
                        </div>
                        <div className="flex gap-6 justify-center items-center">
                            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                                Submitted
                            </p>
                            <p>YES</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-6 font-semibold">
                        <div className="flex gap-6justify-center items-center">
                            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                                Call
                            </p>
                            <p>SDF CALL 5 FOR GRANT PROPOSALS</p>
                        </div>
                        <div className="flex gap-6 justify-center items-center">
                            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                                Window
                            </p>
                            <p>Window 1: Rapid response training</p>
                        </div>
                        <div className="flex  justify-center items-center gap-6">
                            <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                                Application submission deadline
                            </p>
                            <p>2022/02.18 02:00:00</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 mt-6">
                    <div className="flex flex-col gap-4 font-semibold">
                        <h2 className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start w-fit">
                            Description
                        </h2>
                        <div>
                            We are offering an MBA in ICT to upgrade the
                            existing labour force. This programme aims to assist
                            the actual labour force to succeed in the actual
                            disruptive change by being sufficiently equipped to
                            meet the challenge of digitalization.
                        </div>
                    </div>

                    <div className="flex px-4 py-2 gap-2 bg-[#005DE9] rounded-full text-white items-center justify-start w-fit">
                        <span>
                            <SolarFolder2Bold />
                        </span>
                        <div className="">Apply for Appeal</div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="flex bg-white rounded-2xl w-[70%] gap-4  p-5">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="font-semibold text-2xl">
                            Questions and answers
                        </div>
                        <div className="flex font-semibold">
                            <div
                                onClick={() => setCurrentComponent("Project")}
                                className={`cursor-pointer w-1/2 ${
                                    currentComponent === "Project"
                                        ? "bg-[#005DE9] bg-opacity-10"
                                        : ""
                                } h-16 flex items-center justify-center`}
                            >
                                Project Funding Application
                            </div>
                            <div
                                onClick={() =>
                                    setCurrentComponent("IndicativeBudget")
                                }
                                className={`cursor-pointer w-1/2 ${
                                    currentComponent === "IndicativeBudget"
                                        ? "bg-[#C50000] bg-opacity-10"
                                        : ""
                                } h-16 flex items-center justify-center`}
                            >
                                Indicative Budget
                            </div>
                        </div>
                        <div className="mt-4 w-full">{renderComponent()}</div>
                    </div>
                </div>
                <div className="flex flex-col bg-white w-[30%] rounded-2xl p-5 gap-4">
                    <h2 className="font-bold">Decision</h2>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Evaluation Stage</h3>
                        <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
                            Proposal Approved
                        </div>
                        <div className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full">
                            <span>
                                <SolarEyeLinear />
                            </span>
                            <p>details</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold">DueDiligency Stage</h3>
                        <div className="font-medium bg-[#C50000] bg-opacity-10 text-[#C50000] w-fit justify-start items-center rounded-full px-4 py-2">
                            Proposal Rejected
                        </div>
                        <div className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full">
                            <span>
                                <SolarEyeLinear />
                            </span>
                            <p>details</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;

// "use client";
// import React, { useState } from "react";
// import Project from "@/components/ApplicantDetails/Project";
// import IndicativeBudget from "@/components/ApplicantDetails/IndicativeBudget";
// import {
//     SolarFileBold,
//     SolarFolder2Bold,
//     SolarEyeLinear,
// } from "@/components/core/icons";
// const Page = () => {
//     const [currentComponent, setCurrentComponent] = useState<
//         "Project" | "IndicativeBudget"
//     >("Project");

//     const renderComponent = () => {
//         switch (currentComponent) {
//             case "Project":
//                 return <Project />;
//             case "IndicativeBudget":
//                 return <IndicativeBudget />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="flex flex-col gap-6 p-8 rounded-3xl">
//             <div className="bg-white rounded-2xl gap-6 p-5">
//                 <div className="flex justify-between items-center">
//                     <h2 className="text-black font-semibold">Legal status</h2>
//                     <div className="flex justify-between items-center gap-2 px-4 py-2 bg-[#005DE9] rounded-full text-white w-fit">
//                         <span>
//                             <SolarFileBold />
//                         </span>
//                         <div>Export Applicant Details</div>
//                     </div>
//                 </div>

//                 <div className="flex justify-between items-center mt-5">
//                     <div className="flex flex-col justify-start items-start gap-6 font-semibold">
//                         <div className="flex gap-6 justify-center items-center">
//                             <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
//                                 Application number
//                             </p>
//                             <p>GMS-APP-000896</p>
//                         </div>
//                         <div className="flex gap-6 justify-center items-center font-semibold">
//                             <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
//                                 Finished answering
//                             </p>
//                             <p>YES</p>
//                         </div>
//                         <div className="flex gap-6 justify-center items-center">
//                             <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
//                                 Submitted
//                             </p>
//                             <p>YES</p>
//                         </div>
//                     </div>
//                     <div className="flex flex-col justify-start items-start gap-6 font-semibold">
//                         <div className="flex gap-6justify-center items-center">
//                             <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
//                                 Call
//                             </p>
//                             <p>SDF CALL 5 FOR GRANT PROPOSALS</p>
//                         </div>
//                         <div className="flex gap-6 justify-center items-center">
//                             <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
//                                 Window
//                             </p>
//                             <p>Window 1: Rapid response training</p>
//                         </div>
//                         <div className="flex  justify-center items-center gap-6">
//                             <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
//                                 Application submission deadline
//                             </p>
//                             <p>2022/02.18 02:00:00</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-6 mt-6">
//                     <div className="flex flex-col gap-4 font-semibold">
//                         <h2 className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start w-fit">
//                             Description
//                         </h2>
//                         <div>
//                             We are offering an MBA in ICT to upgrade the
//                             existing labour force. This programme aims to assist
//                             the actual labour force to succeed in the actual
//                             disruptive change by being sufficiently equipped to
//                             meet the challenge of digitalization.
//                         </div>
//                     </div>

//                     <div className="flex px-4 py-2 gap-2 bg-[#005DE9] rounded-full text-white items-center justify-start w-fit">
//                         <span>
//                             <SolarFolder2Bold />
//                         </span>
//                         <div className="">Apply for Appeal</div>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex gap-2">
//                 <div className="flex bg-white rounded-2xl w-[70%] gap-4  p-5">
//                     <div className="flex flex-col gap-4 w-full">
//                         <div className="font-semibold text-2xl">
//                             Questions and answers
//                         </div>
//                         <div className="flex font-semibold">
//                             <div
//                                 onClick={() => setCurrentComponent("Project")}
//                                 className={`cursor-pointer w-1/2 ${
//                                     currentComponent === "Project"
//                                         ? "bg-[#005DE9] bg-opacity-10"
//                                         : ""
//                                 } h-16 flex items-center justify-center`}
//                             >
//                                 Project Funding Application
//                             </div>
//                             <div
//                                 onClick={() =>
//                                     setCurrentComponent("IndicativeBudget")
//                                 }
//                                 className={`cursor-pointer w-1/2 ${
//                                     currentComponent === "IndicativeBudget"
//                                         ? "bg-[#C50000] bg-opacity-10"
//                                         : ""
//                                 } h-16 flex items-center justify-center`}
//                             >
//                                 Indicative Budget
//                             </div>
//                         </div>
//                         <div className="mt-4 w-full">{renderComponent()}</div>
//                     </div>
//                 </div>
//                 <div className="flex flex-col bg-white w-[30%] rounded-2xl p-5 gap-4">
//                     <h2 className="font-bold">Decision</h2>
//                     <div className="flex flex-col gap-2">
//                         <h3 className="font-semibold">Evaluation Stage</h3>
//                         <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
//                             Proposal Approved
//                         </div>
//                         <div className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full">
//                             <span>
//                                 <SolarEyeLinear />
//                             </span>
//                             <p>details</p>
//                         </div>
//                     </div>
//                     <div className="flex flex-col gap-2">
//                         <h3 className="font-bold">DueDiligency Stage</h3>
//                         <div className="font-medium bg-[#C50000] bg-opacity-10 text-[#C50000] w-fit justify-start items-center rounded-full px-4 py-2">
//                             Proposal Rejected
//                         </div>
//                         <div className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full">
//                             <span>
//                                 <SolarEyeLinear />
//                             </span>
//                             <p>details</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Page;
