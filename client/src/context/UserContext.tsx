'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { User } from '@/types/user';

interface UserContextProps {
	user: User | null;
    canUserPlay: boolean;
	fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
	user: null,
    canUserPlay: false,
	fetchUser: async () => {},

});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
    const [canUserPlay, setCanUserPlay] = useState<boolean>(false);

	const fetchUser = useCallback(async () => {
		const responseUser = await fetch('/api/user/me', { method: 'GET' });
		const user: User = await responseUser.json();

        const responseCanPLay = await fetch('api/user/can-play', { method: 'GET' });
        const canPlay = await responseCanPLay.json();

		setUser(user);
        setCanUserPlay(canPlay);
	}, []);

	return (
		<UserContext.Provider value={{ user, canUserPlay, fetchUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
