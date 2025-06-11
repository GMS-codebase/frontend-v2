"use client";
import {
  SolarBenzeneRingBroken,
  SolarCalendarBold,
  SolarFileBold,
} from "@/components/core/icons";
import {
  downloadDashboardExcelFile,
  getApplicantsData,
  getApplicationsData,
  getCallStats,
  getSubmissionsData,
} from "@/utils/funcs/dashboard";
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
import Dash from "./dash";
import AdminAction from "@/components/Actions/AdminAction";

const Dashboard = () => {
  const { calls, loading: callsLoading } = useSelector(
    (state: any) => state.calls
  );
  const [callStats, setCallStats] = useState<any>(null);
  const [callStatsError, setCallStatsError] = useState<string | null>(null);
  const [callStatsLoading, setCallStatsLoading] = useState<boolean>(true);

  const [applicantsData, setApplicantsData] = useState<any>({});
  const [applicantsDataError, setApplicantsDataError] = useState<string | null>(null);
  const [applicantsDataLoading, setApplicantsDataLoading] = useState<boolean>(true);

  const [applicationsData, setApplicationsData] = useState<any>({});
  const [applicationsDataError, setApplicationsDataError] = useState<string | null>(null);
  const [applicationsDataLoading, setApplicationsDataLoading] = useState<boolean>(true);

  const [submissionsData, setSubmissionsData] = useState<any>({});
  const [submissionsDataError, setSubmissionsDataError] = useState<string | null>(null);
  const [submissionsDataLoading, setSubmissionsDataLoading] = useState<boolean>(true);

  const [activeCall, setActiveCall] = useState<string>("");
  const [applicantsStage, setApplicantsStage] = useState<string>("ALL");
  const [applicationsStage, setApplicationsStage] = useState<string>("ALL");
  const [submissionsStage, setSubmissionsStage] = useState<string>("ALL");
  const [gaugeStage, setGaugeStage] = useState<string>("ALL");
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const dashTablesData = [
    {
      sector: "Manufacturing",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Hospitality & Tourism",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Transport & Logistics",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Agriculture",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Energy",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Mining",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "ICT & Digital Skills",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Construction",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Other",
      col1Data: 0,
      col2Data: 0,
    },
    {
      sector: "Total",
      col1Data: 0,
      col2Data: 0,
    },
  ];

  useEffect(() => {
    if (!callsLoading && calls.length > 0) {
      setActiveCall(calls[0].uuid);
    }
  }, [callsLoading]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!callsLoading && activeCall) {
          setCallStatsLoading(true);
        setApplicantsDataLoading(true);
        setApplicationsDataLoading(true);
        setSubmissionsDataLoading(true);
        setCallStatsError(null);
        setApplicantsDataError(null);
        setApplicationsDataError(null);
        setSubmissionsDataError(null);
        const results = await Promise.allSettled([
          getCallStats(activeCall),
          getApplicantsData(applicantsStage),
          getApplicationsData(applicationsStage),
          getSubmissionsData(submissionsStage),
        ]);
        // Call Stats
        if (results[0].status === 'fulfilled') {
          setCallStats(results[0].value);
          setCallStatsError(null);
        } else {
          setCallStats(null);
          setCallStatsError('Failed to load call stats');
        }
        setCallStatsLoading(false);
        // Applicants Data
        if (results[1].status === 'fulfilled') {
          setApplicantsData(results[1].value);
          setApplicantsDataError(null);
        } else {
          setApplicantsData({});
          setApplicantsDataError('Failed to load applicants data');
        }
          setApplicantsDataLoading(false);
        // Applications Data
        if (results[2].status === 'fulfilled') {
          setApplicationsData(results[2].value);
          setApplicationsDataError(null);
        } else {
          setApplicationsData({});
          setApplicationsDataError('Failed to load applications data');
        }
          setApplicationsDataLoading(false);
        // Submissions Data
        if (results[3].status === 'fulfilled') {
          setSubmissionsData(results[3].value);
          setSubmissionsDataError(null);
        } else {
          setSubmissionsData({});
          setSubmissionsDataError('Failed to load submissions data');
        }
          setSubmissionsDataLoading(false);
      }
    };
    fetchDashboardData();
  }, [callsLoading, activeCall, applicantsStage, applicationsStage, submissionsStage]);

  const sortedSectors = Object.entries(callStats?.applicantsPerSector || {});
  return (
    <div>
      <div className="md:flex items-center justify-between">
        <p>Evaluation</p>
        {!callsLoading && (
          <Select
            value={activeCall}
            data={calls.map((call: any) => ({
              value: call?.uuid,
              label: call?.title,
            }))}
            onChange={(value) => setActiveCall(value as any)}
            className="bg-white p-2.5 rounded-2xl outline-none  md:w-[30vw]"
          />
        )}
      </div>

      {/* Applicants per Priority Sector */}
      {callStatsLoading ? (
        <div className="bg-gray-200 animate-pulse rounded-2xl h-64 w-full mt-8"></div>
      ) : callStatsError ? (
        <div className="bg-red-100 text-red-700 rounded-2xl h-64 w-full mt-8 flex items-center justify-center font-semibold">
          {callStatsError}
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-6">
          <div className="bg-white p-6 rounded-2xl flex-grow">
            <h2 className="text-lg font-semibold mb-4">
              Applicants per Priority Sector
            </h2>
            {
              //@ts-ignore
              sortedSectors.map(([sector, count], index) => (
                <div
                  key={index}
                  className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
                >
                  <span className="text-base">{sector}</span>
                  <span className="text-base bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                    {count as any}
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
                    {callStats?.genderCount.male +
                      callStats?.genderCount.female}
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
            <div className="md:flex justify-between mb-8">
              <h2 className="text-lg font-semibold ">Total Applicants</h2>
              <div className="rounded-full bg-slate-400 bg-opacity-10">
                <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                  <span className="text-gray-400">
                    <SolarBenzeneRingBroken />
                  </span>
                  <select
                    className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none"
                    value={gaugeStage}
                    onChange={(e) => setGaugeStage(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="EVALUATION">Evaluation</option>
                    <option value="DUE_DILIGENCY">Due Diligency</option>
                    <option value="GRANT_COMMITTEE">Grant Committee</option>
                    <option value="CONTRACT_SIGNING">Contract Signing</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="h-[90%] rounded-lg flex flex-col items-center justify-center gap-3">
              <BasicGauges
                applicationsByBusinessType={
                  Object.keys(callStats?.businessTypeGroupings || {}).reduce(
                    (acc: any, item: any) => {
                      if (gaugeStage === "ALL") {
                        acc[item] = Object.values(
                          callStats?.businessTypeGroupings[item] || {}
                        ).reduce((sum: any, value: any) => sum + value, 0);
                      } else {
                        acc[item] =
                          callStats?.businessTypeGroupings[item][gaugeStage] ||
                          0;
                      }
                      return acc;
                    },
                    {} as { [key: string]: number }
                  ) || {}
                }
              />
            </div>
          </div>
        </div>
      )}
      <div className="md:flex justify-between items-center mt-10 mb-5">
        <div>Priority Sector Analysis</div>
        <div
          className="flex gap-2 bg-[#005de9] px-24 py-2 rounded-full text-white items-center justify-center p-4 mt-4"
          onClick={() =>
            downloadDashboardExcelFile(
              applicationsData,
              applicantsData,
              submissionsData
            )
          }
        >
          <span>
            <SolarFileBold />
          </span>
          Export as excel
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
        {/* Submissions Data */}
        {submissionsDataLoading ? (
          <div className="bg-gray-200 animate-pulse rounded-2xl h-64 w-full"></div>
        ) : submissionsDataError ? (
          <div className="bg-red-100 text-red-700 rounded-2xl h-64 w-full flex items-center justify-center font-semibold">
            {submissionsDataError}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl">
            <div className="md:flex justify-between mb-5">
              <p className="font-bold text-xl">Number of Submissions</p>
              <div className="text-md gap-4 flex items-center justify-center">
                <div className="rounded-full bg-slate-400 bg-opacity-10">
                  <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                    <span className="text-gray-400">
                      <SolarBenzeneRingBroken />
                    </span>
                    <select
                      className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none"
                      onChange={(e) => setSubmissionsStage(e.target.value)}
                      value={submissionsStage}
                    >
                      <option value="ALL">All</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="EVALUATION">Evaluation</option>
                      <option value="DUE_DILIGENCY">Due Diligency</option>
                      <option value="GRANT_COMMITTEE">Grant Committee</option>
                      <option value="CONTRACT_SIGNING">Contract Signing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <AdminAction
                    call={null}
                    setIsCall={() => {}}
                    exportFunction={() =>
                      downloadDashboardExcelFile(
                        undefined,
                        undefined,
                        submissionsData
                      )
                    }
                  />{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between ">
              <span className="w-1/2">Sector</span>
              <span className="w-1/5 text-center">Applicants</span>
              <span className="w-1/5 text-center">Applications</span>
            </div>
            <div className="space-y-4">
              {Object.keys(submissionsData || {}).length === 0 ? (
                <div>
                  <div className="flex items-center justify-center h-60 w-full text-center text-gray-500">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                      <p className="text-lg font-semibold text-gray-700">
                        No data Available
                      </p>
                      <p className="text-sm text-gray-500">
                        Please select a different stage
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                Object.keys(submissionsData || {}).map((key: any, index) => (
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
                ))
              )}
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
        )}

        {/* Applicants Data */}
        {applicantsDataLoading ? (
          <div className="bg-gray-200 animate-pulse rounded-2xl h-64 w-full"></div>
        ) : applicantsDataError ? (
          <div className="bg-red-100 text-red-700 rounded-2xl h-64 w-full flex items-center justify-center font-semibold">
            {applicantsDataError}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl">
            <div className="md:flex justify-between mb-5">
              <p className="font-bold text-xl">Applicants</p>
              <div className="text-md gap-4 flex items-center justify-center">
                <div className="rounded-full bg-slate-400 bg-opacity-10">
                  <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                    <span className="text-gray-400">
                      <SolarBenzeneRingBroken />
                    </span>
                    <select
                      className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none"
                      onChange={(e) => setApplicantsStage(e.target.value)}
                      value={applicantsStage}
                    >
                      <option value="ALL">All</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="EVALUATION">Evaluation</option>
                      <option value="DUE_DILIGENCY">Due Diligency</option>
                      <option value="GRANT_COMMITTEE">Grant Committee</option>
                      <option value="CONTRACT_SIGNING">Contract Signing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <AdminAction
                    call={null}
                    setIsCall={() => {}}
                    exportFunction={() =>
                      downloadDashboardExcelFile(
                        undefined,
                        applicantsData,
                        undefined
                      )
                    }
                  />{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between ">
              <span className="w-1/2">Sector</span>
              <span className="w-1/5 text-center">Applicants</span>
            </div>
            <div className="space-y-4">
              {Object.keys(applicantsData || {}).length === 0 ? (
                <div>
                  <div className="flex items-center justify-center h-60 w-full text-center text-gray-500">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                      <p className="text-lg font-semibold text-gray-700">
                        No data Available
                      </p>
                      <p className="text-sm text-gray-500">
                        Please select a different stage
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                Object.keys(applicantsData || {}).map((key: any, index) => (
                  <div
                    key={key}
                    className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
                  >
                    <span className="w-1/2">{key}</span>
                    <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                      {applicantsData[key]}
                    </span>
                  </div>
                ))
              )}
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
        )}

        {/* Applications Data */}
        {applicationsDataLoading ? (
          <div className="bg-gray-200 animate-pulse rounded-2xl h-64 w-full"></div>
        ) : applicationsDataError ? (
          <div className="bg-red-100 text-red-700 rounded-2xl h-64 w-full flex items-center justify-center font-semibold">
            {applicationsDataError}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl">
            <div className="md:flex justify-between mb-5">
              <p className="font-bold text-lg">Applications</p>
              <div className="text-md gap-4 flex items-center justify-center">
                <div className="rounded-full bg-slate-400 bg-opacity-10">
                  <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                    <span className="text-gray-400">
                      <SolarBenzeneRingBroken />
                    </span>
                    <select
                      className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none"
                      onChange={(e) => setApplicationsStage(e.target.value)}
                      value={applicationsStage}
                    >
                      <option value="ALL">All</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="EVALUATION">Evaluation</option>
                      <option value="DUE_DILIGENCY">Due Diligency</option>
                      <option value="GRANT_COMMITTEE">Grant Committee</option>
                      <option value="CONTRACT_SIGNING">Contract Signing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <AdminAction
                    call={null}
                    setIsCall={() => {}}
                    exportFunction={() =>
                      downloadDashboardExcelFile(
                        applicationsData,
                        undefined,
                        undefined
                      )
                    }
                  />{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between ">
              <span className="w-1/2">Sector</span>
              <span className="w-1/5 text-center">Applications</span>
            </div>
            <div className="space-y-4">
              {Object.keys(applicationsData || {}).length === 0 ? (
                <div>
                  <div className="flex items-center justify-center h-60 w-full text-center text-gray-500">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                      <p className="text-lg font-semibold text-gray-700">
                        No data Available
                      </p>
                      <p className="text-sm text-gray-500">
                        Please select a different stage
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                Object.keys(applicationsData || {}).map((key: any, index) => (
                  <div
                    key={key}
                    className="flex justify-between bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
                  >
                    <span className="w-1/2">{key}</span>
                    <span className="w-1/5 text-center bg-[#005DE91F] rounded-2xl px-4 text-primary font-bold">
                      {applicationsData[key]}
                    </span>
                  </div>
                ))
              )}
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
        )}

        <div className="bg-white p-6 rounded-2sm">
          <div className="md:flex justify-between">
            <p className="font-bold text-lg">Selected Trainees</p>
            <div className="text-md gap-4 flex items-center justify-center">
              <div className="rounded-full bg-slate-400 bg-opacity-10">
                <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                  <span className="text-gray-400">
                    <SolarBenzeneRingBroken />
                  </span>
                  <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none">
                    <option value="select-stage">All</option>
                    <option value="select-stage">Evaluation</option>
                    <option value="select-stage">Due Diligency</option>
                    <option value="select-stage">Grant Committee</option>
                    <option value="select-stage">Contract Signing</option>
                  </select>
                </div>
              </div>
              <div>
                <AdminAction call={null} setIsCall={() => {}} />{" "}
              </div>
            </div>
          </div>
          <Dash col1="Number" data={dashTablesData} showSingleRow={true} />
        </div>
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex flex-col justify-between gap-3 w-full">
            <p className="w-full font-bold text-lg">
              Number of graduates trainees before 2025
            </p>
            <div className="flex items-center justify-between w-full">
              <div className="rounded-full bg-slate-400 bg-opacity-10 md:w-[40%] px-3">
                <label
                  htmlFor="call"
                  className="w-full flex items-center py-2 gap-2 rounded-full"
                >
                  <span id="call" className="text-gray-400">
                    <SolarBenzeneRingBroken />
                  </span>
                  <select
                    id="call"
                    className="w-full px-0 rounded-full text-md bg-transparent outline-none border-none appearance-none"
                  >
                    {calls.map((call: any) => (
                      <option value={call?.uuid} key={call?.uuid}>
                        {call?.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="text-md gap-4 flex items-center justify-center">
                <div>
                  <AdminAction call={null} setIsCall={() => {}} />{" "}
                </div>
              </div>
            </div>
          </div>
          <Dash col1="Male" col2="Female" data={dashTablesData} />
        </div>
        <div className="bg-white p-6 rounded-2xl">
          <div className=" justify-center items-center">
            <p className="font-bold text-lg">
              Number of Trainees Starting from 2025
            </p>
            <div className="text-md gap-2 md:grid-cols-4 grid grid-cols-2 my-2 ">
              <div className="flex gap-2 rounded-full bg-slate-400 bg-opacity-10 items-center justify-center py-2 px-5">
                <span className="text-gray-400">
                  <SolarCalendarBold />
                </span>
                <p className="text-xs">Starting date</p>
              </div>
              <div className="flex gap-2 rounded-full bg-slate-400 bg-opacity-10 items-center justify-center py-2 px-5">
                <span className="text-gray-400">
                  <SolarCalendarBold />
                </span>
                <p className="text-xs">Ending date</p>
              </div>
              <div className="rounded-full bg-slate-400 bg-opacity-10">
                <div className="flex items-center justify-around px-6 py-2 gap-2 rounded-full w-full">
                  <span className="text-gray-400">
                    <SolarBenzeneRingBroken />
                  </span>
                  <select className="w-full rounded-full text-md bg-transparent outline-none border-none appearance-none text-xs">
                    <option value="select-stage">All</option>
                    <option value="select-stage">Ongoing</option>
                    <option value="select-stage">Completed</option>
                    <option value="select-stage">Graduated</option>
                  </select>
                </div>
              </div>
              <div>
                <AdminAction call={null} setIsCall={() => {}} />{" "}
              </div>
            </div>
          </div>
          <Dash col1="Male" col2="Female" data={dashTablesData} />
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

  if (totalApplicants === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold text-gray-700">
            No data Available
          </p>
          <p className="text-sm text-gray-500">
            Please select a different stage
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div style={{ position: "relative", display: "inline-block" }}>
        <GaugeChart
          id="gauge-chart"
          nrOfLevels={chartData.length}
          arcsLength={chartData.map((data) => data.percentage / 100)}
          colors={chartData.map((data) => data.color)}
          percent={totalApplicants > 0 ? totalApplicants / 100 : 0}
          arcPadding={0.02}
          hideText={true}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className="flex flex-col justify-center items-center"
        >
          <p>{totalApplicants}</p>
          <p className="text-sm">Applicants</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-10 mt-4">
        {chartData.map(({ key, color, value }, index) => (
          <div key={index} className="flex items-center">
            <div className="w-4 h-4 mr-2" style={{ backgroundColor: color }} />
            <p className="capitalize">
              {key}: {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
