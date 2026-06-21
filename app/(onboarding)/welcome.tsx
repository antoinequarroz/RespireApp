import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const setProfile = useUserStore((state) => state.setProfile);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  return (
    <View className="flex-1 justify-between bg-white px-6 py-12 dark:bg-night">
      <View className="gap-6">
        <View className="mt-16 h-44 items-center justify-center rounded-full bg-primary/12">
          <View className="h-28 w-28 rounded-full bg-primary/60" />
        </View>
        <View className="gap-3">
          <Text className="text-5xl font-bold text-ink dark:text-white">
            {i18n.t('onboarding.welcomeTitle')}
          </Text>
          <Text className="text-lg text-zinc-600 dark:text-zinc-300">
            {i18n.t('onboarding.welcomeBody')}
          </Text>
        </View>
        <Card>
          <Text className="text-base text-ink dark:text-white">{i18n.t('app.tagline')}</Text>
        </Card>
      </View>
      <View className="gap-3">
        <Button label={i18n.t('common.continue')} onPress={() => router.push('/setup')} />
        {__DEV__ ? (
          <Button
            label={i18n.t('onboarding.devSkip')}
            variant="ghost"
            onPress={() => {
              const now = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
              setProfile({ lastCigaretteAt: now, cigarettesPerDay: 12, packPrice: 11.5 });
              completeOnboarding();
              router.replace('/');
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
