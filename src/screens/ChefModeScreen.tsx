import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { Order, OrderStatus } from '../types';

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

export function ChefModeScreen() {
  const { state, dispatch } = useApp();
  const [selectedChefId, setSelectedChefId] = useState(state.chefs[0]?.id || '');
  const [showChefPicker, setShowChefPicker] = useState(false);

  const chef = state.chefs.find((c) => c.id === selectedChefId);
  const chefOrders = state.orders.filter((o) => o.chefId === selectedChefId);

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

  const renderOrder = ({ item }: { item: Order }) => (
    <GlassCard style={styles.orderCard}>
      <View style={styles.orderInner}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
            <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.customerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.customerPhone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>Pickup: {item.pickupSlot}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {item.items.map((ci) => (
            <Text key={ci.menuItem.id} style={styles.orderItemText}>
              {ci.quantity}× {ci.menuItem.name}
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
                <Ionicons name="close" size={16} color={colors.danger} />
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.advanceBtn}
              onPress={() => handleAdvanceStatus(item.id, item.status)}
            >
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
              <Text style={styles.advanceBtnText}>
                {NEXT_ACTION[item.status] || 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'ready' && (
          <View style={styles.readyBanner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.readyText}>Ready for customer pickup!</Text>
          </View>
        )}

        {item.status === 'declined' && (
          <View style={styles.declinedBanner}>
            <Ionicons name="close-circle" size={18} color={colors.danger} />
            <Text style={styles.declinedText}>Order declined</Text>
          </View>
        )}
      </View>
    </GlassCard>
  );

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <FlatList
        data={chefOrders}
        keyExtractor={(o) => o.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Chef Mode</Text>
            <Text style={styles.subtitle}>Manage your kitchen</Text>

            {/* Chef Picker */}
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setShowChefPicker(!showChefPicker)}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
              <Text style={styles.pickerText}>{chef.name}</Text>
              <Ionicons
                name={showChefPicker ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textSecondary}
              />
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
                    {chef.isOnline ? 'You\'re Online' : 'You\'re Offline'}
                  </Text>
                  <Text style={styles.controlSubtitle}>
                    {chef.isOnline
                      ? 'Accepting new orders'
                      : 'Not accepting new orders'}
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
                <Ionicons name="moon-outline" size={18} color={colors.danger} />
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
                    <Text
                      style={[styles.segText, chef.defaultPrepWindowHours === 4 && styles.segTextActive]}
                    >
                      4 Hours
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.segBtn, chef.defaultPrepWindowHours === 8 && styles.segBtnActive]}
                    onPress={() => handlePrepWindow(8)}
                  >
                    <Text
                      style={[styles.segText, chef.defaultPrepWindowHours === 8 && styles.segTextActive]}
                    >
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
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleCapacity(-1)}
                  >
                    <Ionicons name="remove" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{chef.dailyCapacity}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleCapacity(1)}
                  >
                    <Ionicons name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>

            <Text style={styles.sectionTitle}>
              Incoming Orders ({chefOrders.length})
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Place an order from the "Order Food" tab to see it here
            </Text>
          </View>
        }
      />
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
  statusText: { ...typography.caption, fontWeight: '600' },
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
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
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
});
