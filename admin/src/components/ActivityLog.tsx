import { useFetchActivityLogs } from "../hooks/useFetchActivityLogs";
import {
  useActivityLogStore,
  type ActivityLog,
} from "../store/activityLogStore";

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

// Helper function to format action text based on action type
function formatActionText(action: string): string {
  // Convert action enum to readable text
  const actionMap: Record<string, string> = {
    LOGIN: "Logged in",
    LOGOUT: "Logged out",
    INVITE_MEMBER: "Invited",
    SUSPEND_MEMBER: "Suspended",
    ACTIVATE_MEMBER: "Activated",
    DELETE_MEMBER: "Deleted",
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

interface ActivityLogProps {
  onClose?: () => void;
}

function FeedItemRow({ item, isLast }: { item: ActivityLog; isLast: boolean }) {
  const adminName = `${item.admin.firstName} ${item.admin.lastName}`.trim();
  const timestamp = formatRelativeTime(item.createdAt);
  const actionText = formatActionText(item.action);
  const invitedEmail = item.details?.invitedEmail as string | undefined;

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <img
        src={item.admin.profilePicture || "https://via.placeholder.com/48"}
        alt={adminName}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />

      {/* Content */}
      <div
        className={`flex flex-col gap-3 flex-1 min-w-0 ${
          !isLast ? "pb-8" : ""
        }`}
      >
        <div className="flex flex-col gap-0.5">
          {/* Name + timestamp row */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium leading-5 truncate">
              {adminName}
            </span>
            <span className="text-white text-xs font-normal leading-[18px] whitespace-nowrap flex-shrink-0">
              {timestamp}
            </span>
          </div>

          {/* Action text */}
          <p className="text-sm leading-5 text-white font-normal">
            {item.action === "INVITE_MEMBER" && invitedEmail ? (
              <>
                <span>{actionText} </span>
                <span className="text-[#D8522E] font-medium">
                  {invitedEmail}
                </span>
              </>
            ) : (
              actionText
            )}
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex-shrink-0 mt-1">
        {item.status === "success" ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mt-1"
          >
            <circle cx="5" cy="5" r="4" fill="#47CD89" />
          </svg>
        ) : item.status === "failed" ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mt-1"
          >
            <circle cx="5" cy="5" r="4" fill="#FF6B6B" />
          </svg>
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mt-1"
          >
            <circle cx="5" cy="5" r="4" fill="#FFB800" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default function ActivityLog({ onClose }: ActivityLogProps) {
  const logs = useActivityLogStore((s) => s.logs);
  const isLoading = useActivityLogStore((s) => s.isLoading);
  useFetchActivityLogs();

  return (
    <div className="flex flex-col bg-[#0C111D] border-l border-t border-panel-border shadow-2xl w-full max-w-sm sm:max-w-md h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-2 px-6 flex-shrink-0">
        <div className="flex flex-1 items-start gap-4 pt-6">
          <h2 className="flex-1 text-white font-semibold text-xl leading-[30px]">
            Activity log
          </h2>
        </div>
        <button
          onClick={onClose}
          className="flex w-10 h-10 items-center justify-center rounded-lg hover:bg-white/5 transition-colors flex-shrink-0 mt-2 -mr-2"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="#85888E"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#94969c]">Loading activity logs...</p>
          </div>
        ) : logs.length > 0 ? (
          <div className="flex flex-col gap-0">
            {logs.map((item: ActivityLog, index: number) => (
              <FeedItemRow
                key={item.id}
                item={item}
                isLast={index === logs.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#94969c]">No activity logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
