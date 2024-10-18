import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GaugeChart from "react-gauge-chart";

export default function BasicGauges({
  totalApplicants,
}: {
  totalApplicants: number;
}) {
  const companyApplicants = 60;
  const schoolApplicants = 80;
  const ngoApplicants = 40;
  const associationApplicants = 30;
  const tradeUnionApplicants = 50;
  const cooperativeApplicants = 20;

  const companyPercentage = (companyApplicants / totalApplicants) * 100;
  const schoolPercentage = (schoolApplicants / totalApplicants) * 100;
  const ngoPercentage = (ngoApplicants / totalApplicants) * 100;
  const associationPercentage = (associationApplicants / totalApplicants) * 100;
  const tradeUnionPercentage = (tradeUnionApplicants / totalApplicants) * 100;
  const cooperativePercentage = (cooperativeApplicants / totalApplicants) * 100;

  return (
    <Stack direction="column" spacing={2} alignItems="center">
      <div style={{ position: "relative", display: "inline-block" }}>
        <GaugeChart
          id="gauge-chart5"
          nrOfLevels={6}
          // arcsLength={[
          //   companyPercentage / 100,
          //   schoolPercentage / 100,
          //   ngoPercentage / 100,
          //   associationPercentage / 100,
          //   tradeUnionPercentage / 100,
          //   cooperativePercentage / 100,
          // ]}
          colors={[
            "#005DE9",
            "#90EE90",
            "#EA4228",
            "#FFAA33",
            "#00C49A",
            "#FF69B4",
          ]}
          percent={0.5}
          arcPadding={0.02}
          hideText={true}
          needleColor="transparent"
          needleBaseColor="transparent"
        />
        <Typography
          variant="h6"
          component="div"
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
        </Typography>
      </div>

      <Stack
        direction="column"
        spacing={2}
        className="grid grid-cols-2 gap-x-10"
      >
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-[#005DE9]" />
          <Typography>Companies</Typography>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-[#90EE90]" />
          <Typography>Schools</Typography>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-[#EA4228]" />
          <Typography>NGOs</Typography>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-[#FFAA33]" />
          <Typography>Associations</Typography>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-[#00C49A]" />
          <Typography>Trade Unions</Typography>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-[#FF69B4]" />
          <Typography>Cooperatives</Typography>
        </div>
      </Stack>
    </Stack>
  );
}
