import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface UserData {
  id: number;
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  category: "artist" | "gallery" | "collector" | "viewer";
  type: "viewer" | "publisher";
  dateJoined: string;
  status: "active" | "inactive" | "suspended";
  bio?: string;
  location?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
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

function UserAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-24 h-24 rounded-full object-cover"
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#F3F4F6]">
      <span className="text-2xl font-semibold text-[#444CE7]">{initials}</span>
    </div>
  );
}

export default function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - Replace with actual API call
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Mock data for demonstration
        const mockUsers: Record<string, UserData> = {
          "PUB-14": {
            id: 1,
            userId: "USR-001",
            name: "Sarah Anderson",
            email: "sarah.anderson@example.com",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            category: "artist",
            type: "publisher",
            dateJoined: "Jan 15, 2024",
            status: "active",
            bio: "Contemporary digital artist exploring the intersection of technology and human emotion.",
            location: "New York, USA",
            socialLinks: {
              instagram: "@sarahcreates",
              twitter: "@sarahcreates",
              website: "www.sarahcreates.com",
            },
          },
          "USR-002": {
            id: 2,
            userId: "USR-002",
            name: "James Mitchell",
            email: "james.mitchell@example.com",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            category: "collector",
            type: "viewer",
            dateJoined: "Feb 20, 2024",
            status: "active",
            bio: "Art enthusiast and curator with a passion for emerging talents.",
            location: "London, UK",
            socialLinks: {
              instagram: "@jmitchell_art",
              twitter: "@jmitchell",
            },
          },
          "USR-003": {
            id: 3,
            userId: "USR-003",
            name: "Elena Rivera",
            email: "elena.rivera@example.com",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            category: "gallery",
            type: "publisher",
            dateJoined: "Mar 10, 2024",
            status: "active",
            bio: "Curating exceptional contemporary art from around the world.",
            location: "Barcelona, Spain",
            socialLinks: {
              instagram: "@riveragallery",
              website: "www.riveragallery.com",
            },
          },
          "USR-004": {
            id: 4,
            userId: "USR-004",
            name: "David Chen",
            email: "david.chen@example.com",
            avatar:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            category: "viewer",
            type: "viewer",
            dateJoined: "Apr 5, 2024",
            status: "inactive",
            bio: "Passionate about art appreciation and community engagement.",
            location: "Tokyo, Japan",
            socialLinks: {
              twitter: "@davisart",
            },
          },
        };

        const user = mockUsers[userId || "USR-001"];

        if (user) {
          setUserData(user);
          setError(null);
        } else {
          setError("User not found");
        }
      } catch {
        setError("Failed to load user details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background font-inter">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
          <Link
            to="/users"
            className="flex items-center gap-2 cursor-pointer group w-fit"
          >
            <ArrowLeftIcon />
            <span className="text-white text-base font-medium leading-6 group-hover:text-text-secondary transition-colors">
              Go Back
            </span>
          </Link>
          <div className="text-red-400">{error || "User not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Go Back Button */}
        <Link
          to="/users"
          className="flex items-center gap-2 cursor-pointer group w-fit"
        >
          <ArrowLeftIcon />
          <span className="text-white text-base font-medium leading-6 group-hover:text-text-secondary transition-colors">
            Go Back
          </span>
        </Link>

        {/* User Header Card */}
        <div className="bg-[#0F1419] border border-[#333741] rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <UserAvatar name={userData.name} avatar={userData.avatar} />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userData.name}
                </h1>
                <p className="text-[#94969C] text-sm">{userData.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-[#94969C] uppercase tracking-wide mb-1">
                    User ID
                  </p>
                  <p className="text-white font-semibold">{userData.userId}</p>
                </div>
                <div>
                  <p className="text-xs text-[#94969C] uppercase tracking-wide mb-1">
                    Account Type
                  </p>
                  <p className="text-white font-semibold capitalize">
                    {userData.type === "viewer" ? "Viewer" : "Publisher"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94969C] uppercase tracking-wide mb-1">
                    Category
                  </p>
                  <p className="text-white font-semibold capitalize">
                    {userData.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94969C] uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <p
                    className={`font-semibold capitalize ${
                      userData.status === "active"
                        ? "text-green-500"
                        : userData.status === "inactive"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {userData.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#94969C] uppercase tracking-wide mb-1">
                    Date Joined
                  </p>
                  <p className="text-white font-semibold">
                    {userData.dateJoined}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94969C] uppercase tracking-wide mb-1">
                    Location
                  </p>
                  <p className="text-white font-semibold">
                    {userData.location || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#333741]" />

        {/* Bio Section */}
        <div className="bg-[#0F1419] border border-[#333741] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Bio</h2>
          <p className="text-[#D2D6DB] leading-6">
            {userData.bio || "No bio provided"}
          </p>
        </div>

        {/* Social Links */}
        {userData.socialLinks &&
          Object.values(userData.socialLinks).some((v) => v) && (
            <>
              <div className="w-full h-px bg-[#333741]" />
              <div className="bg-[#0F1419] border border-[#333741] rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">
                  Social Links
                </h2>
                <div className="space-y-4">
                  {userData.socialLinks.instagram && (
                    <div className="flex items-center gap-3">
                      <span className="text-[#94969C] font-medium w-24">
                        Instagram:
                      </span>
                      <a
                        href={`https://instagram.com/${userData.socialLinks.instagram.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#444CE7] hover:text-[#3838c9] font-semibold"
                      >
                        {userData.socialLinks.instagram}
                      </a>
                    </div>
                  )}
                  {userData.socialLinks.twitter && (
                    <div className="flex items-center gap-3">
                      <span className="text-[#94969C] font-medium w-24">
                        Twitter:
                      </span>
                      <a
                        href={`https://twitter.com/${userData.socialLinks.twitter.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#444CE7] hover:text-[#3838c9] font-semibold"
                      >
                        {userData.socialLinks.twitter}
                      </a>
                    </div>
                  )}
                  {userData.socialLinks.website && (
                    <div className="flex items-center gap-3">
                      <span className="text-[#94969C] font-medium w-24">
                        Website:
                      </span>
                      <a
                        href={`https://${userData.socialLinks.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#444CE7] hover:text-[#3838c9] font-semibold"
                      >
                        {userData.socialLinks.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        {/* Type-Specific Content */}
        {userData.type === "publisher" && (
          <>
            <div className="w-full h-px bg-[#333741]" />
            <div className="bg-[#0F1419] border border-[#333741] rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Publisher Content
              </h2>
              <p className="text-[#D2D6DB] text-sm mb-4">
                This user is a publisher and can create, upload, and manage
                content on the platform.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-[#161B26] border border-[#333741] rounded-lg p-4">
                  <p className="text-[#94969C] text-xs mb-1">Total Uploads</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <div className="bg-[#161B26] border border-[#333741] rounded-lg p-4">
                  <p className="text-[#94969C] text-xs mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-white">3.2K</p>
                </div>
                <div className="bg-[#161B26] border border-[#333741] rounded-lg p-4">
                  <p className="text-[#94969C] text-xs mb-1">Followers</p>
                  <p className="text-2xl font-bold text-white">567</p>
                </div>
              </div>
            </div>
          </>
        )}

        {userData.type === "viewer" && (
          <>
            <div className="w-full h-px bg-[#333741]" />
            <div className="bg-[#0F1419] border border-[#333741] rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Viewer Activity
              </h2>
              <p className="text-[#D2D6DB] text-sm mb-4">
                This user is a viewer and can browse, like, and share content on
                the platform.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-[#161B26] border border-[#333741] rounded-lg p-4">
                  <p className="text-[#94969C] text-xs mb-1">Likes</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <div className="bg-[#161B26] border border-[#333741] rounded-lg p-4">
                  <p className="text-[#94969C] text-xs mb-1">Following</p>
                  <p className="text-2xl font-bold text-white">42</p>
                </div>
                <div className="bg-[#161B26] border border-[#333741] rounded-lg p-4">
                  <p className="text-[#94969C] text-xs mb-1">Collections</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
