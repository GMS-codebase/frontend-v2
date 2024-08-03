type BarChartData = {
  day: string;
  value: number;
};

interface CustomBarChartProps {
  data: BarChartData[];
  maxValue: number;
}
