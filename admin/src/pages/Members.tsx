import { useState } from "react";
import RoleSection from "../components/members/RoleSection";

const AVATARS = {
  phoenix:
    "https://api.builder.io/api/v1/image/assets/TEMP/d2a201bccf02cb9250775b6eb1d525835e7f31ce?width=80",
  lana: "https://api.builder.io/api/v1/image/assets/TEMP/1d3152c7796887b884ce56b224346c2a1a2b6271?width=80",
  demi: "https://api.builder.io/api/v1/image/assets/TEMP/1c136361aa7120701865f25fd306706a62a50e12?width=80",
  candice:
    "https://api.builder.io/api/v1/image/assets/TEMP/f936379a17c7cf339cbd3055757ae4eaf739624c?width=80",
  natali:
    "https://api.builder.io/api/v1/image/assets/TEMP/7fd534eaf17c8b0fb2e6d18edf12c983b7d4844e?width=80",
};

const ALL_MEMBERS = [
  {
    name: "Phoenix Baker",
    handle: "@phoenix.baker",
    avatar: AVATARS.phoenix,
    dateAdded: "1/2/2024",
    lastActive: "Active now",
  },
  {
    name: "Lana Steiner",
    handle: "@lanasteiner",
    avatar: AVATARS.lana,
    dateAdded: "1/7/2024",
    lastActive: "1 hr ago",
  },
  {
    name: "Demi Wilkinson",
    handle: "@demi_wilkinson",
    avatar: AVATARS.demi,
    dateAdded: "1/6/2024",
    lastActive: "2 hr ago",
  },
  {
    name: "Candice Wu",
    handle: "@candicewu",
    avatar: AVATARS.candice,
    dateAdded: "1/4/2024",
    lastActive: "1d ago",
  },
  {
    name: "Natali Craig",
    handle: "@nat.craig",
    avatar: AVATARS.natali,
    dateAdded: "1/2/2024",
    lastActive: "13/1/26",
  },
];

const ROLE_SECTIONS = [
  {
    roleName: "Super Admin",
    roleDescription:
      "Full system access, including user roles, content moderation, and platform configuration.",
    members: ALL_MEMBERS.slice(0, 3),
  },
  {
    roleName: "Admin",
    roleDescription:
      "Full access to manage content, users, and platform settings.",
    members: ALL_MEMBERS,
  },
  {
    roleName: "Content Manager",
    roleDescription:
      "Manages content reviews, approvals, and visibility across the platform.",
    members: ALL_MEMBERS,
  },
];

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 3.75V14.25M3.75 9H14.25"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = ROLE_SECTIONS.map((section) => ({
    ...section,
    members: section.members.filter(
      (m) =>
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.handle.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.members.length > 0 || !searchQuery);

  return (
    <div className="min-h-screen font-inter">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 flex-wrap">
            {/* Title + Description */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <h1
                className="text-white text-3xl font-bold leading-[38px] small-caps-heading 
              
              "
                style={{ fontFamily: "BankGothicBold" }}
              >
                Team Members
              </h1>
              <p className="text-[#94969c] text-base font-normal leading-6">
                Manage admin users, roles, and access permissions.
              </p>
            </div>

            {/* Search */}
            <div className="w-full sm:w-auto sm:min-w-[320px] lg:w-[382px]">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#94969c] shadow-sm">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-base text-[#94969c] placeholder-[#94969c] font-normal leading-6 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E4E7EC] w-full" />

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg bg-[#D8522E] hover:bg-[#c24826] transition-colors cursor-pointer">
              <PlusIcon />
              <span className="text-white text-sm font-semibold leading-5 px-0.5">
                Add new member
              </span>
            </button>

            <div className="flex items-center gap-4">
              <button className="px-3.5 py-2.5 rounded-lg bg-[#363b45] hover:bg-[#1e2538] transition-colors cursor-pointer">
                <span className="text-[#CECFD2] text-sm font-semibold leading-5 px-0.5">
                  Export CSV
                </span>
              </button>
              <button className="px-3.5 py-2.5 rounded-lg bg-[#363b45] hover:bg-[#1e2538] transition-colors cursor-pointer">
                <span className="text-[#CECFD2] text-sm font-semibold leading-5 px-0.5">
                  View Activity Log
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Role Sections */}
        <div className="flex flex-col gap-8">
          {filteredSections.map((section, index) => (
            <div key={section.roleName}>
              <RoleSection
                roleName={section.roleName}
                roleDescription={section.roleDescription}
                members={section.members}
              />
              {index < filteredSections.length - 1 && (
                <div className="h-px bg-[#E4E7EC] w-full mt-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
