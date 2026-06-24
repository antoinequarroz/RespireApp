import { type Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useCounter } from '@/hooks/useCounter';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, getAvoidedCigarettes, getMoneySaved } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function ReadyScreen() {
  const router = useRouter();
  const { colors } = useTheme('dark');
  const insets = useSafeAreaInsets();
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const setProfile = useUserStore((state) => state.setProfile);
  const clearOnboardingDraft = useUserStore((state) => state.clearOnboardingDraft);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const counter = useCounter();

  const profile = {
    productType: onboardingDraft?.productType ?? 'cigarette',
    currency: onboardingDraft?.currency ?? 'EUR',
    lastCigaretteAt: onboardingDraft?.lastCigaretteAt ?? new Date().toISOString(),
    cigarettesPerDay: onboardingDraft?.cigarettesPerDay ?? 10,
    packPrice: onboardingDraft?.packPrice ?? 11.5,
    motivations: onboardingDraft?.motivations ?? [],
  };

  const avoided = getAvoidedCigarettes(
    profile.lastCigaretteAt,
    profile.cigarettesPerDay,
    profile.productType,
  );
  const moneySaved = formatCurrency(
    getMoneySaved(
      profile.lastCigaretteAt,
      profile.cigarettesPerDay,
      profile.packPrice,
      profile.productType,
    ),
    profile.currency,
  );
  const totalSmokeFreeDays = Math.max(counter.days, 0);
  const liveCounter =
    counter.hours > 0
      ? `${String(counter.hours).padStart(2, '0')}:${String(counter.minutes).padStart(2, '0')}:${String(counter.seconds).padStart(2, '0')}`
      : `${String(counter.minutes).padStart(2, '0')}:${String(counter.seconds).padStart(2, '0')}`;

  const stats = [
    {
      value: moneySaved,
      label: i18n.t('onboarding.readyStatSavings'),
      color: colors.emerald,
      emoji: '💰',
    },
    {
      value: String(avoided),
      label: i18n.t('onboarding.readyStatAvoided'),
      color: colors.accent,
      emoji: '✨',
    },
    {
      value: `+${totalSmokeFreeDays}j`,
      label: i18n.t('onboarding.readyStatTime'),
      color: colors.textPrimary,
      emoji: '✅',
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: 20,
        paddingTop: Math.max(insets.top + 8, 56),
        paddingBottom: Math.max(insets.bottom + 8, 16),
      }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
      <View style={{ flex: 1, justifyContent: 'space-between', gap: 20 }}>
      <View style={{ alignItems: 'center', gap: 22, paddingTop: 8 }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: RADII.full,
            borderWidth: 2,
            borderColor: colors.emerald,
            backgroundColor: colors.emeraldBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 36 }}>✅</Text>
        </View>

        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text
            style={[
              FONTS.black,
              {
                color: colors.textPrimary,
                fontSize: 34,
                lineHeight: 31,
                textAlign: 'center',
                maxWidth: 255,
              },
            ]}
          >
            {i18n.t('onboarding.readyHeroTitle')}
          </Text>
          <Text
            style={[
              FONTS.regular,
              { color: colors.textSecondary, fontSize: 13, textAlign: 'center', maxWidth: 260 },
            ]}
          >
            {i18n.t('onboarding.readyHeroBody')}
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 14,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgCard,
            paddingHorizontal: 14,
            paddingVertical: 16,
            gap: 14,
          }}
        >
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text
              style={[
                FONTS.bold,
                {
                  color: colors.textMuted,
                  fontSize: 8,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {i18n.t('onboarding.readyStartNow')}
            </Text>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}> 
              {new Date(profile.lastCigaretteAt).toLocaleString('fr-CH', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              backgroundColor: colors.accentBg,
              paddingHorizontal: 14,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Text style={{ fontSize: 13 }}>⏱️</Text>
              <Text
                style={[
                  FONTS.bold,
                  { color: colors.textMuted, fontSize: 8, letterSpacing: 1.6, textTransform: 'uppercase' },
                ]}
              >
                {i18n.t('home.liveLabel')}
              </Text>
            </View>
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 30, letterSpacing: -1 }]}>
              {liveCounter}
            </Text>
            <Text
              style={[
                FONTS.bold,
                { color: colors.textMuted, fontSize: 8, letterSpacing: 1.6, textTransform: 'uppercase' },
              ]}
            >
              {i18n.t('home.smokeFreeLabel')}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {stats.map((item, index) => (
                <View
                  key={item.label}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingHorizontal: 6,
                    borderLeftWidth: index === 0 ? 0 : 0.5,
                    borderLeftColor: colors.divider,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{item.emoji}</Text>
                  <Text style={[FONTS.black, { color: item.color, fontSize: 16, marginTop: 6 }]}>{item.value}</Text>
                  <Text
                    style={[
                      FONTS.regular,
                      { color: colors.textMuted, fontSize: 9, marginTop: 4, textAlign: 'center' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ gap: SPACING.md, paddingBottom: 8 }}>
        <Button
          label={i18n.t('onboarding.start')}
          onPress={() => {
            setProfile(profile);
            clearOnboardingDraft();
            completeOnboarding();
            router.replace('/(tabs)');
          }}
        />
        <Pressable onPress={() => router.push('/(onboarding)/last-cigarette' as Href)}>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 12, textAlign: 'center' }]}>
            {i18n.t('onboarding.editData')}
          </Text>
        </Pressable>
      </View>
      </View>
      </ScrollView>
    </View>
  );
}
