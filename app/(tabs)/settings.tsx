import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, ScrollView, Switch, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { requestNotificationPermission, syncDailyReminder } from '@/services/notifications';
import { openSubscriptionManagement } from '@/services/revenuecat';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

function SettingsRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontFamily: 'Poppins_700Bold' }}>{label}</Text>
        {value ? (
          <Text
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              fontFamily: 'Poppins_400Regular',
            }}
          >
            {value}
          </Text>
        ) : null}
      </View>
      {children ? <View style={{ marginTop: 10 }}>{children}</View> : null}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const reminderHour = useUserStore((state) => state.reminderHour);
  const reminderMinute = useUserStore((state) => state.reminderMinute);
  const setReminder = useUserStore((state) => state.setReminder);
  const language = useUserStore((state) => state.language);
  const setLanguage = useUserStore((state) => state.setLanguage);
  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);
  const setNotificationPermissionGranted = useProgressStore(
    (state) => state.setNotificationPermissionGranted,
  );
  const [reminderDate, setReminderDate] = useState(() => {
    const value = new Date();
    value.setHours(reminderHour, reminderMinute, 0, 0);
    return value;
  });
  const [showIosTimePicker, setShowIosTimePicker] = useState(false);

  const openAndroidTimePicker = () => {
    if (Platform.OS !== 'android') {
      return;
    }

    DateTimePickerAndroid.open({
      value: reminderDate,
      mode: 'time',
      is24Hour: true,
      onChange: (_, value) => {
        if (!value) {
          return;
        }

        setReminderDate(value);
        setReminder(reminderEnabled, value.getHours(), value.getMinutes());
      },
    });
  };

  const sectionLabelStyle = [
    FONTS.bold,
    {
      color: colors.textMuted,
      fontSize: 8,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.title')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          Regle ton cadre. Tout ce qui t aide a tenir se passe ici.
        </Text>
      </View>

      <Card
        style={{
          backgroundColor: colors.bgSurface,
          borderColor: colors.bgCardBorder,
        }}
      >
        <Text style={sectionLabelStyle}>Profil</Text>
        <SettingsRow
          label={i18n.t('settingsScreen.profile')}
          value={`${profile?.cigarettesPerDay ?? 0} / ${profile?.packPrice ?? 0} EUR`}
        />
      </Card>

      <Card
        style={{
          backgroundColor: colors.bgSurface,
          borderColor: colors.bgCardBorder,
        }}
      >
        <Text style={sectionLabelStyle}>Rappels</Text>
        <SettingsRow label={i18n.t('settingsScreen.dailyReminder')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
              Activer le rappel quotidien
            </Text>
            <Switch
              value={reminderEnabled}
              onValueChange={(value) => {
                setReminder(value, reminderDate.getHours(), reminderDate.getMinutes());
                syncDailyReminder(value, reminderDate.getHours(), reminderDate.getMinutes()).catch(
                  () => undefined,
                );
              }}
            />
          </View>
        </SettingsRow>
        <SettingsRow
          label={i18n.t('settingsScreen.reminderTime')}
          value={reminderDate.toLocaleTimeString('fr-CH', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        >
          {Platform.OS === 'android' ? (
            <Button
              label="Modifier l heure"
              variant="secondary"
              onPress={openAndroidTimePicker}
            />
          ) : (
            <>
              <Button
                label="Modifier l heure"
                variant="secondary"
                onPress={() => setShowIosTimePicker((value) => !value)}
              />
              {showIosTimePicker ? (
                <DateTimePicker
                  value={reminderDate}
                  mode="time"
                  onChange={(_, value) => {
                    if (!value) {
                      return;
                    }
                    setReminderDate(value);
                    setReminder(reminderEnabled, value.getHours(), value.getMinutes());
                  }}
                />
              ) : null}
            </>
          )}
        </SettingsRow>
        <SettingsRow label={i18n.t('settingsScreen.requestPermission')}>
          <Button
            label="Demander l acces"
            variant="secondary"
            onPress={() =>
              requestNotificationPermission()
                .then((granted) => setNotificationPermissionGranted(granted))
                .catch(() => setNotificationPermissionGranted(false))
            }
          />
        </SettingsRow>
      </Card>

      <Card
        style={{
          backgroundColor: colors.bgSurface,
          borderColor: colors.bgCardBorder,
        }}
      >
        <Text style={sectionLabelStyle}>Personnalisation</Text>
        <SettingsRow label={i18n.t('settingsScreen.language')}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['fr', 'en', 'de'] as const).map((item) => (
              <Button
                key={item}
                label={i18n.t(`common.${item}`)}
                variant={language === item ? 'primary' : 'secondary'}
                style={{ flex: 1 }}
                onPress={() => setLanguage(item)}
              />
            ))}
          </View>
        </SettingsRow>
        <SettingsRow label={i18n.t('common.theme')}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['light', 'dark', 'system'] as const).map((item) => (
              <Button
                key={item}
                label={i18n.t(`common.${item}`)}
                variant={theme === item ? 'primary' : 'secondary'}
                style={{ flex: 1 }}
                onPress={() => setTheme(item)}
              />
            ))}
          </View>
        </SettingsRow>
      </Card>

      <Card
        style={{
          backgroundColor: colors.accentBg,
          borderColor: colors.accentBorder,
          borderWidth: 1,
        }}
      >
        <Text style={sectionLabelStyle}>Abonnement</Text>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, marginTop: 8 }]}>
          {i18n.t('settingsScreen.subscription')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, marginTop: 6 }]}>
          Gere ton acces premium et garde le suivi complet sous la main.
        </Text>
        <Button
          label={i18n.t('settingsScreen.manageSubscription')}
          style={{ marginTop: 16 }}
          onPress={() => openSubscriptionManagement().catch(() => undefined)}
        />
      </Card>
    </ScrollView>
  );
}
