import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LeaderboardEntry } from '../types/leaderboard';
import { theme } from '../theme';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  currentUsername?: string;
}

const MEDAL_COLORS = [theme.colors.gold, '#c0c0c0', '#cd7f32'];
const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  const pos = entry.position;
  const hasMedal = pos >= 1 && pos <= 3;

  return (
    <View style={[styles.row, isCurrentUser && styles.rowHighlight]}>
      <View style={styles.positionCell}>
        {hasMedal ? (
          <Text style={styles.medal}>{MEDAL_ICONS[pos - 1]}</Text>
        ) : (
          <Text style={[styles.positionText, isCurrentUser && styles.highlightText]}>
            #{pos}
          </Text>
        )}
      </View>
      <Text
        style={[styles.usernameText, isCurrentUser && styles.highlightText]}
        numberOfLines={1}
      >
        {entry.username}
        {isCurrentUser && ' (vous)'}
      </Text>
      <Text style={[styles.scoreText, hasMedal && { color: MEDAL_COLORS[pos - 1] }]}>
        {entry.score}
      </Text>
    </View>
  );
}

export function LeaderboardTable({ entries, currentUsername }: LeaderboardTableProps) {
  if (!entries.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🏆</Text>
        <Text style={styles.emptyText}>Aucun score pour le moment</Text>
        <Text style={styles.emptySubText}>Soyez le premier à jouer !</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.positionCell]}>Rang</Text>
        <Text style={[styles.headerText, styles.flex1]}>Joueur</Text>
        <Text style={styles.headerText}>Score</Text>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(item) => `${item.username}-${item.position}`}
        renderItem={({ item }) => (
          <LeaderboardRow
            entry={item}
            isCurrentUser={item.username === currentUsername}
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },
  rowHighlight: {
    backgroundColor: theme.colors.primaryGlow,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.primary,
  },
  positionCell: {
    width: 44,
  },
  flex1: {
    flex: 1,
  },
  positionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  medal: {
    fontSize: 18,
  },
  usernameText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  highlightText: {
    color: theme.colors.primaryLight,
    fontWeight: theme.fontWeight.bold,
  },
  scoreText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    minWidth: 40,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
  },
  empty: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  emptySubText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
});
