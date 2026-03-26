import { useState } from "react";
import CarouselsTable from "../components/dashboard/CarouselsTable";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsSection from "../components/dashboard/StatsSection";

export default function Index() {
  const [activePeriod, setActivePeriod] = useState("12 months");

  return (
    <div className="min-h-screen bg-dash-bg">
      <div className="flex flex-col gap-8 py-8">
        {/* Header: title, search, period tabs */}
        <DashboardHeader
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />

        {/* Stats section: line chart + metrics */}
        <StatsSection />

        {/* Table: top performing carousels */}
        <CarouselsTable />
      </div>
    </div>
  );
}
