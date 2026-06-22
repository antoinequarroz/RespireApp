import * as Notifications from 'expo-notifications';

import { MILESTONES } from '@/constants/milestones';
import { MOTIVATION_MESSAGES } from '@/constants/motivationMessages';
import { buildMilestoneDate, msFromTimelineItem, type UserProfile } from '@/services/calculations';
import { i18n } from '@/services/i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAILY_REMINDER_ID = 'respire-daily-reminder';
const MILESTONE_PREFIX = 'respire-milestone';

export async function configureNotificationChannel() {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Respire',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

export async function getNotificationPermissionStatus() {
  const current = await Notifications.getPermissionsAsync();
  return current.granted;
}

export async function syncDailyReminder(enabled: boolean, hour: number, minute: number) {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => undefined);

  if (!enabled) {
    return;
  }

  const message = MOTIVATION_MESSAGES[(hour + minute) % MOTIVATION_MESSAGES.length];

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.dailyTitle'),
      body: message || i18n.t('notifications.dailyBody'),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await Notifications.dismissNotificationAsync(identifier).catch(() => undefined);
}

export async function syncMilestoneNotifications(profile: UserProfile | null) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(MILESTONE_PREFIX))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );

  if (!profile) {
    return;
  }

  const upcoming = MILESTONES.filter(
    (item) => buildMilestoneDate(profile.lastCigaretteAt, msFromTimelineItem(item)).getTime() > Date.now(),
  ).slice(0, 1);

  await Promise.all(
    upcoming.map((item) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notifications.milestoneTitle'),
          body: i18n.t('notifications.milestoneBody', { label: item.labelFr }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: buildMilestoneDate(profile.lastCigaretteAt, msFromTimelineItem(item)),
        },
      }),
    ),
  );
}
