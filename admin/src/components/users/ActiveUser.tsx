import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useApiMutation } from "../../hooks/useApiMutation";

interface ChartDataPoint {
  month: string;
  users: number;
}

const DEFAULT_CHART_DATA: ChartDataPoint[] = [
  { month: "Jan", users: 0 },
  { month: "Feb", users: 0 },
  { month: "Mar", users: 0 },
  { month: "Apr", users: 0 },
  { month: "May", users: 0 },
  { month: "Jun", users: 0 },
  { month: "Jul", users: 0 },
  { month: "Aug", users: 0 },
  { month: "Sep", users: 0 },
  { month: "Oct", users: 0 },
  { month: "Nov", users: 0 },
  { month: "Dec", users: 0 },
];

function yTickFormatter(v: number) {
  if (v === 0) return "0";
  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
  return v.toString();
}

export default function ActiveUsersCard() {
  const [chartData, setChartData] =
    useState<ChartDataPoint[]>(DEFAULT_CHART_DATA);

  // Fetch monthly growth data
  const { mutate: fetchMonthlyGrowth } = useApiMutation({
    endpoint: "/admins/users/monthly-growth",
    method: "GET",
  });

  useEffect(() => {
    fetchMonthlyGrowth({} as Record<string, unknown>, {
      onSuccess: (response: Record<string, unknown>) => {
        const data = response.data as ChartDataPoint[];
        if (data && Array.isArray(data)) {
          setChartData(data);
        }
      },
    });
  }, [fetchMonthlyGrowth]);

  // Calculate max value for Y-axis with intelligent scaling
  const actualMax = Math.max(...chartData.map((d) => d.users));

  // Smart scaling based on the actual max value
  let yAxisMax: number;
  let yAxisTicks: number[];

  if (actualMax === 0) {
    yAxisMax = 10;
    yAxisTicks = [0, 5, 10];
  } else if (actualMax <= 10) {
    yAxisMax = Math.ceil(actualMax * 1.5);
    yAxisTicks = Array.from({ length: Math.min(5, yAxisMax + 1) }, (_, i) => i);
  } else if (actualMax <= 100) {
    yAxisMax = Math.ceil(actualMax / 10) * 10 * 1.2;
    yAxisTicks = Array.from({ length: 6 }, (_, i) =>
      Math.floor((i * yAxisMax) / 5)
    );
  } else if (actualMax <= 1000) {
    yAxisMax = Math.ceil(actualMax / 100) * 100 * 1.2;
    yAxisTicks = Array.from({ length: 6 }, (_, i) =>
      Math.floor((i * yAxisMax) / 5)
    );
  } else {
    yAxisMax = Math.ceil(actualMax / 1000) * 1000 * 1.2;
    yAxisTicks = Array.from({ length: 6 }, (_, i) =>
      Math.floor((i * yAxisMax) / 5)
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-[#1F242F] overflow-hidden flex-1 min-h-[360px]">
      <div className="flex flex-col gap-6 p-6 flex-1">
        <h2 className="text-base font-semibold text-[#F5F5F6] leading-6">
          Total Active Users
        </h2>

        <div className="flex-1" style={{ minHeight: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 36 }}
            >
              <defs>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D8522E" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#D8522E" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1F242F"
                vertical={false}
                strokeDasharray=""
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#94969C", fontSize: 12, fontFamily: "Inter" }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Month",
                  position: "insideBottom",
                  offset: -20,
                  fill: "#94969C",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "Inter",
                }}
              />

              <YAxis
                domain={[0, yAxisMax]}
                ticks={yAxisTicks}
                tickFormatter={yTickFormatter}
                tick={{ fill: "#94969C", fontSize: 12, fontFamily: "Inter" }}
                axisLine={false}
                tickLine={false}
                width={48}
                label={{
                  value: "Active Users",
                  angle: -90,
                  position: "insideLeft",
                  offset: -2,
                  fill: "#94969C",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "Inter",
                  dy: 40,
                }}
              />

              <Area
                type="monotone"
                dataKey="users"
                stroke="#D8522E"
                strokeWidth={2}
                fill="url(#usersGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#D8522E", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
