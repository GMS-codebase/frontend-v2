import React, { useEffect, useState } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Group from "../../assets/Vectors/Group.svg";
import Male from "../../assets/Vectors/ion_male.svg";
import Female from "../../assets/Vectors/icon-park-outline_female.svg";

import Image from "next/image";

interface ProgressGenderProps {
  boysCount: number; // Count of boys
  girlsCount: number; // Count of girls
  totalCount: number; // Total count (boys + girls)
  startDate: string; // Start date in 'YYYY-MM-DD' format
  endDate: string; // End date in 'YYYY-MM-DD' format
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
  boysCount,
  girlsCount,
  totalCount,
  startDate,
  endDate,
}) => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<
    "male" | "female" | null
  >(null);

  useEffect(() => {
    const { remainingDays } = calculateDaysRemaining(startDate, endDate);
    setDaysRemaining(remainingDays);
  }, [startDate, endDate]);

  // Calculate male and female percentages
  const malePercentage = totalCount > 0 ? (boysCount / totalCount) * 100 : 0;
  const femalePercentage = totalCount > 0 ? (girlsCount / totalCount) * 100 : 0;

  return (
    <div className="relative flex items-center justify-center flex-col">
      <Gauge
        width={200}
        height={200}
        value={malePercentage}
        cornerRadius="50%"
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            display: "none",
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: hoveredSegment === "male" ? "#005de9" : "#52b202", // Blue on hover
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill:
              hoveredSegment === "female"
                ? "#ff00a8"
                : theme.palette.text.disabled, // Pink on hover
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: "#ff00a8", // Default pink for girls
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: "#005de9", // Default blue for boys
          },
        })}
      />

      {/* Overlay for total count and text */}
      <div className="absolute inset-0 m-0 flex  flex-col items-center justify-center mb-20">
        <Image src={Group} alt="sign" />
        <div className="text-3xl  font-bold text-gray-800">{totalCount}</div>
        <div className="text-sm text-gray-600">in this level</div>
      </div>

      {/* Male and Female Percentages */}
      <div className="flex justify-between w-full mt-2 text-sm text-gray-700">
        <div className="flex gap-2">
          <span>
            <Image src={Male} alt="male" />
          </span>
          Male: {malePercentage.toFixed(0)}%
        </div>
        <div className="flex gap-2">
          <span>
            <Image src={Female} alt="female" />
          </span>
          Female: {femalePercentage.toFixed(0)}%
        </div>
      </div>

      {/* Display counts outside the progress circle */}
      <div className="flex justify-between w-full mt-2 text-lg">
        <div
          className="text-blue-600"
          onMouseEnter={() => setHoveredSegment("male")}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          Boys Count: {boysCount}
        </div>
        <div
          className="text-purple-600"
          onMouseEnter={() => setHoveredSegment("female")}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          Girls Count: {girlsCount}
        </div>
      </div>

      {/* Days remaining display */}
      <div className="mt-2 text-gray-600">
        {daysRemaining > 0 ? `Days Remaining: ${daysRemaining}` : "Event Ended"}
      </div>
    </div>
  );
};

export default ProgressGender;
