import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
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
          return value + '%'; // Display as percentage
        },
      },
    },
  },
};


interface BarChartProps {
  scoresData: { time: number, uid: string }[];
  userId: string;
}

const BarChart = ({ scoresData, userId }: BarChartProps) => {
  const times = scoresData.map(item => item.time);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  console.log('Min Time:', minTime);
  console.log('Max Time:', maxTime);
  const interval = (maxTime - minTime) / 12;

  const labels = Array.from({ length: 12 }, (_, i) => `${Math.round(minTime + i * interval)}`);

  const totalDataCount = scoresData.length;
  const dataCounts = Array(12).fill(0);
  const userBarIndex = new Set<number>();

  scoresData.forEach(item => {
    const index = Math.min(Math.floor((item.time - minTime) / interval), 11);
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
        label: 'Time Intervals',
        data: percentageDataCounts,
        backgroundColor: percentageDataCounts.map((_, index) =>
          userBarIndex.has(index) ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        borderRadius: 6,
        order: 1, // Set order to render bars in front
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;