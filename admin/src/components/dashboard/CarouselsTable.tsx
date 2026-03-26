import { useState } from "react";

type CreatorType = "Artist" | "Collector" | "Art Gallery";

interface Carousel {
  id: number;
  title: string;
  image: string;
  creatorName: string;
  carouselLength: number;
  artCategory: string;
  submissionDate: string;
  creatorType: CreatorType;
}

const carousels: Carousel[] = [
  {
    id: 1,
    title: "Halos Of Life",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/f9caed0d21469b65e7b266691dea379620974313?width=80",
    creatorName: "Mike Afolarin",
    carouselLength: 10,
    artCategory: "Abstract",
    submissionDate: "1/1/2025",
    creatorType: "Artist",
  },
  {
    id: 2,
    title: "Tea or Coffee",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/2e3c1a0190690e4c56103686a548f8497ab2f787?width=80",
    creatorName: "Sofia Torres",
    carouselLength: 30,
    artCategory: "Photography",
    submissionDate: "4/1/2025",
    creatorType: "Collector",
  },
  {
    id: 3,
    title: "Man on Fire",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/755e5d72c5990f38997f81ba18c598ef51415f2b?width=80",
    creatorName: "Rahul Patel",
    carouselLength: 25,
    artCategory: "Modern",
    submissionDate: "3/1/2025",
    creatorType: "Art Gallery",
  },
  {
    id: 4,
    title: "Marketplace",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/648916da02f7f4a3c58a13399440e80404196d8e?width=80",
    creatorName: "Ethan Kim",
    carouselLength: 10,
    artCategory: "NFT",
    submissionDate: "5/1/2025",
    creatorType: "Artist",
  },
  {
    id: 5,
    title: "The upside down",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/e1b7c2d3a4f5e6789012345678901234567890ab?width=80",
    creatorName: "Jessica Lin",
    carouselLength: 22,
    artCategory: "Historic",
    submissionDate: "2/1/2025",
    creatorType: "Artist",
  },
  {
    id: 6,
    title: "Colonial Monkey",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/a1b2c3d4e5f6789012345678901234567890abcd?width=80",
    creatorName: "Leila Ali",
    carouselLength: 32,
    artCategory: "Hyper- realism",
    submissionDate: "6/1/2025",
    creatorType: "Art Gallery",
  },
  {
    id: 7,
    title: "YTRNW",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/b2c3d4e5f6a789012345678901234567890abcde?width=80",
    creatorName: "Gbemidele Aderigbe",
    carouselLength: 40,
    artCategory: "African",
    submissionDate: "1/1/2025",
    creatorType: "Collector",
  },
];

const creatorTypeColors: Record<CreatorType, string> = {
  Artist: "border text-gray-500 bg-gray-800",
  Collector: "border text-gray-500 bg-gray-800",
  "Art Gallery": "border text-gray-500 bg-gray-800",
};

const avatarFallbacks: Record<number, string> = {
  5: "#2a4a3a",
  6: "#1a3a2a",
  7: "#3a2a1a",
};

function AvatarImage({
  src,
  title,
  id,
}: {
  src: string;
  title: string;
  id: number;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: avatarFallbacks[id] || "#2a2a3a" }}
      >
        {title.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="w-10 h-10 rounded-lg object-cover shrink-0"
      onError={() => setError(true)}
    />
  );
}

const pages = [1, 2, 3, "...", 8, 9, 10];

export default function CarouselsTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-8">
      {/* Section header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-100 leading-7">
          Top Performing Carousels
        </h2>
        <button className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg border border-gray-500 bg-gray-800 shadow-sm shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 8.33335H2.5M13.3333 1.66669V5.00002M6.66667 1.66669V5.00002M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3334V7.33335C17.5 5.93322 17.5 5.23316 17.2275 4.69838C16.9878 4.22797 16.6054 3.84552 16.135 3.60584C15.6002 3.33335 14.9001 3.33335 13.5 3.33335H6.5C5.09987 3.33335 4.3998 3.33335 3.86502 3.60584C3.39462 3.84552 3.01217 4.22797 2.77248 4.69838C2.5 5.23316 2.5 5.93322 2.5 7.33335V14.3334C2.5 15.7335 2.5 16.4335 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z"
              stroke="#CECFD2"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-semibold text-gray-500 px-0.5">
            Filter by date
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:-mx-0">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="h-11 px-6 text-left text-xs font-medium text-gray-300 leading-[18px] border-b border-dash-border-subtle bg-dash-bg">
                Carousel Title
              </th>
              <th className="h-11 px-6 text-left text-xs font-medium text-gray-300 leading-[18px] border-b border-dash-border-subtle bg-dash-bg">
                Creator Name
              </th>
              <th className="h-11 px-6 text-left text-xs font-medium text-gray-300 leading-[18px] border-b border-dash-border-subtle bg-dash-bg">
                Carousel Length
              </th>
              <th className="h-11 px-6 text-left text-xs font-medium text-gray-300 leading-[18px] border-b border-dash-border-subtle bg-dash-bg">
                Art Category
              </th>
              <th className="h-11 px-6 text-left text-xs font-medium text-gray-300 leading-[18px] border-b border-dash-border-subtle bg-dash-bg">
                Submission Date
              </th>
              <th className="h-11 px-6 text-left text-xs font-medium text-gray-300 leading-[18px] border-b border-dash-border-subtle bg-dash-bg">
                Creator Type
              </th>
            </tr>
          </thead>
          <tbody>
            {carousels.map((carousel) => (
              <tr
                key={carousel.id}
                className="border-b border-gray-500 hover:bg-gray-500/30 transition-colors"
              >
                {/* Carousel Title */}
                <td className="h-[72px] px-6">
                  <div className="flex items-center gap-3">
                    <AvatarImage
                      src={carousel.image}
                      title={carousel.title}
                      id={carousel.id}
                    />
                    <span className="text-sm font-medium text-white leading-5">
                      {carousel.title}
                    </span>
                  </div>
                </td>
                {/* Creator Name */}
                <td className="h-[72px] px-6">
                  <span className="text-sm font-bold text-gray-300 leading-5">
                    {carousel.creatorName}
                  </span>
                </td>
                {/* Carousel Length */}
                <td className="h-[72px] px-6">
                  <span className="text-sm text-gray-300 leading-5">
                    {carousel.carouselLength}
                  </span>
                </td>
                {/* Art Category */}
                <td className="h-[72px] px-6">
                  <span className="text-sm text-gray-500 leading-5">
                    {carousel.artCategory}
                  </span>
                </td>
                {/* Submission Date */}
                <td className="h-[72px] px-6">
                  <span className="text-sm text-gray-500 leading-5">
                    {carousel.submissionDate}
                  </span>
                </td>
                {/* Creator Type */}
                <td className="h-[72px] px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md border text-xs font-medium leading-5 ${
                      creatorTypeColors[carousel.creatorType]
                    }`}
                  >
                    {carousel.creatorType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        {/* Previous */}
        <button
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-400 transition-colors disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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

        {/* Page numbers */}
        <div className="flex items-center gap-0.5">
          {pages.map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              className={[
                "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium leading-5 transition-colors",
                page === currentPage
                  ? "bg-gray-800 text-gray-100"
                  : "text-gray-500 hover:bg-gray-700/50",
              ].join(" ")}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-400 transition-colors"
          onClick={() => setCurrentPage((p) => p + 1)}
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
