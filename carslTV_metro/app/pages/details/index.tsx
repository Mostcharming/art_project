import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ navigation, route }: Props) {
  const { artworkId } = route.params;

  return (
    <View className="flex-1 bg-black p-5">
      <Pressable onPress={() => navigation.goBack()} className="mb-5">
        <Text className="text-white text-lg">← Back</Text>
      </Pressable>

      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl font-bold mb-4">
          Artwork Details
        </Text>
        <Text className="text-gray-400 text-lg">ID: {artworkId}</Text>
      </View>
    </View>
  );
}
