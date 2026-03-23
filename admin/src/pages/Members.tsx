import { useState } from "react";
import InviteModal from "../components/InviteModal";
import RoleSection from "../components/members/RoleSection";
import { useFetchMembersPageData } from "../hooks/useFetchMembersPageData";
import type { Member } from "../store/membersStore";
import { useMembersStore } from "../store/membersStore";
import { exportMembersAsCSV } from "../utils/csvExport";

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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const roles = useMembersStore((s) => s.roles);
  const isLoading = useMembersStore((s) => s.isLoading);
  const error = useMembersStore((s) => s.error);

  // Fetch members page data
  useFetchMembersPageData();

  const filteredSections = roles
    .map((section) => ({
      ...section,
      members: section.members.filter(
        (m: Member) =>
          !searchQuery ||
          m.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.members.length > 0 || !searchQuery);

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
                className="text-white text-3xl font-bold leading-[38px] small-caps-heading"
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
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg bg-[#D8522E] hover:bg-[#c24826] transition-colors cursor-pointer"
            >
              <PlusIcon />
              <span className="text-white text-sm font-semibold leading-5 px-0.5">
                Add new member
              </span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => exportMembersAsCSV(roles)}
                disabled={roles.length === 0}
                className="px-3.5 py-2.5 rounded-lg bg-[#363b45] hover:bg-[#1e2538] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
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

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-900 bg-opacity-20 border border-red-500 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-[#94969c]">Loading members...</p>
          </div>
        )}

        {/* Role Sections */}
        {!isLoading && filteredSections.length > 0 && (
          <div className="flex flex-col gap-8">
            {filteredSections.map((section, index: number) => (
              <div key={section.id}>
                <RoleSection
                  roleName={section.name}
                  roleDescription={section.description}
                  members={section.members}
                />
                {index < filteredSections.length - 1 && (
                  <div className="h-px bg-[#94969c] w-full mt-8" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredSections.length === 0 && roles.length > 0 && (
          <div className="text-center py-12">
            <p className="text-[#94969c]">
              No members found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <InviteModal
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setShowInviteModal(false);
              // Optionally refetch members data
              // useFetchMembersPageData();
            }}
          />
        </div>
      )}
    </div>
  );
}
