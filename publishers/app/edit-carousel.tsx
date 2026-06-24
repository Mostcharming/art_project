import ArtworkList from "@/app/components/ArtworkList";
import AddArtworkModal from "@/app/components/AddArtworkModal";
import ArtworkFormCard from "@/app/components/ArtworkFormCard";
import ArtworkUploadPrompt from "@/app/components/ArtworkUploadPrompt";
import ImageFitModal, { FittedImage } from "@/app/components/ImageFitModal";
import { Alert } from "@/components/ui/Alert";
import { useCarouselApi } from "@/hooks/useCarouselApi";
import { Carousel } from "@/hooks/useCarouselList";
import { useCarouselListStore } from "@/store/carouselListStore";
import { useCarouselStore } from "@/store/carouselStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SelectedImage {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
}

interface ArtworkForm {
  title: string;
  artist: string;
  height: string;
  width: string;
  yearOfCreation: string;
  purchasePrice: string;
}

interface UploadedArtwork {
  id?: string; // Original artwork ID from server
  uri?: string;
  imageUrl?: string;
  imageWidth: number;
  imageHeight: number;
  fileSize: number;
  title: string;
  artist: string;
  height: string;
  width: string;
  yearOfCreation: string;
  purchasePrice: string;
}

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Nigeria",
  "South Africa",
  "Ghana",
  "Kenya",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Australia",
  "Japan",
  "South Korea",
  "Brazil",
  "Mexico",
  "India",
  "UAE",
  "Singapore",
];

export default function EditCarousel() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { updateDraft } = useCarouselApi();
  const upsertCarousel = useCarouselListStore((state) => state.upsertCarousel);
  const editingCarousel = useCarouselListStore((state) => state.editingCarousel);
  const setEditingCarousel = useCarouselListStore(
    (state) => state.setEditingCarousel,
  );
  const saveDraftLocally = useCarouselStore((state) => state.saveDraftLocally);

  const params = useLocalSearchParams<{
    carousel?: string;
    carouselId?: string;
  }>();

  const [carousel, setCarousel] = useState<Carousel | null>(null);
  const [frameTiming, setFrameTiming] = useState(10);
  const [showFrameDropdown, setShowFrameDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [imageToFit, setImageToFit] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [showImageFitModal, setShowImageFitModal] = useState(false);
  const [formData, setFormData] = useState<ArtworkForm>({
    title: "",
    artist: "",
    height: "",
    width: "",
    yearOfCreation: "",
    purchasePrice: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [uploadedArtworks, setUploadedArtworks] = useState<UploadedArtwork[]>(
    [],
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carousel details state
  const [carouselName, setCarouselName] = useState("");
  const [carouselTag, setCarouselTag] = useState("");
  const [carouselCountry, setCarouselCountry] = useState("");
  const [carouselDescription, setCarouselDescription] = useState("");
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Temporary carousel details for modal editing
  const [tempName, setTempName] = useState("");
  const [tempTag, setTempTag] = useState("");
  const [tempCountry, setTempCountry] = useState("");
  const [tempDescription, setTempDescription] = useState("");

  const frameTimingOptions = [
    { label: "10 seconds", value: 10 },
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
    { label: "2 minutes", value: 120 },
    { label: "3 minutes", value: 180 },
    { label: "4 minutes", value: 240 },
    { label: "5 minutes", value: 300 },
  ];

  const MIN_WIDTH = 1920;
  const MIN_HEIGHT = 1080;
  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const saveEditedCarouselToStores = (
    updatedCarousel: Carousel,
    fallbackArtworks: UploadedArtwork[]
  ) => {
    upsertCarousel(updatedCarousel);
    setEditingCarousel(updatedCarousel);
    setCarousel(updatedCarousel);
    saveDraftLocally({
      id: updatedCarousel.id?.toString(),
      name: updatedCarousel.name,
      tag: updatedCarousel.tag || undefined,
      country: updatedCarousel.country,
      description: updatedCarousel.description || undefined,
      frameTimingSeconds: updatedCarousel.frameTimingSeconds,
      status: updatedCarousel.status,
      createdAt: updatedCarousel.createdAt,
      updatedAt: updatedCarousel.updatedAt,
      artworks:
        updatedCarousel.artworks?.map((artwork) => ({
          id: artwork.id?.toString(),
          imageUrl: artwork.imageUrl,
          imageWidth: artwork.widthInches,
          imageHeight: artwork.heightInches,
          fileSize: 0,
          title: artwork.title,
          artist: artwork.artist,
          height: artwork.heightInches?.toString() || "",
          width: artwork.widthInches?.toString() || "",
          yearOfCreation: artwork.yearOfCreation?.toString() || "",
          purchasePrice: artwork.purchasePrice?.toString() || "",
        })) || fallbackArtworks,
    });
  };

  const hydrateCarousel = (carouselData: Carousel) => {
    setCarousel(carouselData);
    setCarouselName(carouselData.name);
    setCarouselTag(carouselData.tag || "");
    setCarouselCountry(carouselData.country);
    setCarouselDescription(carouselData.description || "");
    setFrameTiming(carouselData.frameTimingSeconds);

    const convertedArtworks: UploadedArtwork[] = (
      carouselData.artworks || []
    ).map((artwork: any) => ({
      id: artwork.id?.toString(),
      imageUrl: artwork.imageUrl,
      imageWidth: artwork.widthInches,
      imageHeight: artwork.heightInches,
      fileSize: 0,
      title: artwork.title,
      artist: artwork.artist,
      height: artwork.heightInches?.toString() || "",
      width: artwork.widthInches?.toString() || "",
      yearOfCreation: artwork.yearOfCreation?.toString() || "",
      purchasePrice: artwork.purchasePrice?.toString() || "",
    }));
    setUploadedArtworks(convertedArtworks);
  };

  // Initialize carousel data
  useEffect(() => {
    if (editingCarousel) {
      hydrateCarousel(editingCarousel);
      return;
    }

    if (params.carousel) {
      try {
        hydrateCarousel(JSON.parse(params.carousel));
      } catch (error) {
        console.error("Failed to parse carousel data:", error);
        setAlertMessage("Failed to load carousel data");
        setShowAlert(true);
      }
    }
  }, [editingCarousel, params.carousel]);

  const validateImage = (asset: ImagePicker.ImagePickerAsset): boolean => {
    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
      setAlertMessage(
        `File size exceeds 25 MB limit. Your file is ${(asset.fileSize / (1024 * 1024)).toFixed(2)} MB`,
      );
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        setAlertMessage(
          "Please allow access to your photo library to upload artwork",
        );
        setShowAlert(true);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
        aspect: undefined,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        if (validateImage(asset)) {
          setImageToFit(asset);
          setShowImageFitModal(true);
        }
      }
    } catch (error) {
      console.error("Image picker failed:", error);
      setAlertMessage("Failed to open image picker. Please try again.");
      setShowAlert(true);
    }
  };

  const handleFittedImage = (image: FittedImage) => {
    setSelectedImage(image);
    setImageToFit(null);
    setShowImageFitModal(false);
  };

  const handleCancelImageFit = () => {
    setImageToFit(null);
    setShowImageFitModal(false);
  };

  const pickImageFromAddModal = () => {
    setShowAddModal(false);
    setImageToFit(null);
    setShowImageFitModal(false);
    void pickImage();
  };

  const handleFormChange = (field: keyof ArtworkForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setAlertMessage("Title is required");
      setShowAlert(true);
      return false;
    }
    if (!formData.artist.trim()) {
      setAlertMessage("Artist is required");
      setShowAlert(true);
      return false;
    }
    if (!formData.height.trim()) {
      setAlertMessage("Height is required");
      setShowAlert(true);
      return false;
    }
    if (!formData.width.trim()) {
      setAlertMessage("Width is required");
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const handleAddArtwork = () => {
    if (validateForm() && selectedImage) {
      const newArtwork: UploadedArtwork = {
        uri: selectedImage.uri,
        imageWidth: selectedImage.width,
        imageHeight: selectedImage.height,
        fileSize: selectedImage.fileSize,
        title: formData.title,
        artist: formData.artist,
        height: formData.height,
        width: formData.width,
        yearOfCreation: formData.yearOfCreation,
        purchasePrice: formData.purchasePrice,
      };

      setUploadedArtworks([...uploadedArtworks, newArtwork]);

      setAlertMessage("Artwork added successfully");
      setShowAlert(true);

      // Reset form and image
      setSelectedImage(null);
      setImageToFit(null);
      setShowImageFitModal(false);
      setFormData({
        title: "",
        artist: "",
        height: "",
        width: "",
        yearOfCreation: "",
        purchasePrice: "",
      });

      setShowAddModal(false);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setImageToFit(null);
    setShowImageFitModal(false);
    setFormData({
      title: "",
      artist: "",
      height: "",
      width: "",
      yearOfCreation: "",
      purchasePrice: "",
    });
  };

  const handleDeleteArtwork = (index: number) => {
    console.log("Deleting artwork at index:", index);
    console.log("Artwork to delete:", uploadedArtworks[index]);
    setUploadedArtworks(uploadedArtworks.filter((_, i) => i !== index));
  };

  const handleModalCancel = () => {
    setShowAddModal(false);
  };

  const scrollToArtworkActions = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 250);
  };

  const openEditDetailsModal = () => {
    setTempName(carouselName);
    setTempTag(carouselTag);
    setTempCountry(carouselCountry);
    setTempDescription(carouselDescription);
    setShowCountryDropdown(false);
    setShowEditDetailsModal(true);
  };

  const handleSaveDetails = () => {
    if (!tempName.trim()) {
      setAlertMessage("Carousel name is required");
      setShowAlert(true);
      return;
    }

    if (!tempCountry.trim()) {
      setAlertMessage("Country is required");
      setShowAlert(true);
      return;
    }

    setCarouselName(tempName.trim());
    setCarouselTag(tempTag.trim());
    setCarouselCountry(tempCountry);
    setCarouselDescription(tempDescription.trim());
    setShowCountryDropdown(false);
    setShowEditDetailsModal(false);
  };

  const handlePreviewCarousel = () => {
    if (uploadedArtworks.length === 0) {
      setAlertMessage("Please add at least one artwork");
      setShowAlert(true);
      return;
    }

    const previewData = {
      id: carousel?.id?.toString() || "preview",
      name: carouselName,
      country: carouselCountry,
      description: carouselDescription,
      frameTimingSeconds: frameTiming,
      artworks: uploadedArtworks,
    };

    router.push({
      pathname: "/carousel-preview",
      params: {
        carousel: JSON.stringify(previewData),
      },
    });
  };

  const handleSaveChanges = async () => {
    if (!carouselName.trim()) {
      setAlertMessage("Carousel name is required");
      setShowAlert(true);
      return;
    }

    if (!carouselCountry.trim()) {
      setAlertMessage("Country is required");
      setShowAlert(true);
      return;
    }

    if (uploadedArtworks.length === 0) {
      setAlertMessage("Please add at least one artwork");
      setShowAlert(true);
      return;
    }

    setIsSaving(true);

    try {
      if (!carousel) {
        setAlertMessage("Carousel data not found");
        setShowAlert(true);
        setIsSaving(false);
        return;
      }

      // Send all artworks - the backend will handle new ones (with uri) and existing ones (with imageUrl)
      console.log("=== FRONTEND DEBUG ===");
      console.log("Uploaded artworks before send:", uploadedArtworks);
      uploadedArtworks.forEach((art, idx) => {
        console.log(`Artwork ${idx}:`, {
          id: art.id,
          title: art.title,
          hasUri: !!art.uri,
          hasImageUrl: !!art.imageUrl,
        });
      });

      // Ensure carousel.id is a string
      const carouselId =
        typeof carousel.id === "string" ? carousel.id : carousel.id?.toString();
      if (!carouselId) {
        setAlertMessage("Carousel ID is missing");
        setShowAlert(true);
        return;
      }

      const response = await updateDraft(carouselId, {
        name: carouselName,
        country: carouselCountry,
        tag: carouselTag.trim(),
        description: carouselDescription.trim(),
        frameTimingSeconds: frameTiming,
        artworks: uploadedArtworks,
      });

      if (response.error) {
        setAlertMessage(response.error);
        setShowAlert(true);
      } else {
        const updatedCarousel = response.data?.carousel;
        if (updatedCarousel) {
          saveEditedCarouselToStores(updatedCarousel, uploadedArtworks);
        } else {
          const fallbackCarousel = {
            ...carousel,
            name: carouselName,
            country: carouselCountry,
            tag: carouselTag.trim() || undefined,
            description: carouselDescription.trim() || undefined,
            frameTimingSeconds: frameTiming,
            updatedAt: new Date().toISOString(),
          };
          upsertCarousel(fallbackCarousel);
          saveDraftLocally({
            id: carousel.id?.toString(),
            name: carouselName,
            tag: carouselTag.trim() || undefined,
            country: carouselCountry,
            description: carouselDescription.trim() || undefined,
            frameTimingSeconds: frameTiming,
            status: carousel.status,
            createdAt: carousel.createdAt,
            updatedAt: fallbackCarousel.updatedAt,
            artworks: uploadedArtworks,
          });
        }

        setAlertMessage("Carousel updated successfully!");
        setShowAlert(true);

        // Navigate after a brief delay
        setTimeout(() => {
          router.back();
        }, 1000);
      }
    } catch {
      setAlertMessage("Failed to update carousel");
      setShowAlert(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (!carousel) {
    return (
      <View
        className="flex-1 bg-black justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-gray-400">Loading carousel...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 20,
        }}
      >
        {/* Header with Back Button */}
        <View className="mb-8 mt-4">
          <Pressable onPress={() => router.back()} className="mb-4">
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <View>
            <Text
              className="text-3xl text-white leading-10 mb-0"
              style={{ fontFamily: "BankGothicBold" }}
            >
              Edit Carousel
            </Text>
            <Text className="text-base text-gray-300 leading-6">
              Make changes to your carousel
            </Text>
          </View>
        </View>

        {/* Carousel Details Box */}
        <Pressable
          onPress={openEditDetailsModal}
          className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 mb-5 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              Edit Carousel Information
            </Text>
          </View>
          <MaterialIcons name="edit" size={20} color="#ffffff" />
        </Pressable>

        {/* Frame Timing */}
        <View className="mb-5">
          <Text className="text-base text-white mb-2">
            Frame Timing (minutes per art work)
          </Text>
          <Pressable
            className="flex-row items-center justify-between rounded-lg px-4 py-4 bg-neutral-800 mb-4"
            onPress={() => setShowFrameDropdown(true)}
          >
            <Text className="text-lg text-white">
              {frameTimingOptions.find((opt) => opt.value === frameTiming)
                ?.label || "Select duration"}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color="#ffffff"
            />
          </Pressable>
          <Text className="text-xs text-gray-400 mb-6">
            Select a duration 10 seconds - 5 minutes
          </Text>
        </View>

        {/* Show uploaded artworks */}
        {uploadedArtworks.length > 0 && !selectedImage ? (
          <>
            <ArtworkList
              artworks={uploadedArtworks as any}
              onArtworksChange={setUploadedArtworks}
              onAddClick={() => setShowAddModal(true)}
              onDelete={handleDeleteArtwork}
            />

            {/* Save Changes Button */}
            <View className="flex-row gap-3">
              <Pressable
                style={{
                  flex: 0.8,
                  minHeight: 60,
                  backgroundColor: "transparent",
                  borderWidth: 2,
                  borderColor: "#FFFFFF1A",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: isSaving ? 0.6 : 1,
                }}
                disabled={isSaving}
                onPress={handleSaveChanges}
              >
                <Text className="text-base  text-orange-600">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1.2,
                  minHeight: 60,
                  backgroundColor: "#ea580c",
                  borderRadius: 12,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
                onPress={handlePreviewCarousel}
              >
                <Play size={20} color="#ffffff" />
                <Text className="text-base text-white">Preview Carousel</Text>
              </Pressable>
            </View>
          </>
        ) : selectedImage ? (
          <ArtworkFormCard
            selectedImage={selectedImage}
            formData={formData}
            onFormChange={handleFormChange}
            onCancel={handleCancel}
            onSubmit={handleAddArtwork}
            onInputFocus={scrollToArtworkActions}
          />
        ) : (
          <>
            <ArtworkUploadPrompt onPress={pickImage} />

            <View className="flex-row gap-3">
              <Pressable
                style={{
                  flex: 0.8,
                  minHeight: 60,
                  backgroundColor: "transparent",
                  borderWidth: 2,
                  borderColor: "#FFFFFF1A",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: isSaving ? 0.6 : 1,
                }}
                disabled={isSaving}
                onPress={() => router.back()}
              >
                <Text className="text-base font-bold text-white">Cancel</Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1.2,
                  minHeight: 60,
                  backgroundColor: "#ea580c",
                  borderRadius: 12,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
                onPress={() => {
                  // Handle preview carousel action
                }}
              >
                <Play size={20} color="#ffffff" />
                <Text className="text-base font-bold text-white">
                  Preview Carousel
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <ImageFitModal
        visible={showImageFitModal && !!imageToFit}
        image={
          imageToFit
            ? {
                uri: imageToFit.uri,
                width: imageToFit.width || MIN_WIDTH,
                height: imageToFit.height || MIN_HEIGHT,
                fileSize: imageToFit.fileSize || 0,
              }
            : null
        }
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        onCancel={handleCancelImageFit}
        onConfirm={handleFittedImage}
        onError={(message) => {
          setAlertMessage(message);
          setShowAlert(true);
        }}
      />

      {/* Frame Timing Dropdown Modal */}
      <Modal
        visible={showFrameDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFrameDropdown(false)}
      >
        <Pressable
          className="flex-1 bg-black/70 justify-end"
          onPress={() => setShowFrameDropdown(false)}
        >
          <View className="bg-neutral-800 rounded-t-2xl pb-8 pt-4 px-5">
            <View className="w-10 h-1 bg-neutral-600 rounded-full self-center mb-4" />
            <Text className="text-lg text-white font-bold mb-4">
              Select Frame Timing
            </Text>
            {frameTimingOptions.map((opt) => (
              <Pressable
                key={opt.value}
                className={`py-4 px-4 rounded-lg mb-1 ${
                  frameTiming === opt.value ? "bg-orange-600/20" : ""
                }`}
                onPress={() => {
                  setFrameTiming(opt.value);
                  setShowFrameDropdown(false);
                }}
              >
                <Text
                  className={`text-base ${
                    frameTiming === opt.value
                      ? "text-orange-600 font-semibold"
                      : "text-white"
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <AddArtworkModal
        visible={showAddModal}
        topInset={insets.top}
        onClose={handleModalCancel}
        onPickImage={pickImageFromAddModal}
      />

      {/* Edit Carousel Details Modal */}
      <Modal
        visible={showEditDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCountryDropdown(false);
          setShowEditDetailsModal(false);
        }}
      >
        <View className="flex-1 bg-black/95">
          <View className="flex-1 justify-end">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                className="bg-black rounded-t-2xl"
                style={{ maxHeight: "88%" }}
              >
                <View className="pb-8 pt-4 px-5">
                  <View className="w-10 h-1 bg-neutral-600 rounded-full self-center mb-4" />

                  {/* Header */}
                  <View className="flex-row items-center justify-between mb-6">
                    <Text
                      style={{ fontFamily: "BankGothicBold" }}
                      className="text-2xl text-white"
                    >
                      Carousel Information
                    </Text>
                    <Pressable
                      onPress={() => {
                        setShowCountryDropdown(false);
                        setShowEditDetailsModal(false);
                      }}
                    >
                      <MaterialIcons name="close" size={24} color="#ffffff" />
                    </Pressable>
                  </View>

                  {/* Modal Content */}
                  {/* Carousel Name */}
                  <View className="mb-5">
                    <Text className="text-sm text-white mb-2">
                      Carousel Name
                    </Text>
                    <View className="flex-row items-center rounded-lg px-4 bg-neutral-700">
                      <TextInput
                        className="flex-1 py-4 text-base text-white"
                        placeholder="Enter carousel name"
                        placeholderTextColor="#666666"
                        value={tempName}
                        onChangeText={setTempName}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

                  {/* Tag */}
                  <View className="mb-5">
                    <Text className="text-sm text-white mb-2">
                      Tag (Optional)
                    </Text>
                    <View className="flex-row items-center rounded-lg px-4 bg-neutral-700">
                      <TextInput
                        className="flex-1 py-4 text-base text-white"
                        placeholder="Enter tag"
                        placeholderTextColor="#666666"
                        value={tempTag}
                        onChangeText={setTempTag}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

                  {/* Country */}
                  <View className="mb-5">
                    <Text className="text-sm text-white mb-2">Country</Text>
                    <Pressable
                      className="flex-row items-center justify-between rounded-lg px-4 py-4 bg-neutral-700"
                      onPress={() =>
                        setShowCountryDropdown((isVisible) => !isVisible)
                      }
                    >
                      <Text
                        className={`text-base ${
                          tempCountry ? "text-white" : "text-neutral-500"
                        }`}
                      >
                        {tempCountry || "Select country"}
                      </Text>
                      <MaterialIcons
                        name={
                          showCountryDropdown
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                        size={24}
                        color="#999999"
                      />
                    </Pressable>
                    {showCountryDropdown && (
                      <View
                        className="mt-2 rounded-lg border border-neutral-700 bg-neutral-800"
                        style={{ maxHeight: 240, overflow: "hidden" }}
                      >
                        <ScrollView
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator
                        >
                          {COUNTRIES.map((country) => (
                            <Pressable
                              key={country}
                              className={`px-4 py-3 ${
                                tempCountry === country
                                  ? "bg-orange-600/20"
                                  : ""
                              }`}
                              onPress={() => {
                                setTempCountry(country);
                                setShowCountryDropdown(false);
                              }}
                            >
                              <Text
                                className={`text-base ${
                                  tempCountry === country
                                    ? "text-orange-600 font-semibold"
                                    : "text-white"
                                }`}
                              >
                                {country}
                              </Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* Description */}
                  <View className="mb-6">
                    <Text className="text-sm text-white mb-2">
                      Description (Optional)
                    </Text>
                    <View className="rounded-lg px-4 bg-neutral-700">
                      <TextInput
                        className="py-4 text-base text-white"
                        placeholder="Describe your carousel..."
                        placeholderTextColor="#666666"
                        value={tempDescription}
                        onChangeText={setTempDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={{ minHeight: 120 }}
                      />
                    </View>
                  </View>

                  {/* Buttons */}
                  <View className="flex-row gap-3">
                    <Pressable
                      style={{
                        flex: 1,
                        minHeight: 50,
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: "#FFFFFF1A",
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setShowCountryDropdown(false);
                        setShowEditDetailsModal(false);
                      }}
                    >
                      <Text className="text-base text-white">Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={{
                        flex: 1,
                        minHeight: 50,
                        backgroundColor: "#ea580c",
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={handleSaveDetails}
                    >
                      <Text className="text-base text-white">Save Changes</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>

      {/* Custom Alert */}
      <Alert
        visible={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
        duration={4000}
      />
    </View>
  );
}
