export enum UserRole {
    user = "user",
    admin = "admin"
}

export type User = {
    user_id: number;
    userName: string;
    email: string;
    password: string;
    picture: string;
    role: UserRole;
    gameCoins: number;
    freeCoins: number;
    premiumCoins: number;
}

export type CreateUserDto = {
    username: string;
    email: string;
    password: string;
}

export type LoginUserDto = {
    email: string;
    password: string;
}

export type UserSession = {
    id: string;
    username: string;
    role: string;
}