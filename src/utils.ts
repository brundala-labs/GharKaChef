import { PickupSlot } from './types';

export function generatePickupSlots(prepHours: 4 | 8): PickupSlot[] {
  const now = new Date();
  const readyHour = now.getHours() + prepHours;
  // Round up to next full hour
  const startHour = readyHour + (now.getMinutes() > 0 ? 1 : 0);

  const slots: PickupSlot[] = [];
  for (let i = 0; i < 3; i++) {
    const s = startHour + i;
    const e = s + 1;
    // Wrap hours for display
    const sDisplay = s % 24;
    const eDisplay = e % 24;
    const sLabel = formatHour(sDisplay);
    const eLabel = formatHour(eDisplay);
    slots.push({
      label: `${sLabel} – ${eLabel}`,
      startHour: sDisplay,
      endHour: eDisplay,
    });
  }
  return slots;
}

function formatHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

export function generateOrderId(): string {
  return 'GKC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
