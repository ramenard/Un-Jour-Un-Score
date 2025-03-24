'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
	isAuth: boolean;
	userId: string;
	userRole: string;
	setAuth: (authData: {
		isAuth: boolean;
		userId: string;
		userRole: string;
	}) => void;
	refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
	isAuth: false,
	userId: '',
	userRole: '',
	setAuth: () => {},
	refreshAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuth, setIsAuth] = useState(false);
	const [userId, setUserId] = useState('');
	const [userRole, setUserRole] = useState('');

	const refreshAuth = async () => {
		const res = await fetch('/api/session', { cache: 'no-store' });
		const session = await res.json();

		setIsAuth(session.isAuth);
		setUserId(session.user?.id || '');
		setUserRole(session.user?.role || '');
	};

	const setAuth = ({
		isAuth,
		userId,
		userRole,
	}: {
		isAuth: boolean;
		userId: string;
		userRole: string;
	}) => {
		setIsAuth(isAuth);
		setUserId(userId);
		setUserRole(userRole);
	};

	useEffect(() => {
		refreshAuth().then(() => {
			console.log('Session loaded', isAuth, userId);
		});
	}, [isAuth, userId]);

	return (
		<AuthContext.Provider
			value={{ isAuth, userId, userRole, setAuth, refreshAuth }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
