import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderRadius: number;
      order: number;
    }[];
  };
}


const BarChart = ({ data }: BarChartProps) => {
  const options = {
    // Will resize with parent div
    responsive: true,
    maintainAspectRatio: false,
    // No legend or tooltips
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    // 0:00 format seconds on x-axis
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function(_: number | string, index: number) {
            return data.labels[index];
          },
          // Prevent labels displaying diagonally
          maxRotation: 0, 
          minRotation: 0, 
        },
      },
      // x% format y-axis
      y: {
        grid: {
          display: true,
        },
        ticks: {
          callback: function(value: number | string) {
            return value + "%";
          },
        },
      },
    },
  };
  
  return (
    <Bar options={options} data={data} />
  );
};

export default BarChart;