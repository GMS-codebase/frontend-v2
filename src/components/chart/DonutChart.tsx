import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
  ChartData,
  Plugin,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register necessary components and plugins
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

interface DonutChartProps {
  daysLeft?: number;
}

// Define the data for the donut chart
const getData = (daysLeft: any): ChartData<"doughnut"> => ({
  labels: ["Days Left", "Unused"],
  datasets: [
    {
      label: "Days Dataset",
      data: [daysLeft, 30 - daysLeft], // Assuming 30 as a full cycle, adjust according to your use case
      backgroundColor: [
        "rgba(0, 93, 233, 1)", // Blue for days left
        "rgb(200, 200, 200)", // Gray for unused
      ],
      hoverOffset: 4,
    },
  ],
});

// Define options for the chart
const options: ChartOptions<"doughnut"> = {
  plugins: {
    legend: {
      display: false, // Hide the legend
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || "";
          if (context.raw) {
            label += `: ${context.raw} days`;
          }
          return label;
        },
      },
    },
    datalabels: {
      display: false, // Disable datalabels to avoid overlap with the center text
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%", // Cutout to make space for the center text
};

const centerTextPlugin: Plugin<"doughnut"> = {
  id: "centerText",
  beforeDraw: (chart) => {
    const { ctx, width, height } = chart;
    const daysLeft = chart.data.datasets[0].data[0];

    ctx.restore();
    const fontSize = (height / 150).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";

    const text = `${daysLeft} days left`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

// DonutChart Component
const DonutChart: React.FC<DonutChartProps> = ({ daysLeft }) => {
  const data = getData(daysLeft);
  return (
    <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
  );
};

export default DonutChart;
