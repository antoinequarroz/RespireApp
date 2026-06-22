import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface SettingsScreenHeaderProps {
  title: string;
  subtitle: string;
}

export function SettingsScreenHeader({ title, subtitle }: SettingsScreenHeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          height: 34,
          width: 34,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: colors.bgCard,
          borderWidth: 0.5,
          borderColor: colors.bgCardBorder,
        }}
      >
        <Ionicons name="chevron-back" size={16} color={colors.textPrimary} />
      </Pressable>
      <View style={{ gap: 4, flex: 1 }}>
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>{title}</Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>{subtitle}</Text>
      </View>
    </View>
  );
}
