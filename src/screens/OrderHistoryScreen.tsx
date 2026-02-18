import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';
import { Order, OrderStatus } from '../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Placed',
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

export function OrderHistoryScreen() {
  const { state } = useApp();
  const orders = [...state.orders].reverse();

  const renderOrder = ({ item }: { item: Order }) => {
    const chef = state.chefs.find((c) => c.id === item.chefId);
    return (
      <GlassCard style={styles.card}>
        <View style={styles.cardInner}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>{item.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
              <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                {STATUS_LABELS[item.status]}
              </Text>
            </View>
          </View>

          {chef && (
            <View style={styles.chefRow}>
              <Ionicons name="restaurant-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.chefName}>{chef.name} · {chef.cuisine}</Text>
            </View>
          )}

          <View style={styles.itemsList}>
            {item.items.map((ci) => (
              <Text key={ci.menuItem.id} style={styles.itemText}>
                {ci.quantity}x {ci.menuItem.name}
                {ci.isPreOrder ? ' (Pre-order)' : ''}
              </Text>
            ))}
          </View>

          <View style={styles.orderFooter}>
            <View style={styles.footerDetail}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.footerText}>Pickup: {item.pickupSlot}</Text>
            </View>
            <Text style={styles.totalText}>${item.total.toFixed(2)}</Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>My Orders</Text>
            <Text style={styles.subtitle}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Browse chefs and place your first order!
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
  card: { marginBottom: spacing.md },
  cardInner: { padding: spacing.lg },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chefName: { ...typography.bodySmall, fontWeight: '500' },
  itemsList: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  itemText: { ...typography.body, marginBottom: spacing.xs },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerDetail: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  footerText: { ...typography.bodySmall, color: colors.textSecondary },
  totalText: { ...typography.h3, color: colors.primary },
  empty: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textLight },
  emptySubtext: { ...typography.bodySmall, color: colors.textLight, textAlign: 'center' },
});
