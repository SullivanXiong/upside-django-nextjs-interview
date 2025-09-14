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
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointRadius?: number;
    pointHoverRadius?: number;
    tension: number;
    fill: boolean;
  }[];
  markers?: ChartMarker[];
  quarterlyData?: Array<{
    label: string;
    count: number;
    startDate: string;
    endDate: string;
  }>;
  dailyData?: Array<{
    date: string;
    count: number;
  }>;
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

export const createChartOptions = () => ({
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
      callbacks: {
        title: function(context: any) {
          // Show formatted date in tooltip
          const label = context[0].label;
          const date = new Date(label);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        },
        label: function(context: any) {
          return `Events: ${context.parsed.y}`;
        }
      }
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
        maxRotation: 0,
        autoSkip: false,
        // Custom callback to show only month names at intervals
        callback: function(value: any, index: number, ticks: any) {
          // Get the label (which is a date string)
          const label = this.getLabelForValue(value);
          const date = new Date(label);
          
          if (isNaN(date.getTime())) return '';
          
          const totalPoints = ticks.length;
          const month = date.getMonth();
          const year = date.getFullYear();
          const day = date.getDate();
          
          // Calculate interval - aim for about 4-5 labels across the chart
          const interval = Math.max(1, Math.floor(totalPoints / 5));
          
          // Track which months we've already shown
          if (!this.shownMonths) {
            this.shownMonths = new Set();
          }
          
          const monthKey = `${year}-${month}`;
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          // Show first and last
          if (index === 0) {
            this.shownMonths.add(monthKey);
            return `${monthNames[month]} ${year}`;
          }
          
          if (index === totalPoints - 1) {
            return `${monthNames[month]} ${year}`;
          }
          
          // Show at regular intervals, but only once per month
          if (index % interval === 0 && !this.shownMonths.has(monthKey)) {
            this.shownMonths.add(monthKey);
            
            // Show year for January
            if (month === 0) {
              return `${monthNames[month]} ${year}`;
            }
            return monthNames[month];
          }
          
          return '';
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
});

// Keep the old chartOptions for backward compatibility
export const chartOptions = createChartOptions();