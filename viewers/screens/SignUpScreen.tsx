import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useTVNavigation } from '../navigation/TVNavigationContext';
import useTVRemote from '../useTVRemote';

export function SignUpScreen() {
  const { navigate, goBack } = useTVNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const menuItems = [
    {
      label: 'Sign Up',
      action: () => console.log('Sign up with:', { email, password }),
    },
    { label: 'Sign In Instead', action: () => navigate('SignIn') },
    { label: 'Back', action: () => goBack() },
  ];

  useTVRemote({
    onUp: () =>
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : menuItems.length - 1)),
    onDown: () =>
      setSelectedIndex(prev => (prev < menuItems.length - 1 ? prev + 1 : 0)),
    onEnter: () => menuItems[selectedIndex].action(),
  });

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-8 items-center border-b border-white/20">
        <Text
          className="text-white text-4xl font-bold"
          style={{ fontFamily: 'BankGothicBold' }}
        >
          Create Account
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-8 py-12">
        <Text className="text-white/80 text-lg leading-7 mb-8">
          Join us to save your favorite artworks and get personalized
          recommendations.
        </Text>

        {/* Form Fields */}
        <View className="gap-6 mb-8">
          {/* Email Field */}
          <View>
            <Text className="text-white/60 text-sm mb-2">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="rgba(255,255,255,0.3)"
              className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20"
            />
          </View>

          {/* Password Field */}
          <View>
            <Text className="text-white/60 text-sm mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20"
            />
          </View>

          {/* Confirm Password Field */}
          <View>
            <Text className="text-white/60 text-sm mb-2">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20"
            />
          </View>
        </View>

        <Text className="text-white/60 text-xs">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>

      {/* Menu Items */}
      <View className="px-8 py-12 gap-4">
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={item.action}
            className={[
              'h-14 rounded-lg items-center justify-center transition-all duration-200',
              selectedIndex === index
                ? 'bg-[#D8522E] ring-2 ring-white'
                : 'bg-white/10 border border-white/20',
            ].join(' ')}
            style={{
              transform:
                selectedIndex === index ? [{ scale: 1.05 }] : [{ scale: 1 }],
            }}
          >
            <Text
              className={[
                'font-semibold text-lg',
                selectedIndex === index ? 'text-white' : 'text-white/70',
              ].join(' ')}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
