/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useApiMutation } from "../hooks/useApiMutation";

interface Role {
  id: number;
  name: string;
  description?: string;
  isCustom: boolean;
  isDefault: boolean;
}

interface Privilege {
  id: number;
  name: string;
  description?: string;
  label?: string;
  category?: string;
  checked?: boolean;
}

interface InviteModalProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function InviteModal({ onClose, onSuccess }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);

  // Load roles and privileges mutation
  const rolesMutation = useApiMutation({
    endpoint: "/admins/roles",
    method: "GET",
  });

  // Fetch privileges mutation
  const privilegesMutation = useApiMutation({
    endpoint: "/admins/privileges",
    method: "GET",
  });

  // Fetch role permissions mutation (endpoint will be built dynamically)
  const rolePermissionsMutation = useApiMutation({
    endpoint: selectedRoleId
      ? `/admins/roles/${selectedRoleId}/privileges`
      : "",
    method: "GET",
  });

  // Invite member mutation
  const inviteMutation = useApiMutation({
    endpoint: "/admins/invite-member",
    method: "POST",
  });

  const rolesData = rolesMutation.data?.data || [];
  const privilegesData = privilegesMutation.data?.data || [];
  const rolesLoading = rolesMutation.isLoading;
  const privilegesLoading = privilegesMutation.isLoading;
  const rolesError = rolesMutation.error;
  const privilegesError = privilegesMutation.error;

  // Load roles and privileges on first render
  useEffect(() => {
    rolesMutation.mutate({} as never);
    privilegesMutation.mutate({} as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch role permissions when role is selected
  useEffect(() => {
    if (selectedRoleId) {
      rolePermissionsMutation.mutate({} as never, {
        onSuccess: (data: any) => {
          const permissions = data?.data?.map((p: any) => p.id) || [];
          setRolePermissions(permissions);
          // For custom roles, allow editing so initialize with fetched permissions
          // For predefined roles, these are just for display
          const role = rolesData?.find((r: Role) => r.id === selectedRoleId);
          if (role?.isCustom) {
            setSelectedPermissions(permissions);
          }
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId]);

  const selectedRole = rolesData?.find((r: Role) => r.id === selectedRoleId);
  const isCustomRole = selectedRole?.isCustom;
  const hasSelectedPermissions = selectedPermissions.length > 0;
  const isFormValid =
    email && selectedRoleId && (!isCustomRole || hasSelectedPermissions);

  const handlePermissionToggle = (privilegeId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(privilegeId)
        ? prev.filter((id) => id !== privilegeId)
        : [...prev, privilegeId]
    );
  };

  const handleSendInvite = async () => {
    if (!isFormValid) return;

    try {
      const payload: any = {
        email,
        roleId: selectedRoleId,
      };

      // Only include privileges if it's a custom role
      if (isCustomRole && selectedPermissions.length > 0) {
        payload.privilegeIds = selectedPermissions;
      }

      await inviteMutation.mutateAsync(payload);

      // Success - reset form and close
      setEmail("");
      setSelectedRoleId(null);
      setSelectedPermissions([]);

      // Show success message or callback
      if (onSuccess) {
        onSuccess();
      } else {
        alert("Team member invited successfully!");
      }

      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to send invite. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  };

  if (rolesLoading || privilegesLoading) {
    return (
      <div className="relative w-full max-w-[664px] rounded-2xl bg-[#0C111D] p-6 flex flex-col gap-8 animate-modal-in">
        <p className="text-[#D2D6DB]">Loading...</p>
      </div>
    );
  }

  if (rolesError || privilegesError) {
    return (
      <div className="relative w-full max-w-[664px] rounded-2xl bg-[#0C111D] p-6 flex flex-col gap-8 animate-modal-in">
        <p className="text-red-500">
          Error loading form data. Please try again.
        </p>
        <button
          onClick={onClose}
          className="w-full px-4 py-3 rounded-lg border-2 border-white/10 bg-[#D8522E] text-white text-base font-medium"
        >
          Close
        </button>
      </div>
    );
  }

  const roles = rolesData || [];
  const privileges = privilegesData || [];

  return (
    <div className="relative w-full max-w-[664px] rounded-2xl bg-[#0C111D] p-6 flex flex-col gap-8 animate-modal-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 7L7 17M7 7L17 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Title */}
      <h1
        className="font-bankgothic text-white text-2xl font-bold uppercase tracking-wide"
        style={{ fontFamily: "BankGothicBold" }}
      >
        Invite team to collaborate
      </h1>

      {/* Form */}
      <div className="flex flex-col gap-8 w-full">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#CECFD2] text-sm font-medium leading-5">
            Email
          </label>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#333741] bg-[#0C111D] shadow-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-[#D2D6DB] text-base font-normal leading-6 outline-none placeholder:text-[#D2D6DB]/50 min-w-0"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Select Role */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[#CECFD2] text-sm font-medium leading-5">
            Select Role
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#333741] bg-[#0C111D] shadow-sm text-left w-full"
          >
            <span className="flex-1 text-[#D2D6DB] text-base font-normal leading-6 truncate">
              {selectedRole?.name || "Select a role"}
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`shrink-0 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            >
              <path
                d="M4.5 6.75L9 11.25L13.5 6.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[#333741] bg-[#161b2b] shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
              {roles.map((role: Role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setSelectedPermissions([]);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[#333741] ${
                    selectedRoleId === role.id
                      ? "text-[#D8522E]"
                      : "text-[#D2D6DB]"
                  }`}
                >
                  <div>
                    <p className="font-medium">{role.name}</p>
                    {role.description && (
                      <p className="text-xs text-[#A0A4A8]">
                        {role.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Permissions - Always show */}
        <div className="flex flex-col gap-4">
          <p className="text-[#CECFD2] text-sm font-medium leading-5">
            Permissions
            {!isCustomRole && selectedRole && (
              <span className="text-[#A0A4A8] text-xs font-normal ml-2">
                (Predefined for {selectedRole.name} role)
              </span>
            )}
          </p>
          <div className="flex flex-col gap-2">
            {privileges.length > 0 ? (
              privileges.map((permission: Privilege) => {
                const isRolePermission = rolePermissions.includes(
                  permission.id
                );
                const isEditable = isCustomRole;
                const isChecked = isCustomRole
                  ? selectedPermissions.includes(permission.id)
                  : isRolePermission;

                return (
                  <label
                    key={permission.id}
                    className={`flex items-center gap-3 ${
                      isEditable
                        ? "cursor-pointer group"
                        : "cursor-default opacity-75"
                    }`}
                  >
                    <div className="pt-0.5 flex items-center justify-center shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          isEditable && handlePermissionToggle(permission.id)
                        }
                        disabled={!isEditable}
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-[#D8522E]"
                            : "border border-[#333741] bg-transparent"
                        } ${!isEditable ? "cursor-default" : ""}`}
                        aria-checked={isChecked}
                        role="checkbox"
                      >
                        {isChecked && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="white"
                              strokeWidth="1.6666"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div
                      className={`flex-1 ${
                        isEditable ? "cursor-pointer" : "cursor-default"
                      }`}
                      onClick={() =>
                        isEditable && handlePermissionToggle(permission.id)
                      }
                    >
                      {permission.description && (
                        <span className="text-[#A0A4A8] text-xs select-none block">
                          {permission.description}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })
            ) : (
              <p className="text-[#A0A4A8] text-sm">No permissions available</p>
            )}
          </div>
        </div>
      </div>

      {/* Send Invite Button */}
      <button
        type="button"
        onClick={handleSendInvite}
        disabled={!isFormValid || inviteMutation.isPending}
        className="w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border-2 border-white/10 bg-[#D8522E] text-white text-base font-medium leading-6 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {inviteMutation.isPending ? "Sending..." : "Send Invite"}
      </button>
    </div>
  );
}
