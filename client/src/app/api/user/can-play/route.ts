import { NextResponse } from 'next/server';
import { canPLay } from '@/app/actions/user';
import { User } from '@/types/user';

export async function GET() {
	const user: User = await canPLay();

	return NextResponse.json(user);
}
