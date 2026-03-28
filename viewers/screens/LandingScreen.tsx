import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTVNavigation } from '../navigation/TVNavigationContext';
import useTVRemote from '../useTVRemote';

export function LandingScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { navigate } = useTVNavigation();

  const menuItems = [
    { id: '1', title: 'Home', icon: '🏠' },
    { id: '2', title: 'Home 2', icon: '📹' },
    { id: '3', title: 'Settings', icon: '⚙️' },
    { id: '4', title: 'About', icon: 'ℹ️' },
  ];

  // TV Remote navigation
  useTVRemote({
    onLeft: () => {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    },
    onRight: () => {
      if (selectedIndex < menuItems.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    },
    onEnter: () => {
      const selectedItem = menuItems[selectedIndex];
      console.log(`Selected: ${selectedItem.title}`);

      // Navigate based on selection
      if (selectedItem.title === 'Home 2') {
        navigate('Home2');
      }
    },
    onBack: () => {
      console.log('Back pressed');
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
            Your Entertainment Hub
          </Text>
        </View>
      </View>

      {/* Welcome Section */}
      <View className="flex-1 px-10 py-16 justify-center">
        <Text className="text-5xl font-bold text-orange-600 mb-2">
          Welcome to CarslTV
        </Text>
        <Text className="text-2xl text-gray-300 mb-12 font-light">
          Discover a world of entertainment
        </Text>

        {/* Features */}
        <View className="flex-row gap-10 mb-16 justify-around">
          <View className="items-center gap-4">
            <Text className="text-5xl">🎬</Text>
            <Text className="text-base text-white font-medium">
              Watch Movies
            </Text>
          </View>
          <View className="items-center gap-4">
            <Text className="text-5xl">🎥</Text>
            <Text className="text-base text-white font-medium">
              Stream Videos
            </Text>
          </View>
          <View className="items-center gap-4">
            <Text className="text-5xl">⚡</Text>
            <Text className="text-base text-white font-medium">
              Fast & Smooth
            </Text>
          </View>
        </View>

        <Text className="text-base text-gray-600 italic">
          Use D-Pad or arrow keys to navigate
        </Text>
      </View>

      {/* Menu */}
      <View className="px-10 py-7 bg-gray-900 border-t border-gray-700">
        <FlatList
          data={menuItems}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className={
                selectedIndex === index
                  ? 'px-6 py-4 rounded-lg flex-row items-center gap-3 min-w-[150px] bg-orange-600 border-2 border-white'
                  : 'px-6 py-4 rounded-lg flex-row items-center gap-3 min-w-[150px] bg-gray-800'
              }
              onPress={() => setSelectedIndex(index)}
              onFocus={() => setSelectedIndex(index)}
            >
              <Text className="text-2xl">{item.icon}</Text>
              <Text className="text-base font-medium text-white">
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal
          scrollEnabled
          contentContainerStyle={{ alignItems: 'center', gap: 5 }}
        />
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
