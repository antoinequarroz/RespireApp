import { Text, View } from 'react-native';

interface SavingsEquivalentProps {
  emoji: string;
  label: string;
}

export function SavingsEquivalent({ emoji, label }: SavingsEquivalentProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-md bg-zinc-100 p-3 dark:bg-zinc-900">
      <Text className="text-2xl">{emoji}</Text>
      <Text className="flex-1 text-sm text-ink dark:text-white">{label}</Text>
    </View>
  );
}
