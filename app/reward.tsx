import { useRouter } from 'expo-router';
import { Check, Gift, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { FONTS, RADII } from '@/constants/theme';
import { useSavings } from '@/hooks/useSavings';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function RewardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const rewardGoalLabel = useUserStore((state) => state.rewardGoalLabel);
  const rewardGoalAmount = useUserStore((state) => state.rewardGoalAmount);
  const setRewardGoal = useUserStore((state) => state.setRewardGoal);
  const { moneySavedFormatted, moneySaved } = useSavings();
  const [label, setLabel] = useState(rewardGoalLabel);
  const [amountInput, setAmountInput] = useState(String(rewardGoalAmount));

  const parsedAmount = useMemo(() => {
    const normalized = amountInput.replace(',', '.').trim();
    const value = Number(normalized);
    return Number.isFinite(value) ? value : 0;
  }, [amountInput]);

  const progress = parsedAmount > 0 ? Math.min(moneySaved / parsedAmount, 1) : 0;
  const canSave = label.trim().length > 0 && parsedAmount > 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 36, gap: 18 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 4 }}>
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.textMuted,
                fontSize: 9,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              },
            ]}
          >
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
          <X color={colors.textPrimary} size={18} strokeWidth={2} />
        </Pressable>
      </View>

      <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
        {i18n.t('reward.body')}
      </Text>

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
        <View style={{ gap: 6 }}>
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.textMuted,
                fontSize: 9,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              },
            ]}
          >
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
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.textMuted,
                fontSize: 9,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              },
            ]}
          >
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
      </View>

      <View
        style={{
          borderRadius: RADII.xl,
          backgroundColor: colors.accentBg,
          borderWidth: 1,
          borderColor: colors.accentBorder,
          padding: 14,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Gift color={colors.accent} size={16} strokeWidth={1.5} />
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 12 }]}>{label || '...'}</Text>
          </View>
          <Text style={[FONTS.black, { color: colors.accent, fontSize: 16 }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>

        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>
          {moneySavedFormatted} / {parsedAmount > 0 ? `${parsedAmount} EUR` : '--'}
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
              backgroundColor: colors.accent,
            }}
          />
        </View>
      </View>

      <Pressable
        disabled={!canSave}
        onPress={() => {
          setRewardGoal(label.trim(), parsedAmount);
          router.back();
        }}
        style={{
          minHeight: 48,
          borderRadius: RADII.lg,
          backgroundColor: canSave ? '#7C3AED' : colors.dividerStrong,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <Check color="#FFFFFF" size={16} strokeWidth={2} />
        <Text style={[FONTS.bold, { color: '#FFFFFF', fontSize: 13 }]}>
          {i18n.t('reward.saveCta')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
