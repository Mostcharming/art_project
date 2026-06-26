import { Alert } from "@/components/ui/Alert";
import { useCarouselApi } from "@/hooks/useCarouselApi";
import { useKeyboardAwareScroll } from "@/hooks/useKeyboardAwareScroll";
import { useCarouselStore } from "@/store/carouselStore";
import { ArtworkForm, SelectedImage, UploadedArtwork } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddArtworkModal from "./components/AddArtworkModal";
import ArtworkFormCard from "./components/ArtworkFormCard";
import ArtworkList from "./components/ArtworkList";
import ArtworkUploadPrompt from "./components/ArtworkUploadPrompt";
import ImageFitModal, { FittedImage } from "./components/ImageFitModal";

export default function UploadArtwork() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saveDraft } = useCarouselApi();
  const carouselStore = useCarouselStore();
  const params = useLocalSearchParams<{
    carouselName?: string;
    carouselTag?: string;
    country?: string;

    description?: string;
  }>();

  const [frameTiming, setFrameTiming] = useState(10);
  const [showFrameDropdown, setShowFrameDropdown] = useState(false);
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
  const [carouselName, setCarouselName] = useState("");
  const [carouselTag, setCarouselTag] = useState("");
  const [carouselCountry, setCarouselCountry] = useState("");
  const [carouselDescription, setCarouselDescription] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    androidKeyboardPadding,
    handleInputBlur: handleArtworkInputBlur,
    handleInputFocus: handleArtworkInputFocus,
  } = useKeyboardAwareScroll(scrollViewRef);

  // Initialize carousel details from route params
  useEffect(() => {
    if (params.carouselName) {
      setCarouselName(params.carouselName);
    }
    if (params.carouselTag) {
      setCarouselTag(params.carouselTag);
    }
    if (params.country) {
      setCarouselCountry(params.country);
    }
    if (params.description) {
      setCarouselDescription(params.description);
    }
  }, [params]);

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

  const validateImage = (_asset: ImagePicker.ImagePickerAsset): boolean => {
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

  const pickImageFromAddModal = () => {
    setShowAddModal(false);
    setImageToFit(null);
    setShowImageFitModal(false);
    void pickImage();
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
    setUploadedArtworks(uploadedArtworks.filter((_, i) => i !== index));
  };

  const handleModalCancel = () => {
    setShowAddModal(false);
  };

  const handlePreviewCarousel = () => {
    if (uploadedArtworks.length === 0) {
      setAlertMessage("Please add at least one artwork");
      setShowAlert(true);
      return;
    }

    const previewData = {
      id: "preview",
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
        isNew: "true",
      },
    });
  };

  const handleSaveDraft = async () => {
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
      const response = await saveDraft({
        name: carouselName,
        country: carouselCountry,
        tag: carouselTag || undefined,
        description: carouselDescription || undefined,
        frameTimingSeconds: frameTiming,
        artworks: uploadedArtworks,
      });

      if (response.error) {
        setAlertMessage(response.error);
        setShowAlert(true);
      } else {
        // Save to local store as well
        carouselStore.saveDraftLocally({
          id: response.data?.carousel?.id?.toString(),
          name: carouselName,
          country: carouselCountry,
          description: carouselDescription,
          frameTimingSeconds: frameTiming,
          artworks: uploadedArtworks,
          status: "draft",
        });

        setAlertMessage("Carousel saved as draft successfully!");
        setShowAlert(true);

        // Reset form
        setCarouselName("");
        setCarouselCountry("");
        setCarouselDescription("");
        setUploadedArtworks([]);

        // Navigate after a brief delay
        setTimeout(() => {
          router.push("/create-carousel");
        }, 1000);
      }
    } catch {
      setAlertMessage("Failed to save carousel draft");
      setShowAlert(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
        style={{ paddingTop: insets.top }}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 120 + androidKeyboardPadding,
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
                Upload artwork
              </Text>
              <Text className="text-base text-gray-300 leading-6">
                Add your art and create your carousel
              </Text>
            </View>
          </View>

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

          {/* Show uploaded artworks if any */}
          {uploadedArtworks.length > 0 && !selectedImage ? (
            <>
              <ArtworkList
                artworks={uploadedArtworks}
                onArtworksChange={setUploadedArtworks}
                onAddClick={() => setShowAddModal(true)}
                onDelete={handleDeleteArtwork}
              />

              {/* Create Carousel Button */}
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
                  onPress={handleSaveDraft}
                >
                  <Text className="text-base  text-orange-600">
                    {isSaving ? "Saving..." : "Save Draft"}
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
                  <Text className="text-base  text-white">
                    Preview carousel
                  </Text>
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
              onInputBlur={handleArtworkInputBlur}
              onInputFocus={handleArtworkInputFocus}
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
                  onPress={handleSaveDraft}
                >
                  <Text className="text-base  text-orange-600">
                    {isSaving ? "Saving..." : "Save Draft"}
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
                  <Text className="text-base  text-white">
                    Preview carousel
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>

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
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-white">{opt.label}</Text>
                    {frameTiming === opt.value && (
                      <MaterialIcons name="check" size={20} color="#EA580C" />
                    )}
                  </View>
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

        {/* Carousel Details Modal */}
        {/* Removed - carousel details are now passed from create-carousel page */}

        {/* Custom Alert */}
        <Alert
          visible={showAlert}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          duration={4000}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
