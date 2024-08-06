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
  Filler
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
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          borderDash: [], 
          color: "#C9CBCD",
        },
      },
    },
    elements: {
      line: {
        tension: 0.5,
        borderWidth: 0
      },
      point: {
        radius: 0,
      },
    },
  };

  const modifiedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      fill: true, 
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
          chartArea.bottom
        );
        gradientBg.addColorStop(0.5, "rgba(0, 123, 255, 1)"); 
        gradientBg.addColorStop(0, "rgba(0, 123, 255, 1)"); 
        gradientBg.addColorStop(1, "rgba(0, 123, 255, 0)"); 

        return gradientBg;
      },
      borderColor: dataset.borderColor || "rgba(0, 123, 255, 1)",
    })),
  };

  return (
    <div className="w-full h-full p-4">
      <Line data={modifiedData} options={chartOptions} />
    </div>
  );
};

export default DashboardLineChart;
