import { Cell, Pie, PieChart } from "recharts";

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface UserCategoryCardProps {
  data?: CategoryData[];
  totalUsers?: number;
}

const DEFAULT_DONUT_DATA: CategoryData[] = [
  { name: "Artists", value: 0, color: "#475467" },
  { name: "Art Galleries", value: 0, color: "#D8522E" },
  { name: "Collectors", value: 0, color: "#BA24D5" },
  { name: "Viewers", value: 0, color: "#444CE7" },
];

function LegendItem({ item }: { item: CategoryData }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-[6px] w-2 h-2 rounded-full shrink-0 block"
        style={{ background: item.color }}
      />
      <span className="text-sm text-[#94969C] leading-5">
        {item.name} -{" "}
        <span className="font-bold">{item.value.toLocaleString()}</span>
      </span>
    </div>
  );
}

export default function UserCategoryCard({
  data,
  totalUsers,
}: UserCategoryCardProps) {
  const DONUT_DATA = data || DEFAULT_DONUT_DATA;
  const TOTAL =
    totalUsers || DONUT_DATA.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col rounded-xl border border-[#1F242F] overflow-hidden w-full lg:w-[360px] lg:shrink-0">
      {/* Card content */}
      <div className="flex flex-col gap-6 p-6 flex-1">
        <h2 className="text-base font-semibold text-[#F5F5F6] leading-6">
          User Category Distribution
        </h2>

        <div className="flex flex-col items-center gap-4">
          {/* Donut chart */}
          <div className="flex items-center justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={DONUT_DATA}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                strokeWidth={0}
                isAnimationActive={true}
              >
                {DONUT_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </div>

          {/* Legend — 2 columns */}
          <div className="flex justify-center gap-[18px] w-full">
            <div className="flex flex-col gap-1">
              <LegendItem item={DONUT_DATA[0]} />
              <LegendItem item={DONUT_DATA[1]} />
            </div>
            <div className="flex flex-col gap-1">
              <LegendItem item={DONUT_DATA[2]} />
              <LegendItem item={DONUT_DATA[3]} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div className="border-t border-[#1F242F]" />
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-base font-semibold text-[#D2D6DB] leading-6">
            Total Active Users
          </span>
          <span className="text-xl font-semibold text-[#F5F5F6] leading-6">
            {TOTAL.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
