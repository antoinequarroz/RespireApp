import { type Href, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { requestNotificationPermission } from '@/services/notifications';
import { useProgressStore } from '@/store/progressStore';

export default function NotificationPermissionScreen() {
  const router = useRouter();
  const { colors, fixed } = useTheme('dark');
  const setNotificationPermissionGranted = useProgressStore(
    (state) => state.setNotificationPermissionGranted,
  );

  const goNext = () => router.push('/(onboarding)/ready' as Href);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.bgDeep,
        paddingHorizontal: 20,
        paddingVertical: 32,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              backgroundColor: colors.accentBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32 }}>🔔</Text>
            <View
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: fixed.sos,
              }}
            />
          </View>
        </View>

        <View style={{ gap: 1, alignItems: 'center' }}>
          <Text
            style={[
              FONTS.black,
              {
                color: colors.textPrimary,
                fontSize: 38,
                lineHeight: 35,
                textAlign: 'center',
                maxWidth: '88%',
              },
            ]}
          >
            {i18n.t('onboarding.notificationsTitle')}
          </Text>
          <Text
            style={[
              FONTS.regular,
              {
                color: colors.textSecondary,
                fontSize: 11,
                textAlign: 'center',
                lineHeight: 17,
                maxWidth: 250,
              },
            ]}
          >
            {i18n.t('onboarding.notificationsBody')}
          </Text>
        </View>

        <Card
          style={{
            gap: 10,
            backgroundColor: colors.bgCard,
            borderColor: colors.bgCardBorder,
            paddingHorizontal: 14,
            paddingVertical: 14,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('onboarding.notificationsCardTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, lineHeight: 18 }]}>
            {i18n.t('onboarding.notificationsCardBody')}
          </Text>
        </Card>
      </View>

      <View style={{ gap: 12 }}>
        <Button
          label={i18n.t('onboarding.notificationsAccept')}
          onPress={() =>
            requestNotificationPermission()
              .then((granted) => {
                setNotificationPermissionGranted(granted);
                goNext();
              })
              .catch(() => {
                setNotificationPermissionGranted(false);
                goNext();
              })
          }
        />
        <Button
          label={i18n.t('onboarding.notificationsSkip')}
          variant="ghost"
          onPress={() => {
            setNotificationPermissionGranted(false);
            goNext();
          }}
        />
      </View>
    </View>
  );
}
