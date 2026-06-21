import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface MilestoneCardProps {
  label: string;
  reached: boolean;
  onPress?: () => void;
}

export function MilestoneCard({ label, reached, onPress }: MilestoneCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-ink dark:text-white">{label}</Text>
        <View>{reached ? <Badge label="✓" tone="accent" /> : <Badge label="•" />}</View>
      </Card>
    </Pressable>
  );
}
