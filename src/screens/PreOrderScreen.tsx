import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { LogoMark } from '../components/Logo';
import { Chef, PlannedMeal } from '../types';

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
      <Text style={styles.countdownText}>{timeLeft}</Text>
    </View>
  );
}

export function PreOrderScreen({ navigation }: any) {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);

  const cuisines = useMemo(() => {
    const set = new Set(state.chefs.map((c) => c.cuisine));
    return Array.from(set).sort();
  }, [state.chefs]);

  const matchesSearch = (name: string, cuisine: string, chefName?: string) => {
    const q = search.toLowerCase().trim();
    if (q && !name.toLowerCase().includes(q) && !cuisine.toLowerCase().includes(q) && !(chefName && chefName.toLowerCase().includes(q))) {
      return false;
    }
    if (cuisineFilter && cuisine !== cuisineFilter) return false;
    return true;
  };

  const allPlannedMeals = useMemo(() => {
    const meals: (PlannedMeal & { chefName: string; chefCuisine: string })[] = [];
    state.chefs.forEach((chef) => {
      (chef.plannedMeals || []).forEach((pm) => {
        meals.push({ ...pm, chefName: chef.name, chefCuisine: chef.cuisine });
      });
    });
    return meals.sort((a, b) => a.date.localeCompare(b.date));
  }, [state.chefs]);

  const filteredPlannedMeals = useMemo(() => {
    return allPlannedMeals.filter((m) => matchesSearch(m.name, m.chefCuisine, m.chefName));
  }, [allPlannedMeals, search, cuisineFilter]);

  const upcomingMeals = filteredPlannedMeals.filter((m) => !m.isLimitedDrop);
  const limitedDrops = filteredPlannedMeals.filter((m) => m.isLimitedDrop);

  const weeklyPlanChefs = useMemo(
    () => state.chefs.filter((c) => c.weeklyPlan && matchesSearch(c.name, c.cuisine)),
    [state.chefs, search, cuisineFilter]
  );

  const handlePreOrder = (meal: PlannedMeal & { chefName: string }) => {
    if (meal.currentOrders >= meal.maxOrders) {
      Platform.OS === 'web' ? alert('This meal is sold out!') : Alert.alert('Sold Out', 'This meal is fully booked!');
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
    Platform.OS === 'web'
      ? alert(`Pre-ordered ${meal.name}! Added to cart.`)
      : Alert.alert('Pre-ordered!', `${meal.name} added to your cart.`);
  };

  const handleSubscribe = (chef: Chef) => {
    dispatch({ type: 'SUBSCRIBE_WEEKLY', payload: { chefId: chef.id } });
    Platform.OS === 'web'
      ? alert(`Subscribed to ${chef.name}'s weekly plan! (Demo)`)
      : Alert.alert('Subscribed!', `You're now subscribed to ${chef.name}'s weekly plan. (Demo)`);
  };

  const hasContent = limitedDrops.length > 0 || upcomingMeals.length > 0 || weeklyPlanChefs.length > 0;

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <LogoMark size={36} />
          <View>
            <Text style={styles.title}>Pre-Order</Text>
            <Text style={styles.subtitle}>Plan ahead — order meals before they're cooked</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chef, cuisine, or meal..."
            placeholderTextColor={colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ fontSize: 16, color: colors.textLight }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cuisine Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cuisineScroll}>
          <TouchableOpacity
            style={[styles.cuisineChip, !cuisineFilter && styles.cuisineChipActive]}
            onPress={() => setCuisineFilter(null)}
          >
            <Text style={[styles.cuisineChipText, !cuisineFilter && styles.cuisineChipTextActive]}>All</Text>
          </TouchableOpacity>
          {cuisines.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.cuisineChip, cuisineFilter === c && styles.cuisineChipActive]}
              onPress={() => setCuisineFilter(cuisineFilter === c ? null : c)}
            >
              <Text style={[styles.cuisineChipText, cuisineFilter === c && styles.cuisineChipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Limited Drops */}
        {limitedDrops.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={{ fontSize: 16 }}>⚡</Text>
              <Text style={styles.sectionTitle}>Limited Drops</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
              {limitedDrops.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Home', { screen: 'ChefDetails', params: { chefId: meal.chefId } })}
                >
                  <GlassCard style={styles.dropCard}>
                    <Image source={{ uri: meal.image }} style={styles.dropImage} />
                    <View style={styles.dropOverlay}>
                      {meal.dropExpiresAt && <CountdownTimer expiresAt={meal.dropExpiresAt} />}
                      <View style={styles.spotsLeftBadge}>
                        <Text style={styles.spotsLeftText}>{meal.maxOrders - meal.currentOrders} spots left!</Text>
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
              <Text style={{ fontSize: 16 }}>📅</Text>
              <Text style={styles.sectionTitle}>Upcoming Meals</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
              {upcomingMeals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Home', { screen: 'ChefDetails', params: { chefId: meal.chefId } })}
                >
                  <GlassCard style={styles.mealCard}>
                    <Image source={{ uri: meal.image }} style={styles.mealImage} />
                    <View style={styles.mealBody}>
                      <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
                      <Text style={styles.mealChef}>{meal.chefName}</Text>
                      <View style={styles.mealMeta}>
                        <View style={styles.mealDateRow}>
                          <Text style={{ fontSize: 10 }}>📅</Text>
                          <Text style={styles.mealDate}>{formatDate(meal.date)}</Text>
                        </View>
                        <View style={styles.mealTimeRow}>
                          <Text style={{ fontSize: 10 }}>☀️</Text>
                          <Text style={styles.mealTime}>{meal.timeSlot === 'lunch' ? 'Lunch' : 'Dinner'}</Text>
                        </View>
                      </View>
                      <View style={styles.mealFooter}>
                        <Text style={styles.mealPrice}>${meal.price.toFixed(2)}</Text>
                        <Text style={styles.spotsText}>{meal.maxOrders - meal.currentOrders} spots left</Text>
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
              <Text style={{ fontSize: 16 }}>🔄</Text>
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
                    <Text style={styles.weeklyDesc} numberOfLines={2}>{c.weeklyPlan!.description}</Text>
                    <View style={styles.weeklyMeta}>
                      <Text style={styles.weeklyMeals}>{c.weeklyPlan!.mealsPerWeek} meals/week</Text>
                      <Text style={styles.weeklyPrice}>${c.weeklyPlan!.pricePerMeal}/meal</Text>
                    </View>
                    <View style={styles.weeklyDietaryRow}>
                      {c.weeklyPlan!.dietaryOptions.map((opt) => (
                        <View key={opt} style={styles.weeklyDietTag}>
                          <Text style={styles.weeklyDietText}>{opt}</Text>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.subscribeBtn} onPress={() => handleSubscribe(c)}>
                      <Text style={{ fontSize: 12 }}>📅</Text>
                      <Text style={styles.subscribeBtnText}>Subscribe</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))}
            </ScrollView>
          </View>
        )}

        {!hasContent && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📅</Text>
            <Text style={styles.emptyText}>No pre-order meals available</Text>
            <Text style={styles.emptySubtext}>Check back soon for upcoming meals from local chefs!</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: 100 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  title: { ...typography.h1, marginBottom: 2 },
  subtitle: { ...typography.bodySmall },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    height: 44,
    ...typography.body,
    color: colors.text,
  },

  cuisineScroll: { marginBottom: spacing.md, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
  cuisineChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cuisineChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  cuisineChipText: { ...typography.caption, color: colors.text, fontWeight: '600' },
  cuisineChipTextActive: { color: colors.white },

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

  empty: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textLight },
  emptySubtext: { ...typography.bodySmall, color: colors.textLight, textAlign: 'center' },
});
