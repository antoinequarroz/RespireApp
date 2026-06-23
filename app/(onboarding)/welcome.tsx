import { type Href, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

const { width: SCREEN_W } = Dimensions.get('window');

interface Slide {
  key: string;
  emoji: string;
  title: string;
  body: string;
  accent?: boolean;
}

const SLIDES: Slide[] = [
  {
    key: 'hero',
    emoji: '🫁',
    title: 'Le dernier. Pour de vrai.',
    body: 'Respire mesure chaque seconde sans tabac, te montre l\'argent récupéré et marque chaque victoire.',
    accent: true,
  },
  {
    key: 'counter',
    emoji: '⏱️',
    title: 'Un compteur qui ne ment pas.',
    body: 'Secondes, minutes, jours, argent économisé — tout en temps réel, calculé depuis ta dernière cigarette.',
  },
  {
    key: 'health',
    emoji: '❤️',
    title: 'Ton corps se répare dès maintenant.',
    body: 'En 20 minutes, ta tension baisse. En 24h, ton risque d\'infarctus diminue. Chaque heure compte.',
  },
  {
    key: 'sos',
    emoji: '🧘',
    title: 'Une envie ? Respire.',
    body: 'En cas de craving, le mode SOS te guide en moins de 3 minutes. La respiration brise le pic.',
  },
];

function SlideCard({ slide, colors }: { slide: Slide; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View
      style={{
        width: SCREEN_W,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 36,
        gap: 24,
      }}
    >
      {/* Emoji dans un cercle */}
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: slide.accent ? colors.accentBg : colors.bgCard,
          borderWidth: 1.5,
          borderColor: slide.accent ? colors.accentBorder : colors.bgCardBorder,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 52 }}>{slide.emoji}</Text>
      </View>

      <View style={{ alignItems: 'center', gap: 10 }}>
        <Text
          style={[
            FONTS.black,
            {
              color: slide.accent ? colors.accent : colors.textPrimary,
              fontSize: 26,
              textAlign: 'center',
              lineHeight: 30,
            },
          ]}
        >
          {slide.title}
        </Text>
        <Text
          style={[
            FONTS.regular,
            {
              color: colors.textSecondary,
              fontSize: 15,
              textAlign: 'center',
              lineHeight: 22,
              maxWidth: 300,
            },
          ]}
        >
          {slide.body}
        </Text>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme('dark');
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const setOnboardingDraft = useUserStore((state) => state.setOnboardingDraft);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const listRef = useRef<FlatList>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const isLast = activeIndex === SLIDES.length - 1;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const goNext = () => {
    if (isLast) {
      startOnboarding();
    } else {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  const startOnboarding = () => {
    setOnboardingDraft(
      profile ?? {
        productType: 'cigarette',
        currency: 'EUR',
        lastCigaretteAt: new Date().toISOString(),
        cigarettesPerDay: 10,
        packPrice: 11.5,
        motivations: [],
      },
    );
    router.push('/(onboarding)/product-type' as Href);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: 60, paddingBottom: 20 }}>
      {/* Logo header */}
      <View style={{ paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{ width: 6, height: 6, borderRadius: RADII.full, backgroundColor: colors.accent }} />
        <AppLogo size="header" forceScheme="dark" />
      </View>

      {/* Slides */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => <SlideCard slide={item} colors={colors} />}
        style={{ flex: 1 }}
      />

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: RADII.full,
              backgroundColor: i === activeIndex ? colors.accent : colors.dividerStrong,
            }}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={{ paddingHorizontal: 28, gap: 12 }}>
        <Button
          label={isLast ? i18n.t('onboarding.startCta') : 'Suivant'}
          onPress={goNext}
        />

        {isLast ? (
          <Pressable onPress={startOnboarding} style={{ alignSelf: 'center', paddingVertical: 6 }}>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 12, textAlign: 'center' }]}>
              {i18n.t('onboarding.secondaryLink')} →
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={startOnboarding} style={{ alignSelf: 'center', paddingVertical: 6 }}>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 12, textAlign: 'center' }]}>
              Passer l'intro →
            </Text>
          </Pressable>
        )}

        {__DEV__ ? (
          <Pressable
            onPress={() => {
              const now = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
              setProfile({
                productType: 'cigarette',
                currency: 'EUR',
                lastCigaretteAt: now,
                cigarettesPerDay: 12,
                packPrice: 11.5,
                motivations: [],
              });
              completeOnboarding();
              router.replace('/(tabs)');
            }}
            style={{ alignSelf: 'center', paddingVertical: 4 }}
          >
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>
              {i18n.t('onboarding.devSkip')}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Home indicator */}
      <View
        style={{
          alignSelf: 'center',
          width: 106,
          height: 4,
          borderRadius: RADII.full,
          backgroundColor: colors.homeIndicator,
          marginTop: 12,
        }}
      />
    </View>
  );
}
