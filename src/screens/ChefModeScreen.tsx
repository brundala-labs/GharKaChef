import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { Order, OrderStatus, PlannedMeal } from '../types';

const STATUS_FLOW: Record<string, OrderStatus> = {
  placed: 'accepted',
  accepted: 'cooking',
  cooking: 'ready',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'New Order',
  accepted: 'Accepted',
  cooking: 'Cooking',
  ready: 'Ready for Pickup',
  declined: 'Declined',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  placed: colors.warning,
  accepted: colors.secondary,
  cooking: colors.primary,
  ready: colors.success,
  declined: colors.danger,
};

const NEXT_ACTION: Record<string, string> = {
  placed: 'Accept',
  accepted: 'Start Cooking',
  cooking: 'Mark Ready',
};

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

export function ChefModeScreen() {
  const { state, dispatch } = useApp();
  const [selectedChefId, setSelectedChefId] = useState(state.chefs[0]?.id || '');
  const [showChefPicker, setShowChefPicker] = useState(false);
  const [showPlanMealModal, setShowPlanMealModal] = useState(false);

  const [mealName, setMealName] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [mealPrice, setMealPrice] = useState('');
  const [mealDate, setMealDate] = useState(futureDate(1));
  const [mealTimeSlot, setMealTimeSlot] = useState<'lunch' | 'dinner'>('dinner');
  const [mealMaxOrders, setMealMaxOrders] = useState('10');
  const [mealIsVeg, setMealIsVeg] = useState(false);
  const [mealIsLimitedDrop, setMealIsLimitedDrop] = useState(false);

  const chef = state.chefs.find((c) => c.id === selectedChefId);
  const chefOrders = state.orders.filter((o) => o.chefId === selectedChefId);
  const plannedMeals = chef?.plannedMeals || [];
  const reviews = chef?.reviews || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (!chef) return null;

  const handleToggleOnline = () => {
    dispatch({ type: 'TOGGLE_CHEF_ONLINE', payload: { chefId: selectedChefId } });
  };

  const handlePrepWindow = (hours: 4 | 8) => {
    dispatch({ type: 'SET_CHEF_PREP_WINDOW', payload: { chefId: selectedChefId, hours } });
  };

  const handleCapacity = (delta: number) => {
    dispatch({
      type: 'SET_CHEF_CAPACITY',
      payload: { chefId: selectedChefId, capacity: chef.dailyCapacity + delta },
    });
  };

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = STATUS_FLOW[currentStatus];
    if (nextStatus) {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: nextStatus } });
    }
  };

  const handleDecline = (orderId: string) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: 'declined' } });
  };

  const handleCreatePlannedMeal = () => {
    if (!mealName.trim() || !mealPrice.trim()) return;
    const newMeal: PlannedMeal = {
      id: `pm-new-${Date.now()}`,
      chefId: selectedChefId,
      name: mealName,
      description: mealDesc,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=250&fit=crop',
      price: parseFloat(mealPrice) || 0,
      date: mealDate,
      timeSlot: mealTimeSlot,
      maxOrders: parseInt(mealMaxOrders) || 10,
      currentOrders: 0,
      allergens: [],
      isVegetarian: mealIsVeg,
      isLimitedDrop: mealIsLimitedDrop,
    };
    dispatch({ type: 'CREATE_PLANNED_MEAL', payload: { chefId: selectedChefId, meal: newMeal } });
    setShowPlanMealModal(false);
    setMealName('');
    setMealDesc('');
    setMealPrice('');
    setMealIsVeg(false);
    setMealIsLimitedDrop(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <GlassCard style={styles.orderCard}>
      <View style={styles.orderInner}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
            <Text style={[styles.statusLabel, { color: STATUS_COLORS[item.status] }]}>
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={{ fontSize: 12 }}>👤</Text>
            <Text style={styles.detailText}>{item.customerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={{ fontSize: 12 }}>📞</Text>
            <Text style={styles.detailText}>{item.customerPhone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={{ fontSize: 12 }}>⏰</Text>
            <Text style={styles.detailText}>Pickup: {item.pickupSlot}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {item.items.map((ci) => (
            <Text key={ci.menuItem.id} style={styles.orderItemText}>
              {ci.quantity}x {ci.menuItem.name}
              {ci.isPreOrder ? ' (Pre-order)' : ''}
            </Text>
          ))}
          <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
        </View>

        {item.status !== 'declined' && item.status !== 'ready' && (
          <View style={styles.actionRow}>
            {item.status === 'placed' && (
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => handleDecline(item.id)}
              >
                <Text style={{ fontSize: 14, color: colors.danger }}>✕</Text>
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.advanceBtn}
              onPress={() => handleAdvanceStatus(item.id, item.status)}
            >
              <Text style={{ color: colors.white, fontSize: 14 }}>→</Text>
              <Text style={styles.advanceBtnText}>
                {NEXT_ACTION[item.status] || 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'ready' && (
          <View style={styles.readyBanner}>
            <Text style={{ fontSize: 16 }}>✅</Text>
            <Text style={styles.readyText}>Ready for customer pickup!</Text>
          </View>
        )}

        {item.status === 'declined' && (
          <View style={styles.declinedBanner}>
            <Text style={{ fontSize: 16, color: colors.danger }}>✕</Text>
            <Text style={styles.declinedText}>Order declined</Text>
          </View>
        )}
      </View>
    </GlassCard>
  );

  const renderHeaderContent = () => (
    <View>
      <Text style={styles.title}>Chef Mode</Text>
      <Text style={styles.subtitle}>Manage your kitchen</Text>

      {/* Chef Picker */}
      <TouchableOpacity
        style={styles.pickerBtn}
        onPress={() => setShowChefPicker(!showChefPicker)}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 20 }}>👤</Text>
        <Text style={styles.pickerText}>{chef.name}</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
          {showChefPicker ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showChefPicker && (
        <GlassCard style={styles.pickerDropdown}>
          <View style={styles.pickerDropdownInner}>
            {state.chefs.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.pickerOption,
                  c.id === selectedChefId && styles.pickerOptionActive,
                ]}
                onPress={() => {
                  setSelectedChefId(c.id);
                  setShowChefPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    c.id === selectedChefId && styles.pickerOptionTextActive,
                  ]}
                >
                  {c.name}
                </Text>
                <Text style={styles.pickerOptionCuisine}>{c.cuisine}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>
      )}

      {/* Online Toggle */}
      <GlassCard style={styles.controlCard}>
        <View style={styles.controlRow}>
          <View style={styles.controlInfo}>
            <Text style={styles.controlTitle}>
              {chef.isOnline ? "You're Online" : "You're Offline"}
            </Text>
            <Text style={styles.controlSubtitle}>
              {chef.isOnline ? 'Accepting new orders' : 'Not accepting new orders'}
            </Text>
          </View>
          <Switch
            value={chef.isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: colors.offline, true: colors.online }}
            thumbColor={colors.white}
          />
        </View>
      </GlassCard>

      {!chef.isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={{ fontSize: 16 }}>🌙</Text>
          <Text style={styles.offlineBannerText}>
            You're offline — not accepting new orders
          </Text>
        </View>
      )}

      {/* Prep Window */}
      <GlassCard style={styles.controlCard}>
        <View style={styles.controlInner}>
          <Text style={styles.controlTitle}>Default Prep Window</Text>
          <View style={styles.segmented}>
            <TouchableOpacity
              style={[styles.segBtn, chef.defaultPrepWindowHours === 4 && styles.segBtnActive]}
              onPress={() => handlePrepWindow(4)}
            >
              <Text style={[styles.segText, chef.defaultPrepWindowHours === 4 && styles.segTextActive]}>
                4 Hours
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segBtn, chef.defaultPrepWindowHours === 8 && styles.segBtnActive]}
              onPress={() => handlePrepWindow(8)}
            >
              <Text style={[styles.segText, chef.defaultPrepWindowHours === 8 && styles.segTextActive]}>
                8 Hours
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>

      {/* Capacity */}
      <GlassCard style={styles.controlCard}>
        <View style={styles.controlRow}>
          <View style={styles.controlInfo}>
            <Text style={styles.controlTitle}>Daily Capacity</Text>
            <Text style={styles.controlSubtitle}>Orders you can take today</Text>
          </View>
          <View style={styles.stepperRow}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => handleCapacity(-1)}>
              <Text style={{ fontSize: 18, color: colors.primary, fontWeight: '700' }}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{chef.dailyCapacity}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => handleCapacity(1)}>
              <Text style={{ fontSize: 18, color: colors.primary, fontWeight: '700' }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>

      {/* Plan a Meal */}
      <Text style={styles.sectionTitle}>Planned Meals</Text>
      <TouchableOpacity
        style={styles.planMealBtn}
        onPress={() => setShowPlanMealModal(true)}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 18 }}>+</Text>
        <Text style={styles.planMealBtnText}>Plan a New Meal</Text>
      </TouchableOpacity>

      {plannedMeals.length > 0 && (
        <View style={styles.plannedMealsList}>
          {plannedMeals.map((pm) => (
            <GlassCard key={pm.id} style={styles.plannedMealCard}>
              <View style={styles.plannedMealInner}>
                <View style={styles.plannedMealHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.plannedMealName}>{pm.name}</Text>
                    <Text style={styles.plannedMealMeta}>
                      {formatDate(pm.date)} · {pm.timeSlot === 'lunch' ? 'Lunch' : 'Dinner'}
                    </Text>
                  </View>
                  {pm.isLimitedDrop && (
                    <View style={styles.limitedDropBadge}>
                      <Text style={{ fontSize: 10 }}>⚡</Text>
                      <Text style={styles.limitedDropText}>Drop</Text>
                    </View>
                  )}
                </View>
                <View style={styles.plannedMealStats}>
                  <View style={styles.plannedMealStat}>
                    <Text style={styles.statValue}>{pm.currentOrders}</Text>
                    <Text style={styles.statLabel}>Orders</Text>
                  </View>
                  <View style={styles.plannedMealStat}>
                    <Text style={styles.statValue}>{pm.maxOrders}</Text>
                    <Text style={styles.statLabel}>Max</Text>
                  </View>
                  <View style={styles.plannedMealStat}>
                    <Text style={styles.statValue}>${pm.price.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>Price</Text>
                  </View>
                  <View style={styles.plannedMealStat}>
                    <Text style={[styles.statValue, { color: pm.currentOrders >= pm.maxOrders ? colors.danger : colors.success }]}>
                      {pm.maxOrders - pm.currentOrders}
                    </Text>
                    <Text style={styles.statLabel}>Spots Left</Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>
      )}

      {plannedMeals.length === 0 && (
        <View style={styles.emptySmall}>
          <Text style={styles.emptySmallText}>No planned meals yet. Create one above!</Text>
        </View>
      )}

      {/* Weekly Plan */}
      <Text style={styles.sectionTitle}>Weekly Plan</Text>
      {chef.weeklyPlan ? (
        <GlassCard style={styles.controlCard}>
          <View style={styles.controlInner}>
            <View style={styles.weeklyPlanHeader}>
              <Text style={{ fontSize: 18 }}>📅</Text>
              <Text style={styles.weeklyPlanTitle}>{chef.weeklyPlan.description}</Text>
            </View>
            <View style={styles.weeklyPlanDetails}>
              <Text style={styles.weeklyPlanDetail}>
                {chef.weeklyPlan.mealsPerWeek} meals/week · ${chef.weeklyPlan.pricePerMeal}/meal
              </Text>
              <View style={styles.dietaryTags}>
                {chef.weeklyPlan.dietaryOptions.map((opt) => (
                  <View key={opt} style={styles.dietaryTag}>
                    <Text style={styles.dietaryTagText}>{opt}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </GlassCard>
      ) : (
        <View style={styles.emptySmall}>
          <Text style={styles.emptySmallText}>No weekly plan configured</Text>
        </View>
      )}

      {/* Reviews */}
      <Text style={styles.sectionTitle}>
        Reviews ({reviews.length})
        {reviews.length > 0 && ` · ${avgRating} ⭐`}
      </Text>
      {reviews.length > 0 ? (
        <View style={styles.reviewsList}>
          {reviews.slice(0, 3).map((r) => (
            <GlassCard key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewInner}>
                <View style={styles.reviewHeader}>
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
            </GlassCard>
          ))}
        </View>
      ) : (
        <View style={styles.emptySmall}>
          <Text style={styles.emptySmallText}>No reviews yet</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Incoming Orders ({chefOrders.length})
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <FlatList
        data={chefOrders}
        keyExtractor={(o) => o.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeaderContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🧾</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Place an order from the "Order Food" tab to see it here
            </Text>
          </View>
        }
      />

      {/* Plan a Meal Modal */}
      <Modal visible={showPlanMealModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Plan a New Meal</Text>
                <TouchableOpacity onPress={() => setShowPlanMealModal(false)}>
                  <Text style={{ fontSize: 22, color: colors.text }}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Meal Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Sunday Biryani Feast"
                placeholderTextColor={colors.textLight}
                value={mealName}
                onChangeText={setMealName}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Describe what's included..."
                placeholderTextColor={colors.textLight}
                value={mealDesc}
                onChangeText={setMealDesc}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Price ($) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 19.99"
                placeholderTextColor={colors.textLight}
                value={mealPrice}
                onChangeText={setMealPrice}
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.dateRow}>
                {[1, 2, 3, 4, 5].map((d) => {
                  const dateStr = futureDate(d);
                  const label = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dateChip, mealDate === dateStr && styles.dateChipActive]}
                      onPress={() => setMealDate(dateStr)}
                    >
                      <Text style={[styles.dateChipText, mealDate === dateStr && styles.dateChipTextActive]}>{label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Time Slot</Text>
              <View style={styles.segmented}>
                <TouchableOpacity
                  style={[styles.segBtn, mealTimeSlot === 'lunch' && styles.segBtnActive]}
                  onPress={() => setMealTimeSlot('lunch')}
                >
                  <Text style={[styles.segText, mealTimeSlot === 'lunch' && styles.segTextActive]}>Lunch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segBtn, mealTimeSlot === 'dinner' && styles.segBtnActive]}
                  onPress={() => setMealTimeSlot('dinner')}
                >
                  <Text style={[styles.segText, mealTimeSlot === 'dinner' && styles.segTextActive]}>Dinner</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Max Orders</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 10"
                placeholderTextColor={colors.textLight}
                value={mealMaxOrders}
                onChangeText={setMealMaxOrders}
                keyboardType="number-pad"
              />

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Vegetarian</Text>
                <Switch
                  value={mealIsVeg}
                  onValueChange={setMealIsVeg}
                  trackColor={{ false: colors.offline, true: colors.vegGreen }}
                  thumbColor={colors.white}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>Limited-Time Drop</Text>
                  <Text style={styles.toggleSubLabel}>Creates urgency with countdown timer</Text>
                </View>
                <Switch
                  value={mealIsLimitedDrop}
                  onValueChange={setMealIsLimitedDrop}
                  trackColor={{ false: colors.offline, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>

              <TouchableOpacity
                style={[styles.createBtn, (!mealName.trim() || !mealPrice.trim()) && styles.createBtnDisabled]}
                onPress={handleCreatePlannedMeal}
                disabled={!mealName.trim() || !mealPrice.trim()}
              >
                <Text style={{ fontSize: 18 }}>✓</Text>
                <Text style={styles.createBtnText}>Create Planned Meal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: 100 },
  title: { ...typography.h1, marginBottom: spacing.xs },
  subtitle: { ...typography.bodySmall, marginBottom: spacing.lg },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pickerText: { ...typography.h3, flex: 1 },
  pickerDropdown: { marginBottom: spacing.md },
  pickerDropdownInner: { padding: spacing.sm },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  pickerOptionActive: { backgroundColor: colors.chipBg },
  pickerOptionText: { ...typography.body },
  pickerOptionTextActive: { color: colors.primary, fontWeight: '600' },
  pickerOptionCuisine: { ...typography.caption },
  controlCard: { marginBottom: spacing.md },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  controlInner: { padding: spacing.lg },
  controlInfo: { flex: 1 },
  controlTitle: { ...typography.h3, marginBottom: spacing.xs },
  controlSubtitle: { ...typography.bodySmall },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(231,29,54,0.08)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  offlineBannerText: { ...typography.body, color: colors.danger, fontWeight: '500' },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: radius.md,
    padding: 3,
    marginTop: spacing.sm,
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
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { ...typography.h2, minWidth: 30, textAlign: 'center' },
  sectionTitle: { ...typography.h3, marginTop: spacing.md, marginBottom: spacing.md },

  planMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  planMealBtnText: { ...typography.button, color: colors.white },
  plannedMealsList: { gap: spacing.sm, marginBottom: spacing.md },
  plannedMealCard: { marginBottom: spacing.sm },
  plannedMealInner: { padding: spacing.md },
  plannedMealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  plannedMealName: { ...typography.body, fontWeight: '700' },
  plannedMealMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  limitedDropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  limitedDropText: { ...typography.caption, color: colors.white, fontWeight: '700', fontSize: 10 },
  plannedMealStats: { flexDirection: 'row', justifyContent: 'space-around' },
  plannedMealStat: { alignItems: 'center' },
  statValue: { ...typography.h3, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary },

  weeklyPlanHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  weeklyPlanTitle: { ...typography.body, fontWeight: '600', flex: 1 },
  weeklyPlanDetails: { marginTop: spacing.xs },
  weeklyPlanDetail: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  dietaryTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  dietaryTag: {
    backgroundColor: 'rgba(46,196,182,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  dietaryTagText: { ...typography.caption, color: colors.success, fontWeight: '600' },

  reviewsList: { gap: spacing.sm, marginBottom: spacing.md },
  reviewCard: { marginBottom: spacing.sm },
  reviewInner: { padding: spacing.md },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  reviewAuthor: { ...typography.body, fontWeight: '600' },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewText: { ...typography.bodySmall, color: colors.textSecondary },

  emptySmall: { paddingVertical: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  emptySmallText: { ...typography.bodySmall, color: colors.textLight },

  orderCard: { marginBottom: spacing.md },
  orderInner: { padding: spacing.lg },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderId: { ...typography.body, fontWeight: '700' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { ...typography.caption, fontWeight: '600' },
  orderDetails: { gap: spacing.xs, marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailText: { ...typography.bodySmall },
  orderItems: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  orderItemText: { ...typography.body, marginBottom: spacing.xs },
  orderTotal: { ...typography.body, fontWeight: '700', color: colors.primary, marginTop: spacing.sm },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  declineBtnText: { ...typography.button, color: colors.danger, fontSize: 14 },
  advanceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  advanceBtnText: { ...typography.button, color: colors.white, fontSize: 14 },
  readyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(46,196,182,0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  readyText: { ...typography.body, color: colors.success, fontWeight: '500' },
  declinedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(231,29,54,0.08)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  declinedText: { ...typography.body, color: colors.danger, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textLight },
  emptySubtext: { ...typography.bodySmall, color: colors.textLight, textAlign: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 480,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: { ...typography.h2 },
  inputLabel: { ...typography.body, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  inputMulti: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  dateChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.chipBg,
  },
  dateChipActive: { backgroundColor: colors.primary },
  dateChipText: { ...typography.caption, fontWeight: '600', color: colors.chipText },
  dateChipTextActive: { color: colors.white },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  toggleLabel: { ...typography.body, fontWeight: '600' },
  toggleSubLabel: { ...typography.caption, color: colors.textSecondary },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  createBtnDisabled: { opacity: 0.5 },
  createBtnText: { ...typography.button, color: colors.white },
});
