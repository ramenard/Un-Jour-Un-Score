'use client';

import Hero from '../components/Hero';
import Features from '../components/Features';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';

export default function Home() {
	const { isAuth } = useAuth();
	const { fetchUser } = useUser();

	useEffect(() => {
		if (isAuth) {
			fetchUser();
		}
	}, [fetchUser, isAuth]);

	return (
		<div className="nes-theme min-h-screen">
			<Hero />
			<Features />
		</div>
	);
}
