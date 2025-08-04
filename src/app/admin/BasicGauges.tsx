import React from "react";
import GaugeChart from "react-gauge-chart";

export default function BasicGauges({
  applicationsByBusinessType,
}: {
  applicationsByBusinessType: { [key: string]: number };
}) {
  const totalApplicants = Object.values(applicationsByBusinessType).reduce(
    (sum, value) => sum + value,
    0,
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
    }),
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
