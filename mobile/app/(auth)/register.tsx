import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { z } from 'zod';
import { register } from '../../src/api/auth';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/theme';

const registerSchema = z.object({
  username: z.string().min(3, 'Pseudo : 3 caractères minimum'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe : 6 caractères minimum'),
});

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleRegister = async () => {
    const result = registerSchema.safeParse({ username, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { access_token } = await register({ username, email, password });
      await signIn(access_token);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erreur lors de la création du compte';
      Alert.alert('Inscription échouée', Array.isArray(msg) ? msg.join('\n') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🎮</Text>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez la compétition !</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Pseudo</Text>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                value={username}
                onChangeText={setUsername}
                placeholder="MonPseudo"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                autoComplete="username-new"
                returnKeyType="next"
              />
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.inputInner}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <Button
              title="S'inscrire"
              onPress={handleRegister}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.submitButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logo: {
    fontSize: 56,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  form: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  field: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.md,
  },
  inputInner: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  eyeButton: {
    paddingHorizontal: theme.spacing.md,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  footerLink: {
    color: theme.colors.primaryLight,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
});
