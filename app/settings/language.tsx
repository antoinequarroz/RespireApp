import { CheckCircle2 } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { SettingsScreenHeader } from '@/components/ui/SettingsScreenHeader';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

function LanguageCard({
  title,
  subtitle,
  active = false,
  disabled = false,
  onPress,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        borderRadius: RADII.lg,
        borderWidth: 1,
        borderColor: active ? colors.accentBorder : colors.bgCardBorder,
        backgroundColor: active ? colors.accentBg : colors.bgCard,
        paddingHorizontal: 14,
        paddingVertical: 14,
        opacity: disabled ? 0.72 : 1,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[FONTS.bold, { color: active ? colors.accent : colors.textPrimary, fontSize: 13 }]}>
            {title}
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 11 }]}>{subtitle}</Text>
        </View>
        {active ? <CheckCircle2 size={18} color={colors.accent} strokeWidth={1.5} /> : null}
      </View>
    </Pressable>
  );
}

export default function SettingsLanguageScreen() {
  const { colors } = useTheme();
  const language = useUserStore((state) => state.language);
  const setLanguage = useUserStore((state) => state.setLanguage);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <SettingsScreenHeader
        title={i18n.t('settingsScreen.language')}
        subtitle={i18n.t('settingsScreen.languageBody')}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: SPACING.lg,
          gap: SPACING.lg,
          paddingBottom: SPACING.xxl,
        }}
      >

      <View style={{ gap: 10 }}>
        <LanguageCard
          title={i18n.t('common.fr')}
          subtitle={i18n.t('settingsScreen.languageActive')}
          active={language === 'fr'}
          onPress={() => setLanguage('fr')}
        />
        <LanguageCard title={i18n.t('common.en')} subtitle={i18n.t('common.soon')} disabled />
        <LanguageCard title={i18n.t('common.de')} subtitle={i18n.t('common.soon')} disabled />
      </View>
      </ScrollView>
    </View>
  );
}
