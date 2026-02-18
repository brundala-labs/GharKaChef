import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { colors, spacing, radius, typography } from '../theme';

const CUISINES = ['Telugu', 'Tamil', 'Kerala', 'Punjabi', 'Gujarati', 'Hyderabadi', 'Bengali', 'Indo-Chinese', 'Street Food', 'South Indian Fusion', 'Other'];

export function ChefSignupScreen({ navigation }: any) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [kitchenDesc, setKitchenDesc] = useState('');
  const [hasPermit, setHasPermit] = useState(false);
  const [showCuisineList, setShowCuisineList] = useState(false);

  const handleSignup = () => {
    if (!name.trim() || !phone.trim() || !cuisine) {
      const msg = 'Please fill in your name, phone, and cuisine type.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Required', msg);
      return;
    }
    dispatch({
      type: 'SET_USER_PROFILE',
      payload: {
        name: name.trim(),
        phone: phone.trim(),
        role: 'chef',
        cuisineType: cuisine,
        kitchenDescription: kitchenDesc.trim(),
      },
    });
    navigation.reset({ index: 0, routes: [{ name: 'ChefTabs' }] });
  };

  return (
    <LinearGradient colors={[...colors.background]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Become a Chef</Text>
        <Text style={styles.subtitle}>Start selling your home-cooked meals</Text>

        <GlassCard style={styles.formCard}>
          <View style={styles.formInner}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Harsha Singh"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., +1 (905) 555-0456"
              placeholderTextColor={colors.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Cuisine Type *</Text>
            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => setShowCuisineList(!showCuisineList)}
            >
              <Text style={cuisine ? styles.selectText : styles.selectPlaceholder}>
                {cuisine || 'Select your cuisine...'}
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                {showCuisineList ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {showCuisineList && (
              <View style={styles.cuisineList}>
                {CUISINES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.cuisineOption, cuisine === c && styles.cuisineOptionActive]}
                    onPress={() => {
                      setCuisine(c);
                      setShowCuisineList(false);
                    }}
                  >
                    <Text style={[styles.cuisineText, cuisine === c && styles.cuisineTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Kitchen Description</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Tell customers about your kitchen setup..."
              placeholderTextColor={colors.textLight}
              value={kitchenDesc}
              onChangeText={setKitchenDesc}
              multiline
              numberOfLines={3}
            />

            <View style={styles.permitRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.permitLabel}>I have a Food Handler's Permit</Text>
                <Text style={styles.permitHelper}>Required for selling food in Ontario</Text>
              </View>
              <Switch
                value={hasPermit}
                onValueChange={setHasPermit}
                trackColor={{ false: colors.offline, true: colors.success }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity
          style={[styles.signupBtn, (!name.trim() || !phone.trim() || !cuisine) && styles.signupBtnDisabled]}
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>🔥</Text>
          <Text style={styles.signupBtnText}>Start Selling</Text>
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
  selectBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  selectText: { ...typography.body, color: colors.text },
  selectPlaceholder: { ...typography.body, color: colors.textLight },
  cuisineList: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: radius.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cuisineOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  cuisineOptionActive: { backgroundColor: 'rgba(255,107,53,0.08)' },
  cuisineText: { ...typography.body },
  cuisineTextActive: { color: colors.primary, fontWeight: '600' },
  permitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  permitLabel: { ...typography.body, fontWeight: '600' },
  permitHelper: { ...typography.caption, color: colors.textSecondary },
  signupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  signupBtnDisabled: { opacity: 0.5 },
  signupBtnText: { ...typography.button, color: colors.white },
});
