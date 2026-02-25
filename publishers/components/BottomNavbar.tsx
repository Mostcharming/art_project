import { useRouter, useSegments } from "expo-router";
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
  const segments = useSegments();
  const currentRoute = `/${segments.join("/")}`;

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
      <View
        style={{
          position: "absolute",
          top: -32,
          left: "50%",
          transform: [{ translateX: -32 }],
          width: 60,
          height: 60,
          borderRadius: 32,
          backgroundColor: "#ea580c",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 101,
          borderWidth: 4,
          borderColor: "#18181b",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 24,
              height: 4,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 4,
              height: 24,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
        </View>
      </View>
      {NAV_ITEMS.map((item) => {
        const isActive = currentRoute === item.route;
        const color = isActive ? "#ea580c" : "#fff";
        return (
          <Pressable
            key={item.label}
            onPress={() => router.replace(item.route as any)}
            style={{ alignItems: "center" }}
          >
            <item.icon size={24} color={color} />
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
