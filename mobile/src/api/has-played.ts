import { apiClient } from './client';
import { HasPlayed, CreateHasPlayedDto } from '../types/has-played';

export const getHasPlayed = async (
  userId: string,
  leaderboardId: string,
): Promise<HasPlayed[]> => {
  const response = await apiClient.get<HasPlayed[]>(
    `/has-played?userId=${userId}&leaderboardId=${leaderboardId}`,
  );
  return response.data;
};

export const createHasPlayed = async (dto: CreateHasPlayedDto): Promise<HasPlayed> => {
  const response = await apiClient.post<HasPlayed>('/has-played', dto);
  return response.data;
};
