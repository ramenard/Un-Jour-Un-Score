'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { UpdateUserDto, User } from '@/types/user';

interface UserContextProps {
	user: User | null;
	canUserPlay: boolean;
	fetchUser: () => Promise<void>;
	removeUserGameCoin: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
	user: null,
	canUserPlay: false,
	fetchUser: async () => {},
	removeUserGameCoin: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [canUserPlay, setCanUserPlay] = useState<boolean>(false);

	const fetchUser = useCallback(async () => {
		const responseUser = await fetch('/api/user/me', { method: 'GET' });
		const user: User = await responseUser.json();

		const responseCanPLay = await fetch('api/user/can-play', {
			method: 'GET',
		});
		const canPlay = await responseCanPLay.json();

		setUser(user);
		setCanUserPlay(canPlay);
	}, []);

	const removeUserGameCoin = async (): Promise<void> => {
		if (!user) {
			return;
		}

		const updateUserDto: UpdateUserDto = { gameCoins: user.gameCoins - 1 };
		await fetch('/api/user', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateUserDto),
		});

		await fetchUser();
	};

	return (
		<UserContext.Provider
			value={{ user, canUserPlay, fetchUser, removeUserGameCoin }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
