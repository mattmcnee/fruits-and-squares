import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Charts.scss";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  scoresData: { time: number, uid: string }[];
  userId: string;
  resolution?: number;
}

const BarChart = ({ scoresData, userId, resolution = 24 }: BarChartProps) => {
  const times = scoresData.map(item => item.time);
  const minTime = Math.min(...times);
  let maxTime = Math.max(...times);

  if (maxTime - minTime < resolution) {
    maxTime = minTime + resolution;
  }

  const interval = (maxTime - minTime) / resolution;

  const labels = Array.from({ length: resolution }, (_, i) => `${Math.round(minTime + i * interval)}`);

  const totalDataCount = scoresData.length;
  const dataCounts = Array(resolution).fill(0);
  const userBarIndex = new Set<number>();

  scoresData.forEach(item => {
    const index = Math.min(Math.floor((item.time - minTime) / interval), resolution - 1);
    dataCounts[index]++;
    if (item.uid === userId) {
      userBarIndex.add(index);
    }
  });

  const percentageDataCounts = dataCounts.map(count => (count / totalDataCount) * 100);

  const data = {
    labels,
    datasets: [
      {
        label: "Time Intervals",
        data: percentageDataCounts,
        backgroundColor: percentageDataCounts.map((_, index) =>
          userBarIndex.has(index) ? "rgba(54, 162, 235, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderRadius: 6,
        order: 1, // Set order to render bars in front
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remove the legend
      },
      tooltip: {
        enabled: false, // Disable the tooltip
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
          display: true,
        },
        ticks: {
          callback: function(value: number | string) {
            return value + "%"; // Display as percentage
          },
        },
      },
    },
  };
  

  // console.log('Data:', scoresData);

  return (
    <div className="overlay-bar-chart">
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;