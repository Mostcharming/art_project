import { getCountryFlag } from "../../utils/countryFlags";

interface UserAboutSectionProps {
  userType: "Publisher" | "Viewer";
  bio?: string;
  interests?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  suspensionReasons: string[];
  region: string;
  dateJoined: string;
  website?: string;
  email: string;
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
  userType,
  bio,
  interests,
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
        {/* About Creator / Interests Section */}
        <div className="flex flex-col gap-2 min-w-[300px] max-w-[640px] flex-1">
          <h2 className="text-white font-medium text-base leading-6">
            {userType === "Viewer" ? "Interests" : "About Creator"}
          </h2>
          {userType === "Publisher" ? (
            <p className="text-[#94969c] text-base font-normal leading-6">
              {bio}
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {interests && interests.length > 0 ? (
                interests.map((interest) => (
                  <div
                    key={interest.id}
                    className="inline-flex items-center px-3 py-2 rounded-lg border border-[#333741] bg-[#333741]"
                  >
                    <span className="text-white text-sm font-medium leading-5">
                      {interest.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[#94969c] text-sm font-normal leading-5">
                  No interests added yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Details grid */}
        <div className="flex flex-wrap items-start gap-4 min-w-[340px] flex-1">
          {/* Region */}
          <div className="flex flex-col gap-2 min-w-[150px] flex-1">
            <span className="text-[#94969c] text-sm font-medium leading-5">
              Region
            </span>
            <div className="flex items-center gap-2">
              {getCountryFlag(region)}
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
