import { useCarouselApi } from "@/hooks/useCarouselApi";
import { Carousel, CarouselType } from "@/hooks/useCarouselList";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { CancelScheduleModal } from "./CancelScheduleModal";
import { CarouselActionMenu } from "./CarouselActionMenu";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { Alert } from "./ui/Alert";

const formatDate = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const today = new Date();

  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();

  // Ordinal suffix for day (st, nd, rd, th)
  let suffix = "th";
  if (day % 10 === 1 && day !== 11) suffix = "st";
  else if (day % 10 === 2 && day !== 12) suffix = "nd";
  else if (day % 10 === 3 && day !== 13) suffix = "rd";

  if (date.toDateString() === today.toDateString()) {
    return `${day}${suffix} ${month}, ${year}`;
  } else {
    return `${day}${suffix} ${month}, ${year}`;
  }
};

const formatMetric = (value: number | undefined) => {
  if (!value) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
};

interface CarouselListProps {
  carousels: Carousel[];
  isLoading: boolean;
  viewMode: "list" | "grid";
  carouselType?: CarouselType;
  onSelectCarousel?: (carousel: Carousel) => void;
  onRefresh?: () => Promise<void>;
  onRefreshDashboard?: () => Promise<void>;
}

export const CarouselListView: React.FC<CarouselListProps> = ({
  carousels,
  isLoading,
  viewMode,
  carouselType,
  onSelectCarousel,
  onRefresh,
  onRefreshDashboard,
}) => {
  const router = useRouter();
  const { moveToDraft, deleteCarousel, deleteDraft, publishScheduled } =
    useCarouselApi();
  const [selectedCarousel, setSelectedCarousel] = useState<Carousel | null>(
    null
  );
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCancelSchedule, setShowCancelSchedule] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const handleCarouselPress = (carousel: Carousel) => {
    setSelectedCarousel(carousel);
    setShowActionMenu(true);
  };

  const handleMoveToDraft = async (carousel: Carousel) => {
    try {
      const response = await moveToDraft(carousel.id.toString());

      if (response.error) {
        setAlertMessage(response.error || "Failed to move carousel to draft");
        setShowAlert(true);
      } else {
        setAlertMessage("Carousel moved to draft successfully");
        setShowAlert(true);
        setShowActionMenu(false);
        // Refresh the carousel list
        if (onRefresh) {
          await onRefresh();
        }
      }
    } catch (error) {
      setAlertMessage("An unexpected error occurred");
      setShowAlert(true);
      console.error("Move to draft error:", error);
    }
  };

  const handleEdit = (carousel: Carousel) => {
    router.push({
      pathname: "/edit-carousel" as any,
      params: {
        carousel: JSON.stringify(carousel),
      },
    });
  };

  const handleDelete = (carousel: Carousel) => {
    // If it's a draft, delete immediately
    if (carousel.status === "draft") {
      setShowActionMenu(false);
      handleConfirmDelete(carousel);
    } else {
      // Otherwise show the confirmation modal
      setSelectedCarousel(carousel);
      setShowDeleteConfirmation(true);
      setShowActionMenu(false);
    }
  };

  const handleConfirmDelete = async (carousel: Carousel) => {
    try {
      // Use the appropriate delete endpoint based on carousel status
      const deleteMethod =
        carousel.status === "draft" ? deleteDraft : deleteCarousel;
      const response = await deleteMethod(carousel.id.toString());

      if (response.error) {
        setAlertMessage(response.error || "Failed to delete carousel");
        setShowAlert(true);
      } else {
        setAlertMessage("Carousel deleted successfully");
        setShowAlert(true);
        // Refresh the carousel list
        if (onRefresh) {
          await onRefresh();
        }
        // Refresh the dashboard data
        if (onRefreshDashboard) {
          await onRefreshDashboard();
        }
        // Close the delete confirmation modal
        setShowDeleteConfirmation(false);
        setShowActionMenu(false);
      }
    } catch (error) {
      setAlertMessage("An unexpected error occurred");
      setShowAlert(true);
      console.error("Delete carousel error:", error);
    }
  };

  const handlePublishScheduled = async (carousel: Carousel) => {
    try {
      setIsLoadingAction(true);
      const response = await publishScheduled(carousel.id.toString());

      if (response.error) {
        setAlertMessage(response.error || "Failed to publish carousel");
        setShowAlert(true);
      } else {
        setAlertMessage("Carousel published successfully!");
        setShowAlert(true);
        // Refresh the carousel list
        if (onRefresh) {
          await onRefresh();
        }
        // Refresh the dashboard data
        if (onRefreshDashboard) {
          await onRefreshDashboard();
        }
      }
    } catch (error) {
      setAlertMessage("An unexpected error occurred");
      setShowAlert(true);
      console.error("Publish scheduled carousel error:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCancelSchedule = async (carousel: Carousel) => {
    try {
      setIsLoadingAction(true);
      const response = await deleteCarousel(carousel.id.toString());

      if (response.error) {
        setAlertMessage(response.error || "Failed to cancel schedule");
        setShowAlert(true);
      } else {
        setAlertMessage("Schedule canceled successfully");
        setShowAlert(true);
        // Refresh the carousel list
        if (onRefresh) {
          await onRefresh();
        }
        // Refresh the dashboard data
        if (onRefreshDashboard) {
          await onRefreshDashboard();
        }
        // Close the cancel schedule modal
        setShowCancelSchedule(false);
      }
    } catch (error) {
      setAlertMessage("An unexpected error occurred");
      setShowAlert(true);
      console.error("Cancel schedule error:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCancelScheduleConfirm = (carousel: Carousel) => {
    setSelectedCarousel(carousel);
    setShowCancelSchedule(true);
  };
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <MaterialIcons name="hourglass-empty" size={48} color="#666666" />
        <Text className="text-gray-400 mt-4">Loading carousels...</Text>
      </View>
    );
  }

  if (carousels.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <MaterialIcons name="image-not-supported" size={48} color="#666666" />
        <Text className="text-gray-400 mt-4">No carousels found</Text>
      </View>
    );
  }

  if (viewMode === "list") {
    return (
      <>
        <FlatList
          key="list-view"
          data={carousels}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 mb-4">
              <View className="flex-row gap-4 items-center">
                {/* Content */}
                <View className="flex-1">
                  {/* Date and Live Status */}
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-gray-400 text-xs">
                      {formatDate(item.createdAt)}
                    </Text>
                    {item.status === "active" && (
                      <>
                        <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <Text className="text-xs font-semibold text-white">
                          Live
                        </Text>
                      </>
                    )}
                  </View>

                  {/* Title */}
                  <Text className="text-white font-bold text-base mb-1">
                    {item.name}
                  </Text>

                  {/* Description */}
                  {item.description && (
                    <Text
                      className="text-gray-400 text-xs mb-2"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </Text>
                  )}

                  {/* Engagement Metrics - Only for publishers */}
                  {carouselType === "published" && (
                    <View className="flex-row gap-4 items-center">
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons
                          name="favorite"
                          size={14}
                          color="#EF4444"
                        />
                        <Text className="text-gray-400 text-xs">
                          {formatMetric(item.favorites)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons
                          name="visibility"
                          size={14}
                          color="#9CA3AF"
                        />
                        <Text className="text-gray-400 text-xs">
                          {formatMetric(item.views)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="share" size={14} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs">
                          {formatMetric(item.shares || 0)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Stacked Thumbnails */}
                <View className="w-24 h-24" style={{ position: "relative" }}>
                  {item.artworks && item.artworks.length > 0 ? (
                    <>
                      {/* Back images (stacked) */}
                      {item.artworks
                        .slice(1, Math.min(3, item.artworks.length))
                        .map((artwork, idx) => (
                          <View
                            key={`stack-${idx}`}
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "#404040",
                              borderRadius: 8,
                              overflow: "hidden",
                              top: -(idx + 1) * 4,
                              left: (idx + 1) * 4,
                              zIndex: 10 - idx,
                              borderColor: "#262626",
                              borderWidth: 1,
                            }}
                          >
                            {artwork.imageUrl ? (
                              <Image
                                source={{ uri: artwork.imageUrl }}
                                style={{ width: "100%", height: "100%" }}
                              />
                            ) : (
                              <View className="w-full h-full justify-center items-center bg-neutral-700">
                                <MaterialIcons
                                  name="image"
                                  size={16}
                                  color="#666666"
                                />
                              </View>
                            )}
                          </View>
                        ))}
                      {/* Front image */}
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#404040",
                          borderRadius: 8,
                          overflow: "hidden",
                          zIndex: 20,
                        }}
                      >
                        {item.artworks[0]?.imageUrl ? (
                          <Image
                            source={{ uri: item.artworks[0].imageUrl }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <View className="w-full h-full justify-center items-center bg-neutral-700">
                            <MaterialIcons
                              name="image"
                              size={24}
                              color="#666666"
                            />
                          </View>
                        )}
                      </View>
                    </>
                  ) : (
                    <View className="w-full h-full bg-neutral-800 rounded-lg justify-center items-center">
                      <MaterialIcons name="image" size={24} color="#666666" />
                    </View>
                  )}
                </View>
              </View>

              {/* Scheduled Carousel Action Buttons */}
              {carouselType === "scheduled" && (
                <View className="flex-row gap-3 mt-4">
                  <Pressable
                    onPress={() => handlePublishScheduled(item)}
                    disabled={isLoadingAction}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      backgroundColor: "#ea580c",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: isLoadingAction ? 0.6 : 1,
                    }}
                  >
                    <Text className="text-white font-semibold text-sm">
                      {isLoadingAction ? "Publishing..." : "Publish Now"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleCancelScheduleConfirm(item)}
                    disabled={isLoadingAction}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      backgroundColor: "transparent",
                      borderWidth: 2,
                      borderColor: "#ffffff1a",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: isLoadingAction ? 0.6 : 1,
                    }}
                  >
                    <Text
                      style={{
                        color: "#d8522e",
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      Cancel Post
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Regular Carousel Press */}
              {carouselType !== "scheduled" && (
                <Pressable
                  onPress={() => handleCarouselPress(item)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              )}
            </View>
          )}
        />
        <CarouselActionMenu
          visible={showActionMenu}
          carousel={selectedCarousel}
          onClose={() => setShowActionMenu(false)}
          onMoveToDraft={handleMoveToDraft}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <DeleteConfirmationModal
          visible={showDeleteConfirmation}
          carousel={selectedCarousel}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirmDelete={handleConfirmDelete}
          onMoveToDraft={handleMoveToDraft}
        />
        <CancelScheduleModal
          visible={showCancelSchedule}
          carousel={selectedCarousel}
          onClose={() => setShowCancelSchedule(false)}
          onConfirmCancel={handleCancelSchedule}
          onSaveAsDraft={handleMoveToDraft}
          isLoading={isLoadingAction}
        />
        <Alert
          visible={showAlert}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      </>
    );
  }

  // Grid view
  return (
    <>
      <FlatList
        key="grid-view"
        data={carousels}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, flex: 1 }}
        renderItem={({ item }) => (
          <View
            className="bg-neutral-900 border border-neutral-700 rounded-xl p-4"
            style={{ flex: 1, marginBottom: 12 }}
          >
            {/* Stacked Thumbnails */}
            <View
              style={{
                width: "100%",
                height: 160,
                overflow: "visible",
                position: "relative",
                backgroundColor: "#404040",
                borderRadius: 8,
              }}
            >
              {item.artworks && item.artworks.length > 0 ? (
                <>
                  {/* Back images (stacked) */}
                  {item.artworks
                    .slice(1, Math.min(3, item.artworks.length))
                    .map((artwork, idx) => (
                      <View
                        key={`stack-${idx}`}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#404040",
                          borderRadius: 8,
                          overflow: "hidden",
                          top: -(idx + 1) * 3,
                          left: (idx + 1) * 3,
                          zIndex: 10 - idx,
                          borderColor: "#262626",
                          borderWidth: 1,
                        }}
                      >
                        {artwork.imageUrl ? (
                          <Image
                            source={{ uri: artwork.imageUrl }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <View className="w-full h-full justify-center items-center bg-neutral-700">
                            <MaterialIcons
                              name="image"
                              size={16}
                              color="#666666"
                            />
                          </View>
                        )}
                      </View>
                    ))}
                  {/* Front image */}
                  <View
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#404040",
                      borderRadius: 8,
                      overflow: "hidden",
                      zIndex: 20,
                    }}
                  >
                    {item.artworks[0]?.imageUrl ? (
                      <Image
                        source={{ uri: item.artworks[0].imageUrl }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <View className="w-full h-full justify-center items-center bg-neutral-700">
                        <MaterialIcons name="image" size={32} color="#666666" />
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <View className="w-full h-full justify-center items-center bg-neutral-700">
                  <MaterialIcons name="image" size={32} color="#666666" />
                </View>
              )}
            </View>

            {/* Info */}
            <View className="p-0 pt-3">
              {/* Date and Live Status */}
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-gray-400 text-xs">
                  {formatDate(item.createdAt)}
                </Text>
                {item.status === "active" && (
                  <>
                    <View className="w-1 h-1 rounded-full bg-green-500" />
                    <Text className="text-white text-xs font-semibold">
                      Live
                    </Text>
                  </>
                )}
              </View>

              {/* Title */}
              <Text
                className="text-white font-bold text-sm mb-3"
                numberOfLines={1}
              >
                {item.name}
              </Text>

              {/* Engagement Metrics - Only for publishers */}
              {carouselType === "published" && (
                <View className="flex-row gap-3 items-center">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="favorite" size={12} color="#EF4444" />
                    <Text className="text-gray-400 text-xs">
                      {formatMetric(item.favorites)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="visibility"
                      size={12}
                      color="#9CA3AF"
                    />
                    <Text className="text-gray-400 text-xs">
                      {formatMetric(item.views)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="share" size={12} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs">
                      {formatMetric(item.shares || 0)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Scheduled Carousel Action Buttons */}
              {carouselType === "scheduled" && (
                <View className="flex-row gap-2 mt-3">
                  <Pressable
                    onPress={() => handlePublishScheduled(item)}
                    disabled={isLoadingAction}
                    style={{
                      flex: 1,
                      minHeight: 36,
                      backgroundColor: "#ea580c",
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: isLoadingAction ? 0.6 : 1,
                    }}
                  >
                    <Text
                      className="text-white font-semibold text-xs"
                      numberOfLines={1}
                    >
                      {isLoadingAction ? "..." : "Publish"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleCancelScheduleConfirm(item)}
                    disabled={isLoadingAction}
                    style={{
                      flex: 1,
                      minHeight: 36,
                      backgroundColor: "transparent",
                      borderWidth: 1.5,
                      borderColor: "#d8522e",
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: isLoadingAction ? 0.6 : 1,
                    }}
                  >
                    <Text
                      style={{
                        color: "#d8522e",
                        fontWeight: "600",
                        fontSize: 11,
                      }}
                      numberOfLines={1}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Regular Carousel Press */}
            {carouselType !== "scheduled" && (
              <Pressable
                onPress={() => handleCarouselPress(item)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            )}
          </View>
        )}
      />
      <CarouselActionMenu
        visible={showActionMenu}
        carousel={selectedCarousel}
        onClose={() => setShowActionMenu(false)}
        onMoveToDraft={handleMoveToDraft}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DeleteConfirmationModal
        visible={showDeleteConfirmation}
        carousel={selectedCarousel}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirmDelete={handleConfirmDelete}
        onMoveToDraft={handleMoveToDraft}
      />
      <CancelScheduleModal
        visible={showCancelSchedule}
        carousel={selectedCarousel}
        onClose={() => setShowCancelSchedule(false)}
        onConfirmCancel={handleCancelSchedule}
        onSaveAsDraft={handleMoveToDraft}
        isLoading={isLoadingAction}
      />
      <Alert
        visible={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};
