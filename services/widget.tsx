import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import type { ReactElement } from 'react';
import { Platform } from 'react-native';

import { formatCurrency } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

export interface WidgetSnapshot {
  smokeFreeDays: number;
  moneySaved: number;
  cigarettesAvoided: number;
  nextMilestoneLabel: string;
  nextMilestonePercent: number; // 0–100
}

const DEFAULT_SNAPSHOT: WidgetSnapshot = {
  smokeFreeDays: 0,
  moneySaved: 0,
  cigarettesAvoided: 0,
  nextMilestoneLabel: '—',
  nextMilestonePercent: 0,
};

let latestSnapshot: WidgetSnapshot = { ...DEFAULT_SNAPSHOT };

export async function updateWidgetSnapshot(snapshot: WidgetSnapshot) {
  latestSnapshot = snapshot;
  await AsyncStorage.setItem(STORAGE_KEYS.widgetSnapshot, JSON.stringify(snapshot)).catch(() => undefined);

  if (Platform.OS !== 'android') return;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { requestWidgetUpdate } = require('react-native-android-widget');
  await requestWidgetUpdate({
    widgetName: 'RespireWidget',
    renderWidget: () => renderRespireAndroidWidget(),
  }).catch(() => undefined);
}

export async function hydrateWidgetSnapshot(): Promise<WidgetSnapshot> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.widgetSnapshot).catch(() => null);
  if (!raw) return latestSnapshot;
  try {
    latestSnapshot = { ...DEFAULT_SNAPSHOT, ...(JSON.parse(raw) as Partial<WidgetSnapshot>) };
  } catch {
    latestSnapshot = { ...DEFAULT_SNAPSHOT };
  }
  return latestSnapshot;
}

export function renderRespireAndroidWidget(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { FlexWidget, TextWidget } = require('react-native-android-widget');
  const s = latestSnapshot;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        padding: 16,
        backgroundColor: '#120F1E',
        borderRadius: 18,
        justifyContent: 'space-between',
      }}
    >
      {/* Header */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TextWidget
          text="RESPIRE"
          style={{ color: 'rgba(167,139,250,0.50)', fontSize: 10, fontWeight: '700', letterSpacing: 2 }}
        />
        <TextWidget
          text="rauchfrei"
          style={{ color: 'rgba(255,255,255,0.20)', fontSize: 9 }}
        />
      </FlexWidget>

      {/* Jours */}
      <FlexWidget style={{ gap: 2 }}>
        <TextWidget
          text={`${s.smokeFreeDays}`}
          style={{ color: '#FFFFFF', fontSize: 34, fontWeight: '900' }}
        />
        <TextWidget
          text={s.smokeFreeDays === 1 ? 'jour sans tabac' : 'jours sans tabac'}
          style={{ color: 'rgba(255,255,255,0.40)', fontSize: 10, fontWeight: '600' }}
        />
      </FlexWidget>

      {/* Stats row */}
      <FlexWidget style={{ flexDirection: 'row', gap: 10 }}>
        <FlexWidget style={{ flex: 1, gap: 2 }}>
          <TextWidget
            text={formatCurrency(s.moneySaved)}
            style={{ color: '#10B981', fontSize: 14, fontWeight: '700' }}
          />
          <TextWidget
            text="économisés"
            style={{ color: 'rgba(255,255,255,0.25)', fontSize: 8 }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1, gap: 2 }}>
          <TextWidget
            text={`${s.cigarettesAvoided}`}
            style={{ color: '#A78BFA', fontSize: 14, fontWeight: '700' }}
          />
          <TextWidget
            text="évitées"
            style={{ color: 'rgba(255,255,255,0.25)', fontSize: 8 }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Next milestone */}
      {s.nextMilestoneLabel !== '—' ? (
        <FlexWidget style={{ gap: 3 }}>
          <TextWidget
            text={`Prochain : ${s.nextMilestoneLabel}`}
            style={{ color: 'rgba(167,139,250,0.60)', fontSize: 9, fontWeight: '600' }}
          />
          <FlexWidget style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <FlexWidget
              style={{
                width: `${s.nextMilestonePercent}%`,
                height: 3,
                backgroundColor: '#A78BFA',
                borderRadius: 2,
              }}
            />
          </FlexWidget>
        </FlexWidget>
      ) : null}
    </FlexWidget>
  );
}

export async function openSosDeepLink() {
  await Linking.openURL('respire://sos').catch(() => undefined);
}
