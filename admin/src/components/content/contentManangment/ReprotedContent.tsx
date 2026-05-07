import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModeration } from "../../../contexts/useModeration";
import { useFlaggedCarouselsData } from "../../../hooks/useFlaggedCarouselsData";
import { DatePicker } from "../../dashboard/DatePicker";
import Pagination from "./Pagination";

const reasonBadge: Record<string, string> = {
  Copyright: "bg-[#55160C] text-[#FDA29B] border border-[#912018]",
  Explicit: "bg-[#102A56] text-[#84CAFF] border border-[#1849A9]",
  Disturbing: "bg-[#4E0D30] text-[#FAA7E0] border border-[#9E165F]",
  Repetitive: "bg-[#511C10] text-[#F7B27A] border border-[#932F19]",
};

const creatorTypeBadge: Record<string, string> = {
  Artist: "bg-[#161B26] text-[#CECFD2] border border-[#333741]",
  Collector: "bg-[#161B26] text-[#CECFD2] border border-[#333741]",
  "Art Gallery": "bg-[#161B26] text-[#CECFD2] border border-[#333741]",
};

export default function ReportedContentSection() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  } | null>(null);
  const pageSize = 10;

  const filters = useMemo(
    () => ({
      startDate: dateRange?.start
        ? dateRange.start.toISOString().split("T")[0]
        : undefined,
      endDate: dateRange?.end
        ? dateRange.end.toISOString().split("T")[0]
        : undefined,
    }),
    [dateRange]
  );

  const {
    data: allReportedItems,
    isLoading,
    refetch,
  } = useFlaggedCarouselsData(filters);

  const moderation = useModeration();

  // Register refetch function with context
  useEffect(() => {
    moderation.registerFlaggedContentRefetch(refetch);
  }, [refetch, moderation]);
  const reportedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return allReportedItems.slice(startIndex, startIndex + pageSize);
  }, [allReportedItems, currentPage]);

  const totalPages = Math.ceil(allReportedItems.length / pageSize);

  const handleDateApply = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  const handleDateRefresh = () => {
    setDateRange(null);
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-white">
          Reported/Flagged Content
        </h2>
        <div className="flex items-center gap-3 relative">
          <button className="flex items-center gap-2 px-[14px] py-[10px] rounded-lg border border-[#333741] bg-[#161B26] text-[#CECFD2] text-sm font-semibold shadow-sm hover:bg-[#1F242F] transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                stroke="#CECFD2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filter
          </button>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-[14px] py-[10px] rounded-lg border border-[#333741] bg-[#161B26] text-[#CECFD2] text-sm font-semibold shadow-sm hover:bg-[#1F242F] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M17.5 8.33335H2.5M13.3333 1.66669V5.00002M6.66667 1.66669V5.00002M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3334V7.33335C17.5 5.93322 17.5 5.23316 17.2275 4.69838C16.9878 4.22797 16.6054 3.84552 16.135 3.60584C15.6002 3.33335 14.9001 3.33335 13.5 3.33335H6.5C5.09987 3.33335 4.3998 3.33335 3.86502 3.60584C3.39462 3.84552 3.01217 4.22797 2.77248 4.69838C2.5 5.23316 2.5 5.93322 2.5 7.33335V14.3334C2.5 15.7335 2.5 16.4335 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z"
                stroke="#CECFD2"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filter by date
          </button>
          {showDatePicker && (
            <div className="absolute right-0 top-12 z-50">
              <DatePicker
                onApply={handleDateApply}
                onRefresh={handleDateRefresh}
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg overflow-hidden border border-[#1F242F]">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Carousel Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Creator Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Creator Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Report count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Date Reported
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Report reason
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-[#94969C]"
                >
                  Loading...
                </td>
              </tr>
            ) : reportedItems.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              reportedItems.map((item: any) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/flagged-content/${item.id}`)}
                  className="border-b border-[#1F242F] last:border-b-0 hover:bg-[#161B26] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <span className="text-sm font-medium text-[#F5F5F6]">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94969C]">
                    {item.creator}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        creatorTypeBadge[item.creatorType] ||
                        "bg-[#161B26] text-[#CECFD2] border border-[#333741]"
                      }`}
                    >
                      {item.creatorType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94969C]">
                    {item.reportCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94969C]">
                    {item.dateReported}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        reasonBadge[
                          Object.keys(reasonBadge).find((key) =>
                            item.reason
                              ?.toLowerCase()
                              .includes(key.toLowerCase())
                          ) ?? ""
                        ] ||
                        "bg-[#161B26] text-[#CECFD2] border border-[#333741]"
                      }`}
                    >
                      {item.reason.charAt(0).toUpperCase() +
                        item.reason.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-[#94969C]"
                >
                  No flagged content
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
