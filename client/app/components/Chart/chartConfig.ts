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
} from 'chart.js';

// Register Chart.js components
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

export interface ChartDataPoint {
  month: string;
  value: number;
}

export interface ChartMarker {
  month: string;
  label: string;
  position: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointRadius: number;
    pointHoverRadius: number;
    tension: number;
    fill: boolean;
  }[];
  markers: ChartMarker[];
}

export const defaultChartData: ChartData = {
  labels: [
    'Apr 2022', 'Jul 2022', 'Oct 2022', 'Jan 2023', 'Apr 2023', 'Jul 2023',
    'Oct 2023', 'Jan 2024', 'Apr 2024', 'Jul 2024', 'Oct 2024', 'Jan 2025'
  ],
  datasets: [
    {
      label: 'Navigation Data',
      data: [20, 35, 25, 45, 30, 55, 40, 60, 35, 50, 45, 70],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#3b82f6',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    }
  ],
  markers: [
    { month: 'Apr 2022', label: 'SF', position: 20 },
    { month: 'Jul 2022', label: 'DA', position: 35 },
    { month: 'Oct 2022', label: 'CJ', position: 25 },
    { month: 'Jan 2023', label: '+2', position: 45 },
    { month: 'Apr 2023', label: '+4', position: 30 },
    { month: 'Jul 2023', label: '+1', position: 55 },
    { month: 'Oct 2023', label: '+3', position: 40 },
    { month: 'Jan 2024', label: '+2', position: 60 },
    { month: 'Apr 2024', label: '+1', position: 35 },
    { month: 'Jul 2024', label: '+5', position: 50 },
    { month: 'Oct 2024', label: '+2', position: 45 },
    { month: 'Jan 2025', label: '+3', position: 70 },
  ]
};

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#3b82f6',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: true,
        color: '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
        },
      },
    },
    y: {
      display: false,
      grid: {
        display: true,
        color: '#f3f4f6',
        drawBorder: false,
      },
    },
  },
  elements: {
    point: {
      hoverBackgroundColor: '#3b82f6',
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
};