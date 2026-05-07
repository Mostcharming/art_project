import { useState } from "react";

interface UserProfileHeaderProps {
  name: string;
  carousels?: number;
  views?: string;
  userId: string;
  avatarUrl: string;
  accountStatus: "Active" | "Suspended" | "Banned";
  userType: "Publisher" | "Viewer";
  onReactivate?: () => void;
  onBan?: () => void;
  onSuspend?: () => void;
}

export default function UserProfileHeader({
  name,
  carousels,
  views,
  userId,
  avatarUrl,
  accountStatus,
  userType,
  onReactivate,
  onBan,
  onSuspend,
}: UserProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full">
      {/* Go Back */}
      <div className="px-8 mb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-white font-medium text-base hover:opacity-80 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 12H4M4 12L10 18M4 12L10 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Go Back
        </button>
      </div>

      {/* Profile header */}
      <div className="px-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#0C111D] overflow-hidden relative">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-full border border-white/12" />
            </div>
          </div>

          {/* Info + Actions */}
          <div className="flex-1 pt-0 sm:pt-16 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0 justify-between">
              {/* Name + stats */}
              <div className="flex flex-col gap-1">
                <h1 className="text-white font-semibold text-2xl sm:text-3xl leading-tight">
                  {name}
                </h1>
                <div className="flex items-center gap-1 flex-wrap">
                  {userType === "Publisher" &&
                    carousels !== undefined &&
                    views !== undefined && (
                      <span className="text-[#475467] text-base font-normal">
                        {carousels} Carousels • {views} Views •
                      </span>
                    )}
                  <div className="flex items-center gap-1">
                    <span className="text-[#475467] text-sm font-medium">
                      User Id: {userId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      title={copied ? "Copied!" : "Copy user ID"}
                      className="text-[#475467] hover:text-white transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#copy-clip)">
                          <path
                            d="M5.33331 5.33333V3.46666C5.33331 2.71992 5.33331 2.34656 5.47864 2.06134C5.60647 1.81046 5.81044 1.60648 6.06133 1.47865C6.34654 1.33333 6.71991 1.33333 7.46665 1.33333H12.5333C13.28 1.33333 13.6534 1.33333 13.9386 1.47865C14.1895 1.60648 14.3935 1.81046 14.5213 2.06134C14.6666 2.34656 14.6666 2.71992 14.6666 3.46666V8.53333C14.6666 9.28007 14.6666 9.65343 14.5213 9.93865C14.3935 10.1895 14.1895 10.3935 13.9386 10.5213C13.6534 10.6667 13.28 10.6667 12.5333 10.6667H10.6666M3.46665 14.6667H8.53331C9.28005 14.6667 9.65342 14.6667 9.93863 14.5213C10.1895 14.3935 10.3935 14.1895 10.5213 13.9386C10.6666 13.6534 10.6666 13.2801 10.6666 12.5333V7.46666C10.6666 6.71992 10.6666 6.34656 10.5213 6.06134C10.3935 5.81046 10.1895 5.60648 9.93863 5.47865C9.65342 5.33333 9.28005 5.33333 8.53331 5.33333H3.46665C2.71991 5.33333 2.34654 5.33333 2.06133 5.47865C1.81044 5.60648 1.60647 5.81046 1.47864 6.06134C1.33331 6.34656 1.33331 6.71993 1.33331 7.46666V12.5333C1.33331 13.2801 1.33331 13.6534 1.47864 13.9386C1.60647 14.1895 1.81044 14.3935 2.06133 14.5213C2.34654 14.6667 2.71991 14.6667 3.46665 14.6667Z"
                            stroke="white"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="copy-clip">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4">
                {accountStatus === "Suspended" && (
                  <button
                    onClick={onReactivate}
                    className="flex items-center justify-center px-3 py-2 rounded-lg border border-[#333741] bg-[#333741] text-white text-sm font-semibold leading-5 hover:bg-ds-border/50 transition-colors"
                  >
                    Reactivate user
                  </button>
                )}
                {accountStatus === "Active" && (
                  <button
                    onClick={onSuspend}
                    className="flex items-center justify-center px-3 py-2 rounded-lg border border-[#333741] bg-[#333741] text-white text-sm font-semibold leading-5 hover:bg-ds-border/50 transition-colors"
                  >
                    Suspend User
                  </button>
                )}
                {accountStatus !== "Banned" && (
                  <button
                    onClick={onBan}
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold leading-5 hover:opacity-90 transition-opacity"
                  >
                    Ban User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
