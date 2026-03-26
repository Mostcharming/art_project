interface UserInfoSectionProps {
  category: string;
  accountStatus: "Active" | "Suspended" | "Banned";
  suspensionStartDate?: string;
  suspensionEndDate?: string;
}

export default function UserInfoSection({
  category,
  accountStatus,
  suspensionStartDate,
  suspensionEndDate,
}: UserInfoSectionProps) {
  return (
    <div className="px-8">
      <div className="flex flex-wrap items-start gap-6">
        {/* User Category */}
        <div className="flex flex-col gap-1 items-center">
          <span className="text-white font-semibold text-lg leading-7">
            User Category
          </span>
          <div className="inline-flex items-center px-2.5 py-1 rounded-lg border border-[#333741] bg-[#333741]">
            <span className="text-white text-sm font-medium leading-5">
              {category}
            </span>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex flex-col gap-1 items-center">
          <span className="text-white font-semibold text-lg leading-7">
            Account status
          </span>
          {accountStatus === "Suspended" ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-yellow-300 bg-yellow-950">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" fill="#F79009" />
              </svg>
              <span className="text-yellow-300 text-sm font-medium leading-5">
                Suspended
              </span>
            </div>
          ) : accountStatus === "Banned" ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-900 bg-red-950">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" fill="#F23C57" />
              </svg>
              <span className="text-red-300 text-sm font-medium leading-5">
                Banned
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-green-800 bg-green-950">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" fill="#12B76A" />
              </svg>
              <span className="text-green-300 text-sm font-medium leading-5">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Suspension Timeframe */}
        {accountStatus === "Suspended" &&
          suspensionStartDate &&
          suspensionEndDate && (
            <div className="flex flex-col gap-1 min-w-[140px]">
              <span className="text-white font-semibold text-lg leading-7">
                Timeframe
              </span>
              <span className="text-white font-semibold text-lg leading-7">
                {suspensionStartDate} - {suspensionEndDate}
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
