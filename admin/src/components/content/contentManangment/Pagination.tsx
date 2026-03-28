import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [1, 2, 3, "...", 8, 9, 10];

  return (
    <div className="flex items-center justify-between pt-3 pb-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#94969C] hover:text-[#CECFD2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.67} />
        Previous
      </button>

      <div className="flex items-center gap-0.5">
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-[#1F242F] text-[#ECECED]"
                : page === "..."
                ? "text-[#94969C] cursor-default"
                : "text-[#94969C] hover:bg-[#1F242F] hover:text-[#ECECED]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#94969C] hover:text-[#CECFD2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" strokeWidth={1.67} />
      </button>
    </div>
  );
}
