import * as React from "react";
import Stack from "@mui/material/Stack";
import { Gauge } from "@mui/x-charts/Gauge";
import Typography from "@mui/material/Typography";

export default function BasicGauges({totalApplicants}: {totalApplicants: number}) {
  // Sample values for companies and schools
  const companyApplicants = 0;
  // Total number of applicants

  // Calculate the percentage of companies
  const companyPercentage = (totalApplicants / totalApplicants) * 100;

  return (
    <Stack direction="column" spacing={2} alignItems="center">
      <div style={{ position: "relative", display: "inline-block" }}>
        <Gauge
          width={200}
          height={200}
          value={null} // Value as percentage of companies
          startAngle={-90}
          endAngle={90}
          sx={{
            "& .MuiGauge-progress": { stroke: "#005DE9" },
            "& .MuiGauge-track": { stroke: "#65E500" },
          }}
        />
        <Typography
          variant="h6"
          component="div"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {totalApplicants}
        </Typography>
      </div>

      {/* Legend to explain colors */}
      <Stack direction="row" spacing={2} alignItems="center">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#005DE9",
              marginRight: 8,
            }}
          />
          <Typography>Companies</Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#65E500",
              marginRight: 8,
            }}
          />
          <Typography>Schools</Typography>
        </div>
      </Stack>
    </Stack>
  );
}
