"use client";
import { SolarFileBold } from "@/components/core/icons";
import {
  getApplicantsData,
  getApplicationsData,
  getCallStats,
  getSubmissionsData,
} from "@/utils/funcs/dashboard";
// import React, { useEffect, useState } from "react";
// import {
//   SolarBenzeneRingBroken,
//   SolarCalendarBold,
//   SolarFileBold,
// } from "@/components/core/icons";
// import { Select, Skeleton } from "@mantine/core";
// import ProgressGender from "./progressGender";
// import BasicGauges from "./BasicGauges";
// import Dash from "./dash";
// import AdminAction from "@/components/Actions/AdminAction";
// import { authorizedApi } from "@/utils/api";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getApplicantsByStage,
//   getApplicationsByStage,
//   getSubmissionsBySector,
// } from "@/services";

// const Page = () => {
//   const boysCount = 20;
//   const girlsCount = 15;
//   const totalCount = boysCount + girlsCount;
//   const startDate = "2023-05-01";
//   const endDate = "2023-12-31";
//   const dispatch = useDispatch();

//   useEffect(() => {
//     getSubmissionsBySector(dispatch);
//     getApplicationsByStage(dispatch);
//     getApplicantsByStage(dispatch);
//   }, []);
//   const [call, setCall] = useState("");
// const { calls } = useSelector((state: any) => state.calls);
// const { applications } = useSelector((state: any) => state.applications);
//   const [businessTypeStage, setBusinessTypeStage] = useState("");
//   const [applicationsStage, setApplicationsStage] = useState("");
//   const [applicantsStage, setApplicantsStage] = useState("");

//   const dashTablesData = [
//     {
//       sector: "Manufacturing",
//       col1Data: sectorsData["Manufacturing"]?.countApplicants,
//       col2Data: sectorsData["Manufacturing"]?.countApplicants,
//     },
//     {
//       sector: "Hospitality & Tourism",
//       col1Data: sectorsData["Hospitality & Tourism"]?.countApplicants,
//       col2Data: sectorsData["Hospitality & Tourism"]?.countApplicants,
//     },
//     {
//       sector: "Transport & Logistics",
//       col1Data: sectorsData["Transport & Logistics"]?.countApplicants,
//       col2Data: sectorsData["Transport & Logistics"]?.countApplicants,
//     },
//     {
//       sector: "Agriculture",
//       col1Data: sectorsData["Agriculture"]?.countApplicants,
//       col2Data: sectorsData["Agriculture"]?.countApplicants,
//     },
//     {
//       sector: "Energy",
//       col1Data: sectorsData["Energy"]?.countApplicants,
//       col2Data: sectorsData["Energy"]?.countApplicants,
//     },
//     {
//       sector: "Mining",
//       col1Data: sectorsData["Mining"]?.countApplicants,
//       col2Data: sectorsData["Mining"]?.countApplicants,
//     },
//     {
//       sector: "ICT & Digital Skills",
//       col1Data: sectorsData["Mining"]?.countApplicants,
//       col2Data: sectorsData["Mining"]?.countApplicants,
//     },
//     {
//       sector: "Construction",
//       col1Data: sectorsData["Mining"]?.countApplicants,
//       col2Data: sectorsData["Mining"]?.countApplicants,
//     },
//     {
//       sector: "Other",
//       col1Data: sectorsData["Mining"]?.countApplicants,
//       col2Data: sectorsData["Mining"]?.countApplicants,
//     },
//     {
//       sector: "Total",
//       col1Data: sectorsData["Mining"]?.countApplicants,
//       col2Data: sectorsData["Mining"]?.countApplicants,
//     },
//   ];

//   return (
//     <div className="w-full text-secondaryText pb-20 overflow-y-auto">
//       {loading ? (
//         <Skeleton w={"100%"} h={1000} />
//       ) : (
//         <>
//           <div className="flex flex-col mb-4">
//             <div className="flex justify-between">
//               <p>Evaluation</p>
//               <div className="text-md gap-2 flex self-end">
//                 <div className="rounded-full border-black-1">
//                   <select
//                     value={call}
//                     onChange={(e: any) => setCall(e.target.value)}
//                     className="p-2 border border-1 border-black rounded-full text-md"
//                   >
//                     {calls.map((call: any, index: number) => (
//                       <option key={index} value={call.uuid}>
//                         {call.title}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 grid grid-cols-2 grid-rows-3 gap-6 w-full">
//             <div className="bg-white p-6 rounded-2xl">
//               <div className="flex justify-between">
//                 <p>Number of submission</p>
//                 <div className="text-xl">
//                   <AdminAction call={null} setIsCall={() => {}} />{" "}
//                 </div>
//               </div>
//               <table className="table-auto w-full border-collapse border border-gray-200">
//                 <thead>
//                   <tr className="bg-[#005DE91F] text-primary">
//                     <th className="px-4 py-2 text-left rounded-tl-xl">
//                       Sector
//                     </th>
//                     <th className="px-4 py-2 text-center">Applicants</th>
//                     <th className="px-4 py-2 text-center rounded-tr-xl">
//                       Applications
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.keys(dashboardData.submissionsBySector).map(
//                     (key: string, index) => (
//                       <tr
//                         key={key}
//                         className={`${
//                           index % 2 === 0 ? "bg-[#005DE91F]" : "bg-white"
//                         } text-primary`}
//                       >
//                         <td className="px-4 py-2 text-base w-1/2">{key}</td>
//                         <td className="px-4 py-2 text-base font-bold text-center w-1/5">
//                           {dashboardData.submissionsBySector[key].applicants}
//                         </td>
//                         <td className="px-4 py-2 text-base font-bold text-center w-1/5">
//                           {dashboardData.submissionsBySector[key].applications}
//                         </td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <div className="bg-white p-6 rounded-2sm">
//               <div className="flex justify-between">
//                 <p>Applications</p>
//                 <div className="text-md gap-4 flex items-center justify-center">
// <Select
//   value={applicationsStage}
//   data={Object.keys(dashboardData.applicationsByStage).map(
//     (key) => ({ value: key, label: key })
//   )}
//   onChange={(value) => setApplicationsStage(value as any)}
// />
//                   <div>
//                     <AdminAction call={null} setIsCall={() => {}} />{" "}
//                   </div>
//                 </div>
//               </div>
//               <table className="table-auto w-full border-collapse border border-gray-200">
//                 <thead>
//                   <tr className="bg-[#005DE91F] text-primary">
//                     <th className="px-4 py-2 text-left rounded-tl-xl">
//                       Sector
//                     </th>
//                     <th className="px-4 py-2 text-center">Selected</th>
//                     <th className="px-4 py-2 text-center rounded-tr-xl">
//                       Rejected
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.keys(
//                     dashboardData.applicationsByStage[applicationsStage]
//                   ).map((key: string, index) => (
//                     <tr
//                       key={key}
//                       className={`${
//                         index % 2 === 0 ? "bg-[#005DE91F]" : "bg-white"
//                       } text-primary`}
//                     >
//                       <td className="px-4 py-2 text-base w-1/2">{key}</td>
//                       <td className="px-4 py-2 text-base font-bold text-center w-1/5">
//                         {
//                           dashboardData.applicationsByStage[applicationsStage][
//                             key
//                           ].selected
//                         }
//                       </td>
//                       <td className="px-4 py-2 text-base font-bold text-center w-1/5">
//                         {
//                           dashboardData.applicationsByStage[applicationsStage][
//                             key
//                           ].rejected
//                         }
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
// <div className="bg-white p-6 rounded-2sm">
//   <div className="flex justify-between">
//     <p>Applicants</p>
//     <div className="text-md gap-4 flex items-center justify-center">
//       <Select
//         value={applicantsStage}
//         data={Object.keys(dashboardData.applicantsByStage).map(
//           (key) => ({ value: key, label: key })
//         )}
//         onChange={(value) => setApplicantsStage(value as any)}
//       />
//       <div>
//         <AdminAction call={null} setIsCall={() => {}} />{" "}
//       </div>
//     </div>
//   </div>
//   <table className="table-auto w-full border-collapse border border-gray-200">
//     <thead>
//       <tr className="bg-[#005DE91F] text-primary">
//         <th className="px-4 py-2 text-left rounded-tl-xl">
//           Sector
//         </th>
//         <th className="px-4 py-2 text-center">Selected</th>
//         <th className="px-4 py-2 text-center rounded-tr-xl">
//           Rejected
//         </th>
//       </tr>
//     </thead>
//     <tbody>
//       {Object.keys(
//         dashboardData.applicantsByStage[applicantsStage]
//       ).map((key: string, index) => (
//         <tr
//           key={key}
//           className={`${
//             index % 2 === 0 ? "bg-[#005DE91F]" : "bg-white"
//           } text-primary`}
//         >
//           <td className="px-4 py-2 text-base w-1/2">{key}</td>
//           <td className="px-4 py-2 text-base font-bold text-center w-1/5">
//             {
//               dashboardData.applicantsByStage[applicantsStage][key]
//                 .selected
//             }
//           </td>
//           <td className="px-4 py-2 text-base font-bold text-center w-1/5">
//             {
//               dashboardData.applicantsByStage[applicantsStage][key]
//                 .rejected
//             }
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>
//             <div className="bg-white p-6 rounded-2sm">
//               <div className="flex justify-between">
//                 <p>Selected Trainees</p>
//                 <div className="text-md gap-4 flex items-center justify-center">
//                   <div className="rounded-full bg-slate-400 bg-opacity-10">
//                     <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
//                       <span className="text-gray-400">
//                         <SolarBenzeneRingBroken />
//                       </span>
//                       <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
//                         <option value="select-stage">All</option>
//                         <option value="select-stage">Evaluation</option>
//                         <option value="select-stage">Due Diligency</option>
//                         <option value="select-stage">Grant Committee</option>
//                         <option value="select-stage">Contract Signing</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <AdminAction call={null} setIsCall={() => {}} />{" "}
//                   </div>
//                 </div>
//               </div>
//               <Dash col1="Number" data={dashTablesData} showSingleRow={true} />
//             </div>
//             <div className="bg-white p-6 rounded-2xl">
//               <div className="flex justify-between gap-3 w-full">
//                 <p className="w-full">
//                   Number of graduates trainees before 2025
//                 </p>
//                 <div className="rounded-full bg-slate-400 bg-opacity-10 w-[40%] px-3">
//                   <label
//                     htmlFor="call"
//                     className="w-full flex items-center py-2 gap-2 rounded-full"
//                   >
//                     <span id="call" className="text-gray-400">
//                       <SolarBenzeneRingBroken />
//                     </span>
//                     <select
//                       id="call"
//                       className="w-full px-0 rounded-full text-md bg-transparent outline-none border-none appearance-none"
//                     >
//                       <option value="call1">Call 1</option>
//                       <option value="call1">Call 2</option>
//                       <option value="call1">Call 3</option>
//                       <option value="call1">Call 4</option>
//                       <option value="call1">Call 5</option>
//                       <option value="call1">NEET 1</option>
//                     </select>
//                   </label>
//                 </div>
//                 <div className="text-md gap-4 flex items-center justify-center">
//                   <div>
//                     <AdminAction call={null} setIsCall={() => {}} />{" "}
//                   </div>
//                 </div>
//               </div>
//               <Dash col1="Male" col2="Female" data={dashTablesData} />
//             </div>
//             <div className="bg-white p-6 rounded-2xl">
//               <div className=" justify-center items-center">
//                 <p>Number of Trainees Starting from 2025</p>
//                 <div className="text-md gap-2 flex my-2 ">
//                   <div className="flex gap-2 rounded-full bg-slate-400 bg-opacity-10 items-center justify-center py-2 px-5">
//                     <span className="text-gray-400">
//                       <SolarCalendarBold />
//                     </span>
//                     <p className="text-xs">Starting date</p>
//                   </div>
//                   <div className="flex gap-2 rounded-full bg-slate-400 bg-opacity-10 items-center justify-center py-2 px-5">
//                     <span className="text-gray-400">
//                       <SolarCalendarBold />
//                     </span>
//                     <p className="text-xs">Ending date</p>
//                   </div>
//                   <div className="rounded-full bg-slate-400 bg-opacity-10">
//                     <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
//                       <span className="text-gray-400">
//                         <SolarBenzeneRingBroken />
//                       </span>
//                       <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none text-xs">
//                         <option value="select-stage">All</option>
//                         <option value="select-stage">Ongoing</option>
//                         <option value="select-stage">Completed</option>
//                         <option value="select-stage">Graduated</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <AdminAction call={null} setIsCall={() => {}} />{" "}
//                   </div>
//                 </div>
//               </div>
//               <Dash col1="Male" col2="Female" data={dashTablesData} />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Page;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ProgressGender from "./progressGender";
import Image from "next/image";
import { PieChart } from "@mui/x-charts";
import Male from "../../assets/Vectors/ion_male.svg";
import Female from "../../assets/Vectors/icon-park-outline_female.svg";
import GaugeChart from "react-gauge-chart";
import { Select } from "@mantine/core";

const Dashboard = () => {
  const { calls, loading: callsLoading } = useSelector(
    (state: any) => state.calls
  );
  const { applications, loading: applicationsLoading } = useSelector(
    (state: any) => state.applications
  );

  const [callStats, setCallStats] = useState<any>(null);
  const [applicantsData, setApplicantsData] = useState<any>({});
  const [applicationsData, setApplicationsData] = useState<any>({});
  const [submissionsData, setSubmissionsData] = useState<any>({});
  const [activeCall, setActiveCall] = useState<string>("");
  const [applicantsCall, setApplicantsCall] = useState<string>("");
  const [applicationsCall, setApplicationsCall] = useState<string>("");
  const [submissionsCall, setSubmissionsCall] = useState<string>("");

  useEffect(() => {
    if (!callsLoading) {
      setActiveCall(calls[0].uuid);
      setApplicantsCall(calls[0].uuid);
      setApplicationsCall(calls[0].uuid);
      setSubmissionsCall(calls[0].uuid);
    }
  }, [callsLoading]);

  useEffect(() => {
    if (
      !callsLoading &&
      !applicationsLoading &&
      applications.length > 0 &&
      activeCall
    ) {
      const stats = getCallStats(activeCall, applications);
      setCallStats(stats);
    }
  }, [callsLoading, applicationsLoading, activeCall]);

  useEffect(() => {
    if (
      !callsLoading &&
      !applicationsLoading &&
      applications.length > 0 &&
      applicantsCall
    ) {
      const data = getApplicantsData(applications);
      setApplicantsData(data);
    }
  }, [callsLoading, applicationsLoading, applicantsCall]);

  useEffect(() => {
    if (
      !callsLoading &&
      !applicationsLoading &&
      applications.length > 0 &&
      applicationsCall
    ) {
      const data = getApplicationsData(applications);
      setApplicationsData(data);
    }
  }, [callsLoading, applicationsLoading, applicationsCall]);

  useEffect(() => {
    if (
      !callsLoading &&
      !applicationsLoading &&
      applications.length > 0 &&
      submissionsCall
    ) {
      const data = getSubmissionsData(applications);
      setSubmissionsData(data);
    }
  }, [callsLoading, applicationsLoading, submissionsCall]);

  const sortedSectors = Object.entries(callStats?.applicantsPerSector || {})
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);
  const othersTotal = Object.entries(callStats?.applicantsPerSector || {})
    .slice(5)
    .reduce((sum, [, value]: any[]) => sum + value, 0);
  const displayedSectors = [
    ...sortedSectors,
    othersTotal > 0 ? ["Others", othersTotal] : null,
  ].filter(Boolean);
  return (
    <div>
      <div className="flex items-center justify-end">
        <Select
          value={activeCall}
          data={calls.map((call: any) => ({
            value: call.uuid,
            label: call.title,
          }))}
          onChange={(value) => setActiveCall(value as any)}
          className="bg-white p-2.5 rounded-2xl outline-none "
        />
      </div>
      <div className="mt-8 flex flex-wrap gap-6">
        <div className="bg-white p-6 rounded-2xl flex-grow">
          <h2 className="text-lg font-semibold mb-4">
            Applicants per Priority Sector
          </h2>
          {
            //@ts-ignore
            displayedSectors.map(([sector, count], index) => (
              <div
                key={index}
                className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
              >
                <span className="text-base">{sector}</span>
                <span className="text-base bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                  {count}
                </span>
              </div>
            ))
          }

          {/* Total count */}
          <div className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2">
            <span className="text-base">Total</span>
            <span className="text-base bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
              {
                Object.values(callStats?.applicantsPerSector || {}).reduce(
                  (sum: any, value) => sum + value,
                  0
                ) as any
              }
            </span>
          </div>
        </div>
        <div className=" bg-white rounded-2xl w-[25%] p-6 flex-grow">
          <div className="my-5">
            <div className="relative flex items-center justify-center flex-col">
              <div className="">
                <PieChart
                  width={300}
                  height={300}
                  className="flex items-center ml-24"
                  series={[
                    {
                      data: [
                        {
                          id: 2,
                          value: callStats?.genderCount.female,
                          color: "#FF00A8",
                        },
                        {
                          id: 1,
                          value: callStats?.genderCount.male,
                          color: "#005DE9",
                        },
                      ],
                    },
                  ]}
                />
              </div>
              <div className="absolute inset-0 m-0 flex  flex-col items-center justify-center mb-20">
                <div className="text-3xl  font-bold text-white">
                  {callStats?.genderCount.male + callStats?.genderCount.female}
                </div>
                <div className="text-sm text-white">in this level</div>
              </div>
              <div className="flex justify-between w-full mt-2 text-sm text-gray-700">
                <div className="flex gap-2">
                  <span>
                    <Image src={Male} alt="male" />
                  </span>
                  Male:{" "}
                  {(
                    (callStats?.genderCount.male /
                      (callStats?.genderCount.male +
                        callStats?.genderCount.female)) *
                    100
                  ).toFixed(0)}
                  %
                </div>
                <div className="flex gap-2">
                  <span>
                    <Image src={Female} alt="female" />
                  </span>
                  Female:{" "}
                  {(
                    (callStats?.genderCount.female /
                      (callStats?.genderCount.male +
                        callStats?.genderCount.female)) *
                    100
                  ).toFixed(0)}
                  %
                </div>
              </div>
              <div className="flex justify-between w-full mt-2 text-lg">
                <div className="text-blue-600">
                  Male Count: {callStats?.genderCount.male}
                </div>
                <div className="text-purple-600">
                  Female Count: {callStats?.genderCount.female}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl flex-grow p-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-8">Total Applicants</h2>
            {/* <Select
              value={businessTypeStage}
              data={Object.keys(dashboardData.businessTypeByStage).map(
                (key) => ({ value: key, label: key })
              )}
              onChange={(value) => setBusinessTypeStage(value as any)}
            /> */}
          </div>
          <div className="h-[90%] rounded-lg flex flex-col items-center justify-center gap-3">
            <BasicGauges
              applicationsByBusinessType={
                Object.keys(callStats?.businessTypeGroupings || {}).reduce(
                  (acc, item) => {
                    acc[item] =
                      callStats?.businessTypeGroupings[item]["EVALUATION"];
                    return acc;
                  },
                  {} as { [key: string]: number }
                ) || {}
              }
            />
          </div>
        </div>
      </div>
      <div className=" flex justify-between items-center mt-10 mb-5">
        <div>Priority Sector Analysis</div>
        <div className="flex gap-2 bg-[#005de9] px-24 py-2 rounded-full text-white items-center justify-center p-4 mt-4">
          <span>
            <SolarFileBold />
          </span>
          Export as excel
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="bg-white p-6 rounded-2sm">
          <div className="flex justify-between mb-5">
            <p className="font-bold text-xl">Number of Submissions</p>
            {/* <div className="text-md gap-4 flex items-center justify-center">
              <Select
                value={submissionsCall}
                data={calls.map((call: any) => ({
                  value: call.uuid,
                  label: call.title,
                }))}
                onChange={(value) => setSubmissionsCall(value as any)}
              />
            </div> */}
          </div>
          <div className="flex justify-between ">
            <span className="w-1/2">Sector</span>
            <span className="w-1/5 text-center">Applicants</span>
            <span className="w-1/5 text-center">Applications</span>
          </div>
          <div className="space-y-4">
            {Object.keys(submissionsData || {}).map((key: any, index) => (
              <div
                key={key}
                className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
              >
                <span className="w-1/2">{key}</span>
                <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                  {submissionsData[key].applicants}
                </span>
                <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                  {submissionsData[key].applications}
                </span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-2 rounded-xl bg-[#005DE91F] text-primary font-bold">
              <span>Total</span>
              <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                {Object.keys(submissionsData || {}).reduce(
                  (sum, key) => sum + submissionsData[key].applicants,
                  0
                )}
              </span>
              <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                {Object.keys(submissionsData || {}).reduce(
                  (sum, key) => sum + submissionsData[key].applications,
                  0
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2sm">
          <div className="flex justify-between mb-5">
            <p className="font-bold text-xl">Applicants</p>
            {/* <div className="text-md gap-4 flex items-center justify-center">
              <Select
                value={applicantsCall}
                data={calls.map((call: any) => ({
                  value: call.uuid,
                  label: call.title,
                }))}
                onChange={(value) => setApplicantsCall(value as any)}
              />
            </div> */}
          </div>
          <div className="flex justify-between ">
            <span className="w-1/2">Sector</span>
            <span className="w-1/5 text-center">Applicants</span>
          </div>
          <div className="space-y-4">
            {Object.keys(applicantsData || {}).map((key: any, index) => (
              <div
                key={key}
                className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
              >
                <span className="w-1/2">{key}</span>
                <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                  {applicantsData[key]}
                </span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-2 rounded-xl bg-[#005DE91F] text-primary font-bold">
              <span>Total</span>
              <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                {Object.keys(applicantsData || {}).reduce(
                  (sum, key) => sum + applicantsData[key],
                  0
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2sm">
          <div className="flex justify-between mb-5">
            <p className="font-bold text-lg">Applications</p>
            {/* <div className="text-md gap-4 flex items-center justify-center">
              <Select
                value={applicationsCall}
                data={calls.map((call: any) => ({
                  value: call.uuid,
                  label: call.title,
                }))}
                onChange={(value) => setApplicationsCall(value as any)}
              />
            </div> */}
          </div>
          <div className="flex justify-between ">
            <span className="w-1/2">Sector</span>
            <span className="w-1/5 text-center">Applications</span>
          </div>
          <div className="space-y-4">
            {Object.keys(applicationsData || {}).map((key: any, index) => (
              <div
                key={key}
                className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
              >
                <span className="w-1/2">{key}</span>
                <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                  {applicationsData[key]}
                </span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-2 rounded-xl bg-[#005DE91F] text-primary font-bold">
              <span>Total</span>
              <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                {Object.keys(applicationsData || {}).reduce(
                  (sum, key) => sum + applicationsData[key],
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function BasicGauges({
  applicationsByBusinessType,
}: {
  applicationsByBusinessType: { [key: string]: number };
}) {
  const totalApplicants = Object.values(applicationsByBusinessType).reduce(
    (sum, value) => sum + value,
    0
  );

  const colors = [
    "#005DE9",
    "#90EE90",
    "#EA4228",
    "#FFAA33",
    "#00C49A",
    "#FF69B4",
    "#FFD700",
    "#8A2BE2",
  ];

  const chartData = Object.entries(applicationsByBusinessType).map(
    ([key, value], index) => ({
      key,
      value,
      percentage: totalApplicants > 0 ? (value / totalApplicants) * 100 : 0,
      color: colors[index % colors.length],
    })
  );

  return (
    <div className="flex items-center justify-center flex-col ">
      <div style={{ position: "relative", display: "inline-block" }}>
        <GaugeChart
          id="gauge-chart"
          nrOfLevels={chartData.length}
          arcsLength={chartData.map((data) => data.percentage / 100)}
          colors={chartData.map((data) => data.color)}
          percent={0.5}
          arcPadding={0.02}
          hideText={true}
          needleColor="transparent"
          needleBaseColor="transparent"
        />
        <p
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <p>{totalApplicants}</p>
            <p className="text-sm">Applicants</p>
          </div>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-10">
        {chartData
          .filter(({ key }) => key)
          .map(({ key, color }, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: color }}
              />
              <p className="capitalize">{key}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
