import { Text, View } from 'react-native';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Card } from '@/components/ui/Card';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

interface CounterSectionProps {
  value: string;
}

export function CounterSection({ value }: CounterSectionProps) {
  const { colors } = useTheme();
  const segments = value.split(' ');

  return (
    <Card
      style={{
        backgroundColor: colors.bgCard,
        borderColor: colors.bgCardBorder,
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <View style={{ gap: 8 }}>
        <Text
          style={[
            FONTS.bold,
            {
              color: colors.textMuted,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
          ]}
        >
          {i18n.t('home.hero')}
        </Text>
        <AnimatedCounter
          value={segments[0] ?? value}
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
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {segments.slice(1).map((segment) => (
            <Text
              key={segment}
              style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}
            >
              {segment}
            </Text>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
        {['J', 'H', 'M', 'S'].map((label) => (
          <View
            key={label}
            style={{
              backgroundColor: colors.accentBg,
              borderRadius: 6,
              paddingHorizontal: 7,
              paddingVertical: 2,
            }}
          >
            <Text style={[FONTS.bold, { fontSize: 11, color: colors.accentSoft }]}>{label}</Text>
          </View>
        ))}
      </View>
      <View
        style={{
          marginTop: 16,
          borderTopWidth: 0.5,
          borderTopColor: colors.divider,
          paddingTop: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={[FONTS.bold, { fontSize: 8, color: colors.textMuted, letterSpacing: 1.2 }]}>
            Focus
          </Text>
          <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary, marginTop: 4 }]}>
            Chaque seconde compte.
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.accentBg,
            borderWidth: 1,
            borderColor: colors.accentBorder,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 6,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={[FONTS.bold, { fontSize: 8, color: colors.accent }]}>Live</Text>
        </View>
      </View>
    </Card>
  );
}
