import { Pressable, Text, View } from 'react-native';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

interface CounterSectionProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  onRelapsePress?: () => void;
}

function StatSegment({
  label,
  value,
  withDivider = false,
}: {
  label: string;
  value: string;
  withDivider?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ alignItems: 'center', minWidth: 70 }}>
        <Text style={[FONTS.black, { fontSize: 19, color: colors.accent }]}>{value}</Text>
        <Text
          style={[
            FONTS.bold,
            {
              fontSize: 8,
              color: colors.accent,
              opacity: 0.55,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            },
          ]}
        >
          {label}
        </Text>
      </View>
      {withDivider ? (
        <View
          style={{
            width: 1,
            height: 26,
            marginLeft: 12,
            backgroundColor: 'rgba(167,139,250,0.18)',
          }}
        />
      ) : null}
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
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingTop: 10,
        paddingBottom: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <StatSegment label="jours" value={String(days)} withDivider />
        <StatSegment label="h" value={String(hours)} withDivider />
        <StatSegment label="min" value={String(minutes)} />
      </View>

      <View style={{ alignItems: 'center', gap: 2 }}>
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

      <Pressable onPress={onRelapsePress} style={{ paddingVertical: 4, paddingHorizontal: 4 }}>
        <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 11 }]}>
          {i18n.t('home.relapseLink')}
        </Text>
      </Pressable>

      <View
        style={{
          width: '100%',
          borderRadius: 13,
          borderWidth: 0.5,
          borderColor: colors.bgCardBorder,
          backgroundColor: colors.bgCard,
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[FONTS.bold, { fontSize: 8, color: colors.textMuted, letterSpacing: 1.2 }]}>
            {i18n.t('home.liveLabel')}
          </Text>
          <Text style={[FONTS.regular, { fontSize: 13, color: colors.textSecondary, marginTop: 4 }]}>
            {i18n.t('home.liveBody')}
          </Text>
        </View>

        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: RADII.full,
            borderWidth: 1.5,
            borderColor: colors.accent,
            backgroundColor: colors.accentBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: RADII.full,
              backgroundColor: colors.accent,
            }}
          />
        </View>
      </View>
    </View>
  );
}
