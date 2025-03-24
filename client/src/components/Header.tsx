'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { logout } from '@/app/actions/auth';
import React from 'react';

interface UserStatus {
	isAuth: boolean;
	userRole: string;
}

const Header: React.FC<UserStatus> = (UserStatus) => {
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
					{!UserStatus.isAuth && (
						<>
							<Button asChild className="mr-2">
								<Link href="/login">Connexion</Link>
							</Button>
							<Button asChild className="mr-2">
								<Link href="/register">Inscription</Link>
							</Button>
						</>
					)}
					{UserStatus.isAuth && (
						<>
							{UserStatus.userRole == 'Admin' && (
								<Button asChild className="mr-2">
									<Link href="/dashboard">Dashboard</Link>
								</Button>
							)}
							<Button asChild className="mr-2">
								<Link href="/test">Profil</Link>
							</Button>
							<Button
								asChild
								variant="destructive"
								className="mr-2"
							>
								<button onClick={() => logout()}>
									Se déconnecter
								</button>
							</Button>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
