import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';

export function ProfileScreen({ navigation }: any) {
  const { state, dispatch } = useApp();
  const profile = state.userProfile;

  if (!profile) return null;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const isChef = profile.role === 'chef';

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <GlassCard style={styles.card}>
          <View style={styles.cardInner}>
            <View style={[styles.avatar, { backgroundColor: isChef ? 'rgba(46,196,182,0.15)' : 'rgba(255,107,53,0.15)' }]}>
              <Text style={{ fontSize: 32 }}>{isChef ? '🔥' : '👤'}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: isChef ? colors.secondary : colors.primary }]}>
              <Text style={styles.roleText}>{isChef ? 'Chef' : 'Customer'}</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.detailsInner}>
            <View style={styles.detailRow}>
              <Text style={{ fontSize: 16 }}>📞</Text>
              <View>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{profile.phone}</Text>
              </View>
            </View>

            {isChef && profile.cuisineType && (
              <View style={styles.detailRow}>
                <Text style={{ fontSize: 16 }}>🍽</Text>
                <View>
                  <Text style={styles.detailLabel}>Cuisine</Text>
                  <Text style={styles.detailValue}>{profile.cuisineType}</Text>
                </View>
              </View>
            )}

            {isChef && profile.kitchenDescription && (
              <View style={styles.detailRow}>
                <Text style={{ fontSize: 16 }}>🏠</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Kitchen</Text>
                  <Text style={styles.detailValue}>{profile.kitchenDescription}</Text>
                </View>
              </View>
            )}

            {!isChef && profile.dietaryPreferences && profile.dietaryPreferences.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={{ fontSize: 16 }}>🌿</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Dietary Preferences</Text>
                  <View style={styles.tagRow}>
                    {profile.dietaryPreferences.map((d) => (
                      <View key={d} style={styles.tag}>
                        <Text style={styles.tagText}>{d}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.statsInner}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{state.orders.length}</Text>
              <Text style={styles.statLabel}>{isChef ? 'Orders Received' : 'Orders Placed'}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{state.chefs.length}</Text>
              <Text style={styles.statLabel}>{isChef ? 'Total Chefs' : 'Chefs Available'}</Text>
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.lg },
  title: { ...typography.h1, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  cardInner: { padding: spacing.xl, alignItems: 'center' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: { ...typography.h2, marginBottom: spacing.sm },
  roleBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  roleText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  detailsInner: { padding: spacing.lg, gap: spacing.lg },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  detailLabel: { ...typography.caption, color: colors.textSecondary },
  detailValue: { ...typography.body, fontWeight: '500' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  tag: {
    backgroundColor: 'rgba(255,107,53,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  tagText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  statsInner: { flexDirection: 'row', padding: spacing.lg },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h1, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    marginTop: spacing.md,
  },
  logoutText: { ...typography.button, color: colors.danger },
});
