import { ArtworkForm, SelectedImage } from "@/types";
import { Image, Pressable, Text, TextInput, View } from "react-native";

interface ArtworkFormCardProps {
  selectedImage: SelectedImage;
  formData: ArtworkForm;
  onFormChange: (field: keyof ArtworkForm, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  onInputFocus?: () => void;
}

export default function ArtworkFormCard({
  selectedImage,
  formData,
  onFormChange,
  onCancel,
  onSubmit,
  onInputFocus,
}: ArtworkFormCardProps) {
  return (
    <View className="bg-neutral-800 rounded-lg p-6 mb-24 border border-neutral-700">
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
          onChangeText={(value) => onFormChange("title", value)}
          className="bg-black text-white px-4 py-3 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-white text-sm font-semibold mb-2">
          Artist <Text className="text-orange-600">*</Text>
        </Text>
        <TextInput
          placeholder="Enter artist name"
          placeholderTextColor="#ffffff"
          value={formData.artist}
          onChangeText={(value) => onFormChange("artist", value)}
          className="bg-black text-white px-4 py-3 rounded-lg"
        />
      </View>

      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <Text className="text-white text-sm font-semibold mb-2">
            Height (inches) <Text className="text-orange-600">*</Text>
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            value={formData.height}
            onChangeText={(value) => onFormChange("height", value)}
            onFocus={onInputFocus}
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
            onChangeText={(value) => onFormChange("width", value)}
            onFocus={onInputFocus}
            keyboardType="decimal-pad"
            className="bg-black text-white px-4 py-3 rounded-lg"
          />
        </View>
      </View>

      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <Text className="text-white text-sm font-semibold mb-2">
            Year of Creation
          </Text>
          <TextInput
            placeholder="YYYY"
            placeholderTextColor="#ffffff"
            value={formData.yearOfCreation}
            onChangeText={(value) => onFormChange("yearOfCreation", value)}
            onFocus={onInputFocus}
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
            onChangeText={(value) => onFormChange("purchasePrice", value)}
            onFocus={onInputFocus}
            keyboardType="decimal-pad"
            className="bg-black text-white px-4 py-3 rounded-lg"
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          className="flex-1 rounded-xl justify-center items-center border-2 border-[#FFFFFF1A]"
          style={{ minHeight: 60, backgroundColor: "transparent" }}
          onPress={onCancel}
        >
          <Text className="text-base text-orange-600">Cancel</Text>
        </Pressable>
        <Pressable
          className="flex-1 rounded-xl justify-center items-center bg-orange-600"
          style={{ minHeight: 60 }}
          onPress={onSubmit}
        >
          <Text className="text-base text-white">Add Artwork</Text>
        </Pressable>
      </View>
    </View>
  );
}
