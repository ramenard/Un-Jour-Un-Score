import 'server-only';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { UserSession } from '@/types/user';
import { isString } from '@/utils/assert';

const secretKey = process.env.SESSION_SECRET ?? 'jwt';
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(token: string) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const cookieStore = await cookies();

	cookieStore.set('session', token, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
	});
}

export const getSession = cache(
	async (): Promise<{ isAuth: boolean; user: UserSession }> => {
		const cookie = (await cookies()).get('session')?.value;
		const session = await decrypt(cookie);

		if (
			!isString(session?.id) ||
			!isString(session?.username) ||
			!isString(session?.role)
		) {
			return { isAuth: false, user: { id: '', username: '', role: '' } };
		}

		return {
			isAuth: true,
			user: {
				id: session.id,
				username: session.username,
				role: session.role,
			},
		};
	},
);

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete('session');
}

export async function decrypt(session: string | undefined = '') {
	if (!session) {
		console.log('No session cookie found');
		return null;
	}

	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		});
		return payload;
	} catch (error) {
		console.log('Failed to verify session :' + error);
		return null;
	}
}
