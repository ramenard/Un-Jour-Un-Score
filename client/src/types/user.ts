export enum UserRole {
	USER = 'user',
	ADMIN = 'admin',
}

export type User = {
	id: number;
	userName: string;
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

export type UserSession = {
	id: string;
	username: string;
	role: string;
};
