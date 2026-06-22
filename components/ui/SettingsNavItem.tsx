import { ChevronRight } from 'lucide-react-native';
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
        paddingVertical: 11,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.divider,
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[FONTS.regular, { color: colors.textPrimary, fontSize: 12 }]}>{label}</Text>
        {value ? (
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10, marginTop: 3 }]}>
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
        <ChevronRight size={14} color={colors.textMuted} strokeWidth={1.5} />
      </View>
    </Pressable>
  );
}
