import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bookmark, Share2, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Share, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FIXED, FONTS, RADII } from '@/constants/theme';
import { type PhraseTrigger } from '@/constants/motivationPhrases';
import { useMotivationPhrase } from '@/hooks/useMotivationPhrase';
import { useTheme } from '@/hooks/useTheme';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';

export default function MotivationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ trigger?: string; streak?: string }>();
  const streak = Number(params.streak ?? useProgressStore.getState().appOpenStreak ?? 0);
  const trigger = (params.trigger ?? 'daily') as PhraseTrigger;

  const { id, text, markUsed } = useMotivationPhrase(trigger);
  const addSavedPhraseId = useUserStore((s) => s.addSavedPhraseId);
  const savedPhraseIds = useUserStore((s) => s.savedPhraseIds);
  const isSaved = savedPhraseIds.includes(id);

  // Mark the phrase used once on mount
  useEffect(() => {
    markUsed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: FIXED.milestoneBg,
        paddingTop: 54,
        paddingHorizontal: 28,
        paddingBottom: 7,
      }}
    >
      <View style={{ alignItems: 'center', gap: 14 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            right: 0,
            top: -4,
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X color={colors.textPrimary} size={18} strokeWidth={1.5} />
        </Pressable>

        <View
          style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(167, 139, 250, 0.20)',
            backgroundColor: 'rgba(167, 139, 250, 0.12)',
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <Text
            style={[
              FONTS.bold,
              { color: colors.accent, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },
            ]}
          >
            {trigger === 'relapse'
              ? 'Nouveau départ'
              : trigger === 'sos'
                ? 'Après une envie forte'
                : `Jour ${Math.max(streak, 1)} · Streak actif`}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 4 }}>
        <Text
          style={[
            FONTS.black,
            {
              fontSize: 56,
              color: 'rgba(167,139,250,0.15)',
              letterSpacing: -2,
              lineHeight: 45,
              alignSelf: 'flex-start',
            },
          ]}
        >
          {'"'}
        </Text>

        <Text
          style={[
            FONTS.bold,
            {
              fontSize: 20,
              color: '#F8F7FF',
              lineHeight: 27,
              marginTop: -10,
              textAlign: 'center',
            },
          ]}
        >
          {text}
        </Text>

        <Text
          style={[
            FONTS.black,
            {
              fontSize: 56,
              color: 'rgba(167,139,250,0.15)',
              letterSpacing: -2,
              lineHeight: 45,
              alignSelf: 'flex-end',
              marginTop: 8,
            },
          ]}
        >
          {'"'}
        </Text>

        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <View style={{ width: 24, height: 1, backgroundColor: 'rgba(248,247,255,0.12)' }} />
          <Text
            style={[
              FONTS.regular,
              { color: 'rgba(248,247,255,0.30)', fontSize: 10, fontStyle: 'italic' },
            ]}
          >
            Respire
          </Text>
          <View style={{ width: 24, height: 1, backgroundColor: 'rgba(248,247,255,0.12)' }} />
        </View>
      </View>

      <View style={{ paddingTop: 22, paddingBottom: 32, gap: 14 }}>
        <Button label="Continuer ma journée" onPress={() => router.back()} />

        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}
        >
          <Pressable
            onPress={() => addSavedPhraseId(id)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Bookmark
              color={isSaved ? colors.accent : 'rgba(167,139,250,0.45)'}
              size={14}
              strokeWidth={1.5}
              fill={isSaved ? colors.accent : 'transparent'}
            />
            <Text
              style={[
                FONTS.regular,
                { color: isSaved ? colors.accent : 'rgba(255,255,255,0.35)', fontSize: 11 },
              ]}
            >
              {isSaved ? 'Sauvegardée' : 'Garder cette phrase'}
            </Text>
          </Pressable>

          <View style={{ width: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.10)' }} />

          <Pressable
            onPress={() => Share.share({ message: `"${text}" — Respire` }).catch(() => undefined)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Share2 color="rgba(167,139,250,0.45)" size={14} strokeWidth={1.5} />
            <Text style={[FONTS.regular, { color: 'rgba(255,255,255,0.35)', fontSize: 11 }]}>
              Partager
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          alignSelf: 'center',
          width: 100,
          height: 4,
          borderRadius: RADII.full,
          backgroundColor: 'rgba(248,247,255,0.15)',
        }}
      />
    </View>
  );
}
