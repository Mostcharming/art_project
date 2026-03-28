import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useModeration } from "../../../contexts/useModeration";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { usePendingApprovalData } from "../../../hooks/usePendingApprovalData";
import { DatePicker } from "../../dashboard/DatePicker";
import Pagination from "./Pagination";

export default function PendingApprovalSection() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  } | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const pageSize = 10;

  const approveMutation = useApiMutation({
    endpoint: "/admins/carousels/",
    method: "POST",
  });

  const rejectMutation = useApiMutation({
    endpoint: "/admins/carousels/",
    method: "POST",
  });

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
    data: allItems,
    isLoading,
    refetch,
  } = usePendingApprovalData(filters);

  const moderation = useModeration();

  // Register refetch function with context
  useEffect(() => {
    moderation.registerPendingApprovalRefetch(refetch);
  }, [refetch, moderation]);
  const items = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return allItems.slice(startIndex, startIndex + pageSize);
  }, [allItems, currentPage]);

  const totalPages = Math.ceil(allItems.length / pageSize);

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

  const handleApprove = useCallback(
    async (carouselId: number) => {
      try {
        setLoadingId(carouselId);
        const loadingToast = toast.loading("Approving carousel...");
        
        await approveMutation.mutateAsync({ carouselId, action: "approve" });
        
        toast.dismiss(loadingToast);
        toast.success("Carousel approved successfully!");
        // Refetch both tables after successful approval
        moderation.refetchAll();
      } catch (error) {
        toast.dismiss();
        toast.error(
          error instanceof Error ? error.message : "Failed to approve carousel"
        );
        console.error("Error approving carousel:", error);
      } finally {
        setLoadingId(null);
      }
    },
    [approveMutation, moderation]
  );

  const handleReject = useCallback(
    async (carouselId: number) => {
      try {
        setLoadingId(carouselId);
        const loadingToast = toast.loading("Rejecting carousel...");
        
        await rejectMutation.mutateAsync({ carouselId, action: "reject" });
        
        toast.dismiss(loadingToast);
        toast.success("Carousel rejected successfully!");
        // Refetch both tables after successful rejection
        moderation.refetchAll();
      } catch (error) {
        toast.dismiss();
        toast.error(
          error instanceof Error ? error.message : "Failed to reject carousel"
        );
        console.error("Error rejecting carousel:", error);
      } finally {
        setLoadingId(null);
      }
    },
    [rejectMutation, moderation]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Section header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-white">Pending Approval</h2>
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
                d="M17.5 8.33334H2.5M13.3333 1.66667V5.00001M6.66667 1.66667V5.00001M6.5 18.3333H13.5C14.9001 18.3333 15.6002 18.3333 16.135 18.0609C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3333V7.33334C17.5 5.93321 17.5 5.23314 17.2275 4.69836C16.9878 4.22796 16.6054 3.84551 16.135 3.60582C15.6002 3.33334 14.9001 3.33334 13.5 3.33334H6.5C5.09987 3.33334 4.3998 3.33334 3.86502 3.60582C3.39462 3.84551 3.01217 4.22796 2.77248 4.69836C2.5 5.23314 2.5 5.93321 2.5 7.33334V14.3333C2.5 15.7335 2.5 16.4335 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0609C4.3998 18.3333 5.09987 18.3333 6.5 18.3333Z"
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
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Carousel Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Creator Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Carousel Length
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Art Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Submission Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#94969C] tracking-wide border-b border-[#1F242F]">
                Action
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
            ) : items.length > 0 ? (
              items.map(
                (item: {
                  id: number;
                  img?: string;
                  title: string;
                  creator: string;
                  length: number;
                  category: string;
                  date: string;
                }) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/pending-approval/${item.id}`)}
                    className={`border-b border-[#1F242F] last:border-b-0 hover:bg-[#161B26] transition-colors cursor-pointer`}
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
                    <td className="px-6 py-4 text-sm text-[#94969C]">
                      {item.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94969C]">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94969C]">
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={loadingId === item.id}
                          className="px-3 py-1.5 rounded-lg bg-[#D8522E] text-white text-sm font-semibold hover:bg-[#C04520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingId === item.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={loadingId === item.id}
                          className="px-3 py-1.5 rounded-lg bg-[#333741] text-[#CECFD2] text-sm font-semibold hover:bg-[#3d424f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingId === item.id ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-[#94969C]"
                >
                  No pending approvals
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
