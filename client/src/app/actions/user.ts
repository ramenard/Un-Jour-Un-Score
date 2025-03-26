import { cache } from 'react';
import { verifySession } from '@/lib/dal';
import { cookies } from 'next/headers';
import { UpdateUserDto } from '@/types/user';

export const getMe = cache(async () => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(`${process.env.API_URL}:${process.env.API_PORT}/users/${session.user.id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: `Bearer ${token}`,
		},
	});

	return res.json();
});

export const getCurrentUserLeaderboard = cache(async () => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(
		`${process.env.API_URL}:${process.env.API_PORT}/users/${session.user.id}/leaderboard`,
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

export const canPLay = cache(async () => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(
		`${process.env.API_URL}:${process.env.API_PORT}/users/${session.user.id}/isAble`,
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

export const patchUser = cache(async (updateUserDto: UpdateUserDto) => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(`${process.env.API_URL}:${process.env.API_PORT}/users/${session.user.id}`, {
		method: 'PATCH',
		body: JSON.stringify(updateUserDto),
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: `Bearer ${token}`,
		},
	});

	return await res.json();
});

export const patchScore = cache(async (score: { score: number }) => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	await fetch(`${process.env.API_URL}:${process.env.API_PORT}/users/${session.user.id}/score`, {
		method: 'PATCH',
		body: JSON.stringify(score),
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: `Bearer ${token}`,
		},
	});
});
