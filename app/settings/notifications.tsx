import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { SettingsScreenHeader } from '@/components/ui/SettingsScreenHeader';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { usePremiumGate } from '@/hooks/usePremiumGate';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { requestNotificationPermission } from '@/services/notifications';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

function SettingRow({
  label,
  value,
  onChange,
  hideBorder = false,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  hideBorder?: boolean;
}) {
  const { colors, fixed } = useTheme();

  return (
    <View
      style={{
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: hideBorder ? 0 : 0.5,
        borderBottomColor: colors.divider,
      }}
    >
      <Text style={[FONTS.regular, { color: colors.textPrimary, fontSize: 13, flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.dividerStrong, true: fixed.purple }}
        thumbColor="#FFFFFF"
      />
    </View>
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

export default function SettingsNotificationsScreen() {
  const { colors } = useTheme();
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const reminderHour = useUserStore((state) => state.reminderHour);
  const reminderMinute = useUserStore((state) => state.reminderMinute);
  const milestoneNotificationsEnabled = useUserStore((state) => state.milestoneNotificationsEnabled);
  const motivationNotificationsEnabled = useUserStore((state) => state.motivationNotificationsEnabled);
  const notifCategories = useUserStore((state) => state.notifCategories);
  const setReminder = useUserStore((state) => state.setReminder);
  const setNotificationPreferences = useUserStore((state) => state.setNotificationPreferences);
  const setNotifCategories = useUserStore((state) => state.setNotifCategories);
  const notificationPermissionGranted = useProgressStore((state) => state.notificationPermissionGranted);
  const setNotificationPermissionGranted = useProgressStore((state) => state.setNotificationPermissionGranted);
  const canUseCategories = usePremiumGate('notifCategories');
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

  const formattedTime = reminderDate.toLocaleTimeString('fr-CH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <SettingsScreenHeader
        title={i18n.t('settingsScreen.notifications')}
        subtitle={i18n.t('settingsScreen.notificationsBody')}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: SPACING.lg,
          gap: SPACING.lg,
          paddingBottom: SPACING.xxl,
        }}
      >
      <View style={{ gap: 14 }}>
        {!notificationPermissionGranted ? (
          <Surface
            style={{
              backgroundColor: colors.accentBg,
              borderColor: colors.accentBorder,
              gap: 10,
            }}
          >
            <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
              {i18n.t('settingsScreen.permissionDenied')}
            </Text>
            <Button
              label={i18n.t('settingsScreen.openSystemSettings')}
              variant="secondary"
              onPress={() => Linking.openSettings()}
            />
          </Surface>
        ) : null}
      </View>

      <Surface style={{ paddingTop: 4, paddingBottom: 4 }}>
        <SettingRow
          label={i18n.t('settingsScreen.dailyReminder')}
          value={reminderEnabled}
          onChange={(value) => setReminder(value, reminderDate.getHours(), reminderDate.getMinutes())}
        />

        <View
          style={{
            minHeight: 58,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            borderBottomColor: colors.divider,
          }}
        >
          <Text style={[FONTS.regular, { color: colors.textPrimary, fontSize: 13, flex: 1 }]}>
            {i18n.t('settingsScreen.reminderTime')}
          </Text>

          {Platform.OS === 'android' ? (
            <Pressable
              onPress={openAndroidTimePicker}
              style={{
                borderRadius: RADII.full,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.accentBg,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.accent, fontSize: 11 }]}>{formattedTime}</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => setShowIosTimePicker((value) => !value)}
                style={{
                  borderRadius: RADII.full,
                  borderWidth: 1,
                  borderColor: colors.accentBorder,
                  backgroundColor: colors.accentBg,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={[FONTS.bold, { color: colors.accent, fontSize: 11 }]}>{formattedTime}</Text>
              </Pressable>
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

        <SettingRow
          label={i18n.t('settingsScreen.milestoneNotifications')}
          value={milestoneNotificationsEnabled}
          onChange={(value) => setNotificationPreferences({ milestoneNotificationsEnabled: value })}
        />
        <SettingRow
          label={i18n.t('settingsScreen.motivationNotifications')}
          value={motivationNotificationsEnabled}
          onChange={(value) => setNotificationPreferences({ motivationNotificationsEnabled: value })}
          hideBorder
        />
      </Surface>

      {/* Catégories de notifications — PRO */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase' }]}>
            Catégories
          </Text>
          {!canUseCategories && (
            <View
              style={{
                borderRadius: RADII.full,
                borderWidth: 1,
                borderColor: colors.accentBorder,
                backgroundColor: colors.accentBg,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={[FONTS.bold, { color: colors.accent, fontSize: 8 }]}>PRO</Text>
            </View>
          )}
        </View>

        <Surface style={{ paddingTop: 4, paddingBottom: 4, opacity: canUseCategories ? 1 : 0.5 }}>
          {[
            { key: 'contextual' as const, label: 'Phrases contextuelles (matin, soir, après SOS)' },
            { key: 'general' as const, label: 'Phrases générales de motivation' },
            { key: 'statBased' as const, label: 'Statistiques et économies' },
            { key: 'challenges' as const, label: 'Défis hebdomadaires' },
          ].map((item, idx, arr) => (
            <SettingRow
              key={item.key}
              label={item.label}
              value={notifCategories?.[item.key] ?? true}
              onChange={(v) => canUseCategories && setNotifCategories({ [item.key]: v })}
              hideBorder={idx === arr.length - 1}
            />
          ))}
        </Surface>
      </View>

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
    </View>
  );
}
