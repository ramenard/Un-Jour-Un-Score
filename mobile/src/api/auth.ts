import { apiClient } from './client';
import { CreateUserDto, LoginUserDto } from '../types/user';

export interface AuthResponse {
  access_token: string;
}

export const login = async (dto: LoginUserDto): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/security/login', dto);
  return response.data;
};

export const register = async (dto: CreateUserDto): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/security/register', dto);
  return response.data;
};
