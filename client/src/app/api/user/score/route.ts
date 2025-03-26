import { NextResponse } from 'next/server';
import { canPLay, getMe, patchScore, patchUser } from '@/app/actions/user';

export async function PATCH(request: Request) {
    const body: { score: number } = await request.json();

    console.log('score PATCH', body);

    try {
        await patchScore(body);

        return NextResponse.json({ isError: false })
    } catch {
        return NextResponse.json({ isError: true });
    }
}
