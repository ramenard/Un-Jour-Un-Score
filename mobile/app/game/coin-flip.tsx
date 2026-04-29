import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { saveScore } from '../../src/api/users';
import { getCurrentLeaderboard } from '../../src/api/leaderboards';
import { getHasPlayed, createHasPlayed } from '../../src/api/has-played';
import { useUser } from '../../src/context/UserContext';
import { useAuth } from '../../src/context/AuthContext';
import { theme } from '../../src/theme';

enum CoinSide {
  HEAD = 'head',
  TAIL = 'tail',
}

const COIN_FACES: Record<CoinSide, { label: string; emoji: string; bg: string }> = {
  [CoinSide.HEAD]: { label: 'FACE', emoji: '🟡', bg: '#f59e0b' },
  [CoinSide.TAIL]: { label: 'PILE', emoji: '⚪', bg: '#94a3b8' },
};

export default function CoinFlipScreen() {
  const [score, setScore] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [coinSide, setCoinSide] = useState<CoinSide>(CoinSide.HEAD);
  const [showingQuestion, setShowingQuestion] = useState(true);
  const [lastResult, setLastResult] = useState<'win' | null>(null);

  const { canPlay, removeUserGameCoin, fetchUser } = useUser();
  const { userId } = useAuth();

  // Refs to avoid stale closures in animations
  const scoreRef = useRef(0);
  const scaleX = useRef(new Animated.Value(1)).current;
  const coinOpacity = useRef(new Animated.Value(1)).current;
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
      // Silently fail — game still works
    }
  };

  const animateScorePop = () => {
    scoreAnim.setValue(0);
    Animated.sequence([
      Animated.spring(scoreAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 5 }),
      Animated.timing(scoreAnim, { toValue: 0, duration: 400, delay: 600, useNativeDriver: true }),
    ]).start();
  };

  const flipCoin = useCallback(
    (choice: CoinSide) => {
      if (isFlipping) return;
      setIsFlipping(true);
      setShowingQuestion(false);

      const randomResult = Math.random();
      const result: CoinSide = randomResult <= 0.5 ? CoinSide.HEAD : CoinSide.TAIL;
      let flipCount = 0;
      const totalFlips = 5;

      const doFlip = () => {
        Animated.sequence([
          Animated.timing(scaleX, {
            toValue: 0,
            duration: Math.max(60, 130 - flipCount * 14),
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
          Animated.timing(scaleX, {
            toValue: 1,
            duration: Math.max(60, 130 - flipCount * 14),
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
        ]).start(() => {
          flipCount++;

          // Show the result face on the penultimate flip
          if (flipCount === totalFlips - 1) {
            setCoinSide(result);
          }

          if (flipCount < totalFlips) {
            doFlip();
          } else {
            // Animation done — evaluate result
            setIsFlipping(false);

            if (result === choice) {
              scoreRef.current += 1;
              setScore(scoreRef.current);
              animateScorePop();
              setLastResult('win');
            } else {
              // Lost — persist score then show dialog
              saveScore(userId, scoreRef.current).catch(console.error);
              setShowResult(true);
            }
          }
        });
      };

      doFlip();
    },
    [isFlipping, scaleX, userId],
  );

  const handleReplay = async () => {
    await removeUserGameCoin();
    setShowResult(false);
    setScore(0);
    scoreRef.current = 0;
    setCoinSide(CoinSide.HEAD);
    setShowingQuestion(true);
    setLastResult(null);
  };

  const handleGoHome = () => {
    setShowResult(false);
    router.replace('/(tabs)');
  };

  const scoreScale = scoreAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const face = COIN_FACES[coinSide];

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
        <Text style={styles.headerTitle}>Pile ou Face</Text>
        <Animated.View style={{ transform: [{ scale: scoreScale }] }}>
          <View style={styles.scorePill}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Coin Area */}
      <View style={styles.coinArea}>
        <Animated.View
          style={[styles.coinWrapper, { transform: [{ scaleX }] }]}
        >
          {showingQuestion ? (
            <View style={[styles.coin, styles.coinQuestion]}>
              <Text style={styles.coinQuestionText}>?</Text>
            </View>
          ) : (
            <View style={[styles.coin, { backgroundColor: face.bg + '22', borderColor: face.bg }]}>
              <Text style={styles.coinEmoji}>{face.emoji}</Text>
              <Text style={[styles.coinLabel, { color: face.bg }]}>{face.label}</Text>
            </View>
          )}
        </Animated.View>

        {isFlipping && (
          <Text style={styles.flippingHint}>Lancement en cours...</Text>
        )}

        {!isFlipping && !showingQuestion && lastResult === 'win' && (
          <Text style={styles.winText}>+1 ✓</Text>
        )}
      </View>

      {/* Choice Buttons */}
      <View style={styles.choiceArea}>
        <Text style={styles.choiceHint}>
          {isFlipping ? ' ' : 'Choisissez votre côté'}
        </Text>
        <View style={styles.choiceRow}>
          <TouchableOpacity
            style={[styles.choiceBtn, styles.tailBtn, isFlipping && styles.btnDisabled]}
            onPress={() => flipCoin(CoinSide.TAIL)}
            disabled={isFlipping}
            activeOpacity={0.75}
          >
            <Text style={styles.choiceBtnEmoji}>⚪</Text>
            <Text style={styles.choiceBtnText}>Pile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.choiceBtn, styles.headBtn, isFlipping && styles.btnDisabled]}
            onPress={() => flipCoin(CoinSide.HEAD)}
            disabled={isFlipping}
            activeOpacity={0.75}
          >
            <Text style={styles.choiceBtnEmoji}>🟡</Text>
            <Text style={styles.choiceBtnText}>Face</Text>
          </TouchableOpacity>
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
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
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
  coinArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  coinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    gap: theme.spacing.xs,
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  coinQuestion: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.cardBorder,
  },
  coinQuestionText: {
    fontSize: 64,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.textMuted,
  },
  coinEmoji: {
    fontSize: 56,
  },
  coinLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.extrabold,
    letterSpacing: 2,
  },
  flippingHint: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
  },
  winText: {
    color: theme.colors.success,
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
    gap: theme.spacing.md,
  },
  choiceBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    gap: theme.spacing.xs,
  },
  tailBtn: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: '#94a3b8',
  },
  headBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: theme.colors.gold,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  choiceBtnEmoji: {
    fontSize: 36,
  },
  choiceBtnText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
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
