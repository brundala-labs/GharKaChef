import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';

const DIETARY_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Gluten-Free', 'No Restrictions'];

export function CustomerSignupScreen({ navigation }: any) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const toggleDietary = (opt: string) => {
    setSelectedDietary((prev) =>
      prev.includes(opt) ? prev.filter((d) => d !== opt) : [...prev, opt]
    );
  };

  const handleSignup = () => {
    if (!name.trim() || !phone.trim()) {
      const msg = 'Please enter your name and phone number.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Required', msg);
      return;
    }
    dispatch({
      type: 'SET_USER_PROFILE',
      payload: {
        name: name.trim(),
        phone: phone.trim(),
        role: 'customer',
        dietaryPreferences: selectedDietary,
      },
    });
    navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
  };

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Start ordering home-cooked meals</Text>

        <GlassCard style={styles.formCard}>
          <View style={styles.formInner}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Priya Sharma"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., +1 (416) 555-0123"
              placeholderTextColor={colors.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Dietary Preferences</Text>
            <Text style={styles.helperText}>Select all that apply</Text>
            <View style={styles.dietaryGrid}>
              {DIETARY_OPTIONS.map((opt) => {
                const isSelected = selectedDietary.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.dietaryChip, isSelected && styles.dietaryChipActive]}
                    onPress={() => toggleDietary(opt)}
                  >
                    <Text style={{ fontSize: 14 }}>{isSelected ? '✓' : '○'}</Text>
                    <Text style={[styles.dietaryText, isSelected && styles.dietaryTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity
          style={[styles.signupBtn, (!name.trim() || !phone.trim()) && styles.signupBtnDisabled]}
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>🍽</Text>
          <Text style={styles.signupBtnText}>Start Ordering</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.h1, marginBottom: spacing.xs },
  subtitle: { ...typography.bodySmall, marginBottom: spacing.xl },
  formCard: { marginBottom: spacing.xl },
  formInner: { padding: spacing.lg },
  label: { ...typography.body, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.md },
  helperText: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
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
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dietaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.chipBg,
  },
  dietaryChipActive: { backgroundColor: colors.primary },
  dietaryText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  dietaryTextActive: { color: colors.white },
  signupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  signupBtnDisabled: { opacity: 0.5 },
  signupBtnText: { ...typography.button, color: colors.white },
});
