import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { saveScore } from '@/api/users';
import { getCurrentLeaderboard } from '@/api/leaderboards';
import { getHasPlayed, createHasPlayed } from '@/api/has-played';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/theme';

enum RPS {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
}

const RPS_META: Record<RPS, { emoji: string; label: string; beats: RPS; color: string }> = {
  [RPS.ROCK]: { emoji: '✊', label: 'Pierre', beats: RPS.SCISSORS, color: '#94a3b8' },
  [RPS.PAPER]: { emoji: '✋', label: 'Papier', beats: RPS.ROCK, color: '#06b6d4' },
  [RPS.SCISSORS]: { emoji: '✌️', label: 'Ciseaux', beats: RPS.PAPER, color: '#a855f7' },
};

function checkWin(player: RPS, computer: RPS): 'win' | 'draw' | null {
  if (player === computer) return 'draw';
  return RPS_META[player].beats === computer ? 'win' : null;
}

export default function RockPaperScissorsScreen() {
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [computerChoice, setComputerChoice] = useState<RPS | null>(null);
  const [roundOutcome, setRoundOutcome] = useState<'win' | 'draw' | null>(null);

  const { canPlay, removeUserGameCoin, fetchUser } = useUser();
  const { userId } = useAuth();

  const scoreRef = useRef(0);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const revealScale = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && userId) {
      hasInitialized.current = true;
      initHasPlayed();
    }
  }, [userId]);

  const initHasPlayed = async () => {
    try {
      const leaderboard = await getCurrentLeaderboard();
      if (!leaderboard) return;
      const existing = await getHasPlayed(userId, leaderboard.id);
      if (!existing.length) {
        await createHasPlayed({ userId });
      }
    } catch {
      // Silently fail
    }
  };

  const animateScorePop = () => {
    scoreAnim.setValue(0);
    Animated.sequence([
      Animated.spring(scoreAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 5 }),
      Animated.timing(scoreAnim, { toValue: 0, duration: 400, delay: 600, useNativeDriver: true }),
    ]).start();
  };

  const playRound = useCallback(
    (playerChoice: RPS) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setComputerChoice(null);
      setRoundOutcome(null);
      revealScale.setValue(0);

      // Blink animation (? pulsing)
      const blinkLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 0.3, duration: 200, useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
      );
      blinkLoop.start();

      setTimeout(() => {
        blinkLoop.stop();
        blinkAnim.setValue(1);

        const choices = [RPS.ROCK, RPS.PAPER, RPS.SCISSORS];
        const cpu = choices[Math.floor(Math.random() * 3)];
        const outcome = checkWin(playerChoice, cpu);

        setComputerChoice(cpu);
        setRoundOutcome(outcome);

        // Reveal animation
        Animated.spring(revealScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 8,
        }).start(() => {
          setIsAnimating(false);

          if (outcome === 'win') {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            animateScorePop();
          } else if (!outcome) {
            saveScore(userId, scoreRef.current).catch(console.error);
            setShowResult(true);
          }
          // Draw: do nothing (no score change, no game over)
        });
      }, 1600);
    },
    [isAnimating, blinkAnim, revealScale, userId],
  );

  const handleReplay = async () => {
    await removeUserGameCoin();
    setShowResult(false);
    setScore(0);
    scoreRef.current = 0;
    setComputerChoice(null);
    setRoundOutcome(null);
  };

  const handleGoHome = () => {
    setShowResult(false);
    router.replace('/(tabs)');
  };

  const scoreScale = scoreAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const outcomeColor =
    roundOutcome === 'win'
      ? theme.colors.success
      : roundOutcome === 'draw'
      ? theme.colors.gold
      : theme.colors.error;

  const outcomeLabel =
    roundOutcome === 'win' ? '✓ Gagné !' : roundOutcome === 'draw' ? '↔ Égalité' : '✗ Perdu';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pierre Papier Ciseaux</Text>
        <Animated.View style={{ transform: [{ scale: scoreScale }] }}>
          <View style={styles.scorePill}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Computer Display */}
      <View style={styles.computerArea}>
        <Text style={styles.computerAreaLabel}>Ordinateur</Text>

        {!computerChoice ? (
          <Animated.View style={[styles.displayBox, { opacity: blinkAnim }]}>
            <Text style={styles.questionMark}>?</Text>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.displayBox,
              {
                transform: [{ scale: revealScale }],
                borderColor: RPS_META[computerChoice].color,
                backgroundColor: RPS_META[computerChoice].color + '18',
              },
            ]}
          >
            <Text style={styles.displayEmoji}>{RPS_META[computerChoice].emoji}</Text>
            <Text style={[styles.displayLabel, { color: RPS_META[computerChoice].color }]}>
              {RPS_META[computerChoice].label}
            </Text>
          </Animated.View>
        )}

        {roundOutcome && !isAnimating && (
          <Text style={[styles.outcomeText, { color: outcomeColor }]}>{outcomeLabel}</Text>
        )}
      </View>

      {/* Player Choices */}
      <View style={styles.choiceArea}>
        <Text style={styles.choiceHint}>
          {isAnimating ? 'L\'ordinateur réfléchit...' : 'Choisissez votre coup'}
        </Text>
        <View style={styles.choiceRow}>
          {([RPS.ROCK, RPS.PAPER, RPS.SCISSORS] as RPS[]).map((rps) => {
            const meta = RPS_META[rps];
            return (
              <TouchableOpacity
                key={rps}
                style={[
                  styles.choiceBtn,
                  { borderColor: meta.color, backgroundColor: meta.color + '15' },
                  isAnimating && styles.btnDisabled,
                ]}
                onPress={() => playRound(rps)}
                disabled={isAnimating}
                activeOpacity={0.75}
              >
                <Text style={styles.choiceBtnEmoji}>{meta.emoji}</Text>
                <Text style={[styles.choiceBtnText, { color: meta.color }]}>{meta.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Game Over Modal */}
      <Modal visible={showResult} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalEmoji}>🎯</Text>
            <Text style={styles.modalTitle}>Partie Terminée</Text>
            <Text style={styles.modalSubtitle}>Votre score final</Text>
            <Text style={styles.modalScore}>{score}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnSecondary} onPress={handleGoHome}>
                <Text style={styles.modalBtnText}>🏠 Menu</Text>
              </TouchableOpacity>
              {canPlay && (
                <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleReplay}>
                  <Text style={styles.modalBtnTextPrimary}>▶ Rejouer</Text>
                </TouchableOpacity>
              )}
            </View>

            {!canPlay && (
              <Text style={styles.modalNoCoins}>Plus de jetons disponibles</Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  scorePill: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    minWidth: 64,
  },
  scoreLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.gold,
  },
  computerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  computerAreaLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  displayBox: {
    width: 160,
    height: 160,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.card,
    gap: theme.spacing.xs,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  questionMark: {
    fontSize: 72,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.textMuted,
  },
  displayEmoji: {
    fontSize: 64,
  },
  displayLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
  },
  outcomeText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
  },
  choiceArea: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  choiceHint: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  choiceBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    gap: 4,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  choiceBtnEmoji: {
    fontSize: 32,
  },
  choiceBtnText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    width: '80%',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  modalEmoji: {
    fontSize: 56,
    marginBottom: theme.spacing.sm,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  modalScore: {
    fontSize: 56,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.gold,
    marginVertical: theme.spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
    marginTop: theme.spacing.md,
  },
  modalBtnSecondary: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  modalBtnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalBtnText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  modalBtnTextPrimary: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  modalNoCoins: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
});
