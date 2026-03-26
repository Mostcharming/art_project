interface UserAboutSectionProps {
  bio: string;
  suspensionReasons: string[];
  region: string;
  dateJoined: string;
  website: string;
  email: string;
}

function NigeriaFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#ng-clip)">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="#F0F0F0"
        />
        <path
          d="M-0.000366211 10.0002C-0.000366211 14.2999 2.71338 17.9653 6.52139 19.3782V0.622223C2.71338 2.03511 -0.000366211 5.70058 -0.000366211 10.0002Z"
          fill="#6DA544"
        />
        <path
          d="M19.9999 10.0002C19.9999 5.70058 17.2862 2.03511 13.4781 0.622223V19.3783C17.2862 17.9653 19.9999 14.2999 19.9999 10.0002Z"
          fill="#6DA544"
        />
      </g>
      <defs>
        <clipPath id="ng-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ExternalLinkIcon({ color = "#D8522E" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H5.83331M14.1666 5.83334V14.1667"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function UserAboutSection({
  bio,
  suspensionReasons,
  region,
  dateJoined,
  website,
  email,
}: UserAboutSectionProps) {
  return (
    <div className="px-8 flex flex-col gap-6">
      {/* About + Details row */}
      <div className="flex flex-wrap items-start gap-6 xl:gap-16">
        {/* About Creator */}
        <div className="flex flex-col gap-2 min-w-[300px] max-w-[640px] flex-1">
          <h2 className="text-white font-medium text-base leading-6">
            About Creator
          </h2>
          <p className="text-[#94969c] text-base font-normal leading-6">
            {bio}
          </p>
        </div>

        {/* Details grid */}
        <div className="flex flex-wrap items-start gap-4 min-w-[340px] flex-1">
          {/* Region */}
          <div className="flex flex-col gap-2 min-w-[150px] flex-1">
            <span className="text-[#94969c] text-sm font-medium leading-5">
              Region
            </span>
            <div className="flex items-center gap-2">
              <NigeriaFlag />
              <span className="text-white font-medium text-base leading-6">
                {region}
              </span>
            </div>
          </div>

          {/* Date Joined */}
          <div className="flex flex-col gap-2 min-w-[150px] flex-1">
            <span className="text-[#94969c] text-sm font-medium leading-5">
              Date Joined
            </span>
            <span className="text-white font-medium text-base leading-6">
              {dateJoined}
            </span>
          </div>

          {/* Website */}
          <div className="flex flex-col gap-2 min-w-[150px] flex-1">
            <span className="text-[#94969c] text-sm font-medium leading-5">
              Website
            </span>
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#D8522E] font-semibold text-base leading-6 hover:opacity-80 transition-opacity"
            >
              {website}
              <ExternalLinkIcon />
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 min-w-[150px] flex-1">
            <span className="text-[#94969c] text-sm font-medium leading-5">
              Email
            </span>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-[#D8522E] font-semibold text-base leading-6 hover:opacity-80 transition-opacity"
            >
              {email}
              <ExternalLinkIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Suspension Reasons */}
      {suspensionReasons.length > 0 && (
        <div className="flex flex-col gap-2 max-w-[640px]">
          <h2 className="text-white font-medium text-base leading-6">
            Detailed suspension reasons
          </h2>
          <ul className="list-disc list-outside pl-5 space-y-1">
            {suspensionReasons.map((reason, index) => (
              <li
                key={index}
                className="text-[#94969c] text-base font-normal leading-6"
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
