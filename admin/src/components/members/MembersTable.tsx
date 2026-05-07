import { useNavigate } from "react-router-dom";

interface Member {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateAdded: string;
  lastActive: string;
}

interface MembersTableProps {
  members: Member[];
}

const EditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.39662 15.0964C2.43491 14.7518 2.45405 14.5795 2.50618 14.4185C2.55243 14.2756 2.61778 14.1396 2.70045 14.0142C2.79363 13.8729 2.91621 13.7504 3.16136 13.5052L14.1666 2.49999C15.0871 1.57951 16.5795 1.57951 17.4999 2.49999C18.4204 3.42046 18.4204 4.91285 17.4999 5.83332L6.49469 16.8386C6.24954 17.0837 6.12696 17.2063 5.98566 17.2995C5.86029 17.3821 5.72433 17.4475 5.58146 17.4937C5.42042 17.5459 5.24813 17.565 4.90356 17.6033L2.08325 17.9167L2.39662 15.0964Z"
      stroke="#94969C"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MembersTable({ members }: MembersTableProps) {
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-hidden rounded-sm">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] bg-table-header">
        <div className="px-6 py-3 h-11 flex items-center">
          <span className="text-[#94969C] font-inter text-xs font-medium leading-[18px]">
            Name
          </span>
        </div>
        <div className="px-6 py-3 h-11 flex items-center">
          <span className="text-[#94969C] font-inter text-xs font-medium leading-[18px] whitespace-nowrap">
            Date Added
          </span>
        </div>
        <div className="px-6 py-3 h-11 flex items-center">
          <span className="text-[#94969C] font-inter text-xs font-medium leading-[18px] whitespace-nowrap">
            Last Active
          </span>
        </div>
        <div className="w-[72px] h-11 bg-table-header" />
      </div>

      {/* Table Rows */}
      {members.map((member, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_auto_auto_auto] border-b border-border-secondary hover:bg-gray-50 transition-colors"
        >
          {/* Name + Avatar */}
          <div className="px-6 py-4 h-[72px] flex items-center gap-3">
            {member.profilePicture && (
              <img
                src={member.profilePicture}
                alt={`${member.firstName} ${member.lastName}`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            )}
            {!member.profilePicture && (
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm font-medium leading-5 truncate">
                {member.firstName} {member.lastName}
              </span>
              <span className="text-[#94969C] text-sm font-normal leading-5 truncate">
                {member.email}
              </span>
            </div>
          </div>

          {/* Date Added */}
          <div className="px-6 py-4 h-[72px] flex items-center">
            <span className="text-[#94969C] text-sm font-normal leading-5 whitespace-nowrap">
              {member.dateAdded}
            </span>
          </div>

          {/* Last Active */}
          <div className="px-6 py-4 h-[72px] flex items-center">
            <span className="text-[#94969C] text-sm font-normal leading-5 whitespace-nowrap">
              {member.lastActive}
            </span>
          </div>

          {/* Edit Action */}
          <div className="w-[72px] px-6 py-4 h-[72px] flex items-center justify-end">
            <button
              onClick={() => navigate(`/members/${member.id}`)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <EditIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
