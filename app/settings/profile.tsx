import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function SettingsProfileScreen() {
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
      maximumDate: new Date(),
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.profile')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.profileBody')}
        </Text>
      </View>

      <Card style={{ gap: SPACING.md }}>
        <View>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.2 }]}>
            {i18n.t('onboarding.lastCigarette')}
          </Text>
          {Platform.OS === 'android' ? (
            <Button
              label={date.toLocaleString('fr-CH')}
              variant="secondary"
              style={{ marginTop: 8 }}
              onPress={openAndroidDateTimePicker}
            />
          ) : (
            <>
              <Button
                label={date.toLocaleString('fr-CH')}
                variant="secondary"
                style={{ marginTop: 8 }}
                onPress={() => setShowIosPicker((value) => !value)}
              />
              {showIosPicker ? (
                <DateTimePicker
                  value={date}
                  mode="datetime"
                  maximumDate={new Date()}
                  onChange={(_, value) => value && setDate(value)}
                />
              ) : null}
            </>
          )}
        </View>

        <View>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.2 }]}>
            {i18n.t('onboarding.cigarettesPerDay')}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, marginTop: 8 }]}>
            {Math.round(cigarettesPerDay)} {i18n.t('onboarding.cigarettesUnit')}
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={60}
            step={1}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.dividerStrong}
            value={cigarettesPerDay}
            onValueChange={setCigarettesPerDay}
          />
        </View>

        <View>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 9, letterSpacing: 1.2 }]}>
            {i18n.t('onboarding.packPrice')}
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            value={packPrice}
            onChangeText={setPackPrice}
            style={[
              FONTS.bold,
              {
                marginTop: 8,
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
        </View>
      </Card>

      <Card
        style={{
          backgroundColor: colors.accentBg,
          borderColor: colors.accentBorder,
          borderWidth: 1,
        }}
      >
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.profileWarning')}
        </Text>
      </Card>

      <Button
        label={i18n.t('settingsScreen.saveChanges')}
        onPress={() =>
          Alert.alert(i18n.t('settingsScreen.profile'), i18n.t('settingsScreen.profileConfirm'), [
            { text: i18n.t('common.cancel'), style: 'cancel' },
            {
              text: i18n.t('common.save'),
              onPress: () => {
                if (!profile) {
                  return;
                }

                setProfile({
                  ...profile,
                  lastCigaretteAt: date.toISOString(),
                  cigarettesPerDay: Math.round(cigarettesPerDay),
                  packPrice: Number(packPrice.replace(',', '.')) || 0,
                });
                router.back();
              },
            },
          ])
        }
      />
    </ScrollView>
  );
}
