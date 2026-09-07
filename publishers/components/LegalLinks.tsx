import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function LegalLinks({ accepted, onAcceptedChange }: { accepted?: boolean; onAcceptedChange?: (accepted: boolean) => void }) {
  const router = useRouter();
  return <View className="my-4 gap-3">
    <View className="flex-row flex-wrap justify-center gap-5">
      <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: "/legal", params: { document: "terms" } })}><Text className="text-orange-300 underline">Terms of Use</Text></Pressable>
      <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: "/legal", params: { document: "privacy" } })}><Text className="text-orange-300 underline">Privacy Policy</Text></Pressable>
    </View>
    {onAcceptedChange && <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: !!accepted }} className="flex-row items-center gap-3 p-2" onPress={() => onAcceptedChange(!accepted)}><Text className="text-xl text-orange-300">{accepted ? "☑" : "☐"}</Text><Text className="flex-1 text-sm text-white">I agree to the Terms of Use and acknowledge the Privacy Policy.</Text></Pressable>}
  </View>;
}
