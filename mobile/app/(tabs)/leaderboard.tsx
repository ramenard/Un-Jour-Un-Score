import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserLeaderboardRankings } from '../../src/api/leaderboards';
import { getUserLeaderboardPosition } from '../../src/api/users';
import { getCurrentGame } from '../../src/api/games';
import { LeaderboardEntry } from '../../src/types/leaderboard';
import { useAuth } from '../../src/context/AuthContext';
import { useUser } from '../../src/context/UserContext';
import { LeaderboardTable } from '../../src/components/LeaderboardTable';
import { Card } from '../../src/components/ui/Card';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { theme } from '../../src/theme';

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [gameName, setGameName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();
  const { user } = useUser();

  const loadData = useCallback(async () => {
    try {
      const [rankings, game, pos] = await Promise.allSettled([
        getUserLeaderboardRankings(),
        getCurrentGame(),
        userId ? getUserLeaderboardPosition(userId) : Promise.resolve(null),
      ]);

      if (rankings.status === 'fulfilled') setEntries(rankings.value);
      if (game.status === 'fulfilled' && game.value) setGameName(game.value.name);
      if (pos.status === 'fulfilled' && pos.value !== null) {
        setUserPosition(typeof pos.value === 'number' ? pos.value : pos.value?.position ?? null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const GAME_LABEL: Record<string, string> = {
    'coin-flip': '🪙 Pile ou Face',
    'rock-paper-scissors': '✊ Pierre Papier Ciseaux',
  };

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
          <Text style={styles.title}>Classement</Text>
          {gameName && (
            <Text style={styles.subtitle}>{GAME_LABEL[gameName] ?? gameName}</Text>
          )}
        </View>

        {/* User's position */}
        {user && userPosition !== null && (
          <Card style={styles.userPositionCard} glow="primary">
            <View style={styles.userPositionContent}>
              <Text style={styles.userPositionIcon}>🎯</Text>
              <View>
                <Text style={styles.userPositionLabel}>Votre position</Text>
                <Text style={styles.userPositionValue}>#{userPosition}</Text>
              </View>
              <View style={styles.userPositionSeparator} />
              <View>
                <Text style={styles.userPositionLabel}>Votre score</Text>
                <Text style={styles.userPositionScore}>
                  {entries.find((e) => e.username === user.username)?.score ?? '–'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Leaderboard */}
        {loading ? (
          <View style={styles.centered}>
            <LoadingSpinner label="Chargement du classement..." />
          </View>
        ) : (
          <LeaderboardTable entries={entries} currentUsername={user?.username} />
        )}

        <Text style={styles.refreshHint}>
          ↕ Tire pour actualiser · mis à jour toutes les 30s
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  userPositionCard: {
    borderColor: theme.colors.primaryGlow,
  },
  userPositionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  userPositionIcon: {
    fontSize: 32,
  },
  userPositionLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  userPositionValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primaryLight,
  },
  userPositionScore: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.accent,
  },
  userPositionSeparator: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.cardBorder,
  },
  centered: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  refreshHint: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.sm,
  },
});
