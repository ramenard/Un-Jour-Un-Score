import { NextResponse } from 'next/server';
import { patchScore } from '@/app/actions/user';

export async function PATCH(request: Request) {
	const body: { score: number } = await request.json();

	try {
		await patchScore(body);

		return NextResponse.json({ isError: false });
	} catch {
		return NextResponse.json({ isError: true });
	}
}
