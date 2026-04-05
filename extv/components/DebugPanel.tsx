import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface DebugPanelProps {
  data: any;
  title: string;
}

export function DebugPanel({ data, title }: DebugPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="bg-black/80 border border-red-500 p-4 m-4 rounded">
      <Pressable onPress={() => setExpanded(!expanded)}>
        <Text className="text-red-500 font-bold text-sm">
          {expanded ? "▼" : "▶"} DEBUG: {title}
        </Text>
      </Pressable>

      {expanded && (
        <ScrollView className="mt-2 max-h-64 bg-black/50 rounded p-2">
          <Text className="text-white font-mono text-xs">
            {JSON.stringify(data, null, 2)}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
