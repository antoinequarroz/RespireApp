import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { FONTS, SPACING } from '@/constants/theme';
import { i18n } from '@/services/i18n';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signIn, isLoading, error, setError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setError(null);
    await signIn(email.trim().toLowerCase(), password);
  };

  const inputStyle = {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    borderWidth: 1,
    borderColor: colors.bgCardBorder,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 80, gap: 24 }}>
        <View style={{ gap: 6 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 28 }]}>
            Connexion
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 14 }]}>
            Retrouve tes données sur n'importe quel appareil.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <TextInput
            style={inputStyle}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput
            style={inputStyle}
            placeholder="Mot de passe"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        {error ? (
          <Text style={[FONTS.regular, { color: '#EF4444', fontSize: 13 }]}>{error}</Text>
        ) : null}

        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          style={{
            backgroundColor: colors.accent,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <Text style={[FONTS.bold, { color: '#fff', fontSize: 15 }]}>
            {isLoading ? 'Connexion…' : 'Se connecter'}
          </Text>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            Pas encore de compte ?
          </Text>
          <Pressable onPress={() => router.push('/(auth)/register' as any)}>
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 13 }]}>
              Créer un compte
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={{ alignSelf: 'center', paddingVertical: 8 }}
        >
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 12 }]}>
            Continuer sans compte →
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
