'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SparklesText } from '@/components/magicui/sparkles-text';
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

const Header: React.FC = () => {
	const { isAuth, refreshAuth } = useAuth();
	const { user, fetchUser } = useUser();
	const router = useRouter();

	const handleLogout = async () => {
		await fetch('/api/logout', { method: 'POST' });
		await refreshAuth();
		router.push('/');
	};

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return (
		<header className="shadow">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				<Link href="/" className="nes-theme">
					<SparklesText
						className="nes-text is-disabled font-bold text-xl"
						text="Un jour, un score"
					/>
				</Link>
				<div className="nes-theme">
					{!isAuth ? (
						<>
							<Button asChild className="mr-2">
								<Link href="/login">Connexion</Link>
							</Button>
							<Button asChild className="mr-2">
								<Link href="/register">Inscription</Link>
							</Button>
						</>
					) : (
						<>
							<div className="flex flex-row items-center">
								{user &&
									[...Array(user?.gameCoins)].map((_, i) => (
										<i
											key={i}
											className="nes-icon coin is-medium"
										/>
									))}
								{user?.role === 'admin' && (
									<Button asChild className="mr-2">
										<Link href="/dashboard">Dashboard</Link>
									</Button>
								)}
								<Button asChild className="mr-2">
									<Link href="/profil">Profil</Link>
								</Button>
								<Button
									asChild
									variant="destructive"
									className="mr-2"
								>
									<Link href="/checkout">Boutique</Link>
								</Button>
								<Button
									asChild
									variant="destructive"
									className="mr-2"
								>
									<button
										onClick={handleLogout}
										className="nes-btn is-error"
									>
										Se déconnecter
									</button>
								</Button>
							</div>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
