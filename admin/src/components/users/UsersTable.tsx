import type { CategoryType, StatusType } from "./UserBadges";
import { CategoryBadge, StatusBadge } from "./UserBadges";

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  category: CategoryType;
  dateJoined: string;
  status: StatusType;
}

const ALL_USERS: User[] = [
  {
    id: "0927727637",
    name: "Mike Afolarin",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/ba4f3dbab08420c243a5dc5f35ebd981621a8de1?width=80",
    category: "Artist",
    dateJoined: "1/1/2025",
    status: "Active",
  },
  {
    id: "0927727641",
    name: "Sofia Torres",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/d9a729b6c4d03758f843179883abfa05de062bcf?width=80",
    category: "Collector",
    dateJoined: "4/1/2025",
    status: "Active",
  },
  {
    id: "0927727639",
    name: "Rahul Patel",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/05ce864eedecb94eceacbce304f8eb72f810346d?width=80",
    category: "Art Gallery",
    dateJoined: "3/1/2025",
    status: "Active",
  },
  {
    id: "0927727638",
    name: "Ethan Kim",
    avatar: null,
    category: "Viewer",
    dateJoined: "5/1/2025",
    status: "Active",
  },
  {
    id: "0927727640",
    name: "Jessica Lin",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/c286fd6d07687217fd1dc98f5b481857accfdafa?width=80",
    category: "Artist",
    dateJoined: "2/1/2025",
    status: "Suspended",
  },
  {
    id: "0927727642",
    name: "Leila Ali",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/5daeee9cf51cda5e2f80a6725fd781747382d618?width=80",
    category: "Art Gallery",
    dateJoined: "6/1/2025",
    status: "Banned",
  },
  {
    id: "0927727637",
    name: "Gbemidele Aderigbe",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/6a5ea1ec74b12650c787925bdd352b67c92aed7d?width=80",
    category: "Collector",
    dateJoined: "1/1/2025",
    status: "Suspended",
  },
];

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
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
      <span className="text-sm font-semibold text-[#444CE7]">{initials}</span>
    </div>
  );
}

interface UsersTableProps {
  activeTab: string;
  searchQuery: string;
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
}: UsersTableProps) {
  const filtered = ALL_USERS.filter((u) => {
    const matchesTab = activeTab === "All users" || u.category === activeTab;
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

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
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-[#94969C] text-sm"
              >
                No users found.
              </td>
            </tr>
          ) : (
            filtered.map((user, idx) => (
              <tr
                key={`${user.id}-${idx}`}
                className=" border-b border-[#1F242F] hover:bg-[#161B26] transition-colors"
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
                    {user.id}
                  </span>
                </td>
                {/* User Category */}
                <td className="px-6 py-4">
                  <CategoryBadge category={user.category} />
                </td>
                {/* Date Joined */}
                <td className="px-6 py-4">
                  <span className="text-sm text-[#D2D6DB] leading-5">
                    {user.dateJoined}
                  </span>
                </td>
                {/* Account Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={user.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
