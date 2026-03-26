import MiniChart from "./MiniChart";

interface MetricCardProps {
  heading: string;
  value: string | number;
  trend: "positive" | "negative";
  percentage: string | number;
}

function ArrowUp() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 15.8333V4.16666M10 4.16666L4.16666 9.99999M10 4.16666L15.8333 9.99999"
        stroke="#47CD89"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99999 4.16666V15.8333M9.99999 15.8333L15.8333 9.99999M9.99999 15.8333L4.16666 9.99999"
        stroke="#F97066"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricCard({
  heading,
  value,
  trend,
  percentage,
}: MetricCardProps) {
  const isPositive = trend === "positive";

  return (
    <div className="flex-1 min-w-[280px] p-6 rounded-xl border border-gray-500 shadow-sm flex flex-col gap-6">
      <h3 className="text-white text-base font-semibold">{heading}</h3>
      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <span className="text-white text-[36px] font-semibold leading-[44px] tracking-[-0.72px]">
            {value}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {isPositive ? <ArrowUp /> : <ArrowDown />}
              <span
                className={`text-sm font-medium text-center ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {percentage}%
              </span>
            </div>
            <span className="text-sm font-medium text-gray-400 truncate">
              vs last month
            </span>
          </div>
        </div>
        <MiniChart trend={trend} />
      </div>
    </div>
  );
}
