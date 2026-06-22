import { ScrollView, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

export default function SettingsLanguageScreen() {
  const { colors } = useTheme();
  const language = useUserStore((state) => state.language);
  const setLanguage = useUserStore((state) => state.setLanguage);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.language')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.languageBody')}
        </Text>
      </View>

      <Card style={{ gap: SPACING.md }}>
        <Button
          label={i18n.t('common.fr')}
          variant={language === 'fr' ? 'primary' : 'secondary'}
          onPress={() => setLanguage('fr')}
        />
        <Button label={`${i18n.t('common.en')} · ${i18n.t('common.soon')}`} variant="secondary" disabled />
        <Button label={`${i18n.t('common.de')} · ${i18n.t('common.soon')}`} variant="secondary" disabled />
      </Card>
    </ScrollView>
  );
}
