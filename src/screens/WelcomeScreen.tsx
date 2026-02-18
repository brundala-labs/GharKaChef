import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';

export function WelcomeScreen({ navigation }: any) {
  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.branding}>
          <Text style={styles.logo}>GharKaChef</Text>
          <Text style={styles.tagline}>Ghar ka taste, freshly cooked today</Text>
          <Text style={styles.description}>
            Connecting verified home chefs with food lovers across Canada
          </Text>
        </View>

        <View style={styles.cards}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CustomerSignup')}
          >
            <GlassCard style={styles.roleCard}>
              <View style={styles.roleContent}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,107,53,0.15)' }]}>
                  <Ionicons name="restaurant" size={32} color={colors.primary} />
                </View>
                <Text style={styles.roleTitle}>Order Food</Text>
                <Text style={styles.roleDesc}>
                  Browse home-cooked meals from verified local chefs
                </Text>
                <View style={styles.roleBtn}>
                  <Text style={styles.roleBtnText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.white} />
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ChefSignup')}
          >
            <GlassCard style={styles.roleCard}>
              <View style={styles.roleContent}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(46,196,182,0.15)' }]}>
                  <Ionicons name="flame" size={32} color={colors.secondary} />
                </View>
                <Text style={styles.roleTitle}>I'm a Chef</Text>
                <Text style={styles.roleDesc}>
                  Start selling your home-cooked meals to your community
                </Text>
                <View style={[styles.roleBtn, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.roleBtnText}>Start Selling</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.white} />
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        <View style={styles.demoBanner}>
          <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
          <Text style={styles.demoText}>Demo app — no real transactions</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  branding: { alignItems: 'center', marginBottom: spacing.xxxl },
  logo: { fontSize: 34, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  tagline: { ...typography.h3, color: colors.primary, marginBottom: spacing.sm },
  description: { ...typography.bodySmall, textAlign: 'center', paddingHorizontal: spacing.xl },
  cards: { gap: spacing.lg },
  roleCard: {},
  roleContent: { padding: spacing.xl, alignItems: 'center' },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  roleTitle: { ...typography.h2, marginBottom: spacing.xs },
  roleDesc: { ...typography.bodySmall, textAlign: 'center', marginBottom: spacing.lg },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  roleBtnText: { ...typography.button, color: colors.white },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxxl,
  },
  demoText: { ...typography.caption, color: colors.primary },
});
