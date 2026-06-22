import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingOptionCard, OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { getCounterBreakdown } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function LastCigaretteScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const [showIosPicker, setShowIosPicker] = useState(false);
  const selectedDate = useMemo(
    () => new Date(onboardingDraft?.lastCigaretteAt ?? profile?.lastCigaretteAt ?? new Date().toISOString()),
    [onboardingDraft?.lastCigaretteAt, profile?.lastCigaretteAt],
  );
  const elapsed = getCounterBreakdown(selectedDate.toISOString());

  const setPreset = (hoursAgo: number) => {
    const next = new Date();
    next.setHours(next.getHours() - hoursAgo);
    updateOnboardingDraft({ lastCigaretteAt: next.toISOString() });
  };

  const openAndroidDateTimePicker = () => {
    if (Platform.OS !== 'android') {
      return;
    }

    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: 'date',
      is24Hour: true,
      maximumDate: new Date(),
      onChange: (_, selected) => {
        if (!selected) {
          return;
        }

        DateTimePickerAndroid.open({
          value: selected,
          mode: 'time',
          is24Hour: true,
          onChange: (_timeEvent, selectedTime) => {
            if (!selectedTime) {
              return;
            }

            const next = new Date(selected);
            next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            updateOnboardingDraft({ lastCigaretteAt: next.toISOString() });
          },
        });
      },
    });
  };

  return (
    <OnboardingScaffold
      step={1}
      total={4}
      title={i18n.t('onboarding.lastCigaretteTitle')}
      subtitle={i18n.t('onboarding.lastCigaretteBody')}
      onBack={() => router.back()}
      footer={<Button label={i18n.t('common.continue')} onPress={() => router.push('/cigarettes-per-day')} />}
    >
      <View style={{ gap: SPACING.md }}>
        <OnboardingOptionCard
          title={i18n.t('onboarding.recentOption')}
          subtitle={i18n.t('onboarding.recentOptionBody')}
          selected={elapsed.totalMs <= 60 * 60 * 1000}
          onPress={() => setPreset(0)}
        />
        <OnboardingOptionCard
          title={i18n.t('onboarding.todayOption')}
          subtitle={i18n.t('onboarding.todayOptionBody')}
          selected={elapsed.totalMs > 60 * 60 * 1000 && elapsed.days === 0}
          onPress={() => setPreset(6)}
        />
        <OnboardingOptionCard
          title={i18n.t('onboarding.yesterdayOption')}
          subtitle={i18n.t('onboarding.yesterdayOptionBody')}
          selected={elapsed.days === 1}
          onPress={() => setPreset(24)}
        />
        <OnboardingOptionCard
          title={i18n.t('onboarding.customDateOption')}
          subtitle={selectedDate.toLocaleString('fr-CH')}
          selected={elapsed.days > 1}
          onPress={() => {
            if (Platform.OS === 'android') {
              openAndroidDateTimePicker();
              return;
            }
            setShowIosPicker((value) => !value);
          }}
        />

        {Platform.OS === 'ios' && showIosPicker ? (
          <View
            style={{
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.bgCardBorder,
              backgroundColor: colors.bgSurface,
              paddingHorizontal: 8,
              paddingVertical: 8,
            }}
          >
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              maximumDate={new Date()}
              onChange={(_, value) => value && updateOnboardingDraft({ lastCigaretteAt: value.toISOString() })}
            />
          </View>
        ) : null}

        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 12, marginTop: 4 }]}>
          {i18n.t('onboarding.elapsedSince')} {elapsed.days}j {elapsed.hours}h {elapsed.minutes}min
        </Text>
      </View>
    </OnboardingScaffold>
  );
}
