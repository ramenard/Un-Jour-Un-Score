import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useUser } from '../../src/context/UserContext';
import { updateUser } from '../../src/api/users';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { theme } from '../../src/theme';

function Avatar({ username }: { username: string }) {
  const initial = username.charAt(0).toUpperCase();
  const hue = username.charCodeAt(0) * 17 % 360;
  return (
    <View style={[styles.avatar, { backgroundColor: `hsl(${hue}, 60%, 30%)` }]}>
      <Text style={styles.avatarText}>{initial}</Text>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'admin';
  return (
    <View style={[styles.roleBadge, isAdmin && styles.roleBadgeAdmin]}>
      <Text style={[styles.roleText, isAdmin && styles.roleTextAdmin]}>
        {isAdmin ? '👑 Admin' : '🎮 Joueur'}
      </Text>
    </View>
  );
}

const RECHARGE_AMOUNT = 3;

export default function ProfileScreen() {
  const { signOut, userRole } = useAuth();
  const { userId } = useAuth();
  const { user, isLoading, fetchUser } = useUser();
  const [recharging, setRecharging] = React.useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleRecharge = async () => {
    if (!user || !userId) return;
    setRecharging(true);
    try {
      await updateUser(userId, { gameCoins: user.gameCoins + RECHARGE_AMOUNT });
      await fetchUser();
      Alert.alert('Jetons rechargés', `+${RECHARGE_AMOUNT} jetons de jeu ajoutés !`);
    } catch {
      Alert.alert('Erreur', 'Impossible de recharger les jetons.');
    } finally {
      setRecharging(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  };

  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <LoadingSpinner label="Chargement du profil..." size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  const totalCoins = user.gameCoins + user.freeCoins + user.premiumCoins;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card style={styles.profileCard} glow="primary">
          <View style={styles.profileTop}>
            <Avatar username={user.username} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.username}</Text>
              <Text style={styles.profileEmail} numberOfLines={1}>{user.email}</Text>
              <RoleBadge role={user.role} />
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Mes jetons</Text>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <StatCard
              icon="🎮"
              value={user.gameCoins}
              label="Jeu"
              color={theme.colors.primaryLight}
            />
            <View style={styles.statDivider} />
            <StatCard
              icon="🎁"
              value={user.freeCoins}
              label="Gratuit"
              color={theme.colors.success}
            />
            <View style={styles.statDivider} />
            <StatCard
              icon="💎"
              value={user.premiumCoins}
              label="Premium"
              color={theme.colors.gold}
            />
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{totalCoins} jeton{totalCoins !== 1 ? 's' : ''}</Text>
          </View>
        </Card>

        {/* How coins work */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.accent} />
            <Text style={styles.infoText}>
              Les jetons de jeu (🎮) se rechargent automatiquement.
              Les jetons gratuits et premium permettent des parties supplémentaires.
            </Text>
          </View>
        </Card>

        {/* Recharge */}
        <Text style={styles.sectionTitle}>Jetons</Text>
        <Card style={styles.rechargeCard} glow="gold">
          <View style={styles.rechargeHeader}>
            <Text style={styles.rechargeIcon}>🎮</Text>
            <View style={styles.rechargeInfo}>
              <Text style={styles.rechargeTitle}>Recharger les jetons</Text>
              <Text style={styles.rechargeSubtitle}>
                Ajoute {RECHARGE_AMOUNT} jetons de jeu à ton solde
              </Text>
            </View>
          </View>
          <Button
            title={`+${RECHARGE_AMOUNT} jetons`}
            onPress={handleRecharge}
            loading={recharging}
            fullWidth
            style={styles.rechargeButton}
          />
        </Card>

        {/* Actions */}
        <Text style={styles.sectionTitle}>Compte</Text>
        <Card style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionRow} onPress={fetchUser}>
            <Ionicons name="refresh-outline" size={20} color={theme.colors.accent} />
            <Text style={styles.actionText}>Actualiser le profil</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </Card>

        <Button
          title="Se déconnecter"
          onPress={handleSignOut}
          variant="danger"
          fullWidth
          style={styles.signOutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  profileCard: {
    marginBottom: theme.spacing.sm,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  profileInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  profileName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  profileEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  roleBadgeAdmin: {
    borderColor: theme.colors.gold,
    backgroundColor: theme.colors.goldGlow,
  },
  roleText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  roleTextAdmin: {
    color: theme.colors.goldLight,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statsCard: {
    gap: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: theme.colors.cardBorder,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  totalValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  infoCard: {
    borderColor: theme.colors.accentGlow,
  },
  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  rechargeCard: {
    gap: theme.spacing.md,
    borderColor: theme.colors.goldGlow,
  },
  rechargeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  rechargeIcon: {
    fontSize: 36,
  },
  rechargeInfo: {
    flex: 1,
    gap: 2,
  },
  rechargeTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  rechargeSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  rechargeButton: {
    backgroundColor: theme.colors.gold,
    shadowColor: theme.colors.gold,
  },
  actionsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  signOutButton: {
    marginTop: theme.spacing.md,
  },
});
