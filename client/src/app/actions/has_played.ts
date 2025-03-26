import { cache } from 'react';
import { verifySession } from '@/lib/dal';
import { cookies } from 'next/headers';

export const getHasPlayedByUserAndLeaderboard = cache(
	async (leaderboardId: string | null) => {
		const session = await verifySession();

		const token = (await cookies()).get('session')?.value;

		if (!session || !token) {
			throw new Error('Session not found');
		}

		const res = await fetch(
			`${process.env.API_URL}${process.env.API_PORT}/has-played?userId=${session.user.id}&leaderboardId=${leaderboardId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					Authorization: `Bearer ${token}`,
				},
			},
		);

		return await res.json();
	},
);

export const createHasPlayedForCurrentUser = cache(async () => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(
		`${process.env.API_URL}${process.env.API_PORT}/has-played`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ userId: session.user.id }),
		},
	);

	return await res.json();
});
