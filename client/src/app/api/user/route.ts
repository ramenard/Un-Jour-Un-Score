import { NextResponse } from 'next/server';
import { canPLay, getMe, patchUser } from '@/app/actions/user';
import { UpdateUserDto, User } from '@/types/user';

export async function PATCH(request: Request) {
    const body: UpdateUserDto = await request.json();
    console.log('boooooooooooooody', body, typeof body);

    const user = await patchUser(body);

    return NextResponse.json(user);
}
