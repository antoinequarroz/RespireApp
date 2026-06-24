import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONTS, RADII, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface OnboardingScaffoldProps {
  step: number;
  total: number;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  titleSize?: number;
  titleMaxWidth?: number | `${number}%`;
}

export function OnboardingScaffold({
  step,
  total,
  title,
  subtitle,
  children,
  footer,
  onBack,
  titleSize = 38,
  titleMaxWidth = '88%',
}: OnboardingScaffoldProps) {
  const { colors } = useTheme('dark');
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isSmall = height < 750;
  const effectiveTitleSize = isSmall ? Math.round(titleSize * 0.78) : titleSize;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: 20,
        paddingTop: Math.max(insets.top + 8, 20),
        paddingBottom: Math.max(insets.bottom + 8, SPACING.lg),
      }}
    >
      {/* Nav + titre */}
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={onBack}
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              backgroundColor: colors.bgCard,
              borderWidth: 0.5,
              borderColor: colors.bgCardBorder,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: onBack ? 1 : 0,
            }}
            disabled={!onBack}
          >
            <ChevronLeft size={16} color={colors.textSecondary} strokeWidth={1.5} />
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            {Array.from({ length: total }, (_, index) => {
              const active = index + 1 === step;
              return (
                <View
                  key={index}
                  style={{
                    width: active ? 18 : 5,
                    height: 3,
                    borderRadius: RADII.full,
                    backgroundColor: active ? colors.accent : colors.dividerStrong,
                  }}
                />
              );
            })}
          </View>

          <View style={{ width: 28 }} />
        </View>

        <View style={{ gap: 1 }}>
          <Text
            style={[
              FONTS.bold,
              { color: colors.accent, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },
            ]}
          >
            Etape {step} sur {total}
          </Text>
          <Text
            style={[
              FONTS.black,
              {
                color: colors.textPrimary,
                fontSize: effectiveTitleSize,
                lineHeight: Math.max(effectiveTitleSize - 3, 30),
                maxWidth: titleMaxWidth,
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              FONTS.regular,
              { color: colors.textSecondary, fontSize: 10, lineHeight: 15, fontStyle: 'italic' },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Contenu scrollable */}
      <ScrollView
        style={{ flex: 1, marginTop: 10 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {footer ? <View style={{ gap: 12, paddingTop: 16 }}>{footer}</View> : null}
    </View>
  );
}

interface OnboardingOptionCardProps {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
}

export function OnboardingOptionCard({
  title,
  subtitle,
  selected,
  onPress,
}: OnboardingOptionCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 13,
        borderWidth: 1,
        borderColor: selected ? colors.borderSelected : colors.bgCardBorder,
        backgroundColor: selected ? colors.cardSelected : colors.bgCard,
        paddingHorizontal: 16,
        paddingVertical: subtitle ? 13 : 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[FONTS.bold, { color: selected ? colors.accent : colors.textPrimary, fontSize: 13 }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              FONTS.regular,
              { color: selected ? colors.emerald : colors.textMuted, fontSize: 10, marginTop: 4 },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: RADII.full,
          borderWidth: 1,
          borderColor: selected ? colors.borderSelected : colors.accentBorder,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{ width: 8, height: 8, borderRadius: RADII.full, backgroundColor: colors.accent }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}
