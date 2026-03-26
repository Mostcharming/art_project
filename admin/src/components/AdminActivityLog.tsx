import { useEffect, useState } from "react";
import { useApiMutation } from "../hooks/useApiMutation";
import { exportActivityLogsAsCSV } from "../utils/csvExport";

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}

// Helper function to format action text
function formatActionText(action: string): string {
  const actionMap: Record<string, string> = {
    LOGIN: "Logged in",
    LOGOUT: "Logged out",
    INVITE_MEMBER: "Invited",
    SUSPEND_MEMBER: "Suspended",
    ACTIVATE_MEMBER: "Activated",
    DELETE_ADMIN: "Deleted",
    APPROVE_CAROUSEL: "Approved carousel",
    REJECT_CAROUSEL: "Rejected carousel",
    APPROVE_ARTWORK: "Approved artwork",
    REJECT_ARTWORK: "Rejected artwork",
    DELETE_CAROUSEL: "Deleted carousel",
    DELETE_ARTWORK: "Deleted artwork",
    UPDATE_ROLE: "Updated role",
    CREATE_ROLE: "Created role",
  };

  return actionMap[action] || action;
}

interface ActivityItem {
  id?: number;
  adminId?: number;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown> & {
    invitedEmail?: string;
    deletedAdminName?: string;
    deletedAdminEmail?: string;
  };
  status?: "success" | "failed" | "pending";
  createdAt: string;
  admin?: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  name?: string;
  time?: string;
  highlightName?: string;
  hasAvatar?: boolean;
  avatarUrl?: string;
  isNew?: boolean;
}

interface AdminActivityLogProps {
  adminId?: number;
}

function UserPlaceholderIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.3333 24.5C23.3333 22.8718 23.3333 22.0578 23.1324 21.3953C22.68 19.9039 21.5128 18.7367 20.0213 18.2843C19.3589 18.0833 18.5448 18.0833 16.9167 18.0833H11.0833C9.45518 18.0833 8.64109 18.0833 7.97867 18.2843C6.4872 18.7367 5.32004 19.9039 4.86761 21.3953C4.66666 22.0578 4.66666 22.8718 4.66666 24.5M19.25 8.75C19.25 11.6495 16.8995 14 14 14C11.1005 14 8.75 11.6495 8.75 8.75C8.75 5.85051 11.1005 3.5 14 3.5C16.8995 3.5 19.25 5.85051 19.25 8.75Z"
        stroke="#94969C"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityFeedItem({ item }: { item: ActivityItem; isLast?: boolean }) {
  // Handle both formats: new API format and default format
  const adminName = item.admin
    ? `${item.admin.firstName} ${item.admin.lastName}`.trim()
    : item.name || "Unknown";

  const timestamp = item.createdAt
    ? formatRelativeTime(item.createdAt)
    : item.time || "Unknown time";

  const actionText = formatActionText(item.action);
  const invitedEmail = item.details?.invitedEmail as string | undefined;
  const deletedAdminName = item.details?.deletedAdminName as string | undefined;

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-[#1F242F] border border-white/10 flex items-center justify-center overflow-hidden">
          {item.admin?.profilePicture ? (
            <img
              src={item.admin.profilePicture}
              alt={adminName}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserPlaceholderIcon />
          )}
        </div>
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-brand-green border-[1.5px] border-background" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5 flex-1 pb-8">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium leading-5">
            {adminName}
          </span>
          <span className="text-white text-xs font-normal leading-[18px]">
            {timestamp}
          </span>
        </div>
        <p className="text-sm leading-5">
          <span className="text-white font-normal">{actionText} </span>
          {invitedEmail && (
            <span className="text-[#D8522E] font-medium">{invitedEmail}</span>
          )}
          {deletedAdminName && (
            <span className="text-[#D8522E] font-medium">
              {deletedAdminName}
            </span>
          )}
          {item.highlightName && (
            <span className="text-[#D8522E] font-medium">
              {item.highlightName}
            </span>
          )}
          {(invitedEmail || deletedAdminName || item.highlightName) && (
            <span className="text-white font-normal">
              {deletedAdminName ? " from the team" : " to the team"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default function AdminActivityLog({ adminId }: AdminActivityLogProps) {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);

  const activityLogMutation = useApiMutation<ActivityItem[]>({
    endpoint: `/admins/${adminId}/activity-logs`,
    method: "GET",
  });

  useEffect(() => {
    if (adminId) {
      activityLogMutation.mutate({} as never, {
        onSuccess: (data) => {
          if (data.success && Array.isArray(data.data)) {
            setActivityItems(data.data);
          } else if (Array.isArray(data)) {
            setActivityItems(data);
          }
        },
        onError: (err) => {
          console.error("Error fetching activity logs:", err.message);
          setActivityItems([]);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const isLoading = activityLogMutation.isPending;

  const handleExportCSV = () => {
    try {
      exportActivityLogsAsCSV(activityItems);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold leading-7">
          Activity log
        </h2>
        <button
          onClick={handleExportCSV}
          disabled={activityItems.length === 0 || isLoading}
          className="px-3.5 py-2.5 rounded-lg border border-[#333741] bg-[#161B26] text-white text-sm font-semibold leading-5 hover:bg-[#1F2636] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Feed */}
      <div className="flex flex-col">
        {isLoading ? (
          <p className="text-[#94969c]">Loading activity logs...</p>
        ) : activityItems.length > 0 ? (
          activityItems.map((item, index: number) => (
            <ActivityFeedItem
              key={item.id || index}
              item={item}
              isLast={index === activityItems.length - 1}
            />
          ))
        ) : (
          <p className="text-[#94969c]">No activity logs found</p>
        )}
      </div>
    </div>
  );
}
