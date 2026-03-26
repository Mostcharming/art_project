import { useState } from "react";
import { useParams } from "react-router-dom";
import BanUserModal from "../components/user/BanUserModal";
import ProjectsSection from "../components/user/ProjectsSection";
import ReactivateUserModal from "../components/user/ReactivateUserModal";
import SuspendUserModal from "../components/user/SuspendUserModal";
import UserAboutSection from "../components/user/UserAboutSection";
import UserInfoSection from "../components/user/UserInfoSection";
import UserProfileHeader from "../components/user/UserProfileHeader";
import {
  useBanUserMutation,
  useFetchUserDetails,
  useReactivateUserMutation,
  useSuspendUserMutation,
} from "../hooks";

export default function Index() {
  const { userId } = useParams<{ userId: string }>();
  const { userDetails, isLoading, error } = useFetchUserDetails(userId);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const suspendMutation = useSuspendUserMutation();
  const banMutation = useBanUserMutation();
  const reactivateMutation = useReactivateUserMutation();

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReactivate = () => {
    setShowReactivateModal(true);
  };

  const handleBan = () => {
    setShowBanModal(true);
  };

  const handleSuspend = () => {
    setShowSuspendModal(true);
  };

  const handleSuspendProceed = async (data: {
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    if (!userId) return;

    try {
      await suspendMutation.mutateAsync({
        userId,
        data,
      });
      showNotification("success", "User suspended successfully");
      setShowSuspendModal(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to suspend user";
      showNotification("error", errorMessage);
    }
  };

  const handleBanProceed = async (data: { reason: string }) => {
    if (!userId) return;

    try {
      await banMutation.mutateAsync({
        userId,
        data,
      });
      showNotification("success", "User banned successfully");
      setShowBanModal(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to ban user";
      showNotification("error", errorMessage);
    }
  };

  const handleReactivateProceed = async () => {
    if (!userId) return;

    try {
      await reactivateMutation.mutateAsync(userId);
      showNotification("success", "User reactivated successfully");
      setShowReactivateModal(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reactivate user";
      showNotification("error", errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full font-sans flex items-center justify-center">
        <div className="text-white text-lg">Loading user details...</div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="min-h-screen w-full font-sans flex items-center justify-center">
        <div className="text-red-500 text-lg">{error || "User not found"}</div>
      </div>
    );
  }

  const USER_DATA = userDetails;

  return (
    <div className="min-h-screen w-full font-sans">
      <div className="max-w-[1280px] mx-auto py-8 pb-16 flex flex-col gap-12">
        {/* Profile Header (Go Back + Avatar + Name + Actions) */}
        <UserProfileHeader
          name={USER_DATA.name}
          carousels={USER_DATA.carousels}
          // views={undefined}
          views={
            USER_DATA.type === "Publisher"
              ? `${
                  USER_DATA.projects?.reduce(
                    (sum, p) => sum + parseInt(p.views),
                    0
                  ) || 0
                }`
              : undefined
          }
          userId={USER_DATA.userId}
          avatarUrl={USER_DATA.avatarUrl || ""}
          accountStatus={USER_DATA.accountStatus}
          userType={USER_DATA.type}
          onReactivate={handleReactivate}
          onBan={handleBan}
          onSuspend={handleSuspend}
        />

        {/* Divider */}
        <div className="px-8">
          <div className="h-px bg-ds-border" />
        </div>

        {/* User Info: Category, Status, Timeframe */}
        <UserInfoSection
          category={USER_DATA.category}
          accountStatus={USER_DATA.accountStatus}
          suspensionStartDate={USER_DATA.suspensionStartDate}
          suspensionEndDate={USER_DATA.suspensionEndDate}
        />

        {/* About Creator + Details + Suspension Reasons */}
        <UserAboutSection
          userType={USER_DATA.type}
          bio={USER_DATA.type === "Publisher" ? USER_DATA.bio : undefined}
          interests={
            USER_DATA.type === "Viewer" ? USER_DATA.interests : undefined
          }
          suspensionReasons={USER_DATA.suspensionReasons}
          region={USER_DATA.region}
          dateJoined={USER_DATA.dateJoined}
          website={USER_DATA.website}
          email={USER_DATA.email}
        />

        {/* Divider */}
        <div className="px-8">
          <div className="h-px bg-ds-border" />
        </div>

        {/* Projects Section - Only for Publishers */}
        {USER_DATA.type === "Publisher" && (
          <ProjectsSection
            projects={USER_DATA.projects || []}
            userType="Publisher"
          />
        )}
      </div>

      {/* Suspend User Modal */}
      {showSuspendModal && (
        <SuspendUserModal
          onClose={() => setShowSuspendModal(false)}
          onProceed={handleSuspendProceed}
          isLoading={suspendMutation.isPending}
        />
      )}

      {/* Ban User Modal */}
      {showBanModal && (
        <BanUserModal
          onClose={() => setShowBanModal(false)}
          onProceed={handleBanProceed}
          isLoading={banMutation.isPending}
        />
      )}

      {/* Reactivate User Modal */}
      {showReactivateModal && (
        <ReactivateUserModal
          onClose={() => setShowReactivateModal(false)}
          onProceed={handleReactivateProceed}
          isLoading={reactivateMutation.isPending}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className="fixed bottom-6 right-6 max-w-sm rounded-lg p-4 shadow-lg z-50 flex items-center gap-3 animate-fade-in"
          style={{
            backgroundColor:
              notification.type === "success"
                ? "rgba(18, 183, 106, 0.95)"
                : "rgba(242, 60, 87, 0.95)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {notification.type === "success" ? (
              <path
                d="M16.667 5L7.5 14.167L3.333 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M10 3.33334V10M10 16.6667H10.0083M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          <span className="text-white text-sm font-medium">
            {notification.message}
          </span>
        </div>
      )}
    </div>
  );
}
