import { useMemo, useState } from "react";
import CarouselTable from "../components/content/CarouselTable";
import MetricCard from "../components/content/MetricCard";
import ModerationPanel from "../components/content/ModerationPanel";
import { useContentData } from "../hooks/useContentData";
import { useContentStore } from "../store/contentStore";
import { exportCarouselsAsCSV } from "../utils/csvExport";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
        stroke="#94969C"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Tab = "statistics" | "moderation";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("statistics");
  const [searchValue, setSearchValue] = useState("");
  const activePeriod = "12 months";

  // Get pagination state from store
  const { stats, carousels, currentPage, pageSize, setCurrentPage } =
    useContentStore();

  // Build filter parameters with pagination
  const filters = useMemo(() => {
    return {
      period: activePeriod,
      page: currentPage,
      limit: pageSize,
    };
  }, [activePeriod, currentPage, pageSize]);

  // Fetch content data
  useContentData(filters);

  // Handle CSV export
  const handleExportCSV = () => {
    exportCarouselsAsCSV(carousels);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col gap-8 py-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="px-8 flex flex-col gap-6">
            {/* Page header: title + search */}
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-col gap-1 min-w-[200px]">
                <h1
                  className="text-white text-[30px] leading-[38px] tracking-wide uppercase"
                  style={{ fontFamily: "BankGothicBold" }}
                >
                  Content Management
                </h1>
                <p className="text-gray-400 text-base font-normal">
                  Review and manage all uploaded artwork and carousels.
                </p>
              </div>

              {/* Search input */}
              <div className="w-full max-w-[382px]">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-gray-500 shadow-sm">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1 text-white text-base placeholder:text-text-placeholder outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-500" />

            {/* Tabs + Export CSV */}
            <div className="flex items-center gap-4 flex-wrap justify-between">
              {/* Tab bar */}
              <div className="flex items-center gap-1 p-1.5 rounded-xl border border-gray-500">
                <button
                  onClick={() => setActiveTab("statistics")}
                  className={`h-11 px-3 flex items-center justify-center gap-2 rounded-md text-base font-semibold transition-all ${
                    activeTab === "statistics"
                      ? "bg-gray-500 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-400"
                  }`}
                >
                  Content Statistics
                </button>
                <button
                  onClick={() => setActiveTab("moderation")}
                  className={`h-11 px-3 flex items-center justify-center gap-2 rounded-md text-base font-semibold transition-all ${
                    activeTab === "moderation"
                      ? "bg-gray-500 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-400"
                  }`}
                >
                  Content Moderation
                </button>
              </div>

              {/* Export CSV button */}
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-lg border border-gray-900 bg-gray-600 text-white text-sm font-semibold hover:bg-gray-500 transition-colors shadow-sm"
              >
                <span className="px-0.5">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Statistics Tab */}
        {activeTab === "statistics" && (
          <>
            {/* Metric Cards */}
            <div className="px-6">
              <div className="flex flex-col sm:flex-row gap-6 items-stretch">
                {stats ? (
                  <>
                    <MetricCard
                      heading="Total Views"
                      value={
                        stats.totalViews >= 1000000
                          ? (stats.totalViews / 1000000).toFixed(1) + " M"
                          : (stats.totalViews / 1000).toFixed(1) + " K"
                      }
                      trend={
                        stats.totalViewsPercentage >= 0
                          ? "positive"
                          : "negative"
                      }
                      percentage={Math.abs(stats.totalViewsPercentage).toFixed(
                        0
                      )}
                    />
                    <MetricCard
                      heading="Average Watch Time (mins)"
                      value={stats.averageWatchTime + " mins"}
                      trend={
                        stats.averageWatchTimePercentage >= 0
                          ? "positive"
                          : "negative"
                      }
                      percentage={Math.abs(
                        stats.averageWatchTimePercentage
                      ).toFixed(0)}
                    />
                    <MetricCard
                      heading="Engagement Rate"
                      value={stats.engagementRate + "%"}
                      trend={
                        stats.engagementRatePercentage >= 0
                          ? "positive"
                          : "negative"
                      }
                      percentage={Math.abs(
                        stats.engagementRatePercentage
                      ).toFixed(0)}
                    />
                  </>
                ) : (
                  <>
                    <MetricCard
                      heading="Total Views"
                      value="0"
                      trend="positive"
                      percentage="0"
                    />
                    <MetricCard
                      heading="Average Watch Time (mins)"
                      value="0 mins"
                      trend="positive"
                      percentage="0"
                    />
                    <MetricCard
                      heading="Engagement Rate"
                      value="0%"
                      trend="positive"
                      percentage="0"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Table Section */}
            <div className="flex flex-col gap-6">
              <CarouselTable
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

        {/* Content Moderation Tab */}
        {activeTab === "moderation" && <ModerationPanel />}
      </div>
    </div>
  );
}
