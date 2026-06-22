import { Pressable, Text, View } from 'react-native';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Card } from '@/components/ui/Card';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

interface CounterSectionProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  onRelapsePress?: () => void;
}

function StatChip({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderRadius: 6,
        backgroundColor: colors.accentBg,
        paddingHorizontal: 7,
        paddingVertical: 2,
      }}
    >
      <Text style={[FONTS.bold, { fontSize: 11, color: colors.accentSoft }]}>
        {value} {label}
      </Text>
    </View>
  );
}

export function CounterSection({
  days,
  hours,
  minutes,
  seconds,
  onRelapsePress,
}: CounterSectionProps) {
  const { colors } = useTheme();

  return (
    <Card
      style={{
        backgroundColor: colors.bgCard,
        borderColor: colors.bgCardBorder,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 14,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <StatChip label="jours" value={String(days)} />
        <StatChip label="h" value={String(hours)} />
        <StatChip label="min" value={String(minutes)} />
      </View>

      <View style={{ gap: 2 }}>
        <AnimatedCounter
          value={String(seconds).padStart(2, '0')}
          textStyle={[
            FONTS.black,
            {
              color: colors.accent,
              fontSize: 62,
              letterSpacing: -2,
              lineHeight: 68,
            },
          ]}
        />
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 8,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('home.smokeFreeLabel')}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopWidth: 0.5,
          borderTopColor: colors.divider,
          paddingTop: 12,
        }}
      >
        <View>
          <Text style={[FONTS.bold, { fontSize: 8, color: colors.textMuted, letterSpacing: 1.2 }]}>
            {i18n.t('home.liveLabel')}
          </Text>
          <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary, marginTop: 4 }]}>
            {i18n.t('home.liveBody')}
          </Text>
        </View>
        <Pressable onPress={onRelapsePress} style={{ paddingVertical: 6, paddingHorizontal: 4 }}>
          <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11 }]}>
            {i18n.t('home.relapseLink')}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}
