import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';
import { requestNotificationPermission, syncDailyReminder } from '@/services/notifications';
import { openSubscriptionManagement } from '@/services/revenuecat';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

export default function SettingsScreen() {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const reminderHour = useUserStore((state) => state.reminderHour);
  const reminderMinute = useUserStore((state) => state.reminderMinute);
  const setReminder = useUserStore((state) => state.setReminder);
  const language = useUserStore((state) => state.language);
  const setLanguage = useUserStore((state) => state.setLanguage);
  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);
  const setNotificationPermissionGranted = useProgressStore((state) => state.setNotificationPermissionGranted);
  const [reminderDate, setReminderDate] = useState(() => {
    const value = new Date();
    value.setHours(reminderHour, reminderMinute, 0, 0);
    return value;
  });

  return (
    <ScrollView className="flex-1 bg-white dark:bg-night" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text className="pt-6 text-3xl font-bold text-ink dark:text-white">
        {i18n.t('settingsScreen.title')}
      </Text>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('settingsScreen.profile')}
        </Text>
        <Text className="text-base text-zinc-600 dark:text-zinc-300">
          {profile?.cigarettesPerDay} / {profile?.packPrice}€
        </Text>
        <Button
          label={i18n.t('common.save')}
          variant="secondary"
          onPress={() => {
            if (!profile) {
              return;
            }
            setProfile({ ...profile, lastCigaretteAt: new Date().toISOString() });
          }}
        />
      </Card>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('settingsScreen.notifications')}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-base text-ink dark:text-white">
            {i18n.t('settingsScreen.dailyReminder')}
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
        <Button
          label={i18n.t('settingsScreen.requestPermission')}
          variant="secondary"
          onPress={() =>
            requestNotificationPermission()
              .then((granted) => setNotificationPermissionGranted(granted))
              .catch(() => setNotificationPermissionGranted(false))
          }
        />
      </Card>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('settingsScreen.language')}
        </Text>
        <View className="flex-row gap-2">
          {(['fr', 'en', 'de'] as const).map((item) => (
            <Button
              key={item}
              label={i18n.t(`common.${item}`)}
              variant={language === item ? 'primary' : 'secondary'}
              onPress={() => setLanguage(item)}
            />
          ))}
        </View>
      </Card>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('common.theme')}
        </Text>
        <View className="flex-row gap-2">
          {(['light', 'dark', 'system'] as const).map((item) => (
            <Button
              key={item}
              label={i18n.t(`common.${item}`)}
              variant={theme === item ? 'primary' : 'secondary'}
              onPress={() => setTheme(item)}
            />
          ))}
        </View>
      </Card>
      <Card className="gap-3">
        <Text className="text-lg font-semibold text-ink dark:text-white">
          {i18n.t('settingsScreen.subscription')}
        </Text>
        <Button
          label={i18n.t('settingsScreen.manageSubscription')}
          onPress={() => openSubscriptionManagement().catch(() => undefined)}
        />
      </Card>
    </ScrollView>
  );
}
