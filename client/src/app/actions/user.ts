import { cache } from 'react';
import { verifySession } from '@/lib/dal';
import { cookies } from 'next/headers';

export const getMe = cache(async () => {
	const session = await verifySession();

	const token = (await cookies()).get('session')?.value;

	if (!session || !token) {
		throw new Error('Session not found');
	}

	const res = await fetch(`http://127.0.0.1:3001/users/${session.user.id}`, {
		method: 'get',
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
		`http://127.0.0.1:3001/users/${session.user.id}/leaderboard`,
		{
			method: 'get',
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
        `http://127.0.0.1:3001/users/${session.user.id}/isAble`,
        {
            method: 'get',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${token}`,
            },
        },
    );

    return res.json();
});
