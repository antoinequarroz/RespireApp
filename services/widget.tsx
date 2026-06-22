import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import type { ReactElement } from 'react';
import { Platform } from 'react-native';

import { formatCurrency } from '@/services/calculations';
import { STORAGE_KEYS } from '@/services/storage';

export interface WidgetSnapshot {
  smokeFreeDays: number;
  moneySaved: number;
}

let latestSnapshot: WidgetSnapshot = {
  smokeFreeDays: 0,
  moneySaved: 0,
};

export async function updateWidgetSnapshot(snapshot: WidgetSnapshot) {
  latestSnapshot = snapshot;
  await AsyncStorage.setItem(STORAGE_KEYS.widgetSnapshot, JSON.stringify(snapshot)).catch(() => undefined);
  if (Platform.OS !== 'android') {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { requestWidgetUpdate } = require('react-native-android-widget');

  await requestWidgetUpdate({
    widgetName: 'RespireWidget',
    renderWidget: () => renderRespireAndroidWidget(),
  }).catch(() => undefined);
}

export async function hydrateWidgetSnapshot() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.widgetSnapshot).catch(() => null);
  if (!raw) {
    return latestSnapshot;
  }

  try {
    latestSnapshot = JSON.parse(raw) as WidgetSnapshot;
  } catch {
    latestSnapshot = {
      smokeFreeDays: 0,
      moneySaved: 0,
    };
  }

  return latestSnapshot;
}

export function renderRespireAndroidWidget(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { FlexWidget, TextWidget } = require('react-native-android-widget');

  return (
    <FlexWidget
      clickAction="OPEN_SOS"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        padding: 16,
        backgroundColor: '#120F1E',
        borderRadius: 18,
        justifyContent: 'space-between',
      }}
    >
      <TextWidget
        text="Respire"
        style={{ color: '#A78BFA', fontSize: 13, fontWeight: '600' }}
      />
      <TextWidget
        text={`${latestSnapshot.smokeFreeDays} j`}
        style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '700' }}
      />
      <TextWidget
        text={formatCurrency(latestSnapshot.moneySaved)}
        style={{ color: '#10B981', fontSize: 18, fontWeight: '700' }}
      />
    </FlexWidget>
  );
}

export async function openSosDeepLink() {
  await Linking.openURL('respire://sos').catch(() => undefined);
}
