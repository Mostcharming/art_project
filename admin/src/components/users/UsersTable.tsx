import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { CategoryType, StatusType } from "./UserBadges";
import { CategoryBadge, StatusBadge } from "./UserBadges";

export interface User {
  id: string | number;
  userId: string;
  name: string;
  avatar: string | null;
  category: CategoryType | string;
  dateJoined: string;
  status: StatusType | string;
  type?: string;
  email?: string;
}

function UserAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#F3F4F6]">
      <span className="text-sm font-semibold text-[#444CE7]">{initials}</span>
    </div>
  );
}

interface UsersTableProps {
  activeTab: string;
  searchQuery: string;
  users: User[];
  isLoading?: boolean;
}

const TABLE_HEADERS = [
  "Full Name",
  "User ID",
  "User Category",
  "Date Joined",
  "Account Status",
];

export default function UsersTable({
  activeTab,
  searchQuery,
  users,
  isLoading = false,
}: UsersTableProps) {
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let result = users || [];

    // Filter by tab
    if (activeTab !== "All users") {
      result = result.filter((u) => {
        const userCategory = String(u.category).toLowerCase();
        const tabCategory = activeTab.toLowerCase();

        if (tabCategory === "artist") return userCategory === "artist";
        if (tabCategory === "art gallery") return userCategory === "gallery";
        if (tabCategory === "collector") return userCategory === "collector";
        if (tabCategory === "viewer") return userCategory === "viewer";
        return false;
      });
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return result;
  }, [users, activeTab, searchQuery]);

  return (
    <div className="overflow-x-auto rounded-none">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="">
            {TABLE_HEADERS.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-[#94969C] leading-[18px] whitespace-nowrap border-b border-[#333741]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-[#94969C] text-sm"
              >
                Loading users...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-[#94969C] text-sm"
              >
                No users found.
              </td>
            </tr>
          ) : (
            filtered.map((user: User, idx: number) => (
              <tr
                key={`${user.id}-${idx}`}
                onClick={() => navigate(`/users/${user.userId}`)}
                className="border-b border-[#1F242F] hover:bg-[#161B26] transition-colors cursor-pointer"
              >
                {/* Full Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} avatar={user.avatar} />
                    <span className="text-sm font-medium text-[#D2D6DB] leading-5">
                      {user.name}
                    </span>
                  </div>
                </td>
                {/* User ID */}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-[#D2D6DB] leading-5">
                    {user.userId}
                  </span>
                </td>
                {/* User Category */}
                <td className="px-6 py-4">
                  <CategoryBadge category={user.category as CategoryType} />
                </td>
                {/* Date Joined */}
                <td className="px-6 py-4">
                  <span className="text-sm text-[#D2D6DB] leading-5">
                    {user.dateJoined}
                  </span>
                </td>
                {/* Account Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={user.status as StatusType} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
