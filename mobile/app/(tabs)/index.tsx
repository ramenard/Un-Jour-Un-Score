import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentGame } from '@/api/games';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Game, GAME_NAMES } from '@/types/game';
import { theme } from '@/theme';

const GAME_META: Record<string, { icon: string; label: string; color: string; route: string }> = {
  [GAME_NAMES.COIN_FLIP]: {
    icon: '🪙',
    label: 'Pile ou Face',
    color: theme.colors.gold,
    route: '/game/coin-flip',
  },
  [GAME_NAMES.ROCK_PAPER_SCISSORS]: {
    icon: '✊',
    label: 'Pierre Papier Ciseaux',
    color: theme.colors.accent,
    route: '/game/rock-paper-scissors',
  },
};

function CoinBadge({ count, icon, label }: { count: number; icon: string; label: string }) {
  return (
    <View style={styles.coinBadge}>
      <Text style={styles.coinIcon}>{icon}</Text>
      <Text style={styles.coinCount}>{count}</Text>
      <Text style={styles.coinLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextRefreshIn, setNextRefreshIn] = useState(0);
  const { user, canPlay, fetchUser, removeUserGameCoin } = useUser();
  const { signOut } = useAuth();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadGame = useCallback(async () => {
    try {
      const current = await getCurrentGame();
      setGame(current);
      computeNextRefresh(current);
    } catch {
      setGame(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const computeNextRefresh = (g: Game | null) => {
    if (!g) return;
    const now = new Date();
    const seconds = now.getSeconds();
    // Games refresh at :01, :11, :21, :31, :41, :51
    const slots = [1, 11, 21, 31, 41, 51];
    const next = slots.find((s) => s > seconds) ?? slots[0] + 60;
    setNextRefreshIn(next - seconds);
  };

  useEffect(() => {
    loadGame();
    const interval = setInterval(loadGame, 30_000);
    return () => clearInterval(interval);
  }, [loadGame]);

  useEffect(() => {
    if (!game?.isActive) return;
    // Pulsing glow when game is active
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
    return () => pulseAnim.stopAnimation();
  }, [game?.isActive, pulseAnim]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadGame(), fetchUser()]);
  }, [loadGame, fetchUser]);

  const handlePlay = async () => {
    if (!game || !canPlay) return;
    await removeUserGameCoin();
    const meta = GAME_META[game.name];
    if (meta) router.push(meta.route as any);
  };

  const gameMeta = game ? GAME_META[game.name] : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <LoadingSpinner label="Chargement..." size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.username}>{user?.username ?? '...'}</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Coin Balances */}
        {user && (
          <Card style={styles.coinsCard}>
            <Text style={styles.sectionLabel}>Vos jetons</Text>
            <View style={styles.coinsRow}>
              <CoinBadge count={user.gameCoins} icon="🎮" label="Jeu" />
              <View style={styles.coinDivider} />
              <CoinBadge count={user.freeCoins} icon="🎁" label="Gratuit" />
              <View style={styles.coinDivider} />
              <CoinBadge count={user.premiumCoins} icon="💎" label="Premium" />
            </View>
          </Card>
        )}

        {/* Current Game */}
        <Text style={styles.sectionTitle}>Jeu en cours</Text>

        {!game ? (
          <Card style={styles.noGameCard}>
            <Text style={styles.noGameIcon}>⏳</Text>
            <Text style={styles.noGameTitle}>Aucun jeu actif</Text>
            <Text style={styles.noGameSubtitle}>
              Le prochain jeu arrive bientôt.{'\n'}Tire vers le bas pour actualiser.
            </Text>
          </Card>
        ) : (
          <Animated.View
            style={[
              game.isActive && { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Card
              style={styles.gameCard}
              glow={game.isActive ? (gameMeta?.color === theme.colors.gold ? 'gold' : 'accent') : undefined}
            >
              {/* Status badge */}
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: game.isActive ? theme.colors.successGlow : theme.colors.errorGlow },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: game.isActive ? theme.colors.success : theme.colors.error },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: game.isActive ? theme.colors.success : theme.colors.error },
                  ]}
                >
                  {game.isActive ? 'EN COURS' : 'FERMÉ'}
                </Text>
              </View>

              <Text style={styles.gameIcon}>{gameMeta?.icon ?? '🎮'}</Text>
              <Text style={styles.gameName}>{gameMeta?.label ?? game.name}</Text>
              <Text style={styles.gameDesc}>{game.description}</Text>

              {game.isActive && (
                <Button
                  title={canPlay ? '▶  Jouer maintenant' : '🚫  Plus de jetons'}
                  onPress={handlePlay}
                  disabled={!canPlay}
                  fullWidth
                  size="lg"
                  style={styles.playButton}
                />
              )}

              {!game.isActive && (
                <View style={styles.waitingRow}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textMuted} />
                  <Text style={styles.waitingText}>Prochain jeu dans quelques minutes</Text>
                </View>
              )}
            </Card>
          </Animated.View>
        )}

        {/* No coins hint */}
        {!canPlay && user && (
          <Card style={styles.hintCard}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.accent} />
            <Text style={styles.hintText}>
              Vous n'avez plus de jetons. Vos jetons de jeu se rechargent automatiquement.
            </Text>
          </Card>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  username: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  logoutButton: {
    padding: theme.spacing.sm,
  },
  coinsCard: {
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  coinsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  coinBadge: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  coinIcon: {
    fontSize: 24,
  },
  coinCount: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  coinLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  coinDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.cardBorder,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  noGameCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  noGameIcon: {
    fontSize: 48,
  },
  noGameTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  noGameSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  gameCard: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.8,
  },
  gameIcon: {
    fontSize: 64,
  },
  gameName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  gameDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  playButton: {
    marginTop: theme.spacing.sm,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  waitingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    borderColor: theme.colors.accentGlow,
  },
  hintText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
