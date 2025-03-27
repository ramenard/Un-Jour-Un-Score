import { NextResponse } from 'next/server';
import { getAll, patchUser } from '@/app/actions/user';
import { UpdateUserDto } from '@/types/user';

export async function PATCH(request: Request) {
	const body: UpdateUserDto = await request.json();

	const user = await patchUser(body);

	return NextResponse.json(user);
}

export async function GET() {
	const user = await getAll();

	return NextResponse.json(user);
}
