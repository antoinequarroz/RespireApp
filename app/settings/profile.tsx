import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { SettingsScreenHeader } from '@/components/ui/SettingsScreenHeader';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

function Label({ children }: { children: string }) {
  const { colors } = useTheme();

  return (
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
      {children}
    </Text>
  );
}

function Surface({
  children,
  style,
}: {
  children: ReactNode;
  style?: object;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          borderRadius: RADII.lg,
          borderWidth: 0.5,
          borderColor: colors.bgCardBorder,
          backgroundColor: colors.bgCard,
          paddingHorizontal: 12,
          paddingVertical: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default function SettingsProfileScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [date, setDate] = useState<Date>(profile ? new Date(profile.lastCigaretteAt) : new Date());
  const [cigarettesPerDay, setCigarettesPerDay] = useState(profile?.cigarettesPerDay ?? 10);
  const [packPrice, setPackPrice] = useState(String(profile?.packPrice ?? 10.5));
  const [showIosPicker, setShowIosPicker] = useState(false);

  const formatDate = (value: Date) =>
    value.toLocaleString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

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

  const saveProfile = () => {
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
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        gap: SPACING.lg,
        paddingBottom: SPACING.xxl,
      }}
    >
      <View style={{ gap: 14 }}>
        <SettingsScreenHeader
          title={i18n.t('settingsScreen.profile')}
          subtitle={i18n.t('settingsScreen.profileBody')}
        />
        <Surface
          style={{
            backgroundColor: 'rgba(255, 77, 109, 0.08)',
            borderColor: 'rgba(255, 77, 109, 0.2)',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <Ionicons name="alert-circle-outline" size={16} color={fixed.sos} style={{ marginTop: 1 }} />
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 }]}>
            {i18n.t('settingsScreen.profileWarning')}
          </Text>
        </Surface>
      </View>

      <Surface style={{ gap: 14 }}>
        <View style={{ gap: 8 }}>
          <Label>{i18n.t('onboarding.lastCigarette')}</Label>
          {Platform.OS === 'android' ? (
            <Pressable
              onPress={openAndroidDateTimePicker}
              style={{
                minHeight: 50,
                justifyContent: 'center',
                borderRadius: RADII.md,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.accentBg,
                paddingHorizontal: 12,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>{formatDate(date)}</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => setShowIosPicker((value) => !value)}
                style={{
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: RADII.md,
                  borderWidth: 1,
                  borderColor: colors.accentBorder,
                  backgroundColor: colors.accentBg,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>{formatDate(date)}</Text>
              </Pressable>
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

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Label>{i18n.t('onboarding.cigarettesPerDay')}</Label>
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 14 }]}>
              {Math.round(cigarettesPerDay)} {i18n.t('onboarding.cigarettesUnit')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable
              onPress={() => setCigarettesPerDay((value) => Math.max(1, value - 1))}
              style={{
                height: 38,
                width: 38,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
                backgroundColor: colors.bgPrimary,
              }}
            >
              <Ionicons name="remove" size={16} color={colors.textPrimary} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Slider
                minimumValue={1}
                maximumValue={60}
                step={1}
                minimumTrackTintColor={fixed.purple}
                maximumTrackTintColor={colors.dividerStrong}
                value={cigarettesPerDay}
                onValueChange={setCigarettesPerDay}
              />
            </View>
            <Pressable
              onPress={() => setCigarettesPerDay((value) => Math.min(60, value + 1))}
              style={{
                height: 38,
                width: 38,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                borderWidth: 0.5,
                borderColor: colors.bgCardBorder,
                backgroundColor: colors.bgPrimary,
              }}
            >
              <Ionicons name="add" size={16} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Label>{i18n.t('onboarding.packPrice')}</Label>
          <View
            style={{
              borderRadius: RADII.md,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              backgroundColor: colors.bgPrimary,
              paddingHorizontal: 12,
              paddingVertical: 2,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 13 }]}>EUR</Text>
            <TextInput
              keyboardType="decimal-pad"
              value={packPrice}
              onChangeText={setPackPrice}
              placeholder="11,50"
              placeholderTextColor={colors.textMuted}
              style={[
                FONTS.bold,
                {
                  flex: 1,
                  color: colors.textPrimary,
                  fontSize: 13,
                  paddingVertical: 10,
                },
              ]}
            />
          </View>
        </View>
      </Surface>

      <Button label={i18n.t('settingsScreen.saveChanges')} onPress={saveProfile} />
    </ScrollView>
  );
}
