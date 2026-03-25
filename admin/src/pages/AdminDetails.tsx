import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminActivityLog from "../components/AdminActivityLog";
import ProfileHeader from "../components/ProfileHeader";
import RolesSection from "../components/RolesSection";
import { useApiMutation } from "../hooks/useApiMutation";

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

export default function AdminDetails() {
  const { id } = useParams<{ id: string }>();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adminMutation = useApiMutation<AdminData>({
    endpoint: `/admins/${id}`,
    method: "GET",
  });

  useEffect(() => {
    if (id) {
      adminMutation.mutate({} as never, {
        onSuccess: (data) => {
          if (data.success && data.data) {
            setAdminData(data.data);
            setError(null);
          } else {
            setError(data.message || "Failed to load admin details");
          }
        },
        onError: (err) => {
          setError(err.message || "Failed to fetch admin details");
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isLoading = adminMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error || !adminData) {
    return (
      <div className="min-h-screen bg-background font-inter">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
          <Link
            to="/members"
            className="flex items-center gap-2 cursor-pointer group w-fit"
          >
            <ArrowLeftIcon />
            <span className="text-white text-base font-medium leading-6 group-hover:text-text-secondary transition-colors">
              Go Back
            </span>
          </Link>
          <div className="text-red-400">{error || "Admin not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Go Back */}
        <Link
          to="/members"
          className="flex items-center gap-2 cursor-pointer group w-fit"
        >
          <ArrowLeftIcon />
          <span className="text-white text-base font-medium leading-6 group-hover:text-text-secondary transition-colors">
            Go Back
          </span>
        </Link>

        {/* Profile Header */}
        <ProfileHeader
          admin={adminData}
          onAdminUpdate={() => {
            if (id) {
              adminMutation.mutate({} as never, {
                onSuccess: (data) => {
                  if (data.success && data.data) {
                    setAdminData(data.data);
                    setError(null);
                  } else {
                    setError(data.message || "Failed to load admin details");
                  }
                },
                onError: (err) => {
                  setError(err.message || "Failed to fetch admin details");
                },
              });
            }
          }}
        />

        {/* Divider */}
        <div className="w-full h-px bg-border" />

        {/* Roles Section */}
        <RolesSection admin={adminData} />

        {/* Divider */}
        <div className="w-full h-px bg-border" />

        {/* Activity Log */}
        <AdminActivityLog adminId={adminData.id} />
      </div>
    </div>
  );
}
