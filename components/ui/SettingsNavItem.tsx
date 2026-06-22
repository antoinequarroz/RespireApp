import { Pressable, Text, View } from 'react-native';

import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface SettingsNavItemProps {
  label: string;
  value?: string;
  badge?: string;
  onPress: () => void;
}

export function SettingsNavItem({ label, value, badge, onPress }: SettingsNavItemProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.divider,
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 13 }]}>{label}</Text>
        {value ? (
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, marginTop: 4 }]}>
            {value}
          </Text>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {badge ? (
          <View
            style={{
              borderRadius: 999,
              borderWidth: 0.5,
              borderColor: colors.accentBorder,
              backgroundColor: colors.accentBg,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 8 }]}>{badge}</Text>
          </View>
        ) : null}
        <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 16 }]}>›</Text>
      </View>
    </Pressable>
  );
}
