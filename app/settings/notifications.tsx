import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Linking, Platform, ScrollView, Switch, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { requestNotificationPermission, syncDailyReminder } from '@/services/notifications';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.divider,
      }}
    >
      <Text style={[FONTS.regular, { color: colors.textPrimary, fontSize: 13, flex: 1 }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

export default function SettingsNotificationsScreen() {
  const { colors } = useTheme();
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const reminderHour = useUserStore((state) => state.reminderHour);
  const reminderMinute = useUserStore((state) => state.reminderMinute);
  const milestoneNotificationsEnabled = useUserStore((state) => state.milestoneNotificationsEnabled);
  const motivationNotificationsEnabled = useUserStore((state) => state.motivationNotificationsEnabled);
  const setReminder = useUserStore((state) => state.setReminder);
  const setNotificationPreferences = useUserStore((state) => state.setNotificationPreferences);
  const notificationPermissionGranted = useProgressStore((state) => state.notificationPermissionGranted);
  const setNotificationPermissionGranted = useProgressStore((state) => state.setNotificationPermissionGranted);
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.notifications')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.notificationsBody')}
        </Text>
      </View>

      {!notificationPermissionGranted ? (
        <Card
          style={{
            backgroundColor: colors.accentBg,
            borderColor: colors.accentBorder,
            borderWidth: 1,
            gap: 10,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('settingsScreen.permissionDenied')}
          </Text>
          <Button label={i18n.t('settingsScreen.openSystemSettings')} variant="secondary" onPress={() => Linking.openSettings()} />
        </Card>
      ) : null}

      <Card>
        <ToggleRow
          label={i18n.t('settingsScreen.dailyReminder')}
          value={reminderEnabled}
          onChange={(value) => {
            setReminder(value, reminderDate.getHours(), reminderDate.getMinutes());
            syncDailyReminder(value, reminderDate.getHours(), reminderDate.getMinutes()).catch(() => undefined);
          }}
        />

        <View style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.divider }}>
          <Text style={[FONTS.regular, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('settingsScreen.reminderTime')}
          </Text>
          {Platform.OS === 'android' ? (
            <Button
              label={reminderDate.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
              variant="secondary"
              style={{ marginTop: 10 }}
              onPress={openAndroidTimePicker}
            />
          ) : (
            <>
              <Button
                label={reminderDate.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                variant="secondary"
                style={{ marginTop: 10 }}
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
        </View>

        <ToggleRow
          label={i18n.t('settingsScreen.milestoneNotifications')}
          value={milestoneNotificationsEnabled}
          onChange={(value) => setNotificationPreferences({ milestoneNotificationsEnabled: value })}
        />
        <ToggleRow
          label={i18n.t('settingsScreen.motivationNotifications')}
          value={motivationNotificationsEnabled}
          onChange={(value) => setNotificationPreferences({ motivationNotificationsEnabled: value })}
        />
      </Card>

      <Button
        label={i18n.t('settingsScreen.requestPermission')}
        variant="secondary"
        onPress={() =>
          requestNotificationPermission()
            .then((granted) => setNotificationPermissionGranted(granted))
            .catch(() => setNotificationPermissionGranted(false))
        }
      />
    </ScrollView>
  );
}
