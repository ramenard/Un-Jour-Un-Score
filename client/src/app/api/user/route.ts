import { NextResponse } from 'next/server';
import { patchUser } from '@/app/actions/user';
import { UpdateUserDto } from '@/types/user';

export async function PATCH(request: Request) {
	const body: UpdateUserDto = await request.json();

	const user = await patchUser(body);

	return NextResponse.json(user);
}
