const accessList = [
  "View all uploaded artworks and carousels",
  "Review and approve pending content",
  "Reject submitted content",
  "Flag content for review",
  "Hide or unhide content from public view",
  "View all user accounts",
  "View content performance metrics",
];

interface Privilege {
  id: number;
  name: string;
  description?: string;
  category: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  isDefault: boolean;
  isCustom: boolean;
  privileges?: Privilege[];
}

interface AdminData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  roleId: number;
  roleDetails?: Role;
  dateJoined?: string;
}

interface RolesSectionProps {
  admin?: AdminData;
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M16.6667 5L7.5 14.1667L3.33334 10"
        stroke="#D2D6DB"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H5.83331M14.1666 5.83334V14.1667"
        stroke="#D8522E"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RolesSection({ admin }: RolesSectionProps) {
  // Use admin's role if provided, otherwise use fallback
  const role = admin?.roleDetails;
  const roleName = role?.name || "";
  const privileges = role?.privileges || [];
  const email = admin?.email || "";
  const dateJoined = admin?.dateJoined || "";

  // Get privileges to display (either from role or use default list)
  const displayPrivileges =
    privileges.length > 0 ? privileges.map((p) => p.description) : accessList;
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Role heading + badge */}
      <div className="flex flex-col gap-1">
        <h2 className="text-white text-lg font-semibold leading-7">Role</h2>
        <span className="inline-flex w-fit px-2.5 py-1 rounded-lg border border-[#333741] bg-[#161B26] text-white text-sm font-medium leading-5">
          {roleName}
        </span>
      </div>

      {/* Content row: Access list + Details */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Roles/Access */}
        <div className="flex flex-col gap-2 flex-1 min-w-0 max-w-xl">
          <p className="text-white text-base font-medium leading-6">
            Roles/Access
          </p>
          <div className="flex flex-col gap-4">
            {displayPrivileges.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckIcon />
                <span className="text-white text-sm font-medium leading-5">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Email + Date Joined */}
        <div className="flex flex-row flex-wrap gap-8 lg:gap-16 lg:flex-shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium leading-5">
              Email
            </span>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-[#D8522E] text-base font-semibold leading-6 hover:opacity-80 transition-opacity"
            >
              {email}
              <ArrowUpRightIcon />
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium leading-5">
              Date Joined
            </span>
            <span className="text-white text-base font-medium leading-6">
              {dateJoined}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
