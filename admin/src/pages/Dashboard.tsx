import { useMemo, useState } from "react";
import CarouselsTable from "../components/dashboard/CarouselsTable";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsSection from "../components/dashboard/StatsSection";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboardStore } from "../store/dashboardStore";

export default function Index() {
  const [activePeriod, setActivePeriod] = useState("12 months");
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  } | null>(null);

  // Build filter parameters
  const filters = useMemo(() => {
    if (selectedDateRange?.start && selectedDateRange?.end) {
      return {
        startDate: selectedDateRange.start.toISOString(),
        endDate: selectedDateRange.end.toISOString(),
      };
    }
    return { period: activePeriod };
  }, [activePeriod, selectedDateRange]);

  // Fetch dashboard data
  useDashboardData(filters);

  const { isLoadingStats } = useDashboardStore();

  const handleDateRangeSelect = (start: Date | null, end: Date | null) => {
    setSelectedDateRange({ start, end });
  };

  const handleDateRangeRefresh = () => {
    setSelectedDateRange(null);
  };

  return (
    <div className="min-h-screen bg-dash-bg">
      <div className="flex flex-col gap-8 py-8">
        {/* Header: title, search, period tabs */}
        <DashboardHeader
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
          onDateRangeSelect={handleDateRangeSelect}
          onDateRangeRefresh={handleDateRangeRefresh}
          selectedDateRange={selectedDateRange}
        />

        {/* Stats section: line chart + metrics */}
        {!isLoadingStats && <StatsSection />}

        {/* Table: top performing carousels */}
        <CarouselsTable />
      </div>
    </div>
  );
}
