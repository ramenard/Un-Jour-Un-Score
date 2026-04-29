import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../../theme';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ label, size = 'md' }: LoadingSpinnerProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerSize = { sm: 20, md: 32, lg: 48 }[size];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            transform: [{ rotate }],
          },
        ]}
      />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  spinner: {
    borderWidth: 3,
    borderColor: theme.colors.cardBorder,
    borderTopColor: theme.colors.primary,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
});
