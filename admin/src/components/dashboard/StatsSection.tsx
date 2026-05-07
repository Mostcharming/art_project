import { useDashboardStore } from "../../store/dashboardStore";

const TrendUpIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#trend-clip)">
      <path
        d="M18.3333 5.83333L11.7761 12.3905C11.4461 12.7205 11.2811 12.8855 11.0909 12.9474C10.9235 13.0017 10.7432 13.0017 10.5758 12.9474C10.3855 12.8855 10.2205 12.7205 9.89053 12.3905L7.60948 10.1095C7.27947 9.77946 7.11446 9.61445 6.92419 9.55263C6.75682 9.49824 6.57653 9.49824 6.40916 9.55263C6.21888 9.61445 6.05388 9.77946 5.72386 10.1095L1.66667 14.1667M18.3333 5.83333H12.5M18.3333 5.83333V11.6667"
        stroke="#47CD89"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="trend-clip">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

interface MetricProps {
  label: string;
  value: string;
  change: string;
  large?: boolean;
}

function MetricCard({ label, value, change, large }: MetricProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-300 text-sm font-medium leading-5">{label}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={[
            "font-semibold text-gray-100 leading-tight",
            large ? "text-[36px] tracking-[-0.72px]" : "text-[30px]",
          ].join(" ")}
        >
          {value}
        </span>
        <div className="flex items-center gap-1">
          <TrendUpIcon />
          <span className="text-sm font-medium text-green-500">{change}</span>
        </div>
      </div>
    </div>
  );
}

export default function StatsSection() {
  const { stats, monthlyChartData } = useDashboardStore();

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Get max value for chart scaling
  const maxValue =
    monthlyChartData.length > 0
      ? Math.max(...monthlyChartData.map((d) => d.value))
      : 100;

  // Generate chart path
  const chartWidth = 891;
  const chartHeight = 166;
  const cellWidth = chartWidth / (monthlyChartData.length || 12);

  const points = monthlyChartData.map((d, i) => {
    const x = (i + 0.5) * cellWidth;
    const y = chartHeight - (d.value / maxValue) * chartHeight;
    return { x, y, value: d.value };
  });

  const pathData =
    points.length > 0
      ? `M${points.map((p) => `${p.x} ${p.y}`).join("L")}`
      : "M0 83L891 83";

  const areaData =
    points.length > 0
      ? `M${points.map((p) => `${p.x} ${p.y}`).join("L")}L891 166L0 166Z`
      : "M0 83L891 83L891 166L0 166Z";

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 px-4 sm:px-8 pb-6 border-b border-gray-500">
      {/* Chart + primary metric */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <MetricCard
          label="Total Active Users"
          value={formatNumber(stats?.totalActiveUsers || 0)}
          change={`${stats?.newUsersPercentage || 0}%`}
          large
        />

        {/* Line chart */}
        <div className="w-full">
          <svg
            viewBox="0 0 891 212"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "200px" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Y-axis grid lines */}
            {[0, 33, 66, 99, 132, 165].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="891"
                y2={y}
                stroke="#1F242F"
                strokeWidth="1"
              />
            ))}

            {/* Filled area under curve */}
            <defs>
              <linearGradient
                id="chartGradient"
                x1="445.5"
                y1="0"
                x2="445.5"
                y2="166"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#D8522E" stopOpacity="0.15" />
                <stop offset="1" stopColor="#D8522E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaData} fill="url(#chartGradient)" />

            {/* Line */}
            <path
              d={pathData}
              stroke="#D8522E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between px-6 mt-1">
            {monthlyChartData.map((d, i) => (
              <span
                key={i}
                className="text-xs text-gray-300 text-center leading-[18px] font-body"
              >
                {d.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right metrics */}
      <div className="flex flex-row lg:flex-col flex-wrap gap-5 lg:w-60 lg:shrink-0">
        <MetricCard
          label="Total Carousels"
          value={formatNumber(stats?.totalCarousels || 0)}
          change={`${stats?.totalCarouselsPercentage || 0}%`}
        />
        <MetricCard
          label="Total Views"
          value={formatNumber(stats?.totalViews || 0)}
          change={`${stats?.totalViewsPercentage || 0}%`}
        />
        <MetricCard
          label="Total Favorites"
          value={formatNumber(stats?.totalFavorites || 0)}
          change={`${stats?.totalFavoritesPercentage || 0}%`}
        />
      </div>
    </div>
  );
}
