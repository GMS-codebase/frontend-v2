import React, { useEffect, useState } from "react";

interface ProgressCircleProps {
  baseColor: string;
  activeColor: string;
  bgColor: string;
  startDate: string; // Start date in 'YYYY-MM-DD' format
  endDate: string; // End date in 'YYYY-MM-DD' format
}

const calculateDaysRemaining = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const remainingDays = (end - now) / (1000 * 60 * 60 * 24);

  const percentageCompleted = Math.min(
    100,
    Math.max(0, (1 - remainingDays / totalDays) * 100)
  );

  return {
    remainingDays: Math.ceil(Math.max(0, remainingDays)),
    percentageCompleted,
  };
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  baseColor,
  bgColor,
  activeColor,
  startDate,
  endDate,
}) => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const { remainingDays, percentageCompleted } = calculateDaysRemaining(
      startDate,
      endDate
    );
    setDaysRemaining(remainingDays);
    setProgress(percentageCompleted);
  }, [startDate, endDate]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div
          className="w-40 h-40 rounded-full flex items-center justify-center relative"
          style={{
            background: `conic-gradient(${activeColor} ${progress}%, ${baseColor} ${progress}% 100%)`,
          }}
        >
          <div
            className="absolute w-28 h-28   rounded-full "
            style={{ background: bgColor }}
          ></div>
          <div className="absolute flex flex-col items-center justify-center p-2 ">
            <div className="text-2xl font-bold text-gray-800">
              {daysRemaining}
            </div>
            <div className="text-xs text-gray-500">days remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;
