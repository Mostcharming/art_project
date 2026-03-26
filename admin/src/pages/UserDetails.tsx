import ProjectsSection from "../components/user/ProjectsSection";
import UserAboutSection from "../components/user/UserAboutSection";
import UserInfoSection from "../components/user/UserInfoSection";
import UserProfileHeader from "../components/user/UserProfileHeader";

const USER_DATA = {
  name: "Darasimi Oguntegbe",
  carousels: 24,
  views: "220K",
  userId: "0927727638",
  avatarUrl:
    "https://api.builder.io/api/v1/image/assets/TEMP/12189cfa02e4ea3e5bdb56858c992d3c6d1aea45?width=320",
  category: "Artist",
  accountStatus: "Suspended" as const,
  timeframeStart: "12/1/26",
  timeframeEnd: "28/12/26",
  bio: "Darasimi Oguntegbe is a contemporary artist whose work explores everyday emotions, shared experiences, and the quiet beauty found in movement and connection. Through bold color, expressive composition, and subtle storytelling, his pieces capture moments that feel both personal and familiar, inviting viewers to pause, reflect, and find meaning in the ordinary.",
  suspensionReasons: [
    "The artwork closely resembles an existing, copyrighted work by another artist without clear attribution or permission.",
    "The uploader is unable to demonstrate ownership or licensing rights for the artwork.",
    "The artwork appears to be reproduced from a protected source (e.g. another artist's portfolio, gallery archive, book, or online platform).",
  ],
  region: "Nigeria",
  dateJoined: "12/10/2023",
  website: "darasimi.com",
  email: "hello@darasimi.com",
};

const PROJECTS: Array<{
  id: string;
  title: string;
  imageUrl?: string;
  views: string;
  likes: string;
}> = [];

export default function Index() {
  const handleReactivate = () => {
    console.log("Reactivate user");
  };

  const handleBan = () => {
    console.log("Ban user");
  };

  return (
    <div className="min-h-screen w-full font-sans">
      <div className="max-w-[1280px] mx-auto py-8 pb-16 flex flex-col gap-12">
        {/* Profile Header (Go Back + Avatar + Name + Actions) */}
        <UserProfileHeader
          name={USER_DATA.name}
          carousels={USER_DATA.carousels}
          views={USER_DATA.views}
          userId={USER_DATA.userId}
          avatarUrl={USER_DATA.avatarUrl}
          onReactivate={handleReactivate}
          onBan={handleBan}
        />

        {/* Divider */}
        <div className="px-8">
          <div className="h-px bg-ds-border" />
        </div>

        {/* User Info: Category, Status, Timeframe */}
        <UserInfoSection
          category={USER_DATA.category}
          accountStatus={USER_DATA.accountStatus}
          timeframeStart={USER_DATA.timeframeStart}
          timeframeEnd={USER_DATA.timeframeEnd}
        />

        {/* About Creator + Details + Suspension Reasons */}
        <UserAboutSection
          bio={USER_DATA.bio}
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

        {/* Projects Section */}
        <ProjectsSection projects={PROJECTS} />
      </div>
    </div>
  );
}
