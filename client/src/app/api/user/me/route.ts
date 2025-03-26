import { NextResponse } from 'next/server';
import { getMe } from '@/app/actions/user';
import { User } from '@/types/user';

export async function GET() {
	const user: User = await getMe();

	return NextResponse.json(user);
}
