import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { MenuItem, VerifiedBadge, PlannedMeal, MenuModifier } from '../types';
import { generatePickupSlots, formatPrice } from '../utils';

const BADGE_EMOJI: Record<VerifiedBadge, string> = {
  'Health Permit': '🏥',
  'Inspected Kitchen': '🏠',
  'Food Handler': '👤',
};

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

export function ChefDetailsScreen({ route, navigation }: any) {
  const { chefId } = route.params;
  const { state, dispatch } = useApp();
  const chef = state.chefs.find((c) => c.id === chefId)!;
  const [prepWindow, setPrepWindow] = useState<4 | 8>(chef.defaultPrepWindowHours);
  const pickupSlots = useMemo(() => generatePickupSlots(prepWindow), [prepWindow]);
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, { label: string; priceAdjustment: number }>>({});

  const cartForChef = state.cart.filter((c) => c.chefId === chefId);
  const cartCount = cartForChef.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = cartForChef.reduce((sum, c) => {
    const modExtra = (c.selectedModifiers || []).reduce((s, m) => s + m.priceAdjustment, 0);
    return sum + (c.menuItem.price + modExtra) * c.quantity;
  }, 0);

  const plannedMeals = chef.plannedMeals || [];
  const reviews = chef.reviews || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleAdd = (item: MenuItem) => {
    if (item.modifiers && item.modifiers.length > 0) {
      setSelectedItem(item);
      setSelectedModifiers({});
      setShowModifierModal(true);
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: { menuItem: item, chefId } });
    }
  };

  const handleAddWithModifiers = () => {
    if (!selectedItem) return;
    const mods = Object.entries(selectedModifiers).map(([modId, opt]) => ({
      modifierId: modId,
      optionLabel: opt.label,
      priceAdjustment: opt.priceAdjustment,
    }));
    dispatch({
      type: 'ADD_TO_CART',
      payload: { menuItem: selectedItem, chefId, selectedModifiers: mods },
    });
    setShowModifierModal(false);
    setSelectedItem(null);
    setSelectedModifiers({});
  };

  const handlePreOrder = (meal: PlannedMeal) => {
    if (meal.currentOrders >= meal.maxOrders) {
      if (Platform.OS === 'web') {
        alert('This meal is sold out!');
      } else {
        Alert.alert('Sold Out', 'This meal is fully booked!');
      }
      return;
    }
    dispatch({ type: 'PREORDER_MEAL', payload: { mealId: meal.id, chefId } });
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
        chefId,
        isPreOrder: true,
      },
    });
    if (Platform.OS === 'web') {
      alert(`Pre-ordered ${meal.name}! Added to cart.`);
    } else {
      Alert.alert('Pre-ordered!', `${meal.name} added to your cart.`);
    }
  };

  const handleSubscribe = () => {
    dispatch({ type: 'SUBSCRIBE_WEEKLY', payload: { chefId } });
    if (Platform.OS === 'web') {
      alert(`Subscribed to ${chef.name}'s weekly plan! (Demo)`);
    } else {
      Alert.alert('Subscribed!', `You're now subscribed to ${chef.name}'s weekly plan. (Demo)`);
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const inCart = state.cart.find((c) => c.menuItem.id === item.id);
    const hasModifiers = item.modifiers && item.modifiers.length > 0;
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
            <View style={styles.priceRow}>
              <Text style={styles.menuPrice}>{formatPrice(item.price)}</Text>
              {hasModifiers && (
                <View style={styles.customizableBadge}>
                  <Text style={{ fontSize: 9 }}>⚙️</Text>
                  <Text style={styles.customizableText}>Customizable</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, inCart && styles.addBtnActive]}
            onPress={() => handleAdd(item)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16, color: inCart ? colors.white : colors.primary, fontWeight: '700' }}>+</Text>
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
                  <Text style={{ fontSize: 14 }}>⭐</Text>
                  <Text style={styles.metaText}>{chef.rating}</Text>
                  {reviews.length > 0 && (
                    <Text style={styles.reviewCount}>({reviews.length})</Text>
                  )}
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
                    <Text style={{ fontSize: 11 }}>{BADGE_EMOJI[b]}</Text>
                    <Text style={styles.badgeText}>{b}</Text>
                  </View>
                ))}
              </View>

              {!chef.isOnline && (
                <View style={styles.offlineBanner}>
                  <Text style={{ fontSize: 14 }}>🌙</Text>
                  <Text style={styles.offlineBannerText}>This chef is currently offline</Text>
                </View>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <View style={styles.reviewsSection}>
                  <View style={styles.reviewsHeader}>
                    <Text style={{ fontSize: 14 }}>⭐</Text>
                    <Text style={styles.reviewsTitle}>{avgRating} · {reviews.length} Reviews</Text>
                  </View>
                  {reviews.slice(0, 3).map((r) => (
                    <View key={r.id} style={styles.reviewItem}>
                      <View style={styles.reviewItemHeader}>
                        <Text style={styles.reviewAuthor}>{r.customerName}</Text>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Text key={s} style={{ fontSize: 10, color: colors.warning }}>
                              {s <= r.rating ? '⭐' : '☆'}
                            </Text>
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewText}>{r.text}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Planned Meals */}
              {plannedMeals.length > 0 && (
                <View style={styles.plannedSection}>
                  <Text style={styles.sectionTitle}>Upcoming Meals</Text>
                  {plannedMeals.map((pm) => (
                    <GlassCard key={pm.id} style={styles.plannedCard}>
                      <View style={styles.plannedRow}>
                        <Image source={{ uri: pm.image }} style={styles.plannedImage} />
                        <View style={styles.plannedInfo}>
                          <Text style={styles.plannedName}>{pm.name}</Text>
                          <Text style={styles.plannedDesc} numberOfLines={2}>{pm.description}</Text>
                          <View style={styles.plannedMeta}>
                            <Text style={styles.plannedDate}>
                              {formatDate(pm.date)} · {pm.timeSlot === 'lunch' ? 'Lunch' : 'Dinner'}
                            </Text>
                            <Text style={styles.plannedSpots}>
                              {pm.maxOrders - pm.currentOrders} spots left
                            </Text>
                          </View>
                          <View style={styles.plannedFooter}>
                            <Text style={styles.plannedPrice}>${pm.price.toFixed(2)}</Text>
                            <TouchableOpacity
                              style={[styles.preorderBtn, pm.currentOrders >= pm.maxOrders && styles.preorderBtnSoldOut]}
                              onPress={() => handlePreOrder(pm)}
                            >
                              <Text style={{ fontSize: 11 }}>🛒</Text>
                              <Text style={styles.preorderBtnText}>
                                {pm.currentOrders >= pm.maxOrders ? 'Sold Out' : 'Pre-order'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          {pm.isLimitedDrop && (
                            <View style={styles.limitedBadge}>
                              <Text style={{ fontSize: 9 }}>⚡</Text>
                              <Text style={styles.limitedBadgeText}>Limited Drop</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </GlassCard>
                  ))}
                </View>
              )}

              {/* Weekly Plan */}
              {chef.weeklyPlan && (
                <View style={styles.weeklySection}>
                  <Text style={styles.sectionTitle}>Weekly Meal Plan</Text>
                  <GlassCard style={styles.weeklyPlanCard}>
                    <View style={styles.weeklyPlanInner}>
                      <View style={styles.weeklyPlanHeader}>
                        <Text style={{ fontSize: 18 }}>📅</Text>
                        <Text style={styles.weeklyPlanTitle}>{chef.weeklyPlan.description}</Text>
                      </View>
                      <View style={styles.weeklyPlanMeta}>
                        <View style={styles.weeklyPlanStat}>
                          <Text style={styles.weeklyStatValue}>{chef.weeklyPlan.mealsPerWeek}</Text>
                          <Text style={styles.weeklyStatLabel}>meals/week</Text>
                        </View>
                        <View style={styles.weeklyPlanStat}>
                          <Text style={styles.weeklyStatValue}>${chef.weeklyPlan.pricePerMeal}</Text>
                          <Text style={styles.weeklyStatLabel}>per meal</Text>
                        </View>
                        <View style={styles.weeklyPlanStat}>
                          <Text style={styles.weeklyStatValue}>
                            ${(chef.weeklyPlan.mealsPerWeek * chef.weeklyPlan.pricePerMeal).toFixed(0)}
                          </Text>
                          <Text style={styles.weeklyStatLabel}>per week</Text>
                        </View>
                      </View>
                      <View style={styles.dietaryRow}>
                        {chef.weeklyPlan.dietaryOptions.map((opt) => (
                          <View key={opt} style={styles.dietaryTag}>
                            <Text style={styles.dietaryTagText}>{opt}</Text>
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
                        <Text style={{ fontSize: 14 }}>📅</Text>
                        <Text style={styles.subscribeBtnText}>Subscribe to Weekly Plan</Text>
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                </View>
              )}

              <Text style={styles.sectionTitle}>Prep Window</Text>
              <View style={styles.segmented}>
                <TouchableOpacity
                  style={[styles.segBtn, prepWindow === 4 && styles.segBtnActive]}
                  onPress={() => setPrepWindow(4)}
                >
                  <Text style={[styles.segText, prepWindow === 4 && styles.segTextActive]}>4 Hours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segBtn, prepWindow === 8 && styles.segBtnActive]}
                  onPress={() => setPrepWindow(8)}
                >
                  <Text style={[styles.segText, prepWindow === 8 && styles.segTextActive]}>8 Hours</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Available Pickup Slots</Text>
              <View style={styles.slotsRow}>
                {pickupSlots.map((slot) => (
                  <View key={slot.label} style={styles.slotChip}>
                    <Text style={{ fontSize: 10 }}>⏰</Text>
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
              <Text style={{ color: colors.white, fontSize: 14 }}>→</Text>
            </View>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* Modifier Modal */}
      <Modal visible={showModifierModal} animationType="slide" transparent>
        <View style={styles.modModalOverlay}>
          <View style={styles.modModalContent}>
            <View style={styles.modModalHeader}>
              <Text style={styles.modModalTitle}>Customize Your Order</Text>
              <TouchableOpacity onPress={() => setShowModifierModal(false)}>
                <Text style={{ fontSize: 22, color: colors.text }}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedItem && (
              <ScrollView>
                <Text style={styles.modItemName}>{selectedItem.name}</Text>
                <Text style={styles.modItemPrice}>Base: {formatPrice(selectedItem.price)}</Text>

                {(selectedItem.modifiers || []).map((mod) => (
                  <View key={mod.id} style={styles.modGroup}>
                    <Text style={styles.modGroupTitle}>{mod.name}</Text>
                    {mod.options.map((opt) => {
                      const isSelected = selectedModifiers[mod.id]?.label === opt.label;
                      return (
                        <TouchableOpacity
                          key={opt.label}
                          style={[styles.modOption, isSelected && styles.modOptionSelected]}
                          onPress={() => setSelectedModifiers({
                            ...selectedModifiers,
                            [mod.id]: { label: opt.label, priceAdjustment: opt.priceAdjustment },
                          })}
                        >
                          <View style={styles.modOptionLeft}>
                            <View style={[styles.modRadio, isSelected && styles.modRadioSelected]}>
                              {isSelected && <View style={styles.modRadioDot} />}
                            </View>
                            <Text style={[styles.modOptionText, isSelected && styles.modOptionTextSelected]}>
                              {opt.label}
                            </Text>
                          </View>
                          {opt.priceAdjustment > 0 && (
                            <Text style={styles.modOptionPrice}>+{formatPrice(opt.priceAdjustment)}</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}

                <TouchableOpacity style={styles.modAddBtn} onPress={handleAddWithModifiers}>
                  <Text style={{ fontSize: 16 }}>🛒</Text>
                  <Text style={styles.modAddBtnText}>
                    Add to Cart · {formatPrice(
                      (selectedItem?.price || 0) +
                      Object.values(selectedModifiers).reduce((s, m) => s + m.priceAdjustment, 0)
                    )}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  reviewCount: { ...typography.caption, color: colors.textSecondary },
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

  reviewsSection: { marginBottom: spacing.md },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  reviewsTitle: { ...typography.h3 },
  reviewItem: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  reviewItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  reviewAuthor: { ...typography.caption, fontWeight: '700', color: colors.text },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewText: { ...typography.caption, color: colors.textSecondary },

  plannedSection: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm, marginTop: spacing.sm },
  plannedCard: { marginBottom: spacing.sm },
  plannedRow: { flexDirection: 'row', padding: spacing.sm },
  plannedImage: { width: 80, height: 80, borderRadius: radius.md },
  plannedInfo: { flex: 1, marginLeft: spacing.sm },
  plannedName: { ...typography.body, fontWeight: '700', fontSize: 13 },
  plannedDesc: { ...typography.caption, color: colors.textSecondary, marginVertical: 2 },
  plannedMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  plannedDate: { ...typography.caption, color: colors.primary, fontWeight: '600', fontSize: 11 },
  plannedSpots: { ...typography.caption, color: colors.success, fontWeight: '600', fontSize: 11 },
  plannedFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  plannedPrice: { ...typography.body, fontWeight: '700', color: colors.primary },
  preorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  preorderBtnSoldOut: { backgroundColor: colors.textLight },
  preorderBtnText: { ...typography.caption, color: colors.white, fontWeight: '700', fontSize: 11 },
  limitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  limitedBadgeText: { ...typography.caption, color: colors.white, fontWeight: '700', fontSize: 9 },

  weeklySection: { marginBottom: spacing.md },
  weeklyPlanCard: {},
  weeklyPlanInner: { padding: spacing.md },
  weeklyPlanHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  weeklyPlanTitle: { ...typography.body, fontWeight: '600', flex: 1 },
  weeklyPlanMeta: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md },
  weeklyPlanStat: { alignItems: 'center' },
  weeklyStatValue: { ...typography.h3, color: colors.primary },
  weeklyStatLabel: { ...typography.caption, color: colors.textSecondary },
  dietaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  dietaryTag: {
    backgroundColor: 'rgba(46,196,182,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  dietaryTagText: { ...typography.caption, color: colors.success, fontWeight: '600' },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  subscribeBtnText: { ...typography.button, color: colors.white, fontSize: 14 },

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
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  menuPrice: { ...typography.body, fontWeight: '700', color: colors.primary },
  customizableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(46,196,182,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  customizableText: { ...typography.caption, color: colors.secondary, fontWeight: '600', fontSize: 10 },
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

  modModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modModalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modModalTitle: { ...typography.h2 },
  modItemName: { ...typography.h3, marginBottom: spacing.xs },
  modItemPrice: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  modGroup: { marginBottom: spacing.md },
  modGroupTitle: { ...typography.body, fontWeight: '700', marginBottom: spacing.sm },
  modOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  modOptionSelected: { backgroundColor: 'rgba(255,107,53,0.08)' },
  modOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  modRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modRadioSelected: { borderColor: colors.primary },
  modRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  modOptionText: { ...typography.body },
  modOptionTextSelected: { fontWeight: '600', color: colors.primary },
  modOptionPrice: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  modAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  modAddBtnText: { ...typography.button, color: colors.white },
});
