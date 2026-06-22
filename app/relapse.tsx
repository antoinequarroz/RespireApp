import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function RelapseScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const resetTo = (date: Date) => {
    if (!profile) {
      router.back();
      return;
    }

    setProfile({
      ...profile,
      lastCigaretteAt: date.toISOString(),
    });
    router.back();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(12, 10, 30, 0.72)',
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
      }}
    >
      <Card
        style={{
          backgroundColor: colors.bgSurface,
          borderColor: colors.bgCardBorder,
          gap: SPACING.md,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.lg,
        }}
      >
        <View style={{ gap: 6 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
            {i18n.t('relapse.title')}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            {i18n.t('relapse.body')}
          </Text>
        </View>

        <Button label={i18n.t('relapse.resetNow')} onPress={() => resetTo(new Date())} />
        <Button
          label={i18n.t('relapse.resetMorning')}
          variant="secondary"
          onPress={() => {
            const morning = new Date();
            morning.setHours(0, 0, 0, 0);
            resetTo(morning);
          }}
        />

        <Pressable onPress={() => router.back()} style={{ paddingVertical: 6 }}>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 12, textAlign: 'center' }]}>
            {i18n.t('relapse.cancel')}
          </Text>
        </Pressable>
      </Card>
    </View>
  );
}
