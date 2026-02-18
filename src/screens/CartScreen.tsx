import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { CartItem, Order } from '../types';
import { generatePickupSlots, generateOrderId, formatPrice } from '../utils';

export function CartScreen({ route, navigation }: any) {
  const { chefId, prepWindow: initialPrep } = route.params;
  const { state, dispatch } = useApp();
  const chef = state.chefs.find((c) => c.id === chefId)!;

  const pickupSlots = useMemo(() => generatePickupSlots(initialPrep || 4), [initialPrep]);
  const [selectedSlot, setSelectedSlot] = useState(pickupSlots[0]?.label || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const cartItems = state.cart.filter((c) => c.chefId === chefId);
  const total = cartItems.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);

  const handleQuantity = (menuItemId: string, delta: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, delta } });
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add items to your cart first.');
      return;
    }
    if (!customerName.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    if (!customerPhone.trim()) {
      Alert.alert('Phone Required', 'Please enter your phone number.');
      return;
    }
    if (!chef.isOnline) {
      Alert.alert('Chef Offline', 'This chef is currently not accepting orders.');
      return;
    }
    if (chef.dailyCapacity <= 0) {
      Alert.alert('Capacity Full', 'This chef has reached their daily order limit.');
      return;
    }

    const order: Order = {
      id: generateOrderId(),
      chefId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: [...cartItems],
      total,
      pickupSlot: selectedSlot,
      status: 'placed',
      createdAt: new Date(),
    };

    dispatch({ type: 'PLACE_ORDER', payload: order });
    setPlacedOrder(order);
    setShowConfirmation(true);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <GlassCard style={styles.itemCard}>
      <View style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <View style={styles.itemNameRow}>
            <View
              style={[
                styles.vegDot,
                { backgroundColor: item.menuItem.isVeg ? colors.vegGreen : colors.nonVegRed },
              ]}
            />
            <Text style={styles.itemName}>{item.menuItem.name}</Text>
          </View>
          <Text style={styles.itemPrice}>{formatPrice(item.menuItem.price)} each</Text>
        </View>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => handleQuantity(item.menuItem.id, -1)}
          >
            <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '700' }}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => handleQuantity(item.menuItem.id, 1)}
          >
            <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '700' }}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.lineTotal}>
          {formatPrice(item.menuItem.price * item.quantity)}
        </Text>
      </View>
    </GlassCard>
  );

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={cartItems}
          keyExtractor={(c) => c.menuItem.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>Your Order</Text>
              <Text style={styles.subtitle}>From {chef.name} · {chef.cuisine}</Text>
            </View>
          }
          ListFooterComponent={
            <View>
              {cartItems.length > 0 && (
                <>
                  <GlassCard style={styles.totalCard}>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                    </View>
                  </GlassCard>

                  <Text style={styles.sectionTitle}>Pickup Window</Text>
                  <View style={styles.slotsRow}>
                    {pickupSlots.map((slot) => (
                      <TouchableOpacity
                        key={slot.label}
                        style={[
                          styles.slotChip,
                          selectedSlot === slot.label && styles.slotChipActive,
                        ]}
                        onPress={() => setSelectedSlot(slot.label)}
                      >
                        <Text style={{ fontSize: 12 }}>⏰</Text>
                        <Text
                          style={[
                            styles.slotText,
                            selectedSlot === slot.label && styles.slotTextActive,
                          ]}
                        >
                          {slot.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.sectionTitle}>Your Details</Text>
                  <GlassCard style={styles.formCard}>
                    <View style={styles.formInner}>
                      <TextInput
                        style={styles.input}
                        placeholder="Your Name"
                        placeholderTextColor={colors.textLight}
                        value={customerName}
                        onChangeText={setCustomerName}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor={colors.textLight}
                        value={customerPhone}
                        onChangeText={setCustomerPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </GlassCard>

                  <TouchableOpacity
                    style={styles.placeBtn}
                    onPress={handlePlaceOrder}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 20 }}>✓</Text>
                    <Text style={styles.placeBtnText}>Place Order · {formatPrice(total)}</Text>
                  </TouchableOpacity>
                </>
              )}

              {cartItems.length === 0 && (
                <View style={styles.empty}>
                  <Text style={{ fontSize: 48 }}>🛒</Text>
                  <Text style={styles.emptyText}>Your cart is empty</Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.emptyLink}>Browse menus</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
        />
      </KeyboardAvoidingView>

      <Modal visible={showConfirmation} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalCard}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 56 }}>✅</Text>
              <Text style={styles.modalTitle}>Order Placed!</Text>
              {placedOrder && (
                <>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Order ID</Text>
                    <Text style={styles.modalValue}>{placedOrder.id}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>Placed</Text>
                    </View>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Pickup</Text>
                    <Text style={styles.modalValue}>{placedOrder.pickupSlot}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Total</Text>
                    <Text style={styles.modalValue}>{formatPrice(placedOrder.total)}</Text>
                  </View>
                </>
              )}
              <Text style={styles.modalNote}>
                Switch to Chef Mode to accept this order!
              </Text>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setShowConfirmation(false);
                  navigation.popToTop();
                }}
              >
                <Text style={styles.modalBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: 40 },
  title: { ...typography.h1, marginBottom: spacing.xs },
  subtitle: { ...typography.bodySmall, marginBottom: spacing.lg },
  itemCard: { marginBottom: spacing.sm },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  itemInfo: { flex: 1 },
  itemNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  vegDot: { width: 10, height: 10, borderRadius: 2 },
  itemName: { ...typography.body, fontWeight: '600', flex: 1 },
  itemPrice: { ...typography.bodySmall, marginTop: 2 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { ...typography.body, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  lineTotal: { ...typography.body, fontWeight: '700', color: colors.primary, minWidth: 60, textAlign: 'right' },
  totalCard: { marginTop: spacing.sm, marginBottom: spacing.lg },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  totalLabel: { ...typography.h3 },
  totalValue: { ...typography.h2, color: colors.primary },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.chipBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  slotChipActive: { backgroundColor: colors.primary },
  slotText: { ...typography.body, color: colors.primary, fontWeight: '600', fontSize: 13 },
  slotTextActive: { color: colors.white },
  formCard: { marginBottom: spacing.lg },
  formInner: { padding: spacing.md, gap: spacing.md },
  input: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  placeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
  },
  placeBtnText: { ...typography.button, color: colors.white, fontSize: 18 },
  empty: { alignItems: 'center', paddingTop: 80, gap: spacing.md },
  emptyText: { ...typography.body, color: colors.textLight },
  emptyLink: { ...typography.body, color: colors.primary, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  modalCard: { width: '100%', maxWidth: 480 },
  modalContent: { padding: spacing.xxl, alignItems: 'center' },
  modalTitle: { ...typography.h1, marginTop: spacing.md, marginBottom: spacing.lg },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalLabel: { ...typography.bodySmall },
  modalValue: { ...typography.body, fontWeight: '600' },
  statusBadge: {
    backgroundColor: colors.chipBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  statusBadgeText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  modalNote: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  modalBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  modalBtnText: { ...typography.button, color: colors.white },
});
