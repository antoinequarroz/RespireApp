import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function SetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [date, setDate] = useState<Date>(profile ? new Date(profile.lastCigaretteAt) : new Date());
  const [cigarettesPerDay, setCigarettesPerDay] = useState(profile?.cigarettesPerDay ?? 10);
  const [packPrice, setPackPrice] = useState(String(profile?.packPrice ?? 10.5));
  const [showIosPicker, setShowIosPicker] = useState(false);

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

  const inputLabelStyle = [
    FONTS.bold,
    {
      color: colors.textMuted,
      fontSize: 9,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xl,
      }}
    >
      <View style={{ gap: SPACING.sm }}>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('onboarding.setupTitle')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('onboarding.setupBody')}
        </Text>
      </View>

      <View style={{ marginTop: SPACING.xl, gap: SPACING.md }}>
        <Card>
          <Text style={inputLabelStyle}>{i18n.t('onboarding.lastCigarette')}</Text>
          <View style={{ marginTop: SPACING.sm }}>
            {Platform.OS === 'android' ? (
              <Button
                label={date.toLocaleString('fr-CH')}
                variant="secondary"
                onPress={openAndroidDateTimePicker}
              />
            ) : (
              <>
                <Button
                  label={date.toLocaleString('fr-CH')}
                  variant="secondary"
                  onPress={() => setShowIosPicker((value) => !value)}
                />
                {showIosPicker ? (
                  <DateTimePicker
                    value={date}
                    mode="datetime"
                    onChange={(_, value) => value && setDate(value)}
                  />
                ) : null}
              </>
            )}
          </View>
        </Card>

        <Card>
          <Text style={inputLabelStyle}>{i18n.t('onboarding.cigarettesPerDay')}</Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, marginTop: 8 }]}>
            {Math.round(cigarettesPerDay)}
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={40}
            step={1}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.dividerStrong}
            value={cigarettesPerDay}
            onValueChange={setCigarettesPerDay}
          />
        </Card>

        <Card>
          <Text style={inputLabelStyle}>{i18n.t('onboarding.packPrice')}</Text>
          <TextInput
            keyboardType="decimal-pad"
            value={packPrice}
            onChangeText={setPackPrice}
            style={[
              FONTS.bold,
              {
                marginTop: SPACING.sm,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.bgCard,
                color: colors.textPrimary,
                fontSize: 13,
                paddingHorizontal: 12,
                paddingVertical: 10,
              },
            ]}
          />
        </Card>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <Button
          label={i18n.t('common.continue')}
          onPress={() => {
            setProfile({
              lastCigaretteAt: date.toISOString(),
              cigarettesPerDay: Math.round(cigarettesPerDay),
              packPrice: Number(packPrice.replace(',', '.')) || 0,
            });
            router.push('/ready');
          }}
        />
      </View>
    </View>
  );
}
