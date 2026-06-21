import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSavings } from '@/hooks/useSavings';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function ReadyScreen() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const { moneySavedFormatted } = useSavings();

  return (
    <View className="flex-1 justify-between bg-white px-6 py-12 dark:bg-night">
      <View className="gap-6">
        <View className="gap-3">
          <Text className="text-4xl font-bold text-ink dark:text-white">
            {i18n.t('onboarding.readyTitle')}
          </Text>
          <Text className="text-base text-zinc-600 dark:text-zinc-300">
            {i18n.t('onboarding.readyBody')}
          </Text>
        </View>
        <Card className="gap-3">
          <Text className="text-base text-ink dark:text-white">{profile?.cigarettesPerDay}</Text>
          <Text className="text-base text-ink dark:text-white">{moneySavedFormatted}</Text>
        </Card>
      </View>
      <Button
        label={i18n.t('onboarding.start')}
        onPress={() => {
          completeOnboarding();
          router.replace('/');
        }}
      />
    </View>
  );
}
