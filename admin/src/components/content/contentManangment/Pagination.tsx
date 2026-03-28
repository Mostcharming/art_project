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
  // Generate page numbers dynamically based on totalPages
  const getPages = (): (number | string)[] => {
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const leftSiblings = 1;
    const rightSiblings = 1;

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const leftRange = Math.max(2, currentPage - leftSiblings);
    const rightRange = Math.min(totalPages - 1, currentPage + rightSiblings);

    // Add left ellipsis if needed
    if (leftRange > 2) {
      pages.push("...");
    }

    // Add pages around current page
    for (let i = leftRange; i <= rightRange; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (rightRange < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

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
