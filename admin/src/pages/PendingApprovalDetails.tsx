import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useModeration } from "../contexts/useModeration";
import { useApiMutation } from "../hooks/useApiMutation";
import { useFetchCarouselDetails } from "../hooks/useFetchCarouselDetails";

export default function PendingApprovalDetailsPage() {
  const navigate = useNavigate();
  const { carouselId } = useParams<{ carouselId: string }>();
  const { carouselDetails, isLoading, error } =
    useFetchCarouselDetails(carouselId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const moderation = useModeration();

  const approveMutation = useApiMutation({
    endpoint: "/admins/carousels/",
    method: "POST",
  });

  const rejectMutation = useApiMutation({
    endpoint: "/admins/carousels/",
    method: "POST",
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading carousel details...</div>
      </div>
    );
  }

  // Error state
  if (error || !carouselDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">
          {error || "Carousel not found"}
        </div>
      </div>
    );
  }

  const carousel = carouselDetails;
  const mainImage = carousel.artworks?.[selectedImageIndex];
  const allImages = carousel.artworks || [];

  const handleApprove = async () => {
    try {
      setApproveLoading(true);
      const loadingToast = toast.loading("Approving carousel...");

      await approveMutation.mutateAsync({
        carouselId: carouselId || "",
        action: "approve",
      });

      toast.dismiss(loadingToast);
      toast.success("Carousel approved successfully!");
      moderation.refetchAll();
      navigate("/content");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to approve carousel"
      );
      console.error("Error approving carousel:", error);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setRejectLoading(true);
      const loadingToast = toast.loading("Rejecting carousel...");

      await rejectMutation.mutateAsync({
        carouselId: carouselId || "",
        action: "reject",
      });

      toast.dismiss(loadingToast);
      toast.success("Carousel rejected successfully!");
      moderation.refetchAll();
      navigate("/content");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to reject carousel"
      );
      console.error("Error rejecting carousel:", error);
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Go Back Header */}
      <div className="px-6 sm:px-16 md:px-20 pt-8 pb-6">
        <button
          onClick={() => navigate("/content")}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2} />
          <span className="text-base font-medium text-white">Go Back</span>
        </button>
      </div>

      {/* Hero Banner Image */}
      <div
        className="w-full overflow-hidden"
        style={{ height: "clamp(200px, 35vw, 485px)" }}
      >
        <img
          src={mainImage?.imageUrl || "https://via.placeholder.com/1440x485"}
          alt={mainImage?.title || carousel.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main content container */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Title + Actions */}
        <div className="flex flex-wrap items-start gap-4 pt-6 pb-5">
          <div className="flex-1 min-w-[240px]">
            <h1 className="text-[30px] font-semibold leading-[38px] text-white">
              {carousel.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleApprove}
              disabled={approveLoading || rejectLoading}
              className="px-3 py-1.5 rounded-lg bg-[#D8522E] text-white text-sm font-semibold hover:bg-[#C04520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approveLoading ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={handleReject}
              disabled={approveLoading || rejectLoading}
              className="px-3 py-1.5 rounded-lg bg-[#333741] text-[#CECFD2] text-sm font-semibold hover:bg-[#3d424f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejectLoading ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-500" />

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-16 py-8 pb-24">
          {/* ===== Left Column ===== */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {/* Stats card - Updated for Pending Approval */}
            <div className="flex flex-wrap gap-6 p-4 sm:px-6 py-4 rounded-xl border border-gray-700 bg-gray-800 overflow-hidden">
              <StatItem
                label="Carousel Length"
                value={allImages.length.toString()}
              />
              <StatItem
                label="Data Submitted"
                value={new Date(carousel.createdAt).toLocaleDateString()}
              />
              <StatItem
                label="Status"
                value="Pending"
                valueClassName="text-yellow-400 bg-[#4e1d09] border border-[#93370d] px-2 py-1 rounded-lg"
              />
            </div>

            {/* Description */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-medium leading-6 text-white">
                Description
              </h2>
              <div className="text-base font-normal leading-6 text-gray-400">
                <p>{carousel.description || "No description available"}</p>
                <p className="mt-3">
                  Date Created:{" "}
                  {new Date(carousel.createdAt).toLocaleDateString()}
                </p>
              </div>
            </section>

            {/* Preview */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-medium leading-6 text-white">
                Preview
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {/* Smaller thumbnails grid */}
                {allImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {allImages.map((img, i) => (
                      <div
                        key={i}
                        className={`rounded-lg overflow-hidden aspect-[16/9] bg-surface cursor-pointer transition-all ${
                          selectedImageIndex === i
                            ? "ring-2 ring-orange-500 opacity-100"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        onClick={() => setSelectedImageIndex(i)}
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Tags */}
            {carousel.tag && carousel.tag.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-base font-medium leading-6 text-white">
                  Tags
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  {(Array.isArray(carousel.tag)
                    ? carousel.tag
                    : [carousel.tag]
                  ).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ===== Right Sidebar ===== */}
          <aside className="w-full lg:w-[360px] shrink-0">
            <div className="rounded-xl bg-gray-800 p-6 flex flex-col gap-8">
              {/* Creator info */}
              <div className="flex flex-col gap-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-2">
                  <div className="w-[54px] h-[54px] shrink-0 rounded-full overflow-hidden border-[3px] border-background">
                    <img
                      src={
                        carousel.publisher.profilePicture ||
                        "https://via.placeholder.com/108"
                      }
                      alt={carousel.publisher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-lg font-medium leading-7 text-white truncate">
                      {carousel.publisher.name}
                    </p>
                    <p className="text-sm font-normal leading-5 text-gray-400">
                      {carousel.publisher.carouselCount} Carousels •{" "}
                      {carousel.publisher.totalViews.toLocaleString()} Views
                    </p>
                  </div>
                </div>

                {/* Artist Category */}
                <div className="flex flex-col gap-[2px]">
                  <p className="text-sm font-medium leading-7 text-white">
                    Artist Category
                  </p>
                  <span className="inline-flex items-center self-start px-[10px] py-1 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 text-sm font-medium leading-5">
                    {carousel.publisher.personaType}
                  </span>
                </div>

                {/* About Creator */}
                <div className="flex flex-col gap-[2px]">
                  <p className="text-sm font-medium leading-7 text-white">
                    About Creator
                  </p>
                  <p className="text-sm font-normal leading-5 text-gray-400">
                    {carousel.publisher.bio || "No bio available"}
                  </p>
                </div>

                {/* Region */}
                <div className="flex flex-col gap-[2px]">
                  <p className="text-sm font-medium leading-7 text-white">
                    Region
                  </p>
                  <div className="flex items-center gap-1">
                    <MapPin
                      className="w-4 h-4 text-gray-400 shrink-0"
                      strokeWidth={1.33}
                    />
                    <span className="text-base font-medium text-gray-400">
                      {carousel.publisher.region}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-[130px]">
      <span className="text-sm font-medium leading-5 text-gray-400">
        {label}
      </span>
      <span
        className={
          valueClassName
            ? `inline-flex items-center w-fit ${valueClassName}`
            : "text-base font-semibold leading-6 text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}
