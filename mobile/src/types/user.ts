export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  gameCoins: number;
  freeCoins: number;
  premiumCoins: number;
};

export type CreateUserDto = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserDto = {
  username?: string;
  email?: string;
  gameCoins?: number;
  premiumCoins?: number;
  freeCoins?: number;
};

export type LoginUserDto = {
  email: string;
  password: string;
};

export type AuthPayload = {
  id: string;
  username: string;
  role?: string;
  iat: number;
  exp: number;
};
