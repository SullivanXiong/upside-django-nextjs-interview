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
  type ChartOptions,
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
      borderColor: 'oklch(0.646 0.222 264.376)',
      backgroundColor: 'color-mix(in oklab, var(--chart-1) 20%, transparent)',
      pointBackgroundColor: 'oklch(0.646 0.222 264.376)',
      pointBorderColor: 'oklch(0.646 0.222 264.376)',
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

export const createChartOptions = (): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--popover'),
      titleColor: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--popover-foreground'),
      bodyColor: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--popover-foreground'),
      borderColor: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--primary'),
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
        color: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--border'),
      },
      ticks: {
        color: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground'),
        font: {
          size: 12,
        },
        maxRotation: 0,
        autoSkip: false,
        // Show month labels at regular intervals
        callback: function(this: any, value: number | string, index: number, ticks: any[]): string {
          const rawLabel = (this as any).getLabelForValue(value) as string;
          const date = new Date(rawLabel);
          if (isNaN(date.getTime())) return '';
          const totalPoints: number = ticks.length;
          const month: number = date.getMonth();
          const year: number = date.getFullYear();
          const monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          // Always show first and last labels
          if (index === 0 || index === totalPoints - 1) {
            return `${monthNames[month]} ${year}`;
          }
          // Calculate interval for approximately every 90 days (3 months)
          const interval: number = Math.floor(totalPoints / Math.ceil(totalPoints / 90));
          // Show labels at regular intervals
          if (interval > 0 && index % interval === 0) {
            // Add year for January or if it's been a while
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
        color: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--border'),
      },
    },
  },
  elements: {
    point: {
      hoverBackgroundColor: (ctx: any) => getComputedStyle(document.documentElement).getPropertyValue('--primary'),
    },
    line: {
      borderWidth: 2,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
});

// Keep the old chartOptions for backward compatibility
export const chartOptions = createChartOptions();