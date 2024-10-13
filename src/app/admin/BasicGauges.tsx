







import * as React from "react";
import Stack from "@mui/material/Stack";
import { Gauge } from "@mui/x-charts/Gauge";
import Typography from "@mui/material/Typography";

export default function BasicGauges() {
    // Sample values for companies and schools
    const companyApplicants = 60;
    const schoolApplicants = 80;

    // Total number of applicants
    const totalApplicants = companyApplicants + schoolApplicants;

    // Calculate the percentage of companies
    const companyPercentage = (companyApplicants / totalApplicants) * 100;

    return (
        <Stack direction="column" spacing={2} alignItems="center">
            <div style={{ position: "relative", display: "inline-block" }}>
                <Gauge
                    width={200}
                    height={200}
                    startAngle={-90}
                    endAngle={90}
                    sx={{
                        "& .MuiGauge-progress": {
                            stroke: "#005DE9", // Blue for companies (progress)
                            strokeWidth: 20, // Control the thickness of the progress
                        },
                        "& .MuiGauge-track": {
                            stroke: "#90EE90", // Green for schools (remaining track)
                            strokeWidth: 20, // Control the thickness of the track
                        },
                    }}
                />
                {/* Display total applicants in the center */}
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
                        <p> {totalApplicants}</p>

                        <p className="text-sm">Applicants</p>
                    </div>
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
                            backgroundColor: "#90EE90",
                            marginRight: 8,
                        }}
                    />
                    <Typography>Schools</Typography>
                </div>
            </Stack>
        </Stack>
    );
}
