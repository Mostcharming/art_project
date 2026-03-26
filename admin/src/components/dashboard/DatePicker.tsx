import { useCallback, useState } from "react";
import { cn } from "../../lib/utils";

const DAYS_OF_WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date) {
  return isSameDay(date, new Date());
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const t = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return t > Math.min(s, e) && t < Math.max(s, e);
}

interface CalendarCellProps {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  onClick: () => void;
}

function CalendarCell({
  day,
  isCurrentMonth,
  isSelected,
  isToday: isTodayDate,
  isInRange: inRange,
  isRangeStart,
  isRangeEnd,
  onClick,
}: CalendarCellProps) {
  const isDisabled = !isCurrentMonth;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 40, height: 40 }}
    >
      {/* Range connector background */}
      {inRange && <div className="absolute inset-y-0 inset-x-0 bg-[#1F242F]" />}
      {isRangeStart && (
        <div className="absolute inset-y-0 right-0 left-1/2 bg-[#1F242F]" />
      )}
      {isRangeEnd && (
        <div className="absolute inset-y-0 left-0 right-1/2 bg-[#1F242F]" />
      )}

      {/* Cell circle */}
      <button
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        className={cn(
          "relative z-10 flex flex-col items-center justify-center rounded-full transition-colors",
          "w-10 h-10 focus:outline-none",
          isSelected
            ? "bg-[#333741]"
            : inRange
            ? "hover:bg-[#2a3040]"
            : isDisabled
            ? "cursor-default"
            : "hover:bg-[#1F242F]"
        )}
      >
        <span
          className={cn(
            "text-sm leading-5 font-medium",
            isDisabled
              ? "text-[#85888E]"
              : isSelected
              ? "text-[#CECFD2]"
              : "text-[#CECFD2]",
            !isCurrentMonth && "font-normal"
          )}
        >
          {day}
        </span>
        {/* Today dot */}
        {isTodayDate && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full mt-0.5 -mb-1 flex-shrink-0",
              isDisabled ? "bg-[#85888E]" : "bg-[#D8522E]"
            )}
          />
        )}
      </button>
    </div>
  );
}

export interface DatePickerProps {
  onApply?: (start: Date | null, end: Date | null) => void;
  onRefresh?: () => void;
}

export function DatePicker({ onApply, onRefresh }: DatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = useCallback(
    (date: Date) => {
      if (selecting === "start") {
        setStartDate(date);
        setEndDate(null);
        setSelecting("end");
      } else {
        if (startDate && date < startDate) {
          setEndDate(startDate);
          setStartDate(date);
        } else {
          setEndDate(date);
        }
        setSelecting("start");
      }
    },
    [selecting, startDate]
  );

  const handleRefresh = () => {
    setStartDate(null);
    setEndDate(null);
    setSelecting("start");
    onRefresh?.();
  };

  const handleApply = () => {
    onApply?.(startDate, endDate);
  };

  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);

  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  const cells: { day: number; date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    const d = prevMonthDays - firstDayOfWeek + 1 + i;
    const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({
      day: d,
      date: new Date(prevY, prevM, d),
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      date: new Date(viewYear, viewMonth, d),
      isCurrentMonth: true,
    });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({
      day: d,
      date: new Date(nextY, nextM, d),
      isCurrentMonth: false,
    });
  }

  const displayCells = cells.slice(0, 42);

  return (
    <div
      className="inline-flex flex-col overflow-hidden "
      style={{
        width: 328,
        borderRadius: 12,
        border: "1px solid #1F242F",
        background: "#0C111D",
        boxShadow:
          "0 20px 24px -4px rgba(255,255,255,0.00), 0 8px 8px -4px rgba(255,255,255,0.00)",
      }}
    >
      {/* Content */}
      <div className="flex flex-col gap-4 p-5">
        {/* Calendar section */}
        <div className="flex flex-col gap-3 w-full">
          {/* Month navigation */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={prevMonth}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-[#1F242F] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="#CECFD2"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <span className="text-[#CECFD2] text-base font-semibold leading-6">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              onClick={nextMonth}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-[#1F242F] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="#CECFD2"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Date range inputs */}
          <div className="flex gap-3 w-full">
            <div className="flex-1">
              <div
                className="flex items-center px-3 py-2 rounded-lg"
                style={{ border: "1px solid #333741", background: "#0C111D" }}
              >
                <span className="text-[#85888E] text-base leading-6 truncate">
                  {startDate ? formatDate(startDate) : "Start date"}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div
                className="flex items-center px-3 py-2 rounded-lg"
                style={{ border: "1px solid #333741", background: "#0C111D" }}
              >
                <span className="text-[#85888E] text-base leading-6 truncate">
                  {endDate ? formatDate(endDate) : "End date"}
                </span>
              </div>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="w-full">
            {/* Day headers */}
            <div className="grid grid-cols-7">
              {DAYS_OF_WEEK.map((d) => (
                <div
                  key={d}
                  className="flex items-center justify-center w-10 h-10"
                >
                  <span className="text-[#CECFD2] text-sm font-medium leading-5 text-center">
                    {d}
                  </span>
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7">
              {displayCells.map(({ day, date, isCurrentMonth }, idx) => {
                const selected =
                  isSameDay(date, startDate) || isSameDay(date, endDate);
                const todayDate = isToday(date);
                const inRange = isInRange(date, startDate, endDate);
                const isRangeStart =
                  isSameDay(date, startDate) && endDate !== null;
                const isRangeEnd =
                  isSameDay(date, endDate) && startDate !== null;

                return (
                  <CalendarCell
                    key={idx}
                    day={day}
                    date={date}
                    isCurrentMonth={isCurrentMonth}
                    isSelected={selected}
                    isToday={todayDate}
                    isInRange={inRange}
                    isRangeStart={isRangeStart}
                    isRangeEnd={isRangeEnd}
                    onClick={() => handleDayClick(date)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="flex gap-3 px-4 py-4"
        style={{ borderTop: "1px solid #1F242F" }}
      >
        <button
          onClick={handleRefresh}
          className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold leading-5 transition-colors hover:bg-[#1F242F]"
          style={{
            border: "1px solid #333741",
            background: "#161B26",
            color: "#CECFD2",
          }}
        >
          Refresh
        </button>
        <button
          onClick={handleApply}
          className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold leading-5 text-white transition-colors hover:opacity-90 active:opacity-80"
          style={{ background: "#D8522E" }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
