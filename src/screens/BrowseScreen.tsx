import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { Chef, VerifiedBadge } from '../types';

const ALL_BADGES: VerifiedBadge[] = ['Health Permit', 'Inspected Kitchen', 'Food Handler'];

export function BrowseScreen({ navigation }: any) {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [prepFilter, setPrepFilter] = useState<4 | 8 | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = state.chefs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.cuisine.toLowerCase().includes(q)
      );
    }
    if (prepFilter) {
      list = list.filter((c) => c.defaultPrepWindowHours === prepFilter);
    }
    if (verifiedOnly) {
      list = list.filter((c) => ALL_BADGES.every((b) => c.verifiedBadges.includes(b)));
    }
    if (onlineOnly) {
      list = list.filter((c) => c.isOnline);
    }
    return list;
  }, [state.chefs, search, prepFilter, verifiedOnly, onlineOnly]);

  const renderChef = ({ item }: { item: Chef }) => {
    const hasAllBadges = ALL_BADGES.every((b) => item.verifiedBadges.includes(b));
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ChefDetails', { chefId: item.id })}
      >
        <GlassCard style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.chefName}>{item.name}</Text>
              <View style={[styles.statusPill, item.isOnline ? styles.online : styles.offline]}>
                <Text style={[styles.statusText, item.isOnline && { color: colors.white }]}>
                  {item.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
            <Text style={styles.cuisine}>{item.cuisine}</Text>
            <View style={styles.cardMeta}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.distanceText}>{item.distanceKm} km</Text>
              <Text style={styles.prepText}>Ready in {item.defaultPrepWindowHours}h</Text>
              <Text style={styles.priceText}>{'$'.repeat(item.priceLevel)}</Text>
            </View>
            {hasAllBadges && (
              <View style={styles.badgeRow}>
                <Ionicons name="shield-checkmark" size={13} color={colors.success} />
                <Text style={styles.badgeText}>Fully Verified</Text>
              </View>
            )}
            {!hasAllBadges && item.verifiedBadges.length > 0 && (
              <View style={styles.badgeRow}>
                <Ionicons name="shield-half" size={13} color={colors.textLight} />
                <Text style={[styles.badgeText, { color: colors.textLight }]}>
                  {item.verifiedBadges.join(' · ')}
                </Text>
              </View>
            )}
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        renderItem={renderChef}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.demoBanner}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.demoText}>Demo only — mock data</Text>
            </View>

            <Text style={styles.title}>GharKaChef 🍛</Text>
            <Text style={styles.subtitle}>Ghar ka taste, freshly cooked today</Text>

            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color={colors.textLight} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search chef or cuisine..."
                placeholderTextColor={colors.textLight}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <View style={styles.filterRow}>
              <Chip
                label="4h Prep"
                active={prepFilter === 4}
                onPress={() => setPrepFilter(prepFilter === 4 ? null : 4)}
              />
              <Chip
                label="8h Prep"
                active={prepFilter === 8}
                onPress={() => setPrepFilter(prepFilter === 8 ? null : 8)}
              />
              <Chip
                label="Verified"
                active={verifiedOnly}
                onPress={() => setVerifiedOnly(!verifiedOnly)}
              />
              <Chip
                label="Online"
                active={onlineOnly}
                onPress={() => setOnlineOnly(!onlineOnly)}
              />
            </View>

            <Text style={styles.resultCount}>
              {filtered.length} verified local kitchen{filtered.length !== 1 ? 's' : ''}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="restaurant-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No chefs match your filters</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: 100 },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,53,0.08)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  demoText: { ...typography.caption, color: colors.primary },
  title: { ...typography.h1, marginBottom: spacing.xs },
  subtitle: { ...typography.bodySmall, marginBottom: spacing.lg },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    height: 44,
    ...typography.body,
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.chipBg,
  },
  chipActive: { backgroundColor: colors.chipActiveBg },
  chipLabel: { ...typography.caption, color: colors.chipText, fontWeight: '600' },
  chipLabelActive: { color: colors.chipActiveText },
  resultCount: { ...typography.bodySmall, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  cardImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  cardBody: { padding: spacing.md },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chefName: { ...typography.h3, flex: 1 },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  online: { backgroundColor: colors.online },
  offline: { backgroundColor: colors.offline },
  statusText: { ...typography.caption, color: colors.textSecondary },
  cuisine: { ...typography.bodySmall, marginBottom: spacing.sm },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { ...typography.bodySmall, fontWeight: '600', color: colors.text },
  distanceText: { ...typography.bodySmall },
  prepText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  priceText: { ...typography.bodySmall, color: colors.success },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: { ...typography.caption, color: colors.success },
  empty: { alignItems: 'center', paddingTop: 60, gap: spacing.md },
  emptyText: { ...typography.body, color: colors.textLight },
});
