import { type Href, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { OnboardingScaffold } from '@/components/ui/OnboardingScaffold';
import { type ProductType, getProductConfig } from '@/constants/productConfig';
import { FONTS, RADII } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/services/calculations';
import { i18n } from '@/services/i18n';
import { useUserStore } from '@/store/userStore';

type Currency = 'EUR' | 'CHF';

const DEFAULT_PRICES: Record<ProductType, Record<Currency, number>> = {
  cigarette:  { EUR: 11.5, CHF: 12.5 },
  vape_puffs: { EUR: 8.9,  CHF: 9.9  },
  vape_pods:  { EUR: 9.9,  CHF: 10.9 },
  rolling:    { EUR: 18.5, CHF: 20.0 },
  cigarillo:  { EUR: 12.0, CHF: 13.5 },
  cigar:      { EUR: 9.0,  CHF: 10.0 },
  pipe:       { EUR: 16.0, CHF: 17.5 },
};

export default function PackPriceScreen() {
  const router = useRouter();
  const { colors } = useTheme('dark');
  const profile = useUserStore((state) => state.profile);
  const onboardingDraft = useUserStore((state) => state.onboardingDraft);
  const updateOnboardingDraft = useUserStore((state) => state.updateOnboardingDraft);

  const productType = onboardingDraft?.productType ?? profile?.productType ?? 'cigarette';
  const currency = onboardingDraft?.currency ?? profile?.currency ?? 'EUR';
  const productConfig = getProductConfig(productType);
  const quantity = onboardingDraft?.cigarettesPerDay ?? profile?.cigarettesPerDay ?? productConfig.defaultQuantity;
  const packPrice = onboardingDraft?.packPrice ?? profile?.packPrice ?? productConfig.defaultPrice;

  const dailyUsage = productConfig.quantityCadence === 'day' ? quantity : quantity / 7;
  const monthlySavings = (dailyUsage / productConfig.unitsPerPrice) * packPrice * 30.44;

  const inputRef = useRef<TextInput>(null);
  // Texte affiché dans le champ — initialisé depuis le store
  const [rawText, setRawText] = useState(packPrice > 0 ? String(packPrice).replace('.', ',') : '');

  function handleChangeText(text: string) {
    // Accepte chiffres, virgule et point
    const sanitized = text.replace(/[^0-9.,]/g, '').replace('.', ',');
    // Autorise une seule virgule
    const parts = sanitized.split(',');
    const normalized = parts.length > 2 ? parts[0] + ',' + parts.slice(1).join('') : sanitized;
    setRawText(normalized);
    const numVal = parseFloat(normalized.replace(',', '.'));
    if (!isNaN(numVal) && numVal > 0) {
      updateOnboardingDraft({ packPrice: numVal });
    }
  }

  function handleBlur() {
    if (!rawText || parseFloat(rawText.replace(',', '.')) <= 0) {
      const def = DEFAULT_PRICES[productType as ProductType]?.[currency as Currency];
      if (def) {
        setRawText(String(def).replace('.', ','));
        updateOnboardingDraft({ packPrice: def });
      }
    }
  }

  function applyPreset(price: number, cur: Currency) {
    setRawText(String(price).replace('.', ','));
    updateOnboardingDraft({ packPrice: price, currency: cur });
    Keyboard.dismiss();
  }

  return (
    <OnboardingScaffold
      step={4}
      total={5}
      title={i18n.t('onboarding.packPriceTitle', {
        label: i18n.t(`products.${productType}.priceLabel`),
      })}
      subtitle={i18n.t('onboarding.packPriceBody', {
        label: i18n.t(`products.${productType}.priceBody`),
      })}
      onBack={() => router.back()}
      footer={
        <Button
          label={i18n.t('common.continue')}
          disabled={packPrice <= 0}
          onPress={() => {
            Keyboard.dismiss();
            router.push('/(onboarding)/motivation' as Href);
          }}
        />
      }
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 20 }}>
          {/* Prix rapides */}
          <View style={{ gap: 6 }}>
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10, textAlign: 'center' }]}>
              Prix moyen — appuie pour sélectionner
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
              {(Object.entries(DEFAULT_PRICES[productType as ProductType] ?? {}) as [Currency, number][]).map(
                ([cur, price]) => (
                  <Pressable
                    key={cur}
                    onPress={() => applyPreset(price, cur)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: RADII.lg,
                      borderWidth: 1,
                      borderColor: currency === cur ? colors.accentBorder : colors.bgCardBorder,
                      backgroundColor: currency === cur ? colors.accentBg : colors.bgCard,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={[FONTS.black, { color: currency === cur ? colors.accent : colors.textPrimary, fontSize: 18 }]}>
                      {price.toFixed(2)}
                    </Text>
                    <Text style={[FONTS.bold, { color: currency === cur ? colors.accent : colors.textMuted, fontSize: 11, opacity: 0.8 }]}>
                      {cur}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          {/* Séparateur */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1, height: 0.5, backgroundColor: colors.divider }} />
            <Text style={[FONTS.regular, { color: colors.textMuted, fontSize: 10 }]}>ou saisir manuellement</Text>
            <View style={{ flex: 1, height: 0.5, backgroundColor: colors.divider }} />
          </View>

          {/* Champ de saisie */}
          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={{
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: colors.accentBorder,
              backgroundColor: colors.accentBg,
              paddingHorizontal: 20,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <TextInput
              ref={inputRef}
              value={rawText}
              onChangeText={handleChangeText}
              onBlur={handleBlur}
              onSubmitEditing={() => Keyboard.dismiss()}
              keyboardType="decimal-pad"
              returnKeyType="done"
              placeholder="0,00"
              placeholderTextColor={colors.textMuted}
              style={[
                FONTS.black,
                {
                  color: colors.textPrimary,
                  fontSize: 42,
                  textAlign: 'center',
                  minWidth: 120,
                  padding: 0,
                },
              ]}
            />
            <Text style={[FONTS.bold, { color: colors.textSecondary, fontSize: 18, marginTop: 6 }]}>
              {currency}
            </Text>
          </Pressable>

          {/* Économies potentielles */}
          <View
            style={{
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.emeraldBorder,
              backgroundColor: colors.emeraldBg,
              paddingHorizontal: 14,
              paddingVertical: 14,
              gap: 4,
            }}
          >
            <Text
              style={[FONTS.bold, { color: colors.emerald, fontSize: 8, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }]}
            >
              {i18n.t('onboarding.potentialSavings')}
            </Text>
            <Text style={[FONTS.black, { color: colors.emerald, fontSize: 24 }]}>
              {formatCurrency(monthlySavings, currency)} / mois
            </Text>
            <Text style={[FONTS.regular, { color: colors.emerald, fontSize: 11, opacity: 0.7 }]}>
              = {formatCurrency(monthlySavings * 12, currency)} par an
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </OnboardingScaffold>
  );
}
