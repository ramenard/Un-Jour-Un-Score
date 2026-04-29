import { apiClient } from './client';
import { Leaderboard, LeaderboardEntry } from '../types/leaderboard';

export const getCurrentLeaderboard = async (): Promise<Leaderboard | null> => {
  try {
    const response = await apiClient.get<Leaderboard>('/leaderboards/current');
    return response.data;
  } catch {
    return null;
  }
};

export const getUserLeaderboardRankings = async (): Promise<LeaderboardEntry[]> => {
  const response = await apiClient.get<LeaderboardEntry[]>('/leaderboards/user-leaderboard');
  return response.data;
};
