import documents from "@/constants/legalDocuments.json";
import { useApiMutate } from "@/hooks/useApiMutate";
import { useUserStore } from "@/store/userStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LegalPage() {
  const { document } = useLocalSearchParams<{ document?: string }>();
  const content = document === "terms" ? documents.terms : documents.privacy;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const token = useUserStore(state => state.token);
  const updateUser = useUserStore(state => state.updateUser);
  const { mutate, isLoading } = useApiMutate();
  const [message, setMessage] = useState("");
  const accept = async () => {
    const response = await mutate("/auth/accept-terms", { method: "POST", payload: { acceptTerms: true, termsVersion: documents.version } });
    if (response.error) { setMessage(response.error); return; }
    updateUser({ termsVersion: documents.version });
    setMessage("Terms accepted. You can return and continue publishing.");
  };
  return <View style={{ flex: 1, backgroundColor: "#10141c", paddingTop: insets.top }}>
    <Pressable accessibilityRole="button" onPress={() => router.back()} style={{ padding: 18 }}><Text style={{ color: "#ffad91", fontSize: 18 }}>Back</Text></Pressable>
    <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: insets.bottom + 40 }}>
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 16 }}>{content.title}</Text>
      <Text style={{ color: "#d6dce6", fontSize: 16, lineHeight: 25, marginBottom: 24 }}>{content.intro}</Text>
      {content.sections.map(section => <View key={section.title} style={{ marginBottom: 28 }}><Text style={{ color: "white", fontSize: 21, fontWeight: "bold", marginBottom: 12 }}>{section.title}</Text>{section.paragraphs.map((paragraph, index) => <Text key={index} style={{ color: "#d6dce6", fontSize: 16, lineHeight: 25, marginBottom: 12 }}>{paragraph}</Text>)}</View>)}
      {document === "terms" && token && <Pressable disabled={isLoading} accessibilityRole="button" onPress={() => void accept()} style={{ padding: 18, backgroundColor: "#d8522e", borderRadius: 8 }}><Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>{isLoading ? "Saving…" : "I agree to these Terms of Use"}</Text></Pressable>}
      {!!message && <Text accessibilityLiveRegion="polite" style={{ color: "#ffad91", marginTop: 16 }}>{message}</Text>}
    </ScrollView>
  </View>;
}
