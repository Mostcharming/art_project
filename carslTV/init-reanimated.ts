import { Platform } from "react-native";
import "react-native-reanimated";

// Only load reanimated on native platforms
if (Platform.OS !== "web") {
  // Reanimated is already imported via the import statement above
}
