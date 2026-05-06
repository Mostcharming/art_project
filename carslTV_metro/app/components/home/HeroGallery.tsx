import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getNextFocusIndex, useTVRemote } from '../../hooks/use-tv-remote';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flex: 1,
  },
  card16x9: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    overflow: 'hidden',
    flex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 10,
  },
  cardImage: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 12,
  },
  cardImageContent: {
    width: '100%',
    height: '100%',
  },
  cardInfoOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    padding: 12,
    flexDirection: 'column',
  },
  cardTitle: {
    color: 'white',
    fontWeight: '600',
    lineHeight: 1.25,
    fontFamily: 'Space_Grotesk',
  },
  cardArtist: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    lineHeight: 1.25,
  },
  bottomPrompt: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    marginLeft: '-50%',
    textAlign: 'center',
    zIndex: 20,
  },
  promptText: {
    color: 'white',
    fontSize: 12,
  },
});

const CARDS = [
  // 1 — Far left (partially off-screen)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/7.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bgColor: '#1a0a2e',
    left: -10,
    top: 60,
    width: 17.7,
    height: 30.5,
    partial: true,
  },
  // 2 — Left medium
  {
    src: 'https://joincarsl.com/api/uploads/artworks/6.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bgColor: '#1a237e',
    left: 6.1,
    top: 41.2,
    width: 17.7,
    height: 40.6,
    partial: false,
  },
  // 3 — Left tall
  {
    src: 'https://joincarsl.com/api/uploads/artworks/5.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bgColor: '#111111',
    left: 22.2,
    top: 21.9,
    width: 17.7,
    height: 46.5,
    partial: false,
  },
  // 4 — CENTER (tallest)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/1.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bgColor: '#6b1a1a',
    left: 38.3,
    top: 0,
    width: 23.4,
    height: 54.2,
    partial: false,
    isCenter: true,
  },
  // 5 — Right tall
  {
    src: 'https://joincarsl.com/api/uploads/artworks/2.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bgColor: '#7a2800',
    left: 60.1,
    top: 22.4,
    width: 17.7,
    height: 46.5,
    partial: false,
  },
  // 6 — Right medium
  {
    src: 'https://joincarsl.com/api/uploads/artworks/3.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bgColor: '#d4d0c8',
    left: 76.2,
    top: 39.4,
    width: 17.7,
    height: 39.4,
    partial: false,
  },
  // 7 — Far right (partially off-screen)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/4.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bgColor: '#5a2d00',
    left: 92.3,
    top: 60,
    width: 17.7,
    height: 29.3,
    partial: true,
  },
];

const FOCUSABLE_INDICES = [1, 2, 3, 4, 5]; // Non-partial card indices

export function HeroGallery() {
  const [focusedIndex, setFocusedIndex] = useState(3); // Center card (index 3)
  const viewRef = useRef<View>(null);
  const navigation = useNavigation<NavigationProp>();

  const handleCardSelect = () => {
    // Navigate to Details page with the focused card's id
    navigation.navigate('Details', { artworkId: focusedIndex });
  };

  // Set up TV remote controls
  useTVRemote({
    onLeft: () => {
      const newIndex = getNextFocusIndex(
        focusedIndex,
        FOCUSABLE_INDICES,
        'left',
      );
      setFocusedIndex(newIndex);
    },
    onRight: () => {
      const newIndex = getNextFocusIndex(
        focusedIndex,
        FOCUSABLE_INDICES,
        'right',
      );
      setFocusedIndex(newIndex);
    },
    onSelect: handleCardSelect,
  });

  const handleTap = () => {
    // Navigate to the next screen on tap (for Android phones/tablets)
    // if (Platform.OS === "android") {
    handleCardSelect();
    // }
  };

  const handleCardFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <Pressable
      onPress={handleTap}
      style={styles.container}
      ref={viewRef}
      accessible={true}
      accessibilityRole="tablist"
      accessibilityLabel="Gallery carousel"
    >
      {/* 16:9 container — fills the viewport width */}
      <View style={styles.card16x9}>
        {/* Background gradient overlay for depth */}
        <View style={styles.gradientOverlay} />

        {/* Cards */}
        {CARDS.map((card, index) => {
          // Only non-partial cards are focusable
          const isFocusable = !card.partial;
          const isFocused = isFocusable && index === focusedIndex;

          const cardStyle: any = {
            ...styles.cardImage,
            backgroundColor: card.bgColor,
            left: `${card.left}%`,
            top: `${card.top}%`,
            width: `${card.width}%`,
            height: `${card.height}%`,
            zIndex: isFocused ? 30 : card.isCenter ? 10 : 0,
          };

          if (isFocused) {
            cardStyle.borderWidth = 4;
            cardStyle.borderColor = 'rgba(255, 255, 255, 0.8)';
            cardStyle.transform = [{ scale: 1.05 }];
            cardStyle.shadowColor = '#000';
            cardStyle.shadowOffset = { width: 0, height: 10 };
            cardStyle.shadowOpacity = 0.8;
            cardStyle.shadowRadius = 15;
            cardStyle.elevation = 20;
          }

          return (
            <Pressable
              key={card.src}
              onPress={() => isFocusable && handleCardFocus(index)}
              accessible={isFocusable}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={`${card.title} by ${card.artist}`}
              style={cardStyle}
            >
              <Image
                source={{ uri: card.src }}
                style={styles.cardImageContent}
                resizeMode="cover"
              />

              {/* Info overlay — always visible when focused */}
              {isFocused && (
                <View style={styles.cardInfoOverlay}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {card.title}
                  </Text>
                  <Text style={styles.cardArtist} numberOfLines={1}>
                    {card.artist}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Bottom text prompt */}
        <View style={styles.bottomPrompt}>
          <Text style={styles.promptText}>Press Enter(ok) to continue</Text>
        </View>
      </View>
    </Pressable>
  );
}
