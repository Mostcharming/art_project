import { useEffect, useState } from "react";
import ActiveUsersCard from "../components/users/ActiveUser";
import UserCategoryCard, {
  type CategoryData,
} from "../components/users/UserCategoryCard";
import UsersTable, { type User } from "../components/users/UsersTable";
import { useApiMutation } from "../hooks/useApiMutation";

type TabType = "All users" | "Artist" | "Art Gallery" | "Collector" | "Viewer";
const TABS: TabType[] = [
  "All users",
  "Artist",
  "Art Gallery",
  "Collector",
  "Viewer",
];

const ITEMS_PER_PAGE = 10;

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-[#667085]"
    >
      <path
        d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
        stroke="#667085"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
        stroke="#CECFD2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15.8333 9.99996H4.16667M4.16667 9.99996L10 15.8333M4.16667 9.99996L10 4.16663"
        stroke="#94969C"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4.16663 9.99996H15.8333M15.8333 9.99996L9.99996 4.16663M15.8333 9.99996L9.99996 15.8333"
        stroke="#94969C"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

function Pagination({ current, total, onChange }: PaginationProps) {
  // Generate page numbers intelligently
  const getPages = (): (number | "...")[] => {
    if (total <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (current <= 4) {
      // Near the beginning
      pages.push(2, 3, 4, 5, "...", total);
    } else if (current >= total - 3) {
      // Near the end
      pages.push("...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      // In the middle
      pages.push("...", current - 1, current, current + 1, "...", total);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-between py-5 border-t border-[#333741]">
      {/* Previous */}
      <button
        className="flex items-center gap-1.5 text-sm font-semibold text-[#94969C] disabled:opacity-40 hover:text-[#CECFD2] transition-colors"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        <ArrowLeft />
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-0.5">
        {pages.map((page, idx) =>
          page === "..." ? (
            <div
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-sm font-medium text-[#94969C]"
            >
              ...
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onChange(page as number)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                current === page
                  ? "bg-[#1F242F] text-[#ECECED]"
                  : "text-[#94969C] hover:bg-[#161B26] hover:text-[#CECFD2]"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        className="flex items-center gap-1.5 text-sm font-semibold text-[#94969C] disabled:opacity-40 hover:text-[#CECFD2] transition-colors"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
      >
        Next
        <ArrowRight />
      </button>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("All users");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [statsData, setStatsData] = useState<Record<string, unknown> | null>(
    null
  );

  // Fetch users data
  const { mutate: fetchUsers } = useApiMutation({
    endpoint: "/admins/users/all",
    method: "GET",
  });

  // Fetch statistics
  const { mutate: fetchStats } = useApiMutation({
    endpoint: "/admins/users/statistics",
    method: "GET",
  });

  // Fetch users when filters change
  useEffect(() => {
    const categoryParam =
      activeTab === "All users"
        ? "all"
        : activeTab === "Art Gallery"
        ? "Gallery"
        : activeTab;

    fetchUsers(
      {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        category: categoryParam,
      } as Record<string, unknown>,
      {
        onSuccess: (response: Record<string, unknown>) => {
          const data = response.data as User[];
          const pagination = response.pagination as Record<string, unknown>;
          setUsers(data || []);
          setTotalUsers((pagination?.total as number) || 0);
        },
        onError: () => {
          setUsers([]);
          setTotalUsers(0);
        },
      }
    );

    // Fetch stats on initial load
    if (currentPage === 1) {
      fetchStats({} as Record<string, unknown>, {
        onSuccess: (response: Record<string, unknown>) => {
          setStatsData(response.data as Record<string, unknown>);
        },
      });
    }
  }, [activeTab, currentPage, searchQuery, fetchUsers, fetchStats]);

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen ">
      {/* ── PAGE HEADER ── */}
      <div className="px-8 pt-8">
        <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
          {/* Title + Subtitle */}
          <div className="flex flex-col gap-1 min-w-[260px]">
            <h1
              className="text-[30px] font-bold text-white leading-[38px] tracking-wide"
              style={{ fontFamily: "BankGothicBold" }}
            >
              Users Management
            </h1>
            <p className="text-base font-normal text-[#475467] leading-6">
              View, manage, and monitor all users across the Carsl platform.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-[382px]">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#333741] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-base text-[#667085] placeholder-[#667085] outline-none bg-transparent leading-6 truncate"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#333741]" />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="px-8 py-6 flex flex-col lg:flex-row gap-6">
        <UserCategoryCard
          data={
            statsData
              ? (statsData.categoryDistribution as CategoryData[])
              : undefined
          }
          totalUsers={
            statsData ? (statsData.totalActiveUsers as number) : undefined
          }
        />
        <ActiveUsersCard />
      </div>

      {/* ── TABLE SECTION ── */}
      <div className="px-8 pb-12">
        {/* Tabs + Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Tab bar */}
          <div className="flex p-1 items-center gap-1 rounded-[10px] border border-[#333741] flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`h-9 px-3 rounded-md text-sm font-semibold leading-5 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#3c3f45] text-[#CECFD2] shadow-sm"
                    : "text-[#94969C] hover:text-[#CECFD2]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter button */}
          <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#333741] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] hover:bg-[#1F242F] transition-colors">
            <FilterIcon />
            <span className="text-sm font-semibold text-[#CECFD2] leading-5">
              Filter
            </span>
          </button>
        </div>

        {/* Table */}
        <UsersTable
          activeTab={activeTab}
          searchQuery={searchQuery}
          users={users}
        />

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
