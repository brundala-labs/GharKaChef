import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { MenuItem, VerifiedBadge } from '../types';
import { generatePickupSlots, formatPrice } from '../utils';

const BADGE_ICONS: Record<VerifiedBadge, string> = {
  'Health Permit': 'medkit',
  'Inspected Kitchen': 'home',
  'Food Handler': 'person',
};

export function ChefDetailsScreen({ route, navigation }: any) {
  const { chefId } = route.params;
  const { state, dispatch } = useApp();
  const chef = state.chefs.find((c) => c.id === chefId)!;
  const [prepWindow, setPrepWindow] = useState<4 | 8>(chef.defaultPrepWindowHours);
  const pickupSlots = useMemo(() => generatePickupSlots(prepWindow), [prepWindow]);

  const cartForChef = state.cart.filter((c) => c.chefId === chefId);
  const cartCount = cartForChef.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = cartForChef.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);

  const handleAdd = (item: MenuItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: { menuItem: item, chefId } });
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const inCart = state.cart.find((c) => c.menuItem.id === item.id);
    return (
      <GlassCard style={styles.menuCard}>
        <View style={styles.menuRow}>
          <View style={styles.menuInfo}>
            <View style={styles.menuNameRow}>
              <View style={[styles.vegDot, { backgroundColor: item.isVeg ? colors.vegGreen : colors.nonVegRed }]} />
              <Text style={styles.menuName}>{item.name}</Text>
            </View>
            <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
            {item.allergens.length > 0 && (
              <View style={styles.allergenRow}>
                {item.allergens.map((a) => (
                  <View key={a} style={styles.allergenTag}>
                    <Text style={styles.allergenText}>{a}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.menuPrice}>{formatPrice(item.price)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, inCart && styles.addBtnActive]}
            onPress={() => handleAdd(item)}
            activeOpacity={0.7}
          >
            <Ionicons name={inCart ? 'add' : 'add'} size={20} color={inCart ? colors.white : colors.primary} />
            {inCart && <Text style={styles.addBtnCount}>{inCart.quantity}</Text>}
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  };

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <FlatList
        data={chef.menuItems}
        keyExtractor={(m) => m.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Image source={{ uri: chef.imageUrl }} style={styles.heroImage} />
            <View style={styles.headerContent}>
              <Text style={styles.chefName}>{chef.name}</Text>
              <Text style={styles.cuisine}>{chef.cuisine}</Text>

              <View style={styles.metaRow}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color={colors.warning} />
                  <Text style={styles.metaText}>{chef.rating}</Text>
                </View>
                <Text style={styles.metaText}>{chef.distanceKm} km</Text>
                <View style={[styles.statusPill, chef.isOnline ? styles.online : styles.offline]}>
                  <Text style={[styles.statusText, chef.isOnline && { color: colors.white }]}>
                    {chef.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
                <Text style={styles.metaText}>Capacity: {chef.dailyCapacity}</Text>
              </View>

              <View style={styles.badgeRow}>
                {chef.verifiedBadges.map((b) => (
                  <View key={b} style={styles.badge}>
                    <Ionicons name={BADGE_ICONS[b] as any} size={12} color={colors.success} />
                    <Text style={styles.badgeText}>{b}</Text>
                  </View>
                ))}
              </View>

              {!chef.isOnline && (
                <View style={styles.offlineBanner}>
                  <Ionicons name="moon-outline" size={16} color={colors.danger} />
                  <Text style={styles.offlineBannerText}>
                    This chef is currently offline
                  </Text>
                </View>
              )}

              <Text style={styles.sectionTitle}>Prep Window</Text>
              <View style={styles.segmented}>
                <TouchableOpacity
                  style={[styles.segBtn, prepWindow === 4 && styles.segBtnActive]}
                  onPress={() => setPrepWindow(4)}
                >
                  <Text style={[styles.segText, prepWindow === 4 && styles.segTextActive]}>
                    4 Hours
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segBtn, prepWindow === 8 && styles.segBtnActive]}
                  onPress={() => setPrepWindow(8)}
                >
                  <Text style={[styles.segText, prepWindow === 8 && styles.segTextActive]}>
                    8 Hours
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Available Pickup Slots</Text>
              <View style={styles.slotsRow}>
                {pickupSlots.map((slot) => (
                  <View key={slot.label} style={styles.slotChip}>
                    <Ionicons name="time-outline" size={12} color={colors.primary} />
                    <Text style={styles.slotText}>{slot.label}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Menu</Text>
            </View>
          </View>
        }
      />

      {cartCount > 0 && (
        <GlassCard style={styles.footer}>
          <TouchableOpacity
            style={styles.footerInner}
            onPress={() => navigation.navigate('Cart', { chefId, prepWindow })}
            activeOpacity={0.8}
          >
            <View style={styles.footerLeft}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
              <Text style={styles.footerText}>
                {cartCount} item{cartCount !== 1 ? 's' : ''} · {formatPrice(cartTotal)}
              </Text>
            </View>
            <View style={styles.footerBtn}>
              <Text style={styles.footerBtnText}>Go to Cart</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </View>
          </TouchableOpacity>
        </GlassCard>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingBottom: 120 },
  heroImage: { width: '100%', height: 200 },
  headerContent: { padding: spacing.lg },
  chefName: { ...typography.h1, marginBottom: spacing.xs },
  cuisine: { ...typography.bodySmall, marginBottom: spacing.md },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { ...typography.bodySmall, fontWeight: '500' },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  online: { backgroundColor: colors.online },
  offline: { backgroundColor: colors.offline },
  statusText: { ...typography.caption, color: colors.textSecondary },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(46,196,182,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: { ...typography.caption, color: colors.success },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(231,29,54,0.08)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  offlineBannerText: { ...typography.bodySmall, color: colors.danger },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm, marginTop: spacing.sm },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  segBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segBtnActive: { backgroundColor: colors.primary },
  segText: { ...typography.body, fontWeight: '600', color: colors.textSecondary },
  segTextActive: { color: colors.white },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.chipBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  slotText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  menuCard: { marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  menuRow: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  menuInfo: { flex: 1, marginRight: spacing.md },
  menuNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  menuName: { ...typography.body, fontWeight: '600', flex: 1 },
  menuDesc: { ...typography.bodySmall, marginBottom: spacing.sm },
  allergenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: spacing.sm },
  allergenTag: {
    backgroundColor: colors.allergenBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  allergenText: { ...typography.caption, color: colors.allergenText, fontSize: 10 },
  menuPrice: { ...typography.body, fontWeight: '700', color: colors.primary },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  addBtnActive: { backgroundColor: colors.primary },
  addBtnCount: { ...typography.caption, color: colors.white, fontWeight: '700' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: spacing.lg,
    right: spacing.lg,
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cartBadge: {
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  footerText: { ...typography.body, fontWeight: '600' },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  footerBtnText: { ...typography.button, color: colors.white },
});
