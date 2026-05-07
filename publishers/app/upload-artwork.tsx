import { Alert } from "@/components/ui/Alert";
import { useCarouselApi } from "@/hooks/useCarouselApi";
import { useCarouselStore } from "@/store/carouselStore";
import { ArtworkForm, SelectedImage, UploadedArtwork } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CloudUpload, Play, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
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
import ArtworkList from "./components/ArtworkList";

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
    null
  );
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
    []
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [carouselName, setCarouselName] = useState("");
  const [carouselTag, setCarouselTag] = useState("");
  const [carouselCountry, setCarouselCountry] = useState("");
  const [carouselDescription, setCarouselDescription] = useState("");

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
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

  const validateImage = (asset: ImagePicker.ImagePickerAsset): boolean => {
    // Check file size
    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
      setAlertMessage(
        `File size exceeds 25 MB limit. Your file is ${(asset.fileSize / (1024 * 1024)).toFixed(2)} MB`
      );
      setShowAlert(true);
      return false;
    }

    // Check dimensions - only validate if dimensions are available
    if (asset.width && asset.height) {
      if (asset.width < MIN_WIDTH || asset.height < MIN_HEIGHT) {
        setAlertMessage(
          `Minimum image size is 1920x1080px. Your image is ${asset.width}x${asset.height}px`
        );
        setShowAlert(true);
        return false;
      }
    }
    // If dimensions are not available, we'll allow it through
    // (dimensions may not be available on first load)

    // Note: Can't check DPI, format type, watermarks, or borders on React Native
    // These would need to be validated on the backend

    return true;
  };

  const pickImage = async (inModal: boolean = false) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      setAlertMessage(
        "Please allow access to your photo library to upload artwork"
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
        setSelectedImage({
          uri: asset.uri,
          width: asset.width || 0,
          height: asset.height || 0,
          fileSize: asset.fileSize || 0,
        });
      }
    }
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
    handleCancel();
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
      <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
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
            <>
              {/* Selected Image and Form Display */}
              <View className="bg-neutral-800 rounded-lg p-6 mb-6 border border-neutral-700">
                {/* Selected Image Display */}
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                  resizeMode="contain"
                />
                <Text className="text-gray-400 text-xs mb-6">
                  {selectedImage.width}x{selectedImage.height}px
                  {selectedImage.fileSize
                    ? ` • ${(selectedImage.fileSize / (1024 * 1024)).toFixed(2)} MB`
                    : ""}
                </Text>

                {/* Artwork Form */}
                {/* Title */}
                <View className="mb-4">
                  <Text className="text-white text-sm font-semibold mb-2">
                    Title <Text className="text-orange-600">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter artwork title"
                    placeholderTextColor="#ffffff"
                    value={formData.title}
                    onChangeText={(value) => handleFormChange("title", value)}
                    className="bg-black text-white px-4 py-3 rounded-lg"
                  />
                </View>

                {/* Artist */}
                <View className="mb-4">
                  <Text className="text-white text-sm font-semibold mb-2">
                    Artist <Text className="text-orange-600">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter artist name"
                    placeholderTextColor="#ffffff"
                    value={formData.artist}
                    onChangeText={(value) => handleFormChange("artist", value)}
                    className="bg-black text-white px-4 py-3 rounded-lg"
                  />
                </View>

                {/* Height and Width */}
                <View className="flex-row gap-4 mb-4">
                  <View className="flex-1">
                    <Text className="text-white text-sm font-semibold mb-2">
                      Height (inches) <Text className="text-orange-600">*</Text>
                    </Text>
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#ffffff"
                      value={formData.height}
                      onChangeText={(value) =>
                        handleFormChange("height", value)
                      }
                      keyboardType="decimal-pad"
                      className="bg-black text-white px-4 py-3 rounded-lg"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-sm font-semibold mb-2">
                      Width (inches) <Text className="text-orange-600">*</Text>
                    </Text>
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#ffffff"
                      value={formData.width}
                      onChangeText={(value) => handleFormChange("width", value)}
                      keyboardType="decimal-pad"
                      className="bg-black text-white px-4 py-3 rounded-lg"
                    />
                  </View>
                </View>

                {/* Year and Purchase Price */}
                <View className="flex-row gap-4 mb-4">
                  <View className="flex-1">
                    <Text className="text-white text-sm font-semibold mb-2">
                      Year of Creation
                    </Text>
                    <TextInput
                      placeholder="YYYY"
                      placeholderTextColor="#ffffff"
                      value={formData.yearOfCreation}
                      onChangeText={(value) =>
                        handleFormChange("yearOfCreation", value)
                      }
                      keyboardType="number-pad"
                      maxLength={4}
                      className="bg-black text-white px-4 py-3 rounded-lg"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-sm font-semibold mb-2">
                      Purchase Price
                    </Text>
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#ffffff"
                      value={formData.purchasePrice}
                      onChangeText={(value) =>
                        handleFormChange("purchasePrice", value)
                      }
                      keyboardType="decimal-pad"
                      className="bg-black text-white px-4 py-3 rounded-lg"
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                  <Pressable
                    className="flex-1 rounded-xl justify-center items-center border-2 border-[#FFFFFF1A]"
                    style={{
                      minHeight: 60,
                      backgroundColor: "transparent",
                    }}
                    onPress={handleCancel}
                  >
                    <Text className="text-base  text-orange-600">Cancel</Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 rounded-xl justify-center items-center bg-orange-600"
                    style={{ minHeight: 60 }}
                    onPress={handleAddArtwork}
                  >
                    <Text className="text-base  text-white">Add Artwork</Text>
                  </Pressable>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Upload Box */}
              <Pressable
                onPress={() => pickImage(false)}
                className="bg-neutral-800 rounded-lg p-6 mb-4 border border-neutral-700 h-40 justify-center items-center"
              >
                <CloudUpload size={30} color="#ffffff" />
                <Text className="text-white mt-4 text-center font-semibold">
                  Click to upload file or drag and drop
                </Text>
                <Text className="text-gray-400 mt-1 text-center text-xs">
                  PNG, JPG, or TIFF (min. 1920x1080px, max 25 MB)
                </Text>
              </Pressable>

              <View className="bg-neutral-800 rounded-lg p-6 mb-10 border border-neutral-700">
                <Text className="text-white font-semibold text-base mb-3">
                  Artwork Upload Requirements:
                </Text>
                <View className="gap-2">
                  <View className="flex-row items-start">
                    <Text className="text-gray-400 mr-2">•</Text>
                    <Text className="text-gray-400 text-sm flex-1">
                      Images only: .JPG, .PNG, .TIFF
                    </Text>
                  </View>
                  <View className="flex-row items-start">
                    <Text className="text-gray-400 mr-2">•</Text>
                    <Text className="text-gray-400 text-sm flex-1">
                      Min size: 1920x1080px (Full HD)
                    </Text>
                  </View>
                  <View className="flex-row items-start">
                    <Text className="text-gray-400 mr-2">•</Text>
                    <Text className="text-gray-400 text-sm flex-1">
                      Min resolution: 300DPI
                    </Text>
                  </View>
                  <View className="flex-row items-start">
                    <Text className="text-gray-400 mr-2">•</Text>
                    <Text className="text-gray-400 text-sm flex-1">
                      No watermarks or borders
                    </Text>
                  </View>
                  <View className="flex-row items-start">
                    <Text className="text-gray-400 mr-2">•</Text>
                    <Text className="text-gray-400 text-sm flex-1">
                      Max file size: 25 MB
                    </Text>
                  </View>
                </View>
              </View>

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

        {/* Add Artwork Modal */}
        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={handleModalCancel}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.77)" }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1, paddingTop: insets.top }}>
                <ScrollView
                  className="flex-1"
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Modal Header */}
                  <View className="flex-row items-center justify-between px-5 py-4 ">
                    <Text
                      className="text-white text-lg"
                      style={{ fontFamily: "BankGothicBold" }}
                    >
                      Add Artwork
                    </Text>
                    <Pressable onPress={handleModalCancel}>
                      <X size={24} color="#ffffff" />
                    </Pressable>
                  </View>

                  <View className="px-5 py-6">
                    {!selectedImage ? (
                      <>
                        {/* Upload Box */}
                        <Pressable
                          onPress={() => pickImage(true)}
                          className="bg-neutral-800 rounded-lg p-6 mb-4 border border-neutral-700 h-40 justify-center items-center"
                        >
                          <CloudUpload size={30} color="#ffffff" />
                          <Text className="text-white mt-4 text-center font-semibold">
                            Click to upload file or drag and drop
                          </Text>
                          <Text className="text-gray-400 mt-1 text-center text-xs">
                            PNG, JPG, or TIFF (min. 1920x1080px, max 25 MB)
                          </Text>
                        </Pressable>

                        <View className="bg-neutral-800 rounded-lg p-6 mb-10 border border-neutral-700">
                          <Text className="text-white font-semibold text-base mb-3">
                            Artwork Upload Requirements:
                          </Text>
                          <View className="gap-2">
                            <View className="flex-row items-start">
                              <Text className="text-gray-400 mr-2">•</Text>
                              <Text className="text-gray-400 text-sm flex-1">
                                Images only: .JPG, .PNG, .TIFF
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <Text className="text-gray-400 mr-2">•</Text>
                              <Text className="text-gray-400 text-sm flex-1">
                                Min size: 1920x1080px (Full HD)
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <Text className="text-gray-400 mr-2">•</Text>
                              <Text className="text-gray-400 text-sm flex-1">
                                Min resolution: 300DPI
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <Text className="text-gray-400 mr-2">•</Text>
                              <Text className="text-gray-400 text-sm flex-1">
                                No watermarks or borders
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <Text className="text-gray-400 mr-2">•</Text>
                              <Text className="text-gray-400 text-sm flex-1">
                                Max file size: 25 MB
                              </Text>
                            </View>
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        {/* Combined Image, Form, and Buttons Box */}
                        <View className="bg-neutral-800 rounded-lg p-6 mb-6 border border-neutral-700">
                          {/* Selected Image Display */}
                          <Image
                            source={{ uri: selectedImage.uri }}
                            style={{
                              width: "100%",
                              height: 200,
                              borderRadius: 8,
                              marginBottom: 12,
                            }}
                            resizeMode="contain"
                          />
                          <Text className="text-gray-400 text-xs mb-6">
                            {selectedImage.width}x{selectedImage.height}px
                            {selectedImage.fileSize
                              ? ` • ${(selectedImage.fileSize / (1024 * 1024)).toFixed(2)} MB`
                              : ""}
                          </Text>

                          <View className="mb-4">
                            <Text className="text-white text-sm font-semibold mb-2">
                              Title <Text className="text-orange-600">*</Text>
                            </Text>
                            <TextInput
                              placeholder="Enter artwork title"
                              placeholderTextColor="#ffffff"
                              value={formData.title}
                              onChangeText={(value) =>
                                handleFormChange("title", value)
                              }
                              className="bg-black text-white px-4 py-3 rounded-lg"
                            />
                          </View>

                          {/* Artist */}
                          <View className="mb-4">
                            <Text className="text-white text-sm font-semibold mb-2">
                              Artist <Text className="text-orange-600">*</Text>
                            </Text>
                            <TextInput
                              placeholder="Enter artist name"
                              placeholderTextColor="#ffffff"
                              value={formData.artist}
                              onChangeText={(value) =>
                                handleFormChange("artist", value)
                              }
                              className="bg-black text-white px-4 py-3 rounded-lg"
                            />
                          </View>

                          {/* Height and Width */}
                          <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                              <Text className="text-white text-sm font-semibold mb-2">
                                Height (inches){" "}
                                <Text className="text-orange-600">*</Text>
                              </Text>
                              <TextInput
                                placeholder="0.00"
                                placeholderTextColor="#ffffff"
                                value={formData.height}
                                onChangeText={(value) =>
                                  handleFormChange("height", value)
                                }
                                keyboardType="decimal-pad"
                                className="bg-black text-white px-4 py-3 rounded-lg"
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-white text-sm font-semibold mb-2">
                                Width (inches){" "}
                                <Text className="text-orange-600">*</Text>
                              </Text>
                              <TextInput
                                placeholder="0.00"
                                placeholderTextColor="#ffffff"
                                value={formData.width}
                                onChangeText={(value) =>
                                  handleFormChange("width", value)
                                }
                                keyboardType="decimal-pad"
                                className="bg-black text-white px-4 py-3 rounded-lg"
                              />
                            </View>
                          </View>

                          {/* Year and Purchase Price */}
                          <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                              <Text className="text-white text-sm font-semibold mb-2">
                                Year of Creation
                              </Text>
                              <TextInput
                                placeholder="YYYY"
                                placeholderTextColor="#ffffff"
                                value={formData.yearOfCreation}
                                onChangeText={(value) =>
                                  handleFormChange("yearOfCreation", value)
                                }
                                keyboardType="number-pad"
                                maxLength={4}
                                className="bg-black text-white px-4 py-3 rounded-lg"
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-white text-sm font-semibold mb-2">
                                Purchase Price
                              </Text>
                              <TextInput
                                placeholder="0.00"
                                placeholderTextColor="#ffffff"
                                value={formData.purchasePrice}
                                onChangeText={(value) =>
                                  handleFormChange("purchasePrice", value)
                                }
                                keyboardType="decimal-pad"
                                className="bg-black text-white px-4 py-3 rounded-lg"
                              />
                            </View>
                          </View>

                          {/* Action Buttons */}
                          <View className="flex-row gap-3">
                            <Pressable
                              className="flex-1 rounded-xl justify-center items-center border-2 border-[#FFFFFF1A]"
                              style={{
                                minHeight: 60,
                                backgroundColor: "transparent",
                              }}
                              onPress={() => {
                                setSelectedImage(null);
                                setFormData({
                                  title: "",
                                  artist: "",
                                  height: "",
                                  width: "",
                                  yearOfCreation: "",
                                  purchasePrice: "",
                                });
                              }}
                            >
                              <Text className="text-base text-orange-600">
                                Cancel
                              </Text>
                            </Pressable>
                            <Pressable
                              className="flex-1 rounded-xl justify-center items-center bg-orange-600"
                              style={{ minHeight: 60 }}
                              onPress={handleAddArtwork}
                            >
                              <Text className="text-base text-white">
                                Add Artwork
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>

        {/* Carousel Details Modal */}
        {/* Removed - carousel details are now passed from create-carousel page */}

        {/* Custom Alert */}
        <Alert
          visible={showAlert}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          duration={4000}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
