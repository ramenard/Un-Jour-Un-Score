'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { User } from '@/types/user';

interface UserContextProps {
	user: User | null;
	fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
	user: null,
	fetchUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	const fetchUser = useCallback(async () => {
		const res = await fetch('/api/user/me', { method: 'GET' });
		const user: User = await res.json();

		setUser(user);
	}, []);

	return (
		<UserContext.Provider value={{ user, fetchUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
