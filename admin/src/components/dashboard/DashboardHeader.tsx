import { useState } from "react";
import { DatePicker } from "./DatePicker";

interface DashboardHeaderProps {
  activePeriod: string;
  onPeriodChange: (period: string) => void;
  onDateRangeSelect?: (start: Date | null, end: Date | null) => void;
  onDateRangeRefresh?: () => void;
  selectedDateRange?: { start: Date | null; end: Date | null } | null;
}

const periods = ["12 months", "30 days", "7 days", "24 hours"];

export default function DashboardHeader({
  activePeriod,
  onPeriodChange,
  onDateRangeSelect,
  onDateRangeRefresh,
  selectedDateRange,
}: DashboardHeaderProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [applied, setApplied] = useState<{
    start: Date | null;
    end: Date | null;
  } | null>(selectedDateRange || null);

  const handleApply = (start: Date | null, end: Date | null) => {
    setApplied({ start, end });
    setShowDatePicker(false);
    onDateRangeSelect?.(start, end);
  };

  const handleRefresh = () => {
    setApplied(null);
    onDateRangeRefresh?.();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-8">
        <div className="flex flex-col gap-1">
          <h1
            className="font-display text-[30px] leading-[38px] text-white tracking-wide"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-300 text-base leading-6">
            Welcome to your dashboard, view and manage analytics.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-[382px]">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-gray-500 bg-dash-bg shadow-sm overflow-hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
                stroke="#94969C"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent text-gray-500 placeholder:text-gray-500 outline-none min-w-0 font-body"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-500 mx-4 sm:mx-8" />

      {/* Tabs and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-8">
        {/* Period button group */}
        <div className="flex items-stretch rounded-lg border border-gray-500 shadow-sm overflow-hidden w-fit">
          {periods.map((period, i) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={[
                "min-h-[40px] px-4 py-2 text-sm font-semibold leading-5 text-gray-300 transition-colors",
                i < periods.length - 1 ? "border-r border-gray-500" : "",
                activePeriod === period ? "bg-gray-700" : " hover:bg-gray-700",
              ].join(" ")}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Custom time period button */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg border border-gray-500 bg-gray-800 shadow-sm w-fit hover:bg-gray-700 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 8.33334H2.5M13.3333 1.66667V5.00001M6.66667 1.66667V5.00001M6.5 18.3333H13.5C14.9001 18.3333 15.6002 18.3333 16.135 18.0609C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3333V7.33334C17.5 5.93321 17.5 5.23314 17.2275 4.69836C16.9878 4.22796 16.6054 3.84551 16.135 3.60582C15.6002 3.33334 14.9001 3.33334 13.5 3.33334H6.5C5.09987 3.33334 4.3998 3.33334 3.86502 3.60582C3.39462 3.84551 3.01217 4.22796 2.77248 4.69836C2.5 5.23314 2.5 5.93321 2.5 7.33334V14.3333C2.5 15.7335 2.5 16.4335 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0609C4.3998 18.3333 5.09987 18.3333 6.5 18.3333Z"
                stroke="#CECFD2"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-500 px-0.5">
              {applied && applied.start
                ? `${applied.start.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} - ${applied.end?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : "Custom time period"}
            </span>
          </button>

          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute right-0 mt-2 z-50">
              <DatePicker onApply={handleApply} onRefresh={handleRefresh} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
