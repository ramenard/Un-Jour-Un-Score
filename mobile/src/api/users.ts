import { apiClient } from './client';
import { User, UpdateUserDto } from '../types/user';

export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};

export const canUserPlay = async (id: string): Promise<boolean> => {
  const response = await apiClient.get<boolean>(`/users/${id}/isAble`);
  return response.data;
};

export const getUserLeaderboardPosition = async (id: string) => {
  const response = await apiClient.get(`/users/${id}/leaderboard`);
  return response.data;
};

export const updateUser = async (id: string, dto: UpdateUserDto): Promise<User> => {
  const response = await apiClient.patch<User>(`/users/${id}`, dto);
  return response.data;
};

export const saveScore = async (id: string, score: number): Promise<void> => {
  await apiClient.patch(`/users/${id}/score`, { score });
};
