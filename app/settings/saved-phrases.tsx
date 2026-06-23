import { Bookmark, Trash2 } from 'lucide-react-native';
import { ScrollView, Pressable, Text, View } from 'react-native';

import { SettingsScreenHeader } from '@/components/ui/SettingsScreenHeader';
import { MOTIVATION_PHRASES } from '@/constants/motivationPhrases';
import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useUserStore } from '@/store/userStore';

export default function SavedPhrasesScreen() {
  const { colors } = useTheme();
  const savedPhraseIds = useUserStore((s) => s.savedPhraseIds);
  const removeSavedPhraseId = useUserStore((s) => s.removeSavedPhraseId);

  const phrases = savedPhraseIds
    .map((id) => MOTIVATION_PHRASES.find((p) => p.id === id))
    .filter(Boolean) as (typeof MOTIVATION_PHRASES)[number][];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <SettingsScreenHeader title="Phrases sauvegardées" subtitle="Tes phrases favorites" />

      {phrases.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: RADII.lg,
              backgroundColor: colors.accentBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bookmark size={22} color={colors.accent} strokeWidth={1.5} />
          </View>
          <Text style={[FONTS.bold, { color: colors.textPrimary, fontSize: 15, textAlign: 'center' }]}>
            Aucune phrase sauvegardée
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12, textAlign: 'center', lineHeight: 18 }]}>
            Appuie sur l'icône marque-page dans l'écran de motivation pour garder une phrase.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: SPACING.lg, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {phrases.map((phrase) => (
            <View
              key={phrase.id}
              style={{
                borderRadius: RADII.lg,
                borderWidth: 1,
                borderColor: colors.bgCardBorder,
                backgroundColor: colors.bgCard,
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <Text
                style={[
                  FONTS.regular,
                  { color: colors.textPrimary, fontSize: 13, lineHeight: 20, flex: 1 },
                ]}
              >
                {phrase.text}
              </Text>

              <Pressable
                onPress={() => removeSavedPhraseId(phrase.id)}
                hitSlop={8}
                style={{ marginTop: 2 }}
              >
                <Trash2 size={15} color={colors.textMuted} strokeWidth={1.5} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
