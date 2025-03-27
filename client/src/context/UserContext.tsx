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
		try {
			const responseUser = await fetch('/api/user/me', { method: 'GET' });
			if (!responseUser.ok) throw new Error('Failed to fetch user');

			const user: User = await responseUser.json();

			const responseCanPlay = await fetch('/api/user/can-play', {
				method: 'GET',
			});
			if (!responseCanPlay.ok)
				throw new Error('Failed to fetch canPlay status');

			const canPlay = await responseCanPlay.json();

			setUser(user);
			setCanUserPlay(canPlay);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	}, []);

	const removeUserGameCoin = async (): Promise<void> => {
		if (!user) return;

		const updateUserDto: UpdateUserDto = { gameCoins: user.gameCoins - 1 };
		try {
			await fetch('/api/user', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateUserDto),
			});
			await fetchUser();
		} catch (error) {
			console.error('Error removing game coin:', error);
		}
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
