import 'expo-router/entry';

import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { openSosDeepLink, renderRespireAndroidWidget } from '@/services/widget';

registerWidgetTaskHandler(async ({ clickAction, renderWidget, widgetAction }) => {
  if (widgetAction === 'WIDGET_CLICK' && clickAction === 'OPEN_SOS') {
    await openSosDeepLink();
  }

  renderWidget(renderRespireAndroidWidget());
});
