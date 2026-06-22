import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { requestNotificationPermission } from '@/services/notifications';
import { useProgressStore } from '@/store/progressStore';

export default function NotificationPermissionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const setNotificationPermissionGranted = useProgressStore(
    (state) => state.setNotificationPermissionGranted,
  );

  const goNext = () => router.push('/ready');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xxl,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', gap: SPACING.xl }}>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              backgroundColor: colors.accentBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[FONTS.black, { color: colors.accent, fontSize: 28 }]}>◌</Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 22, textAlign: 'center' }]}>
            {i18n.t('onboarding.notificationsTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13, textAlign: 'center' }]}>
            {i18n.t('onboarding.notificationsBody')}
          </Text>
        </View>

        <Card
          style={{
            backgroundColor: colors.bgCard,
            borderColor: colors.bgCardBorder,
            gap: 10,
          }}
        >
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>
            {i18n.t('onboarding.notificationsCardTitle')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('onboarding.notificationsCardBody')}
          </Text>
        </Card>
      </View>

      <View style={{ gap: SPACING.md }}>
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
