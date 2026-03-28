/**
 * CarslTV - Android TV App
 * A React Native application optimized for Android TV
 * @format
 */

import { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import useTVRemote from './useTVRemote';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeAreaInsets = useSafeAreaInsets();

  const menuItems = [
    { id: '1', title: 'Home', icon: '🏠' },
    { id: '2', title: 'Videos', icon: '📹' },
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
      console.log(`Selected: ${menuItems[selectedIndex].title}`);
    },
    onBack: () => {
      console.log('Back pressed');
    },
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CarslTV</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Welcome to CarslTV</Text>
        <Text style={styles.contentText}>
          This app is optimized for TV remote navigation
        </Text>
        <Text style={styles.contentText}>
          Use D-Pad or arrow keys to navigate
        </Text>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        <FlatList
          data={menuItems}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.menuItem,
                selectedIndex === index && styles.menuItemSelected,
              ]}
              onPress={() => setSelectedIndex(index)}
              onFocus={() => setSelectedIndex(index)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal
          scrollEnabled
          contentContainerStyle={styles.menuContent}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Press OK/Enter to select • ESC to go back
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#ff6b35',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 60,
    justifyContent: 'center',
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ff6b35',
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#cccccc',
    marginBottom: 15,
    lineHeight: 28,
  },
  menuContainer: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  menuContent: {
    alignItems: 'center',
    gap: 20,
  },
  menuItem: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 150,
  },
  menuItemSelected: {
    backgroundColor: '#ff6b35',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  menuIcon: {
    fontSize: 24,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  footer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default App;
