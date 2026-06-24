import * as Notifications from 'expo-notifications';

import { MILESTONES } from '@/constants/milestones';
import { pickMotivationPhrase } from '@/constants/motivationPhrases';
import type { ActiveWeeklyChallenge } from '@/store/progressStore';
import { useProgressStore } from '@/store/progressStore';
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
  phraseContext?: {
    smokeFreeDays: number;
    cigarettesAvoided: number;
    moneySaved: number;
    savings: string;
    equivalent: string;
  },
) {
  await cancelScheduledByScope(DAILY_REMINDER_ID);

  if (!enabled) {
    return;
  }

  let body = i18n.t('notifications.dailyBody');

  if (motivationEnabled && phraseContext) {
    const recentIds = useProgressStore.getState().getRecentUsedPhraseIds();
    const result = pickMotivationPhrase({
      ...phraseContext,
      trigger: 'daily',
      usedPhraseIds: recentIds,
      hourOfDay: hour,
    });
    body = result.text;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.dailyTitle'),
      body,
      data: { scope: DAILY_REMINDER_ID },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

const WEEKLY_CHALLENGE_PREFIX = 'respire-weekly-challenge';

export async function syncWeeklyChallengeNotifications(
  challenge: ActiveWeeklyChallenge,
  target: number,
) {
  await cancelScheduledByScope(WEEKLY_CHALLENGE_PREFIX);

  const weekStart = new Date(challenge.weekStart);

  // Monday 9h announcement
  const monday = new Date(weekStart);
  monday.setHours(9, 0, 0, 0);
  if (monday.getTime() > Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Défi de la semaine',
        body: challenge.label,
        data: { scope: WEEKLY_CHALLENGE_PREFIX },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: monday,
      },
    }).catch(() => undefined);
  }

  // Thursday reminder if progress < target / 2
  const thursday = new Date(weekStart);
  thursday.setDate(thursday.getDate() + 3);
  thursday.setHours(18, 0, 0, 0);
  if (thursday.getTime() > Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏳ Défi en cours',
        body: `${challenge.label} — il te reste quelques jours !`,
        data: { scope: WEEKLY_CHALLENGE_PREFIX, checkProgress: true, target },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: thursday,
      },
    }).catch(() => undefined);
  }
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
