import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

const TOTAL_STEPS = 4 as const;
type FlowStep = 0 | 1 | 2 | 3;

interface ChoiceCardProps {
  active: boolean;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

function ChoiceCard({ active, title, subtitle, onPress }: ChoiceCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: RADII.lg,
        borderWidth: 1,
        borderColor: active ? colors.accent : colors.bgCardBorder,
        backgroundColor: active ? colors.accentBg : colors.bgCard,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 4,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={[FONTS.bold, { color: active ? colors.accent : colors.textPrimary, fontSize: 13 }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[FONTS.regular, { color: active ? colors.emerald : colors.textMuted, fontSize: 11 }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: active ? colors.accent : colors.accentBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {active ? (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: colors.accent,
              }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function SetupScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [date, setDate] = useState<Date>(profile ? new Date(profile.lastCigaretteAt) : new Date());
  const [cigarettesPerDay, setCigarettesPerDay] = useState(profile?.cigarettesPerDay ?? 10);
  const [packPrice, setPackPrice] = useState(String(profile?.packPrice ?? 10.5));
  const [showIosPicker, setShowIosPicker] = useState(false);
  const [motivations, setMotivations] = useState<string[]>(profile?.motivations ?? []);
  const [step, setStep] = useState<FlowStep>(0);

  const cigaretteOptions = [
    { value: 4, title: i18n.t('onboarding.cigarettesOptionOne'), subtitle: i18n.t('onboarding.cigarettesSaveOne') },
    { value: 8, title: i18n.t('onboarding.cigarettesOptionTwo'), subtitle: i18n.t('onboarding.cigarettesSaveTwo') },
    { value: 15, title: i18n.t('onboarding.cigarettesOptionThree'), subtitle: i18n.t('onboarding.cigarettesSaveThree') },
    { value: 24, title: i18n.t('onboarding.cigarettesOptionFour'), subtitle: i18n.t('onboarding.cigarettesSaveFour') },
  ];

  const priceOptions = [8.5, 10.5, 12.5, 14.5];

  const progress = useMemo(() => [0, 1, 2, 3].map((value) => value <= step), [step]);
  const motivationOptions = [
    i18n.t('onboarding.motivationHealth'),
    i18n.t('onboarding.motivationMoney'),
    i18n.t('onboarding.motivationSport'),
    i18n.t('onboarding.motivationFamily'),
    i18n.t('onboarding.motivationFreedom'),
    i18n.t('onboarding.motivationOther'),
  ];

  const openAndroidDateTimePicker = () => {
    if (Platform.OS !== 'android') {
      return;
    }

    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      is24Hour: true,
      onChange: (_, selectedDate) => {
        if (!selectedDate) {
          return;
        }

        DateTimePickerAndroid.open({
          value: selectedDate,
          mode: 'time',
          is24Hour: true,
          onChange: (_timeEvent, selectedTime) => {
            if (!selectedTime) {
              return;
            }

            const nextDate = new Date(selectedDate);
            nextDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            setDate(nextDate);
          },
        });
      },
    });
  };

  const saveAndContinue = () => {
    setProfile({
      lastCigaretteAt: date.toISOString(),
      cigarettesPerDay: Math.round(cigarettesPerDay),
      packPrice: Number(packPrice.replace(',', '.')) || 0,
      motivations,
    });
    router.push('/notifications');
  };

  const next = () => {
    if (step < 3) {
      setStep((current) => (current + 1) as FlowStep);
      return;
    }

    saveAndContinue();
  };

  const stepTitle =
    step === 0
      ? i18n.t('onboarding.stepOneTitle')
      : step === 1
        ? i18n.t('onboarding.stepTwoTitle')
        : step === 2
          ? i18n.t('onboarding.stepThreeTitle')
          : i18n.t('onboarding.stepFourTitle');

  const stepBody =
    step === 0
      ? i18n.t('onboarding.stepOneBody')
      : step === 1
        ? i18n.t('onboarding.stepTwoBody')
        : step === 2
          ? i18n.t('onboarding.stepThreeBody')
          : i18n.t('onboarding.stepFourBody');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xl,
      }}
    >
      <View style={{ gap: SPACING.lg, paddingTop: SPACING.md }}>
        <Pressable
          onPress={() => (step === 0 ? router.back() : setStep((current) => (current - 1) as FlowStep))}
          style={{
            width: 30,
            height: 30,
            borderRadius: 12,
            backgroundColor: colors.bgCard,
            borderWidth: 0.5,
            borderColor: colors.bgCardBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 16 }]}>‹</Text>
        </Pressable>

        <View style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {progress.map((active, index) => (
              <View
                key={index}
                style={{
                  width: active && step === index ? 22 : 8,
                  height: 4,
                  borderRadius: RADII.full,
                  backgroundColor: active ? colors.accent : colors.dividerStrong,
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text
            style={[
              FONTS.bold,
              { color: colors.accent, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' },
            ]}
          >
            {i18n.t('onboarding.stepLabel', { current: step + 1, total: TOTAL_STEPS })}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>{stepTitle}</Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>{stepBody}</Text>
        </View>
      </View>

      <View style={{ marginTop: SPACING.xl, gap: SPACING.md }}>
        {step === 0 ? (
          <>
            <ChoiceCard
              active
              title={date.toLocaleDateString('fr-CH', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
              subtitle={date.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
              onPress={Platform.OS === 'android' ? openAndroidDateTimePicker : () => setShowIosPicker((value) => !value)}
            />
            {Platform.OS === 'ios' && showIosPicker ? (
              <View
                style={{
                  borderRadius: RADII.lg,
                  backgroundColor: colors.bgCard,
                  borderWidth: 0.5,
                  borderColor: colors.bgCardBorder,
                  padding: 12,
                }}
              >
                <DateTimePicker value={date} mode="datetime" onChange={(_, value) => value && setDate(value)} />
              </View>
            ) : null}
          </>
        ) : null}

        {step === 1 ? (
          <>
            {cigaretteOptions.map((option) => (
              <ChoiceCard
                key={option.value}
                active={Math.round(cigarettesPerDay) === option.value}
                title={option.title}
                subtitle={option.subtitle}
                onPress={() => setCigarettesPerDay(option.value)}
              />
            ))}

            <View
              style={{
                borderRadius: RADII.lg,
                backgroundColor: colors.bgCard,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.2 }]}>
                {i18n.t('onboarding.customQuantity')}
              </Text>
              <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 20, marginTop: 8 }]}>
                {Math.round(cigarettesPerDay)} {i18n.t('onboarding.cigarettesUnit')}
              </Text>
              <Slider
                minimumValue={1}
                maximumValue={40}
                step={1}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.dividerStrong}
                thumbTintColor={fixed.purple}
                value={cigarettesPerDay}
                onValueChange={setCigarettesPerDay}
              />
            </View>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
              {priceOptions.map((option) => {
                const active = Number(packPrice.replace(',', '.')) === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setPackPrice(String(option))}
                    style={{
                      width: '47%',
                      borderRadius: RADII.lg,
                      borderWidth: 1,
                      borderColor: active ? colors.accent : colors.bgCardBorder,
                      backgroundColor: active ? colors.accent : colors.bgCard,
                      paddingVertical: 18,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={[
                        FONTS.bold,
                        { color: active ? colors.bgDeep : colors.textPrimary, fontSize: 13 },
                      ]}
                    >
                      {option.toFixed(2).replace('.', ',')} EUR
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View
              style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.bgCard,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.2 }]}>
                {i18n.t('onboarding.customPrice')}
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                value={packPrice}
                onChangeText={setPackPrice}
                style={[
                  FONTS.bold,
                  {
                    color: colors.textPrimary,
                    fontSize: 16,
                    marginTop: 8,
                  },
                ]}
              />
            </View>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
              {motivationOptions.map((option) => {
                const active = motivations.includes(option);

                return (
                  <Pressable
                    key={option}
                    onPress={() =>
                      setMotivations((current) =>
                        current.includes(option)
                          ? current.filter((item) => item !== option)
                          : [...current, option],
                      )
                    }
                    style={{
                      width: '47%',
                      borderRadius: RADII.lg,
                      borderWidth: 1,
                      borderColor: active ? colors.accent : colors.bgCardBorder,
                      backgroundColor: active ? colors.accent : colors.bgCard,
                      paddingVertical: 16,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={[
                        FONTS.bold,
                        { color: active ? colors.bgDeep : colors.textPrimary, fontSize: 13, textAlign: 'center' },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={saveAndContinue} style={{ alignSelf: 'flex-start', paddingVertical: 8 }}>
              <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 13 }]}>
                {i18n.t('onboarding.skipMotivation')}
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>

      <View style={{ marginTop: 'auto', paddingBottom: SPACING.sm }}>
        <Button label={step === 3 ? i18n.t('onboarding.finishCta') : i18n.t('common.continue')} onPress={next} />
      </View>
    </View>
  );
}
