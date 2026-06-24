import { useRouter } from 'expo-router';
import { Check, Gift, Lock, Trash2, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { FONTS, RADII, SPACING } from '@/constants/theme';
import { usePremiumGate } from '@/hooks/usePremiumGate';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

export default function RewardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const rewardGoals = useUserStore((state) => state.rewardGoals);
  const addRewardGoal = useUserStore((state) => state.addRewardGoal);
  const removeRewardGoal = useUserStore((state) => state.removeRewardGoal);
  const currency = useUserStore((state) => state.profile?.currency ?? 'EUR');
  const celebratedRewardGoalIds = useProgressStore((state) => state.celebratedRewardGoalIds);
  const { moneySavedFormatted, moneySaved } = useSavings();
  const canMultiGoal = usePremiumGate('multiRewardGoals');

  const [label, setLabel] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [showForm, setShowForm] = useState(rewardGoals.length === 0);

  const parsedAmount = useMemo(() => {
    const value = Number(amountInput.replace(',', '.').trim());
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [amountInput]);

  const canAdd = label.trim().length > 0 && parsedAmount > 0;
  const freeGoalLimitReached = !canMultiGoal && rewardGoals.length >= 1;

  const handleAdd = () => {
    if (!canAdd || freeGoalLimitReached) return;
    addRewardGoal(label.trim(), parsedAmount);
    setLabel('');
    setAmountInput('');
    setShowForm(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 36, gap: 18 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 4 }}>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase' }]}>
            {i18n.t('reward.label')}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22 }]}>
            {i18n.t('reward.title')}
          </Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: colors.bgCard,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X color={colors.textPrimary} size={18} strokeWidth={1.5} />
        </Pressable>
      </View>

      {/* Cagnotte actuelle */}
      <View
        style={{
          borderRadius: RADII.xl,
          backgroundColor: colors.emeraldBg,
          borderWidth: 1,
          borderColor: colors.emeraldBorder,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 22 }}>💰</Text>
        <View>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
            Économies actuelles
          </Text>
          <Text style={[FONTS.black, { color: colors.emerald, fontSize: 22 }]}>{moneySavedFormatted}</Text>
        </View>
      </View>

      {/* Liste des objectifs */}
      {rewardGoals.length > 0 && (
        <View style={{ gap: SPACING.sm }}>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase' }]}>
            Mes objectifs
          </Text>
          {rewardGoals.map((goal) => {
            const progress = goal.amount > 0 ? Math.min(moneySaved / goal.amount, 1) : 0;
            const isCompleted = celebratedRewardGoalIds.includes(goal.id);

            return (
              <View
                key={goal.id}
                style={{
                  borderRadius: RADII.xl,
                  backgroundColor: isCompleted ? colors.emeraldBg : colors.accentBg,
                  borderWidth: 1,
                  borderColor: isCompleted ? colors.emeraldBorder : colors.accentBorder,
                  padding: 14,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Gift color={isCompleted ? colors.emerald : colors.accent} size={16} strokeWidth={1.5} />
                    <Text
                      style={[FONTS.bold, { color: isCompleted ? colors.emerald : colors.accent, fontSize: 13, flex: 1 }]}
                      numberOfLines={1}
                    >
                      {goal.label}
                    </Text>
                    {isCompleted && <Text style={{ fontSize: 14 }}>✅</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={[FONTS.black, { color: isCompleted ? colors.emerald : colors.accent, fontSize: 16 }]}>
                      {Math.round(progress * 100)}%
                    </Text>
                    <Pressable onPress={() => removeRewardGoal(goal.id)} hitSlop={8}>
                      <Trash2 color={colors.textMuted} size={14} strokeWidth={1.5} />
                    </Pressable>
                  </View>
                </View>

                <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
                  {moneySavedFormatted} / {goal.amount} {currency}
                </Text>

                <View
                  style={{
                    height: 6,
                    borderRadius: RADII.full,
                    backgroundColor: colors.dividerStrong,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${Math.max(progress * 100, 4)}%`,
                      height: 6,
                      borderRadius: RADII.full,
                      backgroundColor: isCompleted ? colors.emerald : colors.accent,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Formulaire d'ajout ou gate PRO */}
      {freeGoalLimitReached ? (
        <Pressable
          onPress={() => router.push('/paywall')}
          style={{
            borderRadius: RADII.xl,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            backgroundColor: colors.accentBg,
            padding: 16,
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Lock color={colors.accent} size={20} strokeWidth={1.5} />
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 14 }]}>
              Objectifs multiples — PRO
            </Text>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, textAlign: 'center' }]}>
              Crée autant d'objectifs que tu veux avec Respire PRO.
            </Text>
          </View>
          <View
            style={{
              borderRadius: RADII.full,
              backgroundColor: colors.accent,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text style={[FONTS.bold, { color: '#fff', fontSize: 13 }]}>Passer à PRO</Text>
          </View>
        </Pressable>
      ) : showForm ? (
        <View
          style={{
            borderRadius: RADII.xl,
            backgroundColor: colors.bgCard,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            padding: 14,
            gap: 14,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>Nouvel objectif</Text>

          <View style={{ gap: 6 }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
              {i18n.t('reward.nameField')}
            </Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder={i18n.t('reward.namePlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={[
                FONTS.bold,
                {
                  borderRadius: RADII.md,
                  borderWidth: 1,
                  borderColor: colors.accentBorder,
                  backgroundColor: colors.bgCard,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.textPrimary,
                  fontSize: 13,
                },
              ]}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
              {i18n.t('reward.amountField')}
            </Text>
            <TextInput
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="decimal-pad"
              placeholder="1200"
              placeholderTextColor={colors.textMuted}
              style={[
                FONTS.black,
                {
                  borderRadius: RADII.md,
                  borderWidth: 1,
                  borderColor: colors.accentBorder,
                  backgroundColor: colors.bgCard,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.textPrimary,
                  fontSize: 20,
                },
              ]}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {rewardGoals.length > 0 && (
              <Pressable
                onPress={() => setShowForm(false)}
                style={{
                  flex: 1,
                  minHeight: 44,
                  borderRadius: RADII.lg,
                  backgroundColor: colors.bgCard,
                  borderWidth: 1,
                  borderColor: colors.bgCardBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 13 }]}>Annuler</Text>
              </Pressable>
            )}
            <Pressable
              disabled={!canAdd}
              onPress={handleAdd}
              style={{
                flex: 1,
                minHeight: 44,
                borderRadius: RADII.lg,
                backgroundColor: canAdd ? '#7C3AED' : colors.dividerStrong,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <Check color="#FFFFFF" size={16} strokeWidth={1.5} />
              <Text style={[FONTS.bold, { color: '#FFFFFF', fontSize: 13 }]}>Ajouter</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setShowForm(true)}
          style={{
            minHeight: 48,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            backgroundColor: colors.accentBg,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.accent, fontSize: 13 }]}>+ Ajouter un objectif</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
