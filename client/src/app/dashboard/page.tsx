'use client';

import React, { useCallback, useEffect } from 'react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { User } from '@/types/user';
import UsersTable from '@/components/UsersTable';
import GamesTable from '@/components/GamesTable';
import { Game } from '@/types/game';

const Dashboard: React.FC = () => {
	const [users, setUsers] = React.useState<User[]>([]);
	const [games, setGames] = React.useState<Game[]>([]);

	const fetchUsers = useCallback(async (): Promise<User[]> => {
		const response = await fetch('/api/user', {
			method: 'GET',
		});

		if (!response.ok) {
			return [];
		}

		return await response.json();
	}, []);

	const fetchGames = useCallback(async (): Promise<Game[]> => {
		const response = await fetch('/api/game', {
			method: 'GET',
		});

		if (!response.ok) {
			return [];
		}

		return await response.json();
	}, []);

	useEffect(() => {
		fetchUsers().then((usersData) => {
			setUsers(usersData);
		});
	}, [fetchUsers]);

	useEffect(() => {
		fetchGames().then((gamesData) => {
			setGames(gamesData);
		});
	}, [fetchGames]);

	return (
		<div className="nes-theme min-h-screen">
			<div className="nes-container w-full p-6 space-y-16">
				<p className="title text-white text-center">
					Dashboard administrateur
				</p>

				<div>
					<UsersTable
						usersData={users}
						tableTitle={'Liste des utilisateurs'}
					/>
				</div>

				<div>
					<GamesTable
						gamesData={games}
						tableTitle={'Liste des jeux'}
					/>
				</div>

				<BorderBeam
					duration={6}
					size={600}
					className="from-transparent via-red-500 to-transparent"
				/>

				<BorderBeam
					duration={6}
					delay={3}
					size={600}
					className="from-transparent via-blue-500 to-transparent"
				/>
			</div>
		</div>
	);
};

export default Dashboard;
