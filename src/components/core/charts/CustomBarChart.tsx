import React from "react";

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data, maxValue }) => {
  const yAxisValues = [
    "",
    "",
    ...Array.from({ length: 6 }, (_, i) => Math.round((maxValue / 5) * i)),
    "",
  ];
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });
  return (
    <div className="flex space-x-4">
      <div className="flex flex-col justify-between h-64">
        {yAxisValues.reverse().map((value, index) => (
          <span key={index} className="text-sm text-secondaryText">
            {value}
          </span>
        ))}
      </div>
      <div className="flex-1 flex justify-between items-end h-64 relative ">
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isCurrentDay = item.day === currentDay;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end  w-12  h-full "
            >
              <div
                className="py-3 flex-grow w-full rounded-2xl flex flex-col items-center"
                style={{
                  backgroundColor: isCurrentDay ? "#005DE91F" : "white",
                }}
              >
                <div className="h-full flex flex-col justify-end bg-[#F6F7F7]  rounded-t-lg ">
                  <div
                    className={` rounded-t-lg w-2`}
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: isCurrentDay ? "#005DE9F2" : "black",
                    }}
                  ></div>
                </div>
              </div>
              <span className="mt-2 text-sm text-primaryText">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomBarChart;
