import React, { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import Group from "../../assets/Vectors/Vector.svg";
import Male from "../../assets/Vectors/ion_male.svg";
import Female from "../../assets/Vectors/icon-park-outline_female.svg";

import Image from "next/image";
import { authorizedApi } from "@/utils/api";

interface ProgressGenderProps {
  startDate: string; 
  endDate: string; 
  callId: string;
}

const calculateDaysRemaining = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const remainingDays = (end - now) / (1000 * 60 * 60 * 24);

  return {
    remainingDays: Math.ceil(Math.max(0, remainingDays)),
    totalDays,
  };
};

const ProgressGender: React.FC<ProgressGenderProps> = ({
  startDate,
  endDate,
  callId,
}) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    authorizedApi
      .get(
        `/trainees/dashboard/traines_by_genders/${callId}?currentStage=EVALUATION`,
      )
      .then((res) => {
        setData(res.data.sectorSummary[0]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [callId, loading]);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<
    "male" | "female" | null
  >(null);

  useEffect(() => {
    const { remainingDays } = calculateDaysRemaining(startDate, endDate);
    setDaysRemaining(remainingDays);
  }, [startDate, endDate]);
  const male = data?.male ?? 0;
  const female = data?.female ?? 0;
  const totalCount = male + female;
  const malePercentage = totalCount > 0 ? (male / totalCount) * 100 : "None";
  const femalePercentage =
    totalCount > 0 ? (female / totalCount) * 100 : "None";

  return (
    <div className="relative flex items-center justify-center flex-col">
   <div className="">
         <PieChart
     width={300}
     height={300}
    className="flex items-center ml-24"
    
  series={[
        {
          data: [
            { id: 1, value: 15,color:"#005DE9" },
            { id: 2, value: 20,color:"#FF00A8" },
          ],
        },
      ]}
      />
   </div>

      {/* Overlay for total count and text */}
      <div className="absolute inset-0 m-0 flex  flex-col items-center justify-center mb-20">

          {/* <Image src={Group} alt="sign" /> */}
        <div className="text-3xl  font-bold text-white">{totalCount}</div>
        <div className="text-sm text-white">in this level</div>

      </div>

      {/* Male and Female Percentages */}
      <div className="flex justify-between w-full mt-2 text-sm text-gray-700">
        <div className="flex gap-2">
          <span>
            <Image src={Male} alt="male" />
          </span>
          Male:{" "}
          {malePercentage !== "None" ? `${malePercentage}%` : malePercentage}
        </div>
        <div className="flex gap-2">
          <span>
            <Image src={Female} alt="female" />
          </span>
          Female:{" "}
          {malePercentage !== "None"
            ? `${femalePercentage}%`
            : femalePercentage}
        </div>
      </div>

      {/* Display counts outside the progress circle */}
      <div className="flex justify-between w-full mt-2 text-lg">
        <div
          className="text-blue-600"
          onMouseEnter={() => setHoveredSegment("male")}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          Male Count: {male}
        </div>
        <div
          className="text-purple-600"
          onMouseEnter={() => setHoveredSegment("female")}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          Female Count: {female}
        </div>
      </div>
      <div className="mt-2 text-gray-600">
        {daysRemaining > 0 ? `Days Remaining: ${daysRemaining}` : "Event Ended"}
      </div>
    </div>
  );
};

export default ProgressGender;
