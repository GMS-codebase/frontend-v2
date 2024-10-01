import React from "react";

interface CustomBarChartProps {
  data: { day: string; completed: number; ongoing: number }[];
  maxValue: number;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data, maxValue }) => {
  // Generate y-axis values based on maxValue
  const yAxisValues = [
    "",
    "",
    ...Array.from({ length: 6 }, (_, i) => Math.round((maxValue / 5) * i)),
    "",
  ];

  return (
    <div className="flex space-x-4">
      {/* Y-axis labels */}
      <div className="flex flex-col justify-between h-64">
        {yAxisValues.reverse().map((value, index) => (
          <span key={index} className="text-sm text-secondaryText">
            {value}
          </span>
        ))}
      </div>

      {/* Bars section */}
      <div className="flex-1 flex justify-between items-end h-64 relative">
        {data.map((item, index) => {
          // Calculate the height percentages for completed and ongoing bars
          const completedHeightPercent = (item.completed / maxValue) * 100;
          const ongoingHeightPercent = (item.ongoing / maxValue) * 100;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end w-12 h-full"
            >
              {/* Bar container */}
              <div className="py-3 flex-grow w-full rounded-2xl flex flex-col items-center">
                <div className="h-full flex flex-col justify-end rounded-t-lg">
                  {/* Completed bar (blue) */}
                  <div
                    className="rounded-t-lg w-4 bg-blue-500"
                    style={{
                      height: `${completedHeightPercent}%`,
                    }}
                  ></div>

                  {/* Ongoing bar (orange) */}
                  <div
                    className="rounded-t-lg w-4 bg-orange-500 mt-1"
                    style={{
                      height: `${ongoingHeightPercent}%`,
                    }}
                  ></div>
                </div>
              </div>
              {/* X-axis label (day) */}
              <span className="mt-2 text-sm text-primaryText">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomBarChart;
