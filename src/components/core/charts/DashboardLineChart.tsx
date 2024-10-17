import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register components for ChartJS, including Filler for area filling
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface DashboardLineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
      fill: boolean;
    }[];
  };
}

const DashboardLineChart: React.FC<DashboardLineChartProps> = ({ data }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Display the legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
      y: {
        grid: {
          display: false, // Hide horizontal grid lines
        },
      },
    },
    elements: {
      line: {
        tension: 0.5,
        borderWidth: 0, // Remove line border
      },
      point: {
        radius: 0, // Remove points on the line
      },
    },
  };

  const modifiedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      fill: true, // Enable background fill
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          return null;
        }

        const gradientBg = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom,
        );

        // Set gradient colors based on the index of the dataset
        if (index === 0) {
          gradientBg.addColorStop(0.5, "rgba(0, 123, 255, 1)"); // Blue gradient
          gradientBg.addColorStop(0, "rgba(0, 123, 255, 0.2)");
          gradientBg.addColorStop(1, "rgba(0, 123, 255, 0)");
        } else {
          gradientBg.addColorStop(0.5, "rgba(255, 165, 0, 1)"); // Orange gradient
          gradientBg.addColorStop(0, "rgba(255, 165, 0, 0.2)");
          gradientBg.addColorStop(1, "rgba(255, 165, 0, 0)");
        }

        return gradientBg;
      },
      borderColor: "transparent", // Set the line border to transparent
    })),
  };

  return (
    <div className="w-full h-full p-4">
      <Line data={modifiedData} options={chartOptions} />
    </div>
  );
};

export default DashboardLineChart;
