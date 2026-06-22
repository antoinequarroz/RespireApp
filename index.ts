import 'expo-router/entry';

import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const {
    hydrateWidgetSnapshot,
    openSosDeepLink,
    renderRespireAndroidWidget,
  } = require('@/services/widget');
  /* eslint-enable @typescript-eslint/no-require-imports */

  registerWidgetTaskHandler(
    async ({
      clickAction,
      renderWidget,
      widgetAction,
    }: {
      clickAction?: string;
      renderWidget: (widget: ReturnType<typeof renderRespireAndroidWidget>) => void;
      widgetAction: string;
    }) => {
      await hydrateWidgetSnapshot();

      if (widgetAction === 'WIDGET_CLICK' && clickAction === 'OPEN_SOS') {
        await openSosDeepLink();
      }

      renderWidget(renderRespireAndroidWidget());
    },
  );
}
