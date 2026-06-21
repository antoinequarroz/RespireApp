import type { ReactElement } from 'react';
import { Linking } from 'react-native';
import {
  FlexWidget,
  requestWidgetUpdate,
  TextWidget,
} from 'react-native-android-widget';

import { formatCurrency } from '@/services/calculations';

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
  await requestWidgetUpdate({
    widgetName: 'RespireWidget',
    renderWidget: () => renderRespireAndroidWidget(),
  }).catch(() => undefined);
}

export function renderRespireAndroidWidget(): ReactElement {
  return (
    <FlexWidget
      clickAction="OPEN_SOS"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        padding: 16,
        backgroundColor: '#121212',
        borderRadius: 18,
        justifyContent: 'space-between',
      }}
    >
      <TextWidget
        text="Respire"
        style={{ color: '#888888', fontSize: 14, fontWeight: '600' }}
      />
      <TextWidget
        text={`${latestSnapshot.smokeFreeDays} j`}
        style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '700' }}
      />
      <TextWidget
        text={formatCurrency(latestSnapshot.moneySaved)}
        style={{ color: '#27AE60', fontSize: 18, fontWeight: '700' }}
      />
    </FlexWidget>
  );
}

export async function openSosDeepLink() {
  await Linking.openURL('respire://sos').catch(() => undefined);
}
