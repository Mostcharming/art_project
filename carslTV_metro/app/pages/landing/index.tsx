import { StyleSheet, View } from 'react-native';
import { HeroGallery } from '../../components/home/HeroGallery';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <HeroGallery />
    </View>
  );
}
