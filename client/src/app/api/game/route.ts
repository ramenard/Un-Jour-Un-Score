import { NextResponse } from 'next/server';
import { Game } from '@/types/game';
import { getAll } from '@/app/actions/game';

export async function GET() {
	try {
		const currentGame: Game = await getAll();

		return NextResponse.json(currentGame);
	} catch (err) {
		return NextResponse.json({ error: err });
	}
}
