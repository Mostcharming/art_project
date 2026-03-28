import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTVNavigation } from '../navigation/TVNavigationContext';
import useTVRemote from '../useTVRemote';

export function Home2Screen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { goBack } = useTVNavigation();

  const actions = [
    { id: '1', title: 'Back', action: 'back' },
    { id: '2', title: 'Settings', action: 'settings' },
  ];

  // TV Remote navigation
  useTVRemote({
    onLeft: () => {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    },
    onRight: () => {
      if (selectedIndex < actions.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    },
    onEnter: () => {
      const selectedAction = actions[selectedIndex];
      if (selectedAction.action === 'back') {
        goBack();
      }
    },
    onBack: () => {
      goBack();
    },
  });

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-10 py-7 border-b-2 border-orange-600 flex-row items-center gap-5">
        <Text className="text-5xl font-bold text-orange-600 bg-gray-900 px-4 py-3 rounded-lg">
          C
        </Text>
        <View className="flex-1">
          <Text className="text-4xl font-bold text-white">CarslTV</Text>
          <Text className="text-base text-orange-600 mt-1 font-medium">
            Home 2
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 px-10 py-16 justify-center">
        <Text className="text-5xl font-bold text-orange-600 mb-2">
          Home 2 Screen
        </Text>
        <Text className="text-2xl text-gray-300 mb-12 font-light">
          You are now on the Home 2 page
        </Text>

        {/* Content Cards */}
        <View className="flex-row gap-8 mb-16 justify-around">
          <View className="items-center gap-4 px-5 py-5 bg-gray-900 rounded-lg border border-gray-700">
            <Text className="text-5xl">🎬</Text>
            <Text className="text-lg text-white font-semibold">
              Featured Content
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Check out the latest movies and shows
            </Text>
          </View>
          <View className="items-center gap-4 px-5 py-5 bg-gray-900 rounded-lg border border-gray-700">
            <Text className="text-5xl">🎥</Text>
            <Text className="text-lg text-white font-semibold">
              Recommendations
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Personalized picks just for you
            </Text>
          </View>
          <View className="items-center gap-4 px-5 py-5 bg-gray-900 rounded-lg border border-gray-700">
            <Text className="text-5xl">⭐</Text>
            <Text className="text-lg text-white font-semibold">
              Trending Now
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              What everyone is watching
            </Text>
          </View>
        </View>

        <Text className="text-base text-gray-600 italic">
          Use D-Pad or arrow keys to navigate
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="px-10 py-7 bg-gray-900 border-t border-gray-700 flex-row gap-5 justify-center">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={action.id}
            className={
              selectedIndex === index
                ? 'px-7 py-3 rounded-lg min-w-[150px] bg-orange-600 border-2 border-white'
                : 'px-7 py-3 rounded-lg min-w-[150px] bg-gray-800'
            }
            onPress={() => {
              if (action.action === 'back') {
                goBack();
              }
            }}
          >
            <Text className="text-base font-medium text-white text-center">
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View className="px-10 py-5 bg-gray-900 border-t border-gray-700">
        <Text className="text-sm text-gray-600 text-center">
          Press OK/Enter to select • ESC to go back
        </Text>
      </View>
    </View>
  );
}
