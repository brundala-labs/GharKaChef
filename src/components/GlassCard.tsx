import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../theme';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 40 }: Props) {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.fallback,
          // @ts-ignore: web-only backdropFilter
          { backdropFilter: `blur(${intensity / 4}px)`, WebkitBackdropFilter: `blur(${intensity / 4}px)` },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <BlurView intensity={intensity} tint="light" style={styles.blur}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  blur: {
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: colors.card,
  },
  fallback: {
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});
