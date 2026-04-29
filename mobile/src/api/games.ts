import { apiClient } from './client';
import { Game } from '../types/game';

export const getCurrentGame = async (): Promise<Game | null> => {
  try {
    const response = await apiClient.get<Game>('/games/current');
    return response.data;
  } catch {
    return null;
  }
};

export const getAllGames = async (): Promise<Game[]> => {
  const response = await apiClient.get<Game[]>('/games');
  return response.data;
};
