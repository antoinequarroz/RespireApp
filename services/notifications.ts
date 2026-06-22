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
  return current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

async function cancelScheduledByScope(scope: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduled
      .filter((item) => item.content.data?.scope === scope)
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier).catch(() => undefined)),
  );
}

export async function syncDailyReminder(
  enabled: boolean,
  hour: number,
  minute: number,
  motivationEnabled = true,
) {
  await cancelScheduledByScope(DAILY_REMINDER_ID);

  if (!enabled) {
    return;
  }

  const message = MOTIVATION_MESSAGES[(hour + minute) % MOTIVATION_MESSAGES.length];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.dailyTitle'),
      body: motivationEnabled ? message || i18n.t('notifications.dailyBody') : i18n.t('notifications.dailyBody'),
      data: { scope: DAILY_REMINDER_ID },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function syncMilestoneNotifications(profile: UserProfile | null, enabled = true) {
  await cancelScheduledByScope(MILESTONE_PREFIX);

  if (!profile || !enabled) {
    return;
  }

  const upcoming = MILESTONES.filter((item) => {
    const target = buildMilestoneDate(profile.lastCigaretteAt, msFromTimelineItem(item)).getTime();
    return target > Date.now();
  });

  await Promise.all(
    upcoming.map((item) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notifications.milestoneTitle'),
          body: i18n.t('notifications.milestoneBody', { label: item.labelFr }),
          data: { scope: MILESTONE_PREFIX, milestoneId: item.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: buildMilestoneDate(profile.lastCigaretteAt, msFromTimelineItem(item)),
        },
      }),
    ),
  );
}
