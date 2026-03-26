import { useParams } from "react-router-dom";
import ProjectsSection from "../components/user/ProjectsSection";
import UserAboutSection from "../components/user/UserAboutSection";
import UserInfoSection from "../components/user/UserInfoSection";
import UserProfileHeader from "../components/user/UserProfileHeader";
import { useFetchUserDetails } from "../hooks/useFetchUserDetails";

export default function Index() {
  const { userId } = useParams<{ userId: string }>();
  const { userDetails, isLoading, error } = useFetchUserDetails(userId);

  const handleReactivate = () => {
    console.log("Reactivate user");
  };

  const handleBan = () => {
    console.log("Ban user");
  };

  const handleSuspend = () => {
    console.log("Suspend user");
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
    </div>
  );
}
