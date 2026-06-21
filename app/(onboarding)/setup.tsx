import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function SetupScreen() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [date, setDate] = useState<Date>(profile ? new Date(profile.lastCigaretteAt) : new Date());
  const [cigarettesPerDay, setCigarettesPerDay] = useState(profile?.cigarettesPerDay ?? 10);
  const [packPrice, setPackPrice] = useState(String(profile?.packPrice ?? 10.5));

  return (
    <View className="flex-1 bg-white px-6 py-10 dark:bg-night">
      <View className="gap-3">
        <Text className="text-4xl font-bold text-ink dark:text-white">
          {i18n.t('onboarding.setupTitle')}
        </Text>
        <Text className="text-base text-zinc-600 dark:text-zinc-300">
          {i18n.t('onboarding.setupBody')}
        </Text>
      </View>
      <View className="mt-8 gap-4">
        <Card className="gap-3">
          <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {i18n.t('onboarding.lastCigarette')}
          </Text>
          <DateTimePicker value={date} mode="datetime" onChange={(_, value) => value && setDate(value)} />
        </Card>
        <Card className="gap-3">
          <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {i18n.t('onboarding.cigarettesPerDay')}: {Math.round(cigarettesPerDay)}
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={40}
            step={1}
            minimumTrackTintColor="#1B6CA8"
            maximumTrackTintColor="#CFCFCF"
            value={cigarettesPerDay}
            onValueChange={setCigarettesPerDay}
          />
        </Card>
        <Card className="gap-3">
          <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {i18n.t('onboarding.packPrice')}
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            value={packPrice}
            onChangeText={setPackPrice}
            className="rounded-md bg-white px-4 py-3 text-base text-ink dark:bg-zinc-950 dark:text-white"
          />
        </Card>
      </View>
      <View className="mt-auto gap-3">
        <Button
          label={i18n.t('common.continue')}
          onPress={() => {
            setProfile({
              lastCigaretteAt: date.toISOString(),
              cigarettesPerDay: Math.round(cigarettesPerDay),
              packPrice: Number(packPrice.replace(',', '.')) || 0,
            });
            router.push('/ready');
          }}
        />
      </View>
    </View>
  );
}
