import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

interface SavingsSectionProps {
  amount: string;
  equivalentLabel: string;
  equivalentEmoji: string;
}

export function SavingsSection({
  amount,
  equivalentLabel,
  equivalentEmoji,
}: SavingsSectionProps) {
  const { colors } = useTheme();

  return (
    <Card
      style={{
        backgroundColor: colors.emeraldBg,
        borderColor: colors.emeraldBorder,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.emerald,
              opacity: 0.6,
              fontSize: 8,
              letterSpacing: 1,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('home.moneySaved')}
        </Text>
        <Badge label={i18n.t('home.equivalent')} tone="neutral" />
      </View>
      <Text style={[FONTS.black, { fontSize: 22, color: colors.emerald, marginTop: 6 }]}>
        {amount}
      </Text>
      <Text style={[FONTS.regular, { fontSize: 9, color: colors.emerald, opacity: 0.6, marginTop: 2 }]}>
        {equivalentEmoji} {equivalentLabel}
      </Text>
    </Card>
  );
}
