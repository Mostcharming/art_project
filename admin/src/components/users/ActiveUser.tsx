import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const CHART_DATA = [
  { month: "Jan", users: 55200 },
  { month: "Feb", users: 56800 },
  { month: "Mar", users: 56100 },
  { month: "Apr", users: 57500 },
  { month: "May", users: 57900 },
  { month: "Jun", users: 58900 },
  { month: "Jul", users: 59600 },
  { month: "Aug", users: 60200 },
  { month: "Sep", users: 61500 },
  { month: "Oct", users: 63500 },
  { month: "Nov", users: 66800 },
  { month: "Dec", users: 72000 },
];

function yTickFormatter(v: number) {
  if (v === 0) return "0";
  if (v === 20000) return "20k";
  return `${v / 1000}K`;
}

export default function ActiveUsersCard() {
  return (
    <div className="flex flex-col rounded-xl border border-[#1F242F] overflow-hidden flex-1 min-h-[360px]">
      <div className="flex flex-col gap-6 p-6 flex-1">
        <h2 className="text-base font-semibold text-[#F5F5F6] leading-6">
          Total Active Users
        </h2>

        <div className="flex-1" style={{ minHeight: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={CHART_DATA}
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
                domain={[0, 100000]}
                ticks={[0, 20000, 40000, 60000, 80000, 100000]}
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
