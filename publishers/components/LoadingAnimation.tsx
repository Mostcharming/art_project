import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export const LoadingAnimation = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Create 8 dots in a line
  const dots = Array.from({ length: 8 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={styles.circle} />
        <Animated.View
          style={[
            styles.dotsContainer,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          {dots.map((index) => (
            <View
              key={index}
              style={[
                styles.dotWrapper,
                {
                  left: (index * 50) / 8,
                },
              ]}
            >
              <View style={styles.dotInner} />
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.9)",
    position: "absolute",
  },
  dotsContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  dotWrapper: {
    position: "absolute",
    width: 3,
    height: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  dotInner: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(200, 200, 200, 0.7)",
  },
});
