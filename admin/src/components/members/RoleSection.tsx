import MembersTable from "./MembersTable";

interface Member {
  name: string;
  handle: string;
  avatar: string;
  dateAdded: string;
  lastActive: string;
}

interface RoleSectionProps {
  roleName: string;
  roleDescription: string;
  members: Member[];
}

export default function RoleSection({
  roleName,
  roleDescription,
  members,
}: RoleSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 w-full">
      {/* Role Info */}
      <div className="flex flex-col gap-1 w-full lg:w-[366px] lg:min-w-[300px] flex-shrink-0">
        <h2
          className="text-white text-2xl font-bold font-oswald small-caps-heading"
          style={{ fontFamily: "BankGothicBold" }}
        >
          {roleName}
        </h2>
        <p className="text-[#94969c] text-base font-normal leading-6">
          {roleDescription}
        </p>
      </div>

      {/* Table */}
      <div className="w-full lg:flex-1 overflow-x-auto">
        <MembersTable members={members} />
      </div>
    </div>
  );
}
