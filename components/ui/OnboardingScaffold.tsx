import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

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
}

export function OnboardingScaffold({
  step,
  total,
  title,
  subtitle,
  children,
  footer,
  onBack,
}: OnboardingScaffoldProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bgDeep,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
      }}
    >
      <View style={{ gap: SPACING.lg }}>
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
            <ChevronLeft size={16} color={colors.textSecondary} strokeWidth={2} />
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {Array.from({ length: total }, (_, index) => {
              const active = index + 1 === step;

              return (
                <View
                  key={index}
                  style={{
                    width: active ? 18 : 6,
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

        <View style={{ gap: 8 }}>
          <Text
            style={[
              FONTS.bold,
              {
                color: colors.accent,
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              },
            ]}
          >
            {step} / {total}
          </Text>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 16, lineHeight: 22 }]}>{title}</Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 10, lineHeight: 15 }]}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: SPACING.xl }}>{children}</View>

      {footer ? <View style={{ gap: SPACING.md, paddingTop: SPACING.lg }}>{footer}</View> : null}

      <View
        style={{
          alignSelf: 'center',
          width: 104,
          height: 4,
          borderRadius: RADII.full,
          backgroundColor: colors.homeIndicator,
          marginTop: SPACING.lg,
        }}
      />
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
        paddingHorizontal: 14,
        paddingVertical: subtitle ? 14 : 16,
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
              {
                color: selected ? colors.emerald : colors.textMuted,
                fontSize: 11,
                marginTop: 4,
              },
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
            style={{
              width: 8,
              height: 8,
              borderRadius: RADII.full,
              backgroundColor: colors.accent,
            }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}
