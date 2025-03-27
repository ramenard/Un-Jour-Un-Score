import { cache } from 'react';
import { verifySession } from '@/lib/dal';
import { cookies } from 'next/headers';

export const getCurrentGame = cache(async () => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(
		`${process.env.API_URL}${process.env.API_PORT}/games/current`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return res.json();
});

export const getAll = cache(async () => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(
		`${process.env.API_URL}${process.env.API_PORT}/games`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return res.json();
});
