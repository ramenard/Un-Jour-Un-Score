import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

type GlowColor = 'primary' | 'accent' | 'gold' | 'success';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: GlowColor;
}

const glowShadowColor: Record<GlowColor, string> = {
  primary: theme.colors.primary,
  accent: theme.colors.accent,
  gold: theme.colors.gold,
  success: theme.colors.success,
};

export function Card({ children, style, glow }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        glow && {
          shadowColor: glowShadowColor[glow],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 10,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
});
