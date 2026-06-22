import Constants from 'expo-constants';
import { Linking, ScrollView, Text, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { APP_LINKS } from '@/constants/appLinks';
import { FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';

export default function SettingsAboutScreen() {
  const { colors } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
    >
      <View style={{ gap: SPACING.sm, paddingTop: SPACING.lg }}>
        <AppLogo size="header" />
        <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18 }]}>
          {i18n.t('settingsScreen.about')}
        </Text>
        <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
          {i18n.t('settingsScreen.aboutBody')}
        </Text>
      </View>

      <Card style={{ gap: 12 }}>
        <View>
          <Text style={[FONTS.bold, { color: colors.textMuted, fontSize: 8, letterSpacing: 1.5 }]}>
            VERSION
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 18, marginTop: 6 }]}>{version}</Text>
        </View>
        <Button
          label={i18n.t('settingsScreen.legalTerms')}
          variant="secondary"
          onPress={() => Linking.openURL(APP_LINKS.termsUrl)}
        />
        <Button
          label={i18n.t('settingsScreen.legalPrivacy')}
          variant="secondary"
          onPress={() => Linking.openURL(APP_LINKS.privacyUrl)}
        />
        <Button
          label={i18n.t('settingsScreen.contactSupport')}
          variant="secondary"
          onPress={() => Linking.openURL(APP_LINKS.supportEmail)}
        />
        <Button
          label={i18n.t('settingsScreen.projectPage')}
          variant="secondary"
          onPress={() => Linking.openURL(APP_LINKS.repositoryUrl)}
        />
      </Card>
    </ScrollView>
  );
}
