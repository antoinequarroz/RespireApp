import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface MilestoneCardProps {
  label: string;
  reached: boolean;
  onPress?: () => void;
}

export function MilestoneCard({ label, reached, onPress }: MilestoneCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13, maxWidth: '76%' }]}>
          {label}
        </Text>
        <View>{reached ? <Badge label="OK" tone="accent" /> : <Badge label="A venir" />}</View>
      </Card>
    </Pressable>
  );
}
