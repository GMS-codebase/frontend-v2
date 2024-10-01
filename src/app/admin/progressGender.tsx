import React, { useEffect, useState } from "react";

interface ProgressGenderProps {
  boysCount: number; // Count of boys
    girlsCount: number; // Count of girls
      totalCount: number; // Ad
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
  startDate,
  endDate,
}) => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [totalCount, setTotalCount] = useState(boysCount + girlsCount); // Initialize total count
  const [hoveredSegment, setHoveredSegment] = useState<"male" | "female" | null>(null); // State for hovered segment

  useEffect(() => {
    const { remainingDays } = calculateDaysRemaining(startDate, endDate);
    setDaysRemaining(remainingDays);
    setTotalCount(boysCount + girlsCount); // Update total count
  }, [boysCount, girlsCount, startDate, endDate]);

  // Calculate male and female percentages
  const malePercentage = totalCount > 0 ? (boysCount / totalCount) * 100 : 0;
  const femalePercentage = totalCount > 0 ? (girlsCount / totalCount) * 100 : 0;

  return (
      <div className="flex items-center justify-center flex-col">
          <div className="relative">
              <div
                  className="w-40 h-40 rounded-full flex items-center justify-center relative cursor-pointer"
                  style={{
                      background: `conic-gradient(
               rgba(0, 93, 233, 1)${malePercentage}%,
              rgba(255, 0, 168, 1)${femalePercentage}%,
              transparent ${malePercentage + femalePercentage}%
            )`,
                  }}
                  onMouseEnter={() => setHoveredSegment("male")} // Show male count on hover
                  onMouseLeave={() => setHoveredSegment(null)} // Hide count on mouse leave
              >
                  <div className="absolute w-28 h-28 rounded-full bg-white"></div>
                  <div className="absolute flex flex-col items-center justify-center p-2">
                      <div className="text-2xl font-bold text-gray-800">
                          {totalCount}
                      </div>
                      <div className="text-xs text-gray-500">Applicants</div>
                  </div>
              </div>
              <div className="flex justify-between w-full mt-2 text-sm text-gray-700">
                  <div>Male: {malePercentage.toFixed(0)}%</div>
                  <div>Female: {femalePercentage.toFixed(0)}%</div>
              </div>
          </div>
          {/* Display counts outside the progress circle */}
          <div className="flex justify-between w-full mt-2 text-lg">
              <div className="text-blue-600">
                  {hoveredSegment === "male"
                      ? `Boys Count: ${boysCount}`
                      : `Boys Count: 0`}
              </div>
              <div className="text-purple-600">
                  {hoveredSegment === "female"
                      ? `Girls Count: ${girlsCount}`
                      : `Girls Count: 0`}
              </div>
          </div>
      </div>
  );
};

export default ProgressGender;
