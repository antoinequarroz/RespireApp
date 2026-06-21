import { Text, View } from 'react-native';

interface BadgeProps {
  label: string;
  tone?: 'accent' | 'neutral' | 'warning';
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const tones = {
    accent: 'bg-accent/15 text-accent',
    neutral: 'bg-zinc-200 text-ink dark:bg-zinc-800 dark:text-white',
    warning: 'bg-sos/15 text-sos',
  }[tone];

  return (
    <View className={`self-start rounded-full px-3 py-1 ${tones}`}>
      <Text className="text-xs font-semibold">{label}</Text>
    </View>
  );
}
