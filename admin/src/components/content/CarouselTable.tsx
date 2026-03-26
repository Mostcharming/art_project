import { type ReactNode } from "react";
import { useContentStore } from "../../store/contentStore";

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md border border-gray-500 text-gray-500 text-xs font-medium whitespace-nowrap">
      {type}
    </span>
  );
}

function TableThumbnail({
  image,
  title,
}: {
  image: string | null;
  title: string;
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={title}
        className="w-10 h-10 rounded-lg object-cover shrink-0"
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-lg shrink-0 bg-gradient-to-br from-gray-700 to-gray-900"
      aria-label={title}
    />
  );
}

function PaginationButton({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-gray-700 text-white"
          : "text-gray-500 hover:bg-gray-300 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

interface CarouselTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function CarouselTable({
  currentPage,
  onPageChange,
}: CarouselTableProps) {
  const { carousels, totalCarousels, pageSize } = useContentStore();

  return (
    <div className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between gap-4 px-8">
        <h2 className="text-white text-lg font-semibold">
          Top Performing Carousels
        </h2>
        <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-gray-500 bg-gray-800 text-gray-200 text-sm font-semibold hover:bg-gray-700 transition-colors shadow-sm">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 8.33332H2.5M13.3333 1.66666V4.99999M6.66667 1.66666V4.99999M6.5 18.3333H13.5C14.9001 18.3333 15.6002 18.3333 16.135 18.0608C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3333V7.33332C17.5 5.93319 17.5 5.23313 17.2275 4.69835C16.9878 4.22794 16.6054 3.84549 16.135 3.60581C15.6002 3.33332 14.9001 3.33332 13.5 3.33332H6.5C5.09987 3.33332 4.3998 3.33332 3.86502 3.60581C3.39462 3.84549 3.01217 4.22794 2.77248 4.69835C2.5 5.23313 2.5 5.93319 2.5 7.33332V14.3333C2.5 15.7335 2.5 16.4335 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0608C4.3998 18.3333 5.09987 18.3333 6.5 18.3333Z"
              stroke="#CECFD2"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-text-placeholder">Filter by date</span>
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 h-11">
                Carousel Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 h-11">
                Creator Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 h-11">
                Carousel Length
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 h-11">
                Art Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 h-11">
                Submission Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 h-11">
                Creator Type
              </th>
            </tr>
          </thead>
          <tbody>
            {carousels.map((carousel) => (
              <tr
                key={carousel.id}
                className="border-b border-gray-500 transition-colors hover:bg-surface-hover"
              >
                {/* Carousel Title */}
                <td className="px-6 py-4 h-[72px]">
                  <div className="flex items-center gap-3">
                    <TableThumbnail
                      image={carousel.artworkImage || null}
                      title={carousel.name}
                    />
                    <span className="text-white text-sm font-medium">
                      {carousel.name}
                    </span>
                  </div>
                </td>
                {/* Creator Name */}
                <td className="px-6 py-4 h-[72px]">
                  <span className="text-gray-500 text-sm font-semibold">
                    {carousel.publisherName}
                  </span>
                </td>
                {/* Carousel Length */}
                <td className="px-6 py-4 h-[72px]">
                  <span className="text-gray-500 text-sm">
                    {carousel.carouselLength}
                  </span>
                </td>
                {/* Art Category */}
                <td className="px-6 py-4 h-[72px]">
                  <span className="text-gray-500 text-sm">
                    {carousel.artCategory}
                  </span>
                </td>
                {/* Submission Date */}
                <td className="px-6 py-4 h-[72px]">
                  <span className="text-gray-500 text-sm">
                    {carousel.createdAt}
                  </span>
                </td>
                {/* Creator Type */}
                <td className="px-6 py-4 h-[72px]">
                  <TypeBadge type={carousel.publisherType} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 text-gray-500 text-sm font-semibold hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.8333 9.99996H4.16667M4.16667 9.99996L10 15.8333M4.16667 9.99996L10 4.16663"
              stroke="#94969C"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </button>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: Math.ceil(totalCarousels / pageSize) }).map(
            (_, idx) => (
              <PaginationButton
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => onPageChange(idx + 1)}
              >
                {idx + 1}
              </PaginationButton>
            )
          )}
        </div>

        <button
          onClick={() =>
            onPageChange(
              Math.min(Math.ceil(totalCarousels / pageSize), currentPage + 1)
            )
          }
          disabled={currentPage >= Math.ceil(totalCarousels / pageSize)}
          className="flex items-center gap-2 text-gray-500 text-sm font-semibold hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16663 9.99996H15.8333M15.8333 9.99996L9.99996 4.16663M15.8333 9.99996L9.99996 15.8333"
              stroke="#94969C"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
