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

const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function StatsSection() {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 px-4 sm:px-8 pb-6 border-b border-gray-500">
      {/* Chart + primary metric */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <MetricCard
          label="Total Active Users"
          value="180.8K"
          change="7.4%"
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
            <path
              d="M0 93.8542L20.1926 90.3091L41.0163 88.6552L61.8399 91.963L83.2946 90.3091H104.749L125.573 88.6552H145.135L165.327 86.45L185.52 88.6552L209.499 84.796L227.167 86.45L246.098 84.796L265.028 83.1421L289.007 84.796L306.676 83.1421L323.082 79.8343L345.168 76.5265L367.254 73.7699H389.339L412.687 72.116L429.093 73.7699H438.559L454.334 76.5265L472.634 81.4882L491.564 83.1421H498.506L514.281 76.5265L530.688 73.7699L545.201 72.116L573.597 70.4621L583.062 66.6029L603.886 64.949L627.865 63.2951H637.961C641.958 63.8464 650.203 64.949 651.212 64.949C652.222 64.949 665.095 66.0516 671.405 66.6029L687.812 70.4621H707.373L726.304 66.6029L739.555 68.2569L764.796 70.4621L780.572 68.2569L807.705 66.6029C810.86 66.0516 817.423 64.949 818.433 64.949C819.442 64.949 826.426 63.1113 829.791 62.1925H842.411L851.877 56.6794H872.069L891 50.7917V212H0V93.8542Z"
              fill="url(#chartGradient)"
            />

            {/* Line */}
            <path
              d="M0 93.8542L20.1926 90.3091L41.0163 88.6552L61.8399 91.963L83.2946 90.3091H104.749L125.573 88.6552H145.135L165.327 86.45L185.52 88.6552L209.499 84.796L227.167 86.45L246.098 84.796L265.028 83.1421L289.007 84.796L306.676 83.1421L323.082 79.8343L345.168 76.5265L367.254 73.7699H389.339L412.687 72.116L429.093 73.7699H438.559L454.334 76.5265L472.634 81.4882L491.564 83.1421H498.506L514.281 76.5265L530.688 73.7699L545.201 72.116L573.597 70.4621L583.062 66.6029L603.886 64.949L627.865 63.2951H637.961C641.958 63.8464 650.203 64.949 651.212 64.949C652.222 64.949 665.095 66.0516 671.405 66.6029L687.812 70.4621H707.373L726.304 66.6029L739.555 68.2569L764.796 70.4621L780.572 68.2569L807.705 66.6029C810.86 66.0516 817.423 64.949 818.433 64.949C819.442 64.949 826.426 63.1113 829.791 62.1925H842.411L851.877 56.6794H872.069L891 50.7917"
              stroke="#D8522E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between px-6 mt-1">
            {xLabels.map((label) => (
              <span
                key={label}
                className="text-xs text-gray-300 text-center leading-[18px] font-body"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right metrics */}
      <div className="flex flex-row lg:flex-col flex-wrap gap-5 lg:w-60 lg:shrink-0">
        <MetricCard label="Active Publishers" value="4,862" change="9.2%" />
        <MetricCard
          label="Total Carousels Uploaded"
          value="2,671"
          change="6.6%"
        />
        <MetricCard label="Total TV app views" value="82.7M" change="8.1%" />
      </div>
    </div>
  );
}
