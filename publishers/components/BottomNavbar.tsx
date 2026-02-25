import { useRouter } from "expo-router";
import { Home, Settings, Tags, User } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NAV_ITEMS = [
  { icon: Home, label: "Home", route: "/dashboard" },
  { icon: Tags, label: "Tags", route: "/tags" },
  { icon: User, label: "Profile", route: "/profile" },
  { icon: Settings, label: "Settings", route: "/settings" },
];

export default function BottomNavbar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#18181b",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        paddingBottom: Math.max(insets.bottom, 8),
        borderTopWidth: 1,
        borderTopColor: "#27272a",
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => router.replace(item.route as any)}
          style={{ alignItems: "center" }}
        >
          <item.icon size={24} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
