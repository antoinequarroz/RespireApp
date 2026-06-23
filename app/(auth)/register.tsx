import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { FONTS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signUp, isLoading, error, setError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLocalError(null);
    setError(null);
    if (!email.trim() || !password) { setLocalError('Remplis tous les champs.'); return; }
    if (password.length < 8) { setLocalError('Mot de passe trop court (8 caractères min).'); return; }
    if (password !== confirm) { setLocalError('Les mots de passe ne correspondent pas.'); return; }
    await signUp(email.trim().toLowerCase(), password);
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

  const displayError = localError ?? error;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 80, gap: 24 }}>
        <View style={{ gap: 6 }}>
          <Text style={[FONTS.black, { color: colors.textPrimary, fontSize: 28 }]}>
            Créer un compte
          </Text>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 14 }]}>
            Tes données seront synchronisées et sauvegardées.
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
            placeholder="Mot de passe (8 caractères min)"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          <TextInput
            style={inputStyle}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={colors.textSecondary}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoComplete="new-password"
          />
        </View>

        {displayError ? (
          <Text style={[FONTS.regular, { color: '#EF4444', fontSize: 13 }]}>{displayError}</Text>
        ) : null}

        <Pressable
          onPress={handleRegister}
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
            {isLoading ? 'Création…' : 'Créer mon compte'}
          </Text>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          <Text style={[FONTS.regular, { color: colors.textSecondary, fontSize: 13 }]}>
            Déjà un compte ?
          </Text>
          <Pressable onPress={() => router.push('/(auth)/login' as any)}>
            <Text style={[FONTS.bold, { color: colors.accent, fontSize: 13 }]}>
              Se connecter
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
