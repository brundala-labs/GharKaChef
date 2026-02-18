import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import { colors } from '../theme';

type LogoProps = {
  size?: number;
  showText?: boolean;
  textSize?: number;
};

export function Logo({ size = 80, showText = true, textSize = 28 }: LogoProps) {
  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Defs>
            <SvgGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FF8F65" />
              <Stop offset="1" stopColor="#FF5722" />
            </SvgGradient>
            <SvgGradient id="flameGrad" x1="0.5" y1="1" x2="0.5" y2="0">
              <Stop offset="0" stopColor="#FF6B35" />
              <Stop offset="1" stopColor="#FFB627" />
            </SvgGradient>
          </Defs>

          {/* Background rounded square */}
          <Rect x="4" y="4" width="112" height="112" rx="28" fill="url(#bgGrad)" />

          {/* Subtle inner shadow */}
          <Rect x="4" y="4" width="112" height="112" rx="28" fill="rgba(0,0,0,0.06)" />
          <Rect x="5" y="5" width="110" height="110" rx="27" fill="url(#bgGrad)" />

          <G transform="translate(60, 62)">
            {/* Chef hat - three puffs */}
            <Circle cx="0" cy="-38" r="10" fill="white" />
            <Circle cx="-9" cy="-33" r="8" fill="white" />
            <Circle cx="9" cy="-33" r="8" fill="white" />
            {/* Hat band */}
            <Rect x="-12" y="-28" width="24" height="6" rx="2" fill="white" />

            {/* House roof */}
            <Path
              d="M0 -18 L-28 6 L-22 6 L-22 6 L22 6 L28 6 Z"
              fill="white"
            />

            {/* House body */}
            <Rect x="-22" y="6" width="44" height="30" rx="3" fill="white" />

            {/* Door */}
            <Rect x="-7" y="18" width="14" height="18" rx="7" fill="url(#bgGrad)" />

            {/* Flame inside door */}
            <Path
              d="M0 20 C-2 23 -5 25 -5 29 C-5 32 -3 34 0 34 C3 34 5 32 5 29 C5 25 2 23 0 20 Z"
              fill="url(#flameGrad)"
            />

            {/* Windows */}
            <Circle cx="-13" cy="14" r="4" fill="url(#bgGrad)" />
            <Circle cx="13" cy="14" r="4" fill="url(#bgGrad)" />

            {/* Window cross lines */}
            <Rect x="-13.5" y="12.5" width="1" height="3" fill="white" opacity="0.6" />
            <Rect x="-14.5" y="13.5" width="3" height="1" fill="white" opacity="0.6" />
            <Rect x="12.5" y="12.5" width="1" height="3" fill="white" opacity="0.6" />
            <Rect x="11.5" y="13.5" width="3" height="1" fill="white" opacity="0.6" />
          </G>
        </Svg>
      </View>

      {showText && (
        <View style={styles.textRow}>
          <Text style={[styles.brandGhar, { fontSize: textSize }]}>Ghar</Text>
          <Text style={[styles.brandKa, { fontSize: textSize * 0.85 }]}>Ka</Text>
          <Text style={[styles.brandChef, { fontSize: textSize }]}>Chef</Text>
        </View>
      )}
    </View>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <SvgGradient id="bgGrad2" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF8F65" />
            <Stop offset="1" stopColor="#FF5722" />
          </SvgGradient>
        </Defs>
        <Rect x="4" y="4" width="112" height="112" rx="28" fill="url(#bgGrad2)" />
        <Rect x="5" y="5" width="110" height="110" rx="27" fill="url(#bgGrad2)" />
        <G transform="translate(60, 62)">
          <Circle cx="0" cy="-38" r="10" fill="white" />
          <Circle cx="-9" cy="-33" r="8" fill="white" />
          <Circle cx="9" cy="-33" r="8" fill="white" />
          <Rect x="-12" y="-28" width="24" height="6" rx="2" fill="white" />
          <Path d="M0 -18 L-28 6 L22 6 L28 6 Z" fill="white" />
          <Rect x="-22" y="6" width="44" height="30" rx="3" fill="white" />
          <Rect x="-7" y="18" width="14" height="18" rx="7" fill="url(#bgGrad2)" />
          <Circle cx="-13" cy="14" r="4" fill="url(#bgGrad2)" />
          <Circle cx="13" cy="14" r="4" fill="url(#bgGrad2)" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  textRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  brandGhar: {
    fontWeight: '800',
    color: colors.text,
  },
  brandKa: {
    fontWeight: '400',
    color: colors.textLight,
    marginHorizontal: 2,
  },
  brandChef: {
    fontWeight: '800',
    color: colors.primary,
  },
});
