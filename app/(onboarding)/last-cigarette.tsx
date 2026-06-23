import WheelPicker from '@quidone/react-native-wheel-picker';
import { type Href, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, type TextStyle, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { getCounterBreakdown } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

const ITEM_HEIGHT = 42;
const VISIBLE_ITEMS = 3;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

function getLastUseCopy(productType: string) {
  switch (productType) {
    case 'vape_puffs':
    case 'vape_pods':
      return { title: 'Ta dernière session de vape.', subtitle: "C'était quand ?" };
    case 'rolling':
      return { title: 'Ta dernière roulée.', subtitle: "C'était quand ?" };
    case 'cigarillo':
      return { title: 'Ton dernier cigarillo.', subtitle: "C'était quand ?" };
    case 'cigar':
      return { title: 'Ton dernier cigare.', subtitle: "C'était quand ?" };
    case 'pipe':
      return { title: 'Ta dernière pipée.', subtitle: "C'était quand ?" };
    default:
      return { title: 'Ta dernière cigarette.', subtitle: "C'était quand ?" };
  }
}

function formatElapsedLabel(totalMs: number) {
  const totalMinutes = Math.max(Math.floor(totalMs / (60 * 1000)), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes}min`;
  }

  return `${hours}h${minutes.toString().padStart(2, '0')}min`;
}

function clampToNow(date: Date) {
  const now = new Date();
  return date.getTime() > now.getTime() ? now : date;
}

export default function LastCigaretteScreen() {
  const router = useRouter();
  const { colors } = useTheme('dark');
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);
  const productType = onboardingDraft?.productType ?? profile?.productType ?? 'cigarette';
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(20, 0, 0, 0);
    return d;
  }, []);

  const selectedDate = useMemo(
    () =>
      new Date(
        onboardingDraft?.lastCigaretteAt ?? profile?.lastCigaretteAt ?? defaultDate.toISOString(),
      ),
    [onboardingDraft?.lastCigaretteAt, profile?.lastCigaretteAt, defaultDate],
  );
  const elapsed = getCounterBreakdown(selectedDate.toISOString());
  const copy = getLastUseCopy(productType);

  const dateItems = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, index) => {
      const date = new Date();
      date.setDate(now.getDate() - (7 - index));
      date.setHours(0, 0, 0, 0);

      let label = date.toLocaleDateString('fr-CH', {
        day: '2-digit',
        month: 'short',
      });

      const diffDays = Math.round((now.setHours(0, 0, 0, 0) - date.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays === 0) label = "Aujourd'hui";
      if (diffDays === 1) label = 'Hier';
      if (diffDays === 2) label = 'Avant-hier';

      return {
        value: date.toISOString(),
        label,
      };
    });
  }, []);

  const hourItems = useMemo(
    () =>
      Array.from({ length: 24 }, (_, value) => ({
        value,
        label: `${String(value).padStart(2, '0')}h`,
      })),
    [],
  );

  const minuteItems = useMemo(
    () =>
      Array.from({ length: 60 }, (_, value) => ({
        value,
        label: String(value).padStart(2, '0'),
      })),
    [],
  );

  const selectedDateValue = useMemo(() => {
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);
    return (
      dateItems.find((item) => {
        const itemDate = new Date(item.value);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === selectedDay.getTime();
      })?.value ?? dateItems[dateItems.length - 1]?.value
    );
  }, [dateItems, selectedDate]);

  const updateDay = (isoDate: string) => {
    const nextDay = new Date(isoDate);
    nextDay.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
    updateOnboardingDraft({ lastCigaretteAt: clampToNow(nextDay).toISOString() });
  };

  const updateHour = (hour: number) => {
    const next = new Date(selectedDate);
    next.setHours(hour, next.getMinutes(), 0, 0);
    updateOnboardingDraft({ lastCigaretteAt: clampToNow(next).toISOString() });
  };

  const updateMinute = (minute: number) => {
    const next = new Date(selectedDate);
    next.setHours(next.getHours(), minute, 0, 0);
    updateOnboardingDraft({ lastCigaretteAt: clampToNow(next).toISOString() });
  };

  const itemTextStyle: TextStyle = {
    ...FONTS.bold,
    color: colors.textPrimary,
    fontSize: 13,
  };

  return (
    <OnboardingScaffold
      step={2}
      total={5}
      title={copy.title}
      subtitle={copy.subtitle}
      onBack={() => router.back()}
      footer={
        <Button
          label={i18n.t('common.continue')}
          onPress={() => router.push('/(onboarding)/cigarettes-per-day' as Href)}
        />
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: 14, paddingTop: 8, paddingBottom: 24 }}>
        {/* Quick-select chips */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            maxWidth: 336,
            alignSelf: 'center',
          }}
        >
          {[
            {
              label: "Il y a moins d'1h",
              onPress: () => {
                const d = new Date();
                d.setMinutes(d.getMinutes() - 30);
                updateOnboardingDraft({ lastCigaretteAt: d.toISOString() });
              },
            },
            {
              label: 'Ce matin',
              onPress: () => {
                const d = new Date();
                d.setHours(8, 0, 0, 0);
                updateOnboardingDraft({ lastCigaretteAt: clampToNow(d).toISOString() });
              },
            },
            {
              label: 'Hier soir',
              onPress: () => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                d.setHours(20, 0, 0, 0);
                updateOnboardingDraft({ lastCigaretteAt: d.toISOString() });
              },
            },
            {
              label: 'Il y a 2 jours',
              onPress: () => {
                const d = new Date();
                d.setDate(d.getDate() - 2);
                d.setHours(20, 0, 0, 0);
                updateOnboardingDraft({ lastCigaretteAt: d.toISOString() });
              },
            },
          ].map((chip) => (
            <Pressable
              key={chip.label}
              onPress={chip.onPress}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.accentBg,
              }}
            >
              <Text style={[FONTS.regular, { color: colors.accent, fontSize: 11 }]}>
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={{
            width: '100%',
            maxWidth: 336,
            alignSelf: 'center',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.bgCardBorder,
            backgroundColor: colors.bgCard,
            overflow: 'hidden',
            paddingTop: 16,
            paddingBottom: 14,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 13 }}>⏰</Text>
            <Text
              style={[
                FONTS.bold,
                {
                  color: colors.accent,
                  fontSize: 9,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                },
              ]}
            >
              Date et heure
            </Text>
          </View>

          <View style={{ position: 'relative', height: WHEEL_HEIGHT, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <WheelPicker
                data={dateItems}
                value={selectedDateValue}
                onValueChanged={({ item }) => updateDay(item.value)}
                itemHeight={ITEM_HEIGHT}
                visibleItemCount={VISIBLE_ITEMS}
                width={144}
                enableScrollByTapOnItem
                style={{ backgroundColor: 'transparent' }}
                itemTextStyle={itemTextStyle}
                overlayItemStyle={{
                  backgroundColor: colors.cardSelected,
                  borderTopWidth: 0.5,
                  borderBottomWidth: 0.5,
                  borderColor: colors.accentBorder,
                  borderRadius: 12,
                }}
              />

              <View style={{ width: 0.5, height: 86, backgroundColor: colors.divider }} />

              <WheelPicker
                data={hourItems}
                value={selectedDate.getHours()}
                onValueChanged={({ item }) => updateHour(item.value)}
                itemHeight={ITEM_HEIGHT}
                visibleItemCount={VISIBLE_ITEMS}
                width={62}
                enableScrollByTapOnItem
                style={{ backgroundColor: 'transparent' }}
                itemTextStyle={itemTextStyle}
                overlayItemStyle={{
                  backgroundColor: colors.cardSelected,
                  borderTopWidth: 0.5,
                  borderBottomWidth: 0.5,
                  borderColor: colors.accentBorder,
                }}
              />

              <View style={{ width: 0.5, height: 86, backgroundColor: colors.divider }} />

              <WheelPicker
                data={minuteItems}
                value={selectedDate.getMinutes()}
                onValueChanged={({ item }) => updateMinute(item.value)}
                itemHeight={ITEM_HEIGHT}
                visibleItemCount={VISIBLE_ITEMS}
                width={48}
                enableScrollByTapOnItem
                style={{ backgroundColor: 'transparent' }}
                itemTextStyle={itemTextStyle}
                overlayItemStyle={{
                  backgroundColor: colors.cardSelected,
                  borderTopWidth: 0.5,
                  borderBottomWidth: 0.5,
                  borderColor: colors.accentBorder,
                  borderRadius: 12,
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            backgroundColor: colors.accentBg,
            paddingHorizontal: 12,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 336,
            alignSelf: 'center',
          }}
        >
          <Text style={[FONTS.bold, { color: colors.accent, fontSize: 12 }]}>
            • {i18n.t('onboarding.elapsedSince')} {formatElapsedLabel(elapsed.totalMs)}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>en cours...</Text>
        </View>

        <Pressable onPress={() => updateOnboardingDraft({ lastCigaretteAt: new Date().toISOString() })}>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11, textAlign: 'center' }]}>
            {i18n.t('onboarding.dontRemember')}
          </Text>
        </Pressable>
      </View>
    </OnboardingScaffold>
  );
}
