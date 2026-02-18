import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { Chef, VerifiedBadge, PlannedMeal } from '../types';

const ALL_BADGES: VerifiedBadge[] = ['Health Permit', 'Inspected Kitchen', 'Food Handler'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const mealDate = new Date(dateStr + 'T00:00:00');
  if (mealDate.getTime() === today.getTime()) return 'Today';
  if (mealDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      const diff = expires - now;
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${mins}m left`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <View style={styles.countdownBadge}>
      <Ionicons name="time" size={10} color={colors.white} />
      <Text style={styles.countdownText}>{timeLeft}</Text>
    </View>
  );
}

export function BrowseScreen({ navigation }: any) {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [prepFilter, setPrepFilter] = useState<4 | 8 | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);

  // Gather all planned meals from all chefs
  const allPlannedMeals = useMemo(() => {
    const meals: (PlannedMeal & { chefName: string })[] = [];
    state.chefs.forEach((chef) => {
      (chef.plannedMeals || []).forEach((pm) => {
        meals.push({ ...pm, chefName: chef.name });
      });
    });
    return meals.sort((a, b) => a.date.localeCompare(b.date));
  }, [state.chefs]);

  const upcomingMeals = allPlannedMeals.filter((m) => !m.isLimitedDrop);
  const limitedDrops = allPlannedMeals.filter((m) => m.isLimitedDrop);

  // Chefs with weekly plans
  const weeklyPlanChefs = useMemo(
    () => state.chefs.filter((c) => c.weeklyPlan),
    [state.chefs]
  );

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

  const handlePreOrder = (meal: PlannedMeal & { chefName: string }) => {
    if (meal.currentOrders >= meal.maxOrders) {
      if (Platform.OS === 'web') {
        alert('This meal is sold out!');
      } else {
        Alert.alert('Sold Out', 'This meal is fully booked!');
      }
      return;
    }
    dispatch({ type: 'PREORDER_MEAL', payload: { mealId: meal.id, chefId: meal.chefId } });
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        menuItem: {
          id: meal.id,
          name: `${meal.name} (Pre-order)`,
          price: meal.price,
          description: `${formatDate(meal.date)} · ${meal.timeSlot === 'lunch' ? 'Lunch' : 'Dinner'}`,
          allergens: meal.allergens,
          isVeg: meal.isVegetarian,
        },
        chefId: meal.chefId,
        isPreOrder: true,
      },
    });
    if (Platform.OS === 'web') {
      alert(`Pre-ordered ${meal.name}! Added to cart.`);
    } else {
      Alert.alert('Pre-ordered!', `${meal.name} added to your cart.`);
    }
  };

  const handleSubscribe = (chef: Chef) => {
    dispatch({ type: 'SUBSCRIBE_WEEKLY', payload: { chefId: chef.id } });
    if (Platform.OS === 'web') {
      alert(`Subscribed to ${chef.name}'s weekly plan! (Demo)`);
    } else {
      Alert.alert('Subscribed!', `You're now subscribed to ${chef.name}'s weekly plan. (Demo)`);
    }
  };

  const renderChef = ({ item }: { item: Chef }) => {
    const hasAllBadges = ALL_BADGES.every((b) => item.verifiedBadges.includes(b));
    const reviewCount = (item.reviews || []).length;
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
                {reviewCount > 0 && (
                  <Text style={styles.reviewCountText}>({reviewCount})</Text>
                )}
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
            {item.weeklyPlan && (
              <View style={styles.weeklyBadge}>
                <Ionicons name="calendar" size={12} color={colors.secondary} />
                <Text style={styles.weeklyBadgeText}>Weekly Plan Available</Text>
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

            <Text style={styles.title}>GharKaChef</Text>
            <Text style={styles.subtitle}>Ghar ka taste, freshly cooked today</Text>

            {/* Limited Drops */}
            {limitedDrops.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="flash" size={18} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Limited Drops</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                  {limitedDrops.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('ChefDetails', { chefId: meal.chefId })}
                    >
                      <GlassCard style={styles.dropCard}>
                        <Image source={{ uri: meal.image }} style={styles.dropImage} />
                        <View style={styles.dropOverlay}>
                          {meal.dropExpiresAt && <CountdownTimer expiresAt={meal.dropExpiresAt} />}
                          <View style={styles.spotsLeftBadge}>
                            <Text style={styles.spotsLeftText}>
                              {meal.maxOrders - meal.currentOrders} spots left!
                            </Text>
                          </View>
                        </View>
                        <View style={styles.dropBody}>
                          <Text style={styles.dropMealName} numberOfLines={1}>{meal.name}</Text>
                          <Text style={styles.dropChefName}>{meal.chefName}</Text>
                          <View style={styles.dropMeta}>
                            <Text style={styles.dropDate}>{formatDate(meal.date)}</Text>
                            <Text style={styles.dropPrice}>${meal.price.toFixed(2)}</Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.preorderBtn, meal.currentOrders >= meal.maxOrders && styles.preorderBtnSoldOut]}
                            onPress={() => handlePreOrder(meal)}
                          >
                            <Text style={styles.preorderBtnText}>
                              {meal.currentOrders >= meal.maxOrders ? 'Sold Out' : 'Pre-order'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Upcoming Meals */}
            {upcomingMeals.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Upcoming Meals</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                  {upcomingMeals.map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('ChefDetails', { chefId: meal.chefId })}
                    >
                      <GlassCard style={styles.mealCard}>
                        <Image source={{ uri: meal.image }} style={styles.mealImage} />
                        <View style={styles.mealBody}>
                          <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
                          <Text style={styles.mealChef}>{meal.chefName}</Text>
                          <View style={styles.mealMeta}>
                            <View style={styles.mealDateRow}>
                              <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                              <Text style={styles.mealDate}>{formatDate(meal.date)}</Text>
                            </View>
                            <View style={styles.mealTimeRow}>
                              <Ionicons name="sunny-outline" size={12} color={colors.textSecondary} />
                              <Text style={styles.mealTime}>{meal.timeSlot === 'lunch' ? 'Lunch' : 'Dinner'}</Text>
                            </View>
                          </View>
                          <View style={styles.mealFooter}>
                            <Text style={styles.mealPrice}>${meal.price.toFixed(2)}</Text>
                            <Text style={styles.spotsText}>
                              {meal.maxOrders - meal.currentOrders} spots left
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.preorderSmallBtn, meal.currentOrders >= meal.maxOrders && styles.preorderBtnSoldOut]}
                            onPress={() => handlePreOrder(meal)}
                          >
                            <Text style={styles.preorderSmallText}>
                              {meal.currentOrders >= meal.maxOrders ? 'Sold Out' : 'Pre-order'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Weekly Plans */}
            {weeklyPlanChefs.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="repeat" size={18} color={colors.secondary} />
                  <Text style={styles.sectionTitle}>Weekly Meal Plans</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                  {weeklyPlanChefs.map((c) => (
                    <GlassCard key={c.id} style={styles.weeklyCard}>
                      <View style={styles.weeklyBody}>
                        <View style={styles.weeklyChefRow}>
                          <Image source={{ uri: c.imageUrl }} style={styles.weeklyAvatar} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.weeklyChefName}>{c.name}</Text>
                            <Text style={styles.weeklyCuisine}>{c.cuisine}</Text>
                          </View>
                        </View>
                        <Text style={styles.weeklyDesc} numberOfLines={2}>
                          {c.weeklyPlan!.description}
                        </Text>
                        <View style={styles.weeklyMeta}>
                          <Text style={styles.weeklyMeals}>
                            {c.weeklyPlan!.mealsPerWeek} meals/week
                          </Text>
                          <Text style={styles.weeklyPrice}>
                            ${c.weeklyPlan!.pricePerMeal}/meal
                          </Text>
                        </View>
                        <View style={styles.weeklyDietaryRow}>
                          {c.weeklyPlan!.dietaryOptions.map((opt) => (
                            <View key={opt} style={styles.weeklyDietTag}>
                              <Text style={styles.weeklyDietText}>{opt}</Text>
                            </View>
                          ))}
                        </View>
                        <TouchableOpacity
                          style={styles.subscribeBtn}
                          onPress={() => handleSubscribe(c)}
                        >
                          <Ionicons name="calendar" size={14} color={colors.white} />
                          <Text style={styles.subscribeBtnText}>Subscribe</Text>
                        </TouchableOpacity>
                      </View>
                    </GlassCard>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Search & Filters */}
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
              <Chip label="4h Prep" active={prepFilter === 4} onPress={() => setPrepFilter(prepFilter === 4 ? null : 4)} />
              <Chip label="8h Prep" active={prepFilter === 8} onPress={() => setPrepFilter(prepFilter === 8 ? null : 8)} />
              <Chip label="Verified" active={verifiedOnly} onPress={() => setVerifiedOnly(!verifiedOnly)} />
              <Chip label="Online" active={onlineOnly} onPress={() => setOnlineOnly(!onlineOnly)} />
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

  // Section headers
  sectionContainer: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  sectionTitle: { ...typography.h3 },
  carousel: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },

  // Limited Drops
  dropCard: { width: 220, marginRight: spacing.md },
  dropImage: { width: '100%', height: 110, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  dropOverlay: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(231,29,54,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  countdownText: { ...typography.caption, color: colors.white, fontWeight: '700', fontSize: 10 },
  spotsLeftBadge: {
    backgroundColor: 'rgba(255,107,53,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  spotsLeftText: { ...typography.caption, color: colors.white, fontWeight: '700', fontSize: 10 },
  dropBody: { padding: spacing.sm },
  dropMealName: { ...typography.body, fontWeight: '700', fontSize: 13 },
  dropChefName: { ...typography.caption, color: colors.textSecondary },
  dropMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  dropDate: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  dropPrice: { ...typography.body, fontWeight: '700', color: colors.primary, fontSize: 14 },
  preorderBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  preorderBtnSoldOut: { backgroundColor: colors.textLight },
  preorderBtnText: { ...typography.caption, color: colors.white, fontWeight: '700' },

  // Upcoming Meals
  mealCard: { width: 200, marginRight: spacing.md },
  mealImage: { width: '100%', height: 100, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  mealBody: { padding: spacing.sm },
  mealName: { ...typography.body, fontWeight: '700', fontSize: 13 },
  mealChef: { ...typography.caption, color: colors.textSecondary },
  mealMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  mealDateRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  mealDate: { ...typography.caption, color: colors.textSecondary, fontSize: 11 },
  mealTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  mealTime: { ...typography.caption, color: colors.textSecondary, fontSize: 11 },
  mealFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  mealPrice: { ...typography.body, fontWeight: '700', color: colors.primary, fontSize: 14 },
  spotsText: { ...typography.caption, color: colors.success, fontWeight: '600', fontSize: 10 },
  preorderSmallBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  preorderSmallText: { ...typography.caption, color: colors.white, fontWeight: '700', fontSize: 11 },

  // Weekly Plans
  weeklyCard: { width: 250, marginRight: spacing.md },
  weeklyBody: { padding: spacing.md },
  weeklyChefRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  weeklyAvatar: { width: 36, height: 36, borderRadius: 18 },
  weeklyChefName: { ...typography.body, fontWeight: '700', fontSize: 13 },
  weeklyCuisine: { ...typography.caption, color: colors.textSecondary },
  weeklyDesc: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  weeklyMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  weeklyMeals: { ...typography.caption, fontWeight: '600', color: colors.text },
  weeklyPrice: { ...typography.caption, fontWeight: '700', color: colors.primary },
  weeklyDietaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: spacing.sm },
  weeklyDietTag: {
    backgroundColor: 'rgba(46,196,182,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  weeklyDietText: { ...typography.caption, color: colors.success, fontSize: 10 },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.secondary,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  subscribeBtnText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  weeklyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  weeklyBadgeText: { ...typography.caption, color: colors.secondary, fontWeight: '600' },

  // Search & Filters
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

  // Chef Cards
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
  reviewCountText: { ...typography.caption, color: colors.textSecondary },
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
