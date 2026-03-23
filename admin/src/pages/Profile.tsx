import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useApiMutation } from "../hooks/useApiMutation";
import { useUserStore } from "../store/userStore";

function UserIcon() {
  return (
    <svg
      width="57"
      height="57"
      viewBox="0 0 57 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.05 47C12.5391 41.1781 19.9915 37.6 28.2 37.6C36.4085 37.6 43.8609 41.1781 49.35 47M38.775 17.625C38.775 23.4654 34.0404 28.2 28.2 28.2C22.3596 28.2 17.625 23.4654 17.625 17.625C17.625 11.7846 22.3596 7.05 28.2 7.05C34.0404 7.05 38.775 11.7846 38.775 17.625Z"
        stroke="#94969C"
        strokeWidth="4.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 7.5L10.5 4.5M1.87498 16.125L4.41326 15.843C4.72338 15.8085 4.87844 15.7913 5.02337 15.7444C5.15195 15.7027 5.27432 15.6439 5.38715 15.5695C5.51433 15.4857 5.62464 15.3753 5.84528 15.1547L15.75 5.25C16.5784 4.42157 16.5784 3.07843 15.75 2.25C14.9216 1.42157 13.5784 1.42157 12.75 2.25L2.84528 12.1547C2.62464 12.3753 2.51433 12.4857 2.43046 12.6128C2.35606 12.7257 2.29725 12.848 2.25562 12.9766C2.2087 13.1215 2.19147 13.2766 2.15702 13.5867L1.87498 16.125Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 12H4M4 12L10 18M4 12L10 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileField({
  label,
  value,
  type = "text",
  editable = false,
  onSave,
  isLoading = false,
}: {
  label: string;
  value: string;
  type?: string;
  editable?: boolean;
  onSave?: (value: string) => void;
  isLoading?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = async () => {
    if (onSave && editValue.trim()) {
      await onSave(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 w-full">
      <div className="sm:flex-1 text-[#D2D6DB] text-lg font-medium leading-7 min-w-[120px]">
        {label}
      </div>
      <div className="sm:flex-1 flex flex-col gap-1.5">
        {isEditing && editable ? (
          <div className="flex items-center gap-2">
            <input
              type={type === "password" ? "password" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#333741] bg-[#0C111D] text-[#85888E] text-base font-normal leading-6 outline-none focus:border-[#D8522E] transition-colors"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={isLoading || !editValue.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#D8522E] text-white text-sm font-medium hover:bg-[#c44a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg border border-[#333741] text-[#D2D6DB] text-sm font-medium hover:bg-[#161B26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#333741] bg-[#0C111D] w-full cursor-pointer hover:border-[#D8522E] transition-colors"
            onClick={() => editable && setIsEditing(true)}
          >
            <span className="flex-1 text-[#85888E] text-base font-normal leading-6 truncate">
              {type === "password" ? "**************" : value}
            </span>
            {editable && (
              <span className="text-[#85888E] text-xs">(Click to edit)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadProfilePicture = useApiMutation({
    endpoint: "/admins/profile-picture",
    method: "PUT",
    isFormData: true,
  });

  const updateProfile = useApiMutation({
    endpoint: "/admins/profile",
    method: "PUT",
  });

  const fullName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim();

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      // Create FormData with the file
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Call API to upload profile picture
      uploadProfilePicture.mutate(formData, {
        onSuccess: (response) => {
          // Update the user store with new profile picture URL
          if (user && response.data?.profilePicture) {
            setUser({
              ...user,
              profilePicture: response.data.profilePicture,
            });
          }
        },
        onError: (error) => {
          alert(error.message || "Failed to upload profile picture");
          console.error("Profile picture upload error:", error);
        },
      });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file");
    }
  };

  const handleNameSave = async (fullName: string) => {
    // Split the name into first and last name
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";

    updateProfile.mutate(
      { firstName, lastName },
      {
        onSuccess: (response) => {
          // Update the user store with new names
          if (user) {
            setUser({
              ...user,
              firstname: response.data?.firstName || firstName,
              lastname: response.data?.lastName || lastName,
            });
          }
        },
        onError: (error) => {
          alert(error.message || "Failed to update profile");
          console.error("Profile update error:", error);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bfont-sans">
      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 pb-12 flex flex-col gap-8">
        {/* Go Back */}
        <div className="pl-6 sm:pl-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#F5F5F6] text-base font-medium leading-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeftIcon />
            <span>Go Back</span>
          </button>
        </div>

        {/* Page Header - Avatar + Name */}
        <div className="pl-0 sm:pl-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center justify-center w-[94px] h-[94px] rounded-full bg-[#1F242F] overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              {/* Edit button */}
              <button
                onClick={handleProfilePictureClick}
                disabled={uploadProfilePicture.isPending}
                className="absolute bottom-0 right-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#D8522E] border border-white/12 hover:bg-[#c44a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <EditIcon />
              </button>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Name + Badge */}
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#F5F5F6] text-3xl font-semibold leading-[38px]">
                  {fullName}
                </h1>
              </div>
              <div className="flex items-center px-2.5 py-1 rounded-lg border border-[#333741] bg-[#161B26]">
                <span className="text-[#CECFD2] text-sm font-medium leading-5 text-center">
                  {user?.role?.name || "Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="pl-0 sm:pl-8 flex flex-col gap-8">
          {/* Personal Info */}
          <div className="pl-0 sm:pl-4 flex flex-col gap-8">
            <ProfileField
              label="Name"
              value={fullName}
              editable={true}
              onSave={handleNameSave}
              isLoading={updateProfile.isPending}
            />
            <ProfileField label="Email" value={user?.email || ""} />
          </div>

          {/* Security Settings */}
          <div className="pl-0 sm:pl-4 flex flex-col gap-11">
            {/* Section header */}
            <div className="flex items-center justify-between gap-8">
              <h2 className="text-white text-xl font-bold">
                Security Settings
              </h2>
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="flex items-center justify-center h-9 px-[18px] rounded-lg border-2 border-[#D8522E] hover:bg-[#D8522E]/10 transition-colors"
              >
                <span className="text-[#D8522E] text-sm font-medium leading-6">
                  Change password
                </span>
              </button>
            </div>

            {/* Password field */}
            <ProfileField
              label="Password"
              value="**************"
              type="password"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
