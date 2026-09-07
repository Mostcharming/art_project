import { getBaseUrl } from "@/constants/api.config";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DeleteAccountPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useUserStore(state => state.user);
  const [email, setEmail] = useState(user?.email || "");
  const [accountType, setAccountType] = useState("publisher");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submit = async () => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const base = getBaseUrl().replace(/\/publishers\/?$/, "/privacy");
      const { data } = await axios.post(`${base}/deletion/${requestId ? "confirm" : "request"}`, requestId ? { requestId, code, confirm: confirmed } : { email, accountType }, { timeout: 60000 });
      setMessage(data.message + (data.reference ? ` Reference: ${data.reference}` : ""));
      if (requestId) {
        setDone(true); setCode("");
        if (accountType !== "viewer" && email.trim().toLowerCase() === user?.email.toLowerCase()) await useUserStore.getState().clearUser();
      } else setRequestId(data.requestId);
    } catch (failure) { setError(axios.isAxiosError(failure) ? failure.response?.data?.error || "Could not complete the request. Please try again." : "Could not clear local session data. Sign out before using another account."); }
    finally { setBusy(false); }
  };
  const button = { padding: 16, borderRadius: 8, backgroundColor: "#d8522e", marginTop: 16 };
  const body = { color: "#d6dce6", fontSize: 16, lineHeight: 25, marginBottom: 16 };
  const input = { borderWidth: 1, borderColor: "#8290a4", borderRadius: 6, color: "white", padding: 14, marginBottom: 16 };
  return <View style={{ flex: 1, backgroundColor: "#10141c", paddingTop: insets.top }}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 22, paddingBottom: insets.bottom + 40 }}>
    <Pressable onPress={() => done ? router.replace("/splash/splash1") : router.back()}><Text style={{ color: "#ffad91", marginBottom: 24 }}>Back</Text></Pressable>
    <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>Delete your account</Text>
    <Text style={body}>This permanently deletes the selected account and its profile, credentials, preferences and activity. Publisher deletion also removes its artwork and carousels. Publisher and TV viewer accounts are separate.</Text>
    {!done && (!requestId ? <>
      <Text style={body}>Registered email</Text><TextInput accessibilityLabel="Registered email" value={email} onChangeText={setEmail} editable={!busy} keyboardType="email-address" autoCapitalize="none" maxLength={254} style={input} />
      {[['publisher', 'Publisher account'], ['viewer', 'TV viewer account'], ['both', 'Both accounts']].map(([value, label]) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: accountType === value }} disabled={busy} onPress={() => setAccountType(value)} style={{ paddingVertical: 12 }}><Text style={{ color: accountType === value ? "#ffad91" : "white" }}>{accountType === value ? "●" : "○"} {label}</Text></Pressable>)}
    </> : <><Text style={body}>Enter the 8-digit code emailed for your {accountType} deletion request. It expires in 15 minutes.</Text><TextInput accessibilityLabel="Deletion verification code" value={code} onChangeText={value => setCode(value.replace(/\D/g, ""))} maxLength={8} keyboardType="number-pad" autoComplete="one-time-code" editable={!busy} style={input} /><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: confirmed }} disabled={busy} onPress={() => setConfirmed(!confirmed)}><Text style={body}>{confirmed ? "☑" : "☐"} I understand and confirm permanent deletion.</Text></Pressable></>)}
    {!!message && <Text accessibilityLiveRegion="polite" style={body}>{message}</Text>}
    {!!error && <Text accessibilityRole="alert" style={{ ...body, color: "#ffaaaa" }}>{error}</Text>}
    {!done && <Pressable accessibilityRole="button" disabled={busy || (!!requestId && (!confirmed || code.length !== 8))} onPress={() => void submit()} style={{ ...button, opacity: busy || (!!requestId && !confirmed) ? .5 : 1 }}><Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>{busy ? "Please wait…" : requestId ? "Confirm permanent deletion" : "Email a verification code"}</Text></Pressable>}
    {!done && requestId && <Pressable disabled={busy} onPress={() => { setRequestId(null); setCode(""); setConfirmed(false); setMessage(""); }}><Text style={{ color: "#ffad91", marginTop: 20 }}>Change details or request a new code</Text></Pressable>}
    <Text style={{ ...body, marginTop: 28 }}>Local file cleanup retries automatically. A minimal deletion ledger is kept for 90 days; backups and email-provider records are handled separately. Contact support with your reference for help.</Text>
    <Pressable onPress={() => void Linking.openURL("mailto:carsl.ssfo@gmail.com?subject=Carsl%20account%20deletion%20request").catch(() => setError("Email carsl.ssfo@gmail.com using your usual email app."))}><Text style={{ color: "#ffad91" }}>Support: carsl.ssfo@gmail.com</Text></Pressable>
  </ScrollView></View>;
}
