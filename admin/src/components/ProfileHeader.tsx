import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useApiMutation } from "../hooks/useApiMutation";
import ConfirmModal from "./ConfirmModal";
import EditRoleModal from "./EditRoleModal";

interface AdminData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  roleId: number;
  roleDetails?: {
    id: number;
    name: string;
    description?: string;
    isDefault: boolean;
    isCustom: boolean;
    privileges?: Array<{
      id: number;
      name: string;
      description?: string;
      category: string;
    }>;
  };
  dateJoined?: string;
  createdAt?: string;
}

interface ProfileHeaderProps {
  admin?: AdminData;
  onAdminUpdate?: () => void;
}

export default function ProfileHeader({
  admin,
  onAdminUpdate,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);

  const removeAdminMutation = useApiMutation({
    endpoint: `/admins/${admin?.id}`,
    method: "DELETE",
  });

  // Use admin data if provided, otherwise use fallback values
  const displayName = admin ? `${admin.firstName} ${admin.lastName}` : "";
  const profilePicture = admin?.profilePicture;

  const handleEditRoleSuccess = () => {
    setShowEditRoleModal(false);
    if (onAdminUpdate) {
      onAdminUpdate();
    }
  };

  const handleRemoveTeamMember = async () => {
    try {
      await removeAdminMutation.mutateAsync(null);
      toast.success("Team member removed successfully");
      setShowRemoveConfirmModal(false);
      // Navigate back to members page after successful deletion
      setTimeout(() => {
        navigate("/members");
      }, 500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove team member"
      );
    }
  };

  if (showEditRoleModal && admin) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <EditRoleModal
          admin={admin}
          onClose={() => setShowEditRoleModal(false)}
          onSuccess={handleEditRoleSuccess}
        />
      </div>
    );
  }

  if (showRemoveConfirmModal && admin) {
    return (
      <ConfirmModal
        title="Are you sure?"
        description="This will revoke this team member's access to Carsl"
        confirmLabel="Remove Team Member"
        cancelLabel="No, Cancel"
        onConfirm={handleRemoveTeamMember}
        onCancel={() => setShowRemoveConfirmModal(false)}
        onClose={() => setShowRemoveConfirmModal(false)}
        isLoading={removeAdminMutation.isPending}
      />
    );
  }

  return (
    <div className="flex items-start gap-6 w-full">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#1F242F] border border-white/10 flex items-center justify-center overflow-hidden">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66.6667 70C66.6667 65.3481 66.6667 63.0222 66.0925 61.1295C64.7999 56.8682 61.4651 53.5335 57.2038 52.2408C55.3112 51.6667 52.9852 51.6667 48.3333 51.6667H31.6667C27.0148 51.6667 24.6888 51.6667 22.7962 52.2408C18.5348 53.5335 15.2001 56.8682 13.9075 61.1295C13.3333 63.0222 13.3333 65.3481 13.3333 70M55 25C55 33.2843 48.2843 40 40 40C31.7157 40 25 33.2843 25 25C25 16.7157 31.7157 10 40 10C48.2843 10 55 16.7157 55 25Z"
                stroke="#94969C"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {/* Online indicator */}
        <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-brand-green border-2 border-background" />
      </div>

      {/* Name + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 flex-1 pt-10 sm:pt-14">
        <h1 className="text-white text-2xl sm:text-3xl font-semibold leading-tight">
          {displayName}
        </h1>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowEditRoleModal(true)}
            className="px-3 py-2 rounded-lg border border-[#333741] bg-[#161B26] text-white text-sm font-semibold leading-5 hover:bg-[#1F2636] transition-colors"
          >
            Edit Role
          </button>
          <button
            onClick={() => setShowRemoveConfirmModal(true)}
            className="px-3 py-2 rounded-lg bg-red-400 text-white text-sm font-semibold leading-5 hover:opacity-90 transition-opacity"
          >
            Remove Team member
          </button>
        </div>
      </div>
    </div>
  );
}
